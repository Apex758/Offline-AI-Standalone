"""
Teacher Long-Term Memory (Feature 6).

Persistent fact storage across conversations. Facts are extracted in the same
LLM call that generates the conversation summary (zero extra latency), then
recalled into future chats via TF-IDF similarity search.

Includes Feature 6 tightening:
  1. Recall block hard-capped at ~200 tokens.
  2. Threshold 0.28 + short-query fallback (recent facts).
  3. Privacy kill-switch (caller passes memory_enabled flag).
  4. `source` column ('chat' | 'profile' | 'manual') for F7 integration.
  5. `feature_context` recall biasing via `contexts` column (+0.1 bonus).
  6. `conflicts_with` flagging instead of silent override.
"""

import sqlite3
import uuid
import logging
import threading
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

# Soft cap on the recall block injected into prompts (Feature 6 tightening #1)
RECALL_BLOCK_TOKEN_CAP = 200
# TF-IDF cosine similarity defaults (Feature 6 tightening #2)
DEFAULT_RECALL_THRESHOLD = 0.28
SHORT_QUERY_WORD_THRESHOLD = 5
DUPLICATE_SIMILARITY_THRESHOLD = 0.85
# Per-teacher fact cap (oldest+lowest-access pruned beyond this)
MAX_FACTS_PER_TEACHER = 200


def _estimate_tokens(text: str) -> int:
    if not text:
        return 0
    return max(1, int(len(text) / 3.5))


def _get_db_path() -> Path:
    """Use the same data dir as chat_memory; teacher_memories lives in chat_memory.db."""
    import os
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Teacher Assistant' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir / 'chat_memory.db'


