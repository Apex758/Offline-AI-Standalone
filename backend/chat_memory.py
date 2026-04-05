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


def _get_db_path() -> Path:
    """Get the SQLite database path in the app data directory."""
    import os
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
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

    async def maybe_update_summary(self, chat_id: str):
        """
        Check if summary needs updating and regenerate if so.
        Called as a fire-and-forget background task after assistant responds.
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

            prompt = "<|begin_of_text|>"
            prompt += "<|start_header_id|>system<|end_header_id|>\n\n"
            prompt += "You are a conversation summarizer. Write a concise 2-4 sentence summary of the conversation. "
            prompt += "Capture the main topics discussed, key decisions, and any important context. "
            prompt += "Write in third person (e.g. 'The user asked about...'). Return ONLY the summary, nothing else."
            prompt += "<|eot_id|>"
            prompt += "<|start_header_id|>user<|end_header_id|>\n\n"
            prompt += summary_instruction
            prompt += f"Conversation:\n{conversation_text[:3000]}\n\n"
            prompt += "Write a concise summary:"
            prompt += "<|eot_id|>"
            prompt += "<|start_header_id|>assistant<|end_header_id|>\n\n"

            result = await inference.generate(
                tool_name="conversation_summary",
                input_data="summarize",
                prompt_template=prompt,
                max_tokens=200,
                temperature=0.3,
            )

            if result["metadata"]["status"] == "success" and result.get("result"):
                summary = result["result"].strip()
                if len(summary) > 10:  # Sanity check
                    self._save_summary(chat_id, summary, current_count)
                    logger.info(f"Updated summary for chat {chat_id} (at {current_count} messages)")

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
