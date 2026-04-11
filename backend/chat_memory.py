"""
Chat Memory — Lightweight 3-tier memory system.

Tier 1: Immediate context — last N message pairs (sliding window)
Tier 2: Conversation summary — LLM-generated, updated every ~10 messages
Tier 3: SQLite storage — all messages and chat metadata

No ChromaDB, no embeddings, no per-message LLM calls.
"""

import sqlite3
import json
import logging
import asyncio
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)

# How many new messages before we regenerate the summary
SUMMARY_INTERVAL = 10


def _estimate_tokens(text: str) -> int:
    """Cheap token estimator (~1 token per 3.5 chars). Avoids loading a tokenizer."""
    if not text:
        return 0
    return max(1, int(len(text) / 3.5))


def _try_parse_summary_json(raw: str) -> Optional[Dict]:
    """Parse the expanded summary JSON. Tolerates code fences and leading prose."""
    if not raw:
        return None
    text = raw.strip()
    # Strip ``` fences if present
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()
    # Find the first '{' and last '}' to recover from leading/trailing prose
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        return None
    candidate = text[start:end + 1]
    try:
        parsed = json.loads(candidate)
    except (json.JSONDecodeError, ValueError):
        return None
    if not isinstance(parsed, dict):
        return None
    return parsed


def _get_db_path() -> Path:
    """Get the SQLite database path in the app data directory."""
    import os
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Class Coworker' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir / 'chat_memory.db'