class TeacherMemory:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or str(_get_db_path())
        self._init_db()
        # Per-teacher cached vectors: teacher_id -> {vectorizer, matrix, facts}
        self._cache: Dict[str, dict] = {}
        self._cache_lock = threading.Lock()

    # ── Schema ────────────────────────────────────────────────────────

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("PRAGMA journal_mode=WAL")
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS teacher_memories (
                id TEXT PRIMARY KEY,
                teacher_id TEXT NOT NULL,
                fact TEXT NOT NULL,
                source TEXT NOT NULL DEFAULT 'chat',
                contexts TEXT,
                conflicts_with TEXT,
                source_chat_id TEXT,
                access_count INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                last_accessed TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_teacher_memories_teacher
                ON teacher_memories(teacher_id);
        """)
        # Forward migration for previously-created tables
        for col, ddl in [
            ("source", "ALTER TABLE teacher_memories ADD COLUMN source TEXT NOT NULL DEFAULT 'chat'"),
            ("contexts", "ALTER TABLE teacher_memories ADD COLUMN contexts TEXT"),
            ("conflicts_with", "ALTER TABLE teacher_memories ADD COLUMN conflicts_with TEXT"),
        ]:
            try:
                conn.execute(f"SELECT {col} FROM teacher_memories LIMIT 1")
            except sqlite3.OperationalError:
                try:
                    conn.execute(ddl)
                except Exception:
                    pass
        conn.commit()
        conn.close()

    def _conn(self) -> sqlite3.Connection:
        c = sqlite3.connect(self.db_path)
        c.row_factory = sqlite3.Row
        return c

    # ── Read helpers ──────────────────────────────────────────────────

    def _get_all_facts(self, teacher_id: str) -> List[Dict]:
        conn = self._conn()
        rows = conn.execute(
            "SELECT id, fact, source, contexts, conflicts_with, access_count, "
            "created_at, last_accessed FROM teacher_memories "
            "WHERE teacher_id = ? ORDER BY id ASC",
            (teacher_id,)
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def get_recent_facts(self, teacher_id: str, n: int = 10) -> List[Dict]:
        """Top-N most recently accessed facts. Used for short-query fallback
        and for the 'existing memories' block in fact extraction."""
        conn = self._conn()
        rows = conn.execute(
            "SELECT id, fact, source FROM teacher_memories WHERE teacher_id = ? "
            "ORDER BY last_accessed DESC, id DESC LIMIT ?",
            (teacher_id, n)
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def count_facts(self, teacher_id: str) -> int:
        conn = self._conn()
        n = conn.execute(
            "SELECT COUNT(*) FROM teacher_memories WHERE teacher_id = ?",
            (teacher_id,)
        ).fetchone()[0]
        conn.close()
        return n

    # ── Write helpers ─────────────────────────────────────────────────

    def _insert_fact(self, teacher_id, fact, source='chat',
                     source_chat_id=None, contexts=None, conflicts_with=None) -> str:
        fid = str(uuid.uuid4())
        conn = self._conn()
        conn.execute(
            "INSERT INTO teacher_memories "
            "(id, teacher_id, fact, source, source_chat_id, contexts, conflicts_with) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (fid, teacher_id, fact, source, source_chat_id, contexts, conflicts_with)
        )
        conn.commit()
        conn.close()
        return fid

    def _replace_fact(self, fact_id: str, new_fact: str, source_chat_id: Optional[str] = None):
        conn = self._conn()
        conn.execute(
            "UPDATE teacher_memories SET fact = ?, source_chat_id = ?, "
            "last_accessed = CURRENT_TIMESTAMP WHERE id = ?",
            (new_fact, source_chat_id, fact_id)
        )
        conn.commit()
        conn.close()

    def _bump_access(self, fact_ids: List[str]):
        if not fact_ids:
            return
        conn = self._conn()
        placeholders = ",".join("?" * len(fact_ids))
        conn.execute(
            f"UPDATE teacher_memories SET access_count = access_count + 1, "
            f"last_accessed = CURRENT_TIMESTAMP WHERE id IN ({placeholders})",
            fact_ids
        )
        conn.commit()
        conn.close()

    def _prune_if_needed(self, teacher_id: str):
        n = self.count_facts(teacher_id)
        if n <= MAX_FACTS_PER_TEACHER:
            return
        excess = n - MAX_FACTS_PER_TEACHER
        conn = self._conn()
        conn.execute(
            "DELETE FROM teacher_memories WHERE id IN ("
            "  SELECT id FROM teacher_memories WHERE teacher_id = ? "
            "  ORDER BY access_count ASC, last_accessed ASC LIMIT ?"
            ")",
            (teacher_id, excess)
        )
        conn.commit()
        conn.close()

    def delete_all(self, teacher_id: str) -> int:
        """Privacy kill-switch (Feature 6 tightening #3)."""
        conn = self._conn()
        cur = conn.execute(
            "DELETE FROM teacher_memories WHERE teacher_id = ?",
            (teacher_id,)
        )
        n = cur.rowcount
        conn.commit()
        conn.close()
        self._invalidate_vectors(teacher_id)
        return n

    # ── Save flow ─────────────────────────────────────────────────────

    def save_facts(
        self,
        teacher_id: str,
        facts: List[str],
        source_chat_id: Optional[str] = None,
        replacements: Optional[List[Dict]] = None,
        source: str = 'chat',
        contexts: Optional[str] = None,
    ) -> int:
        """Save extracted facts.

        Applies any contradiction `replacements` first, then inserts new facts
        that aren't TF-IDF duplicates (>0.85 similarity to an existing fact).
        Returns the number of newly-added facts.
        """
        if not facts and not replacements:
            return 0

        if replacements:
            for r in replacements:
                old_id = r.get("old_id")
                new_fact = (r.get("new_fact") or "").strip()
                if old_id and new_fact:
                    self._replace_fact(old_id, new_fact, source_chat_id)

        existing = [e["fact"] for e in self._get_all_facts(teacher_id)]
        added = 0
        for fact in facts or []:
            fact = (fact or "").strip()
            if not fact or len(fact) < 5:
                continue
            if self._is_duplicate(fact, existing):
                continue
            self._insert_fact(
                teacher_id, fact,
                source=source,
                source_chat_id=source_chat_id,
                contexts=contexts,
            )
            existing.append(fact)  # avoid intra-batch dupes
            added += 1

        if added or replacements:
            self._invalidate_vectors(teacher_id)
            self._prune_if_needed(teacher_id)
        return added

    def _is_duplicate(self, fact: str, existing: List[str]) -> bool:
        if not existing:
            return False
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
            vec = TfidfVectorizer(stop_words='english', max_features=2000)
            try:
                matrix = vec.fit_transform(existing + [fact])
            except ValueError:
                return False  # empty vocabulary (e.g., all stopwords)
            sims = cosine_similarity(matrix[-1], matrix[:-1])[0]
            return bool((sims >= DUPLICATE_SIMILARITY_THRESHOLD).any())
        except Exception as e:
            logger.warning(f"Duplicate check failed (allowing insert): {e}")
            return False

    # ── Recall ────────────────────────────────────────────────────────

    def _invalidate_vectors(self, teacher_id: str):
        with self._cache_lock:
            self._cache.pop(teacher_id, None)

    def _ensure_vectors(self, teacher_id: str):
        with self._cache_lock:
            if teacher_id in self._cache:
                return self._cache[teacher_id]
        facts = self._get_all_facts(teacher_id)
        if not facts:
            return None
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            vec = TfidfVectorizer(stop_words='english', max_features=5000)
            matrix = vec.fit_transform([f["fact"] for f in facts])
        except Exception as e:
            logger.warning(f"TF-IDF vectorization failed: {e}")
            return None
        bundle = {"vectorizer": vec, "matrix": matrix, "facts": facts}
        with self._cache_lock:
            self._cache[teacher_id] = bundle
        return bundle

    def recall(
        self,
        teacher_id: str,
        query: str,
        top_k: int = 5,
        threshold: float = DEFAULT_RECALL_THRESHOLD,
        feature_context: Optional[str] = None,
    ) -> List[Dict]:
        """Return up to top_k relevant facts, hard-capped at RECALL_BLOCK_TOKEN_CAP.

        Returns list of dicts: [{id, fact, source, conflicts_with, score}, ...]
        Implements Feature 6 tightening: short-query fallback, +0.1 context
        bonus, token-cap trimming.
        """
        if not query or not teacher_id:
            return []
        query = query.strip()

        # Short-query fallback: TF-IDF is unreliable on 1-4 word queries
        if len(query.split()) < SHORT_QUERY_WORD_THRESHOLD:
            recents = self.get_recent_facts(teacher_id, n=2)
            if not recents:
                return []
            self._bump_access([r["id"] for r in recents])
            return self._cap_to_token_budget(
                [{**r, "conflicts_with": None, "score": 0.0} for r in recents]
            )

        bundle = self._ensure_vectors(teacher_id)
        if not bundle:
            return []
        try:
            from sklearn.metrics.pairwise import cosine_similarity
            qvec = bundle["vectorizer"].transform([query])
            sims = cosine_similarity(qvec, bundle["matrix"])[0]
        except Exception as e:
            logger.warning(f"Recall similarity failed: {e}")
            return []

        scored = []
        for i, fact_row in enumerate(bundle["facts"]):
            score = float(sims[i])
            # Feature-context bonus: +0.1 if this fact's contexts include the active feature
            if feature_context and fact_row.get("contexts"):
                tags = [t.strip() for t in fact_row["contexts"].split(",") if t.strip()]
                if feature_context in tags:
                    score += 0.1
            if score >= threshold:
                scored.append({
                    "id": fact_row["id"],
                    "fact": fact_row["fact"],
                    "source": fact_row.get("source", "chat"),
                    "conflicts_with": fact_row.get("conflicts_with"),
                    "score": score,
                })
        scored.sort(key=lambda x: x["score"], reverse=True)
        top = scored[:top_k]
        if top:
            self._bump_access([r["id"] for r in top])
        return self._cap_to_token_budget(top)

    def _cap_to_token_budget(self, facts: List[Dict]) -> List[Dict]:
        """Trim from the end until estimated block tokens <= RECALL_BLOCK_TOKEN_CAP."""
        out = list(facts)
        while out and _estimate_tokens(self.format_block(out)) > RECALL_BLOCK_TOKEN_CAP:
            out.pop()
        return out

    def format_block(self, facts: List[Dict]) -> str:
        """Render the recalled facts as a system-prompt injection block."""
        if not facts:
            return ""
        lines = ["\n\n[Known about this teacher:"]
        for f in facts:
            line = f"  - {f['fact']}"
            cw = f.get("conflicts_with")
            if cw:
                line += (f" (note: this conflicts with the profile field "
                         f"'{cw}' -- ask for clarification if relevant)")
            lines.append(line)
        lines.append("]")
        return "\n".join(lines)


# ── Singleton ─────────────────────────────────────────────────────────

_instance: Optional[TeacherMemory] = None
_instance_lock = threading.Lock()


def get_teacher_memory() -> TeacherMemory:
    global _instance
    with _instance_lock:
        if _instance is None:
            _instance = TeacherMemory()
    return _instance
