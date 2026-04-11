"""
Consultant Memory — 3-tier memory system for Educator Coach conversations.

Reuses the ChatMemory pattern from chat_memory.py but with separate tables
in teacher.db (consultant_conversations + consultant_messages).

Tier 1: Sliding window — last N message pairs
Tier 2: Conversation summary — LLM-generated, every ~10 messages
Tier 3: SQLite persistence — all messages
"""

import sqlite3
import uuid
import logging
from datetime import datetime
from typing import List, Dict, Optional, Tuple

logger = logging.getLogger(__name__)

SUMMARY_INTERVAL = 10


def _estimate_tokens(text: str) -> int:
    """Cheap token estimator (~1 token per 3.5 chars). Avoids loading a tokenizer."""
    if not text:
        return 0
    return max(1, int(len(text) / 3.5))


def _get_db_path() -> str:
    from teacher_metrics_service import _get_db_path as get_path
    return get_path()


def _conn() -> sqlite3.Connection:
    conn = sqlite3.connect(_get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


class ConsultantMemory:
    """Memory manager for Educator Coach conversations."""

    def create_conversation(self, teacher_id: str, dimension_focus: str = None) -> str:
        """Create a new consultant conversation and return its ID."""
        chat_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        title = f"Coach: {dimension_focus.capitalize()}" if dimension_focus else "Educator Coach"

        c = _conn()
        try:
            c.execute(
                "INSERT INTO consultant_conversations (id, teacher_id, title, dimension_focus, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                (chat_id, teacher_id, title, dimension_focus, now, now)
            )
            c.commit()
        finally:
            c.close()
        return chat_id

    def list_conversations(self, teacher_id: str, limit: int = 20) -> List[Dict]:
        """List recent consultant conversations for a teacher."""
        c = _conn()
        try:
            rows = c.execute(
                "SELECT id, teacher_id, title, dimension_focus, created_at, updated_at FROM consultant_conversations WHERE teacher_id = ? ORDER BY updated_at DESC LIMIT ?",
                (teacher_id, limit)
            ).fetchall()
            return [dict(r) for r in rows]
        finally:
            c.close()

    def get_conversation(self, chat_id: str) -> Optional[Dict]:
        """Get a single conversation with its messages."""
        c = _conn()
        try:
            row = c.execute("SELECT * FROM consultant_conversations WHERE id = ?", (chat_id,)).fetchone()
            if not row:
                return None
            conv = dict(row)
            messages = c.execute(
                "SELECT msg_id, role, content, timestamp FROM consultant_messages WHERE chat_id = ? ORDER BY id ASC",
                (chat_id,)
            ).fetchall()
            conv["messages"] = [dict(m) for m in messages]
            return conv
        finally:
            c.close()

    def save_message(self, chat_id: str, msg_id: str, role: str, content: str, timestamp: str = None):
        """Save a message to a consultant conversation."""
        ts = timestamp or datetime.now().isoformat()
        c = _conn()
        try:
            c.execute(
                "INSERT INTO consultant_messages (chat_id, msg_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?)",
                (chat_id, msg_id, role, content, ts)
            )
            c.execute(
                "UPDATE consultant_conversations SET updated_at = ? WHERE id = ?",
                (ts, chat_id)
            )
            c.commit()
        finally:
            c.close()

    def build_context(self, chat_id: str, n_pairs: int = 4) -> Tuple[str, List[Dict]]:
        """Build conversation context: (summary_block, recent_messages).

        Returns the summary as a string prefix and the last N user+assistant pairs.
        """
        c = _conn()
        try:
            # Get summary
            row = c.execute("SELECT summary FROM consultant_conversations WHERE id = ?", (chat_id,)).fetchone()
            summary = row["summary"] if row and row["summary"] else ""

            # Get last N pairs (2*n_pairs messages)
            messages = c.execute(
                "SELECT role, content FROM consultant_messages WHERE chat_id = ? ORDER BY id DESC LIMIT ?",
                (chat_id, n_pairs * 2)
            ).fetchall()
            messages = [dict(m) for m in reversed(messages)]

            summary_block = ""
            if summary:
                summary_block = f"Previous conversation summary: {summary}\n\n"

            return summary_block, messages
        finally:
            c.close()

    def build_context_budgeted(
        self,
        chat_id: str,
        token_budget: int = 2000,
        n_pairs_max: int = 4,
        summary_cap_tokens: int = 150,
        reserved_tokens: int = 0,
    ) -> Tuple[str, List[Dict]]:
        """
        Token-aware version of build_context() (consultant flavor).

        Identical pattern to ChatMemory.build_context_budgeted: caps the summary,
        drops oldest pairs until under budget, and as a last resort truncates the
        summary further. `reserved_tokens` accounts for the system prompt + user
        message + any other blocks the caller plans to inject.
        """
        c = _conn()
        try:
            row = c.execute(
                "SELECT summary FROM consultant_conversations WHERE id = ?",
                (chat_id,)
            ).fetchone()
            summary = row["summary"] if row and row["summary"] else ""

            messages = c.execute(
                "SELECT role, content FROM consultant_messages WHERE chat_id = ? ORDER BY id DESC LIMIT ?",
                (chat_id, n_pairs_max * 2)
            ).fetchall()
            recent = [dict(m) for m in reversed(messages)]
        finally:
            c.close()

        # Step 1: cap summary length up-front
        if summary and _estimate_tokens(summary) > summary_cap_tokens:
            char_cap = int(summary_cap_tokens * 3.5)
            cut = summary[:char_cap].rfind('. ')
            summary = summary[:cut + 1] if cut > 0 else summary[:char_cap]

        # Step 2: shrink history until within available budget
        available = max(0, token_budget - reserved_tokens)
        summary_tokens = _estimate_tokens(summary) if summary else 0
        history_tokens = sum(_estimate_tokens(m.get("content", "")) for m in recent)

        while (summary_tokens + history_tokens) > available and len(recent) >= 2:
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

        summary_block = f"Previous conversation summary: {summary}\n\n" if summary else ""
        return summary_block, recent

    def needs_summary_update(self, chat_id: str) -> bool:
        """Check if the conversation needs a summary update."""
        c = _conn()
        try:
            row = c.execute(
                "SELECT summary_msg_count FROM consultant_conversations WHERE id = ?",
                (chat_id,)
            ).fetchone()
            if not row:
                return False
            last_summarized = row["summary_msg_count"] or 0

            count = c.execute(
                "SELECT COUNT(*) as cnt FROM consultant_messages WHERE chat_id = ?",
                (chat_id,)
            ).fetchone()["cnt"]

            return (count - last_summarized) >= SUMMARY_INTERVAL
        finally:
            c.close()

    def update_summary(self, chat_id: str, summary: str):
        """Update the conversation summary after LLM summarization."""
        c = _conn()
        try:
            count = c.execute(
                "SELECT COUNT(*) as cnt FROM consultant_messages WHERE chat_id = ?",
                (chat_id,)
            ).fetchone()["cnt"]
            c.execute(
                "UPDATE consultant_conversations SET summary = ?, summary_msg_count = ? WHERE id = ?",
                (summary, count, chat_id)
            )
            c.commit()
        finally:
            c.close()

    def get_messages_for_summary(self, chat_id: str) -> List[Dict]:
        """Get all messages for summary generation."""
        c = _conn()
        try:
            rows = c.execute(
                "SELECT role, content FROM consultant_messages WHERE chat_id = ? ORDER BY id ASC",
                (chat_id,)
            ).fetchall()
            return [dict(r) for r in rows]
        finally:
            c.close()


# Singleton
_instance: Optional[ConsultantMemory] = None


def get_consultant_memory() -> ConsultantMemory:
    global _instance
    if _instance is None:
        _instance = ConsultantMemory()
    return _instance