class ChatMemory:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or str(_get_db_path())
        self._init_db()

    # ── Schema ────────────────────────────────────────────────────────

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("PRAGMA journal_mode=WAL")  # Better concurrent read perf
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS chats (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL DEFAULT 'New Chat',
                summary TEXT DEFAULT '',
                summary_msg_count INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chat_id TEXT NOT NULL,
                msg_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                attachments TEXT DEFAULT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
            CREATE INDEX IF NOT EXISTS idx_messages_chat_role ON messages(chat_id, role);
        """)
        # Migrate: add attachments column if missing (existing databases)
        try:
            conn.execute("SELECT attachments FROM messages LIMIT 1")
        except sqlite3.OperationalError:
            conn.execute("ALTER TABLE messages ADD COLUMN attachments TEXT DEFAULT NULL")
        conn.commit()
        conn.close()

    def _conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        return conn

    # ── Chat CRUD ─────────────────────────────────────────────────────

    def ensure_chat(self, chat_id: str, title: str = "New Chat"):
        """Create a chat if it doesn't exist."""
        conn = self._conn()
        conn.execute(
            "INSERT OR IGNORE INTO chats (id, title) VALUES (?, ?)",
            (chat_id, title)
        )
        conn.commit()
        conn.close()

    def update_chat_title(self, chat_id: str, title: str):
        conn = self._conn()
        conn.execute(
            "UPDATE chats SET title = ?, updated_at = ? WHERE id = ?",
            (title, datetime.now().isoformat(), chat_id)
        )
        conn.commit()
        conn.close()

    def get_all_chats(self) -> List[Dict]:
        """Get all chats sorted by most recently updated."""
        conn = self._conn()
        rows = conn.execute(
            "SELECT id, title, created_at, updated_at FROM chats ORDER BY updated_at DESC"
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def delete_chat(self, chat_id: str):
        conn = self._conn()
        conn.execute("DELETE FROM messages WHERE chat_id = ?", (chat_id,))
        conn.execute("DELETE FROM chats WHERE id = ?", (chat_id,))
        conn.commit()
        conn.close()

    # ── Message Storage ───────────────────────────────────────────────

    def save_message(self, chat_id: str, msg_id: str, role: str, content: str, timestamp: str, attachments=None):
        """Save a single message."""
        self.ensure_chat(chat_id)
        conn = self._conn()
        # Avoid duplicates (frontend may re-save)
        existing = conn.execute(
            "SELECT id FROM messages WHERE chat_id = ? AND msg_id = ?",
            (chat_id, msg_id)
        ).fetchone()
        if not existing:
            attachments_json = json.dumps(attachments) if attachments else None
            conn.execute(
                "INSERT INTO messages (chat_id, msg_id, role, content, timestamp, attachments) VALUES (?, ?, ?, ?, ?, ?)",
                (chat_id, msg_id, role, content, timestamp, attachments_json)
            )
            conn.execute(
                "UPDATE chats SET updated_at = ? WHERE id = ?",
                (datetime.now().isoformat(), chat_id)
            )
            conn.commit()
        conn.close()

    def save_messages_bulk(self, chat_id: str, messages: List[Dict]):
        """Save/sync all messages for a chat (used by the existing auto-save flow)."""
        self.ensure_chat(chat_id)
        conn = self._conn()

        # Get existing msg_ids for this chat
        existing_ids = set(
            row[0] for row in conn.execute(
                "SELECT msg_id FROM messages WHERE chat_id = ?", (chat_id,)
            ).fetchall()
        )

        new_messages = [m for m in messages if m.get('id') not in existing_ids]
        if new_messages:
            conn.executemany(
                "INSERT INTO messages (chat_id, msg_id, role, content, timestamp, attachments) VALUES (?, ?, ?, ?, ?, ?)",
                [(chat_id, m['id'], m['role'], m['content'], m.get('timestamp', datetime.now().isoformat()), json.dumps(m['attachments']) if m.get('attachments') else None) for m in new_messages]
            )
            conn.execute(
                "UPDATE chats SET updated_at = ? WHERE id = ?",
                (datetime.now().isoformat(), chat_id)
            )
            conn.commit()
        conn.close()

    def _parse_message_row(self, row) -> Dict:
        """Convert a message row to a dict, parsing attachments JSON if present."""
        d = dict(row)
        if d.get('attachments'):
            try:
                d['attachments'] = json.loads(d['attachments'])
            except (json.JSONDecodeError, TypeError):
                d['attachments'] = None
        return d

    def get_all_messages(self, chat_id: str) -> List[Dict]:
        """Get all messages for a chat."""
        conn = self._conn()
        rows = conn.execute(
            "SELECT msg_id as id, role, content, timestamp, attachments FROM messages WHERE chat_id = ? ORDER BY id ASC",
            (chat_id,)
        ).fetchall()
        conn.close()
        return [self._parse_message_row(r) for r in rows]

    def get_message_count(self, chat_id: str) -> int:
        conn = self._conn()
        row = conn.execute(
            "SELECT COUNT(*) FROM messages WHERE chat_id = ?", (chat_id,)
        ).fetchone()
        conn.close()
        return row[0] if row else 0

    # ── Tier 1: Sliding Window Context ────────────────────────────────

    def get_context_window(self, chat_id: str, n_pairs: int = 4) -> List[Dict]:
        """
        Get the last N user+assistant message pairs for context injection.
        Returns messages in chronological order.
        """
        conn = self._conn()
        # Fetch only recent messages with margin for unpaired messages; DESC + LIMIT is index-efficient
        limit = max(n_pairs * 3, 12)
        rows = conn.execute(
            "SELECT role, content FROM messages WHERE chat_id = ? AND role IN ('user', 'assistant') ORDER BY id DESC LIMIT ?",
            (chat_id, limit)
        ).fetchall()
        conn.close()

        # Reverse to restore chronological order
        messages = [dict(r) for r in reversed(rows)]

        # Group into complete pairs
        pairs = []
        i = 0
        while i < len(messages) - 1:
            if messages[i]['role'] == 'user' and messages[i + 1]['role'] == 'assistant':
                pairs.append((messages[i], messages[i + 1]))
                i += 2
            else:
                i += 1

        # Take last n_pairs
        last_pairs = pairs[-n_pairs:] if n_pairs > 0 else []
        return [msg for pair in last_pairs for msg in pair]

    # ── Tier 2: Conversation Summary ──────────────────────────────────

    def get_summary(self, chat_id: str) -> str:
        """Get the stored conversation summary."""
        conn = self._conn()
        row = conn.execute(
            "SELECT summary FROM chats WHERE id = ?", (chat_id,)
        ).fetchone()
        conn.close()
        return row['summary'] if row and row['summary'] else ""

    def _save_summary(self, chat_id: str, summary: str, msg_count: int):
        conn = self._conn()
        conn.execute(
            "UPDATE chats SET summary = ?, summary_msg_count = ?, updated_at = ? WHERE id = ?",
            (summary, msg_count, datetime.now().isoformat(), chat_id)
        )
        conn.commit()
        conn.close()

    def needs_summary_update(self, chat_id: str) -> bool:
        """Check if we should regenerate the summary."""
        conn = self._conn()
        row = conn.execute(
            "SELECT summary_msg_count FROM chats WHERE id = ?", (chat_id,)
        ).fetchone()
        conn.close()

        last_summarized = row['summary_msg_count'] if row else 0
        current_count = self.get_message_count(chat_id)

        # Generate summary after 10 messages, then every 10 messages after
        return current_count >= SUMMARY_INTERVAL and (current_count - last_summarized) >= SUMMARY_INTERVAL

    def get_messages_for_summary(self, chat_id: str) -> str:
        """Get conversation text formatted for summarization."""
        conn = self._conn()
        rows = conn.execute(
            "SELECT role, content FROM messages WHERE chat_id = ? AND role IN ('user', 'assistant') ORDER BY id ASC",
            (chat_id,)
        ).fetchall()
        conn.close()

        # Include all messages, but truncate each for the summary prompt
        lines = []
        for r in rows:
            role = r['role'].upper()
            content = r['content'][:300]
            lines.append(f"{role}: {content}")

        return "\n".join(lines)

    async def maybe_update_summary(
        self,
        chat_id: str,
        prompt_format: str = "llama",
        teacher_id: Optional[str] = None,
        memory_enabled: bool = True,
        feature_context: Optional[str] = None,
        known_facts: Optional[List[str]] = None,
    ):
        """
        Check if summary needs updating and regenerate if so.
        Called as a fire-and-forget background task after assistant responds.

        When `memory_enabled` is True (Feature 6), the same LLM call also
        extracts key facts about the teacher and saves them to the long-term
        memory store. When False, falls back to summary-only mode (privacy
        kill-switch).
        """
        if not self.needs_summary_update(chat_id):
            return

        try:
            conversation_text = self.get_messages_for_summary(chat_id)
            if not conversation_text.strip():
                return

            existing_summary = self.get_summary(chat_id)
            current_count = self.get_message_count(chat_id)

            from inference_factory import get_inference_instance
            inference = get_inference_instance()

            # Build a summary prompt
            if existing_summary:
                summary_instruction = (
                    f"Here is the previous summary of this conversation:\n{existing_summary}\n\n"
                    f"The conversation has continued. Update the summary to include the new messages.\n"
                )
            else:
                summary_instruction = ""

            # Feature 6: load top-10 existing memories for contradiction detection
            existing_memories = []
            if memory_enabled and teacher_id:
                try:
                    from teacher_memory import get_teacher_memory
                    existing_memories = get_teacher_memory().get_recent_facts(teacher_id, n=10)
                except Exception as e:
                    logger.warning(f"Could not load existing memories: {e}")

            if memory_enabled:
                # Expanded prompt: summary + fact extraction + contradiction check
                if existing_memories:
                    mem_lines = "\n".join(
                        f"  [{m['id']}] {m['fact']}" for m in existing_memories
                    )
                else:
                    mem_lines = "  (none yet)"

                system_text = (
                    "You are a conversation analyzer for a teacher coaching app. Do THREE things:\n"
                    "1. Write a concise 2-4 sentence SUMMARY of this conversation (decisions made, "
                    "advice given, action items). Third person, no filler.\n"
                    "2. Extract 1-3 KEY FACTS about the teacher that would be useful to remember "
                    "for future conversations (preferences, struggles, teaching style, classroom "
                    "context). Only specific, actionable facts. Do NOT re-extract facts already "
                    "listed in the KNOWN PROFILE block (those are already on file). If nothing "
                    "new and notable, return [].\n"
                    "3. Check if any new facts CONTRADICT or UPDATE an existing memory listed below. "
                    "If so, mark the old memory's id for replacement. If nothing contradicts, return [].\n\n"
                    "Output STRICT JSON only, no prose, no markdown fences:\n"
                    '{"summary": "...", "new_facts": ["fact 1"], '
                    '"replace": [{"old_id": "...", "new_fact": "..."}]}'
                )
                known_block = ""
                if known_facts:
                    known_block = (
                        "KNOWN PROFILE (already on file -- do NOT re-extract these):\n"
                        + "\n".join(f"  - {f}" for f in known_facts)
                        + "\n\n"
                    )
                user_text = (
                    summary_instruction
                    + known_block
                    + f"EXISTING MEMORIES:\n{mem_lines}\n\n"
                    + f"CONVERSATION:\n{conversation_text[:3000]}\n\n"
                    + "Return the JSON now:"
                )
            else:
                system_text = (
                    "You are a conversation summarizer. Write a concise 2-4 sentence summary.\n"
                    "Capture: (1) decisions made, (2) specific advice given, (3) action items mentioned.\n"
                    "Drop pleasantries and filler. Write in third person. Return ONLY the summary."
                )
                user_text = summary_instruction + f"Conversation:\n{conversation_text[:3000]}\n\nWrite a concise summary:"

            # Build format-aware prompt
            fmt = (prompt_format or "llama").lower()
            if fmt == "chatml":
                prompt = f"<|im_start|>system\n{system_text}<|im_end|>\n<|im_start|>user\n{user_text}<|im_end|>\n<|im_start|>assistant\n"
            elif fmt in ("phi", "phi-4", "phi4"):
                prompt = f"<|system|>\n{system_text}<|end|>\n<|user|>\n{user_text}<|end|>\n<|assistant|>\n"
            elif fmt in ("gemma", "gemma2", "gemma4"):
                prompt = f"<start_of_turn>user\n{system_text}\n\n{user_text}<end_of_turn>\n<start_of_turn>model\n"
            else:  # llama (default)
                prompt = (
                    "<|begin_of_text|>"
                    "<|start_header_id|>system<|end_header_id|>\n\n"
                    f"{system_text}"
                    "<|eot_id|>"
                    "<|start_header_id|>user<|end_header_id|>\n\n"
                    f"{user_text}"
                    "<|eot_id|>"
                    "<|start_header_id|>assistant<|end_header_id|>\n\n"
                )

            # Memory mode needs more tokens to fit the JSON structure
            result = await inference.generate(
                tool_name="conversation_summary",
                input_data="summarize",
                prompt_template=prompt,
                max_tokens=400 if memory_enabled else 200,
                temperature=0.3,
            )

            if result["metadata"]["status"] == "success" and result.get("result"):
                raw = result["result"].strip()
                summary_text = ""
                new_facts: List[str] = []
                replacements: List[Dict] = []

                if memory_enabled:
                    # Try to parse JSON; on failure fall back to raw as summary
                    parsed = _try_parse_summary_json(raw)
                    if parsed is not None:
                        summary_text = (parsed.get("summary") or "").strip()
                        new_facts = [str(x) for x in (parsed.get("new_facts") or []) if x]
                        replacements = [r for r in (parsed.get("replace") or []) if isinstance(r, dict)]
                    else:
                        logger.info(f"Summary JSON parse failed for {chat_id}; using raw text as summary")
                        summary_text = raw
                else:
                    summary_text = raw

                if len(summary_text) > 10:
                    self._save_summary(chat_id, summary_text, current_count)
                    logger.info(f"Updated summary for chat {chat_id} (at {current_count} messages)")

                # Persist extracted facts (Feature 6)
                if memory_enabled and teacher_id and (new_facts or replacements):
                    try:
                        from teacher_memory import get_teacher_memory
                        added = get_teacher_memory().save_facts(
                            teacher_id=teacher_id,
                            facts=new_facts,
                            source_chat_id=chat_id,
                            replacements=replacements,
                            source='chat',
                            contexts=feature_context,  # Tag with active feature for F6 #5 bonus
                        )
                        logger.info(
                            f"[teacher_memory] +{added} facts, "
                            f"{len(replacements)} replacements for {teacher_id}"
                        )
                    except Exception as e:
                        logger.warning(f"Saving teacher memory facts failed: {e}")

        except Exception as e:
            logger.warning(f"Summary generation failed for {chat_id}: {e}")

    # ── Context Builder (combines Tier 1 + Tier 2) ────────────────────

    def build_context(self, chat_id: str, n_pairs: int = 4) -> Tuple[str, List[Dict]]:
        """
        Build the full context for a chat request.

        Returns:
            (summary_block, recent_messages)
            - summary_block: string to prepend to system prompt (or empty)
            - recent_messages: list of recent message dicts for multi-turn prompt
        """
        summary = self.get_summary(chat_id)
        recent = self.get_context_window(chat_id, n_pairs)

        summary_block = ""
        if summary:
            summary_block = f"\n\n[Conversation context so far: {summary}]"

        return summary_block, recent

    def build_context_budgeted(
        self,
        chat_id: str,
        token_budget: int = 2000,
        n_pairs_max: int = 4,
        summary_cap_tokens: int = 150,
        reserved_tokens: int = 0,
    ) -> Tuple[str, List[Dict]]:
        """
        Token-aware version of build_context().

        Fits (summary + recent pairs) into `token_budget - reserved_tokens` by:
          1. Capping the summary to `summary_cap_tokens` (truncate at sentence boundary)
          2. Dropping oldest pairs until within budget
          3. As a last resort, further truncating the summary

        `reserved_tokens` should account for the system prompt + user message + any
        other blocks the caller plans to inject (curriculum refs, profile context),
        so the returned context fits alongside them.

        Returns the same shape as build_context(): (summary_block, recent_messages).
        """
        summary = self.get_summary(chat_id)

        # Step 1: cap summary length up-front
        if summary and _estimate_tokens(summary) > summary_cap_tokens:
            char_cap = int(summary_cap_tokens * 3.5)
            cut = summary[:char_cap].rfind('. ')
            summary = summary[:cut + 1] if cut > 0 else summary[:char_cap]

        recent = self.get_context_window(chat_id, n_pairs_max)

        # Step 2: shrink history until within available budget
        available = max(0, token_budget - reserved_tokens)
        summary_tokens = _estimate_tokens(summary) if summary else 0
        history_tokens = sum(_estimate_tokens(m.get("content", "")) for m in recent)

        while (summary_tokens + history_tokens) > available and len(recent) >= 2:
            # Drop the oldest user+assistant pair
            recent = recent[2:]
            history_tokens = sum(_estimate_tokens(m.get("content", "")) for m in recent)

        # Step 3: if still over budget, hard-truncate the summary
        if summary and (summary_tokens + history_tokens) > available:
            remaining_for_summary = max(0, available - history_tokens)
            char_cap = int(remaining_for_summary * 3.5)
            if char_cap <= 0:
                summary = ""
            else:
                summary = summary[:char_cap]

        summary_block = f"\n\n[Conversation context so far: {summary}]" if summary else ""
        return summary_block, recent

    # ── Chat History API Compatibility ────────────────────────────────
    # These methods maintain compatibility with the existing frontend API

    def get_chat_with_messages(self, chat_id: str) -> Optional[Dict]:
        """Get a single chat with all its messages (for frontend compatibility)."""
        conn = self._conn()
        chat_row = conn.execute(
            "SELECT id, title, updated_at as timestamp FROM chats WHERE id = ?", (chat_id,)
        ).fetchone()
        if not chat_row:
            conn.close()
            return None

        msg_rows = conn.execute(
            "SELECT msg_id as id, role, content, timestamp, attachments FROM messages WHERE chat_id = ? ORDER BY id ASC",
            (chat_id,)
        ).fetchall()
        conn.close()

        return {
            "id": chat_row['id'],
            "title": chat_row['title'],
            "timestamp": chat_row['timestamp'],
            "messages": [self._parse_message_row(r) for r in msg_rows]
        }

    def get_all_chats_with_messages(self, limit: int = 50, offset: int = 0) -> List[Dict]:
        """Get all chats with their messages (for frontend /api/chat-history compatibility)."""
        conn = self._conn()

        # Single query: paginate chats then LEFT JOIN their messages
        rows = conn.execute("""
            SELECT c.id as chat_id, c.title, c.updated_at as chat_timestamp,
                   m.msg_id as id, m.role, m.content, m.timestamp, m.attachments
            FROM (SELECT id, title, updated_at FROM chats ORDER BY updated_at DESC LIMIT ? OFFSET ?) c
            LEFT JOIN messages m ON m.chat_id = c.id
            ORDER BY c.updated_at DESC, m.id ASC
        """, (limit, offset)).fetchall()
        conn.close()

        # Group by chat, preserving ORDER BY chat order via OrderedDict
        from collections import OrderedDict
        chats: OrderedDict = OrderedDict()
        for row in rows:
            cid = row['chat_id']
            if cid not in chats:
                chats[cid] = {
                    "id": cid,
                    "title": row['title'],
                    "timestamp": row['chat_timestamp'],
                    "messages": []
                }
            if row['id'] is not None:  # LEFT JOIN may produce NULL for empty chats
                chats[cid]["messages"].append(self._parse_message_row(row))

        return list(chats.values())

    def import_from_json(self, json_path: str):
        """One-time migration: import existing chat_history.json into SQLite."""
        import os
        if not os.path.exists(json_path):
            return

        try:
            with open(json_path, 'r', encoding='utf-8-sig') as f:
                histories = json.load(f)

            if not histories:
                return

            conn = self._conn()
            for chat in histories:
                chat_id = chat.get('id')
                if not chat_id:
                    continue

                # Skip if already imported
                existing = conn.execute("SELECT id FROM chats WHERE id = ?", (chat_id,)).fetchone()
                if existing:
                    continue

                conn.execute(
                    "INSERT INTO chats (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
                    (chat_id, chat.get('title', 'New Chat'), chat.get('timestamp', datetime.now().isoformat()), chat.get('timestamp', datetime.now().isoformat()))
                )

                for msg in chat.get('messages', []):
                    conn.execute(
                        "INSERT INTO messages (chat_id, msg_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?)",
                        (chat_id, msg.get('id', ''), msg.get('role', ''), msg.get('content', ''), msg.get('timestamp', ''))
                    )

            conn.commit()
            conn.close()

            # Rename old file so we don't re-import
            backup_path = json_path + '.migrated'
            if not os.path.exists(backup_path):
                os.rename(json_path, backup_path)

            logger.info(f"Migrated {len(histories)} chats from JSON to SQLite")

        except Exception as e:
            logger.error(f"Failed to import chat history from JSON: {e}")


# ── Singleton ─────────────────────────────────────────────────────────

_instance: Optional[ChatMemory] = None


def get_chat_memory() -> ChatMemory:
    global _instance
    if _instance is None:
        _instance = ChatMemory()
    return _instance
