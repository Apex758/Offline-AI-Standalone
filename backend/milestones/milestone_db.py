import sqlite3
import json
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)

class MilestoneDB:
    """SQLite database for curriculum milestone tracking"""
    
    def __init__(self, db_path: Optional[str] = None):
        if db_path is None:
            # Use same data directory pattern as your JSON files
            # Import from main, not config, to avoid ImportError
            from main import get_data_directory
            data_dir = get_data_directory()
            db_path = str(data_dir / "milestones.db")
        
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        """Initialize database schema"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        
        conn.execute("""
            CREATE TABLE IF NOT EXISTS milestones (
                id TEXT PRIMARY KEY,
                teacher_id TEXT NOT NULL,
                topic_id TEXT NOT NULL,
                topic_title TEXT NOT NULL,
                grade TEXT NOT NULL,
                subject TEXT NOT NULL,
                strand TEXT,
                route TEXT,
                status TEXT CHECK(status IN ('not_started','in_progress','completed','skipped')) DEFAULT 'not_started',
                notes TEXT,
                due_date DATE,
                is_hidden INTEGER DEFAULT 0,
                completed_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(teacher_id, topic_id)
            )
        """)
        
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_teacher_status 
            ON milestones(teacher_id, status, is_hidden)
        """)
        
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_due_date 
            ON milestones(due_date) 
            WHERE due_date IS NOT NULL
        """)
        
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_grade_subject 
            ON milestones(teacher_id, grade, subject, is_hidden)
        """)
        
        # History table for audit trail
        conn.execute("""
            CREATE TABLE IF NOT EXISTS milestone_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                milestone_id TEXT NOT NULL,
                teacher_id TEXT NOT NULL,
                previous_status TEXT,
                new_status TEXT,
                changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                notes TEXT
            )
        """)
        
        # Migration: add checklist_json column for existing databases
        try:
            conn.execute("ALTER TABLE milestones ADD COLUMN checklist_json TEXT DEFAULT '[]'")
        except sqlite3.OperationalError:
            pass  # Column already exists

        conn.commit()
        conn.close()
        logger.info(f"Milestone database initialized at {self.db_path}")

    @staticmethod
    def _extract_key_and_text(outcome: str, index: int) -> tuple:
        """Extract a stable key and display text from an outcome string.
        Handles: '1.1 text', 'K1: text', '3-CP-K-1: text', plain text.
        """
        text = outcome.strip()
        if not text:
            return str(index), text

        # Numbered: "1.1 Choose to listen..."
        m = re.match(r'^(\d+\.\d+)\s+(.+)', text)
        if m:
            return m.group(1), m.group(2).strip()

        # KSV with number: "K1: Identify..." or "S: Observe..."
        m = re.match(r'^([KSV]\d*):\s+(.+)', text)
        if m:
            return m.group(1), m.group(2).strip()

        # Coded: "3-CP-K-1: Identify..."
        m = re.match(r'^([\d]+-\w+-[KSV]-?\d+):?\s+(.+)', text)
        if m:
            return m.group(1), m.group(2).strip()

        return str(index), text

    @staticmethod
    def _parse_outcomes_to_checklist(specific_outcomes: list) -> str:
        """Convert specificOutcomes strings into checklist JSON."""
        checklist = []
        for i, outcome in enumerate(specific_outcomes):
            if not outcome.strip():
                continue
            key, text = MilestoneDB._extract_key_and_text(outcome, i)
            checklist.append({"key": key, "text": text, "checked": False})
        return json.dumps(checklist)

    @staticmethod
    def _merge_checklists(existing_json: str, specific_outcomes: list) -> str:
        """Merge new curriculum outcomes with existing checked state."""
        existing = json.loads(existing_json) if existing_json else []
        existing_map = {item['key']: item['checked'] for item in existing}

        checklist = []
        for i, outcome in enumerate(specific_outcomes):
            if not outcome.strip():
                continue
            key, text = MilestoneDB._extract_key_and_text(outcome, i)
            checklist.append({"key": key, "text": text, "checked": existing_map.get(key, False)})
        return json.dumps(checklist)
    
    def get_connection(self):
        """Get database connection with row factory"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def create_milestone(
        self,
        teacher_id: str,
        topic_id: str,
        topic_title: str,
        grade: str,
        subject: str,
        strand: str = "",
        route: str = "",
        status: str = "not_started",
        specific_outcomes: list = None
    ) -> Dict[str, Any]:
        """Create a new milestone"""
        milestone_id = f"{teacher_id}_{topic_id}"
        checklist_json = self._parse_outcomes_to_checklist(specific_outcomes) if specific_outcomes else '[]'

        conn = self.get_connection()
        try:
            conn.execute("""
                INSERT OR IGNORE INTO milestones
                (id, teacher_id, topic_id, topic_title, grade, subject, strand, route, status, checklist_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (milestone_id, teacher_id, topic_id, topic_title, grade, subject, strand, route, status, checklist_json))
            conn.commit()

            row = conn.execute("SELECT * FROM milestones WHERE id = ?", (milestone_id,)).fetchone()
            return dict(row) if row else {}
        finally:
            conn.close()
    
    def get_milestones(
        self,
        teacher_id: str,
        grade: Optional[str] = None,
        subject: Optional[str] = None,
        status: Optional[str] = None,
        include_hidden: bool = False
    ) -> List[Dict[str, Any]]:
        """Get milestones with optional filters"""
        conn = self.get_connection()
        
        query = "SELECT * FROM milestones WHERE teacher_id = ?"
        params = [teacher_id]
        
        if not include_hidden:
            query += " AND is_hidden = 0"
        
        if grade:
            query += " AND grade = ?"
            params.append(grade)
        
        if subject:
            query += " AND subject = ?"
            params.append(subject)
        
        if status:
            query += " AND status = ?"
            params.append(status)
        
        query += " ORDER BY grade, subject, strand, topic_title"
        
        try:
            rows = conn.execute(query, params).fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()
    
    def update_milestone(
        self,
        milestone_id: str,
        status: Optional[str] = None,
        notes: Optional[str] = None,
        due_date: Optional[str] = None,
        is_hidden: Optional[bool] = None,
        checklist_json: Optional[str] = None
    ) -> Dict[str, Any]:
        """Update milestone fields"""
        conn = self.get_connection()
        
        try:
            # Get current state for history
            current = conn.execute("SELECT * FROM milestones WHERE id = ?", (milestone_id,)).fetchone()
            if not current:
                return {}
            
            updates = []
            params = []
            
            if status is not None:
                updates.append("status = ?")
                params.append(status)
                
                # Record history
                conn.execute("""
                    INSERT INTO milestone_history (milestone_id, teacher_id, previous_status, new_status)
                    VALUES (?, ?, ?, ?)
                """, (milestone_id, current['teacher_id'], current['status'], status))
                
                # Set completed_at timestamp
                if status == "completed":
                    updates.append("completed_at = CURRENT_TIMESTAMP")
                elif current['status'] == "completed" and status != "completed":
                    updates.append("completed_at = NULL")
            
            if notes is not None:
                updates.append("notes = ?")
                params.append(notes)
            
            if due_date is not None:
                updates.append("due_date = ?")
                params.append(due_date if due_date else None)
            
            if is_hidden is not None:
                updates.append("is_hidden = ?")
                params.append(1 if is_hidden else 0)

            if checklist_json is not None:
                updates.append("checklist_json = ?")
                params.append(checklist_json)

            if updates:
                updates.append("updated_at = CURRENT_TIMESTAMP")
                params.append(milestone_id)
                
                query = f"UPDATE milestones SET {', '.join(updates)} WHERE id = ?"
                conn.execute(query, params)
                conn.commit()
            
            row = conn.execute("SELECT * FROM milestones WHERE id = ?", (milestone_id,)).fetchone()
            return dict(row) if row else {}
        finally:
            conn.close()
    
    def get_progress_summary(self, teacher_id: str) -> Dict[str, Any]:
        """Get overall progress statistics"""
        conn = self.get_connection()
        
        try:
            summary = conn.execute("""
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'not_started' THEN 1 ELSE 0 END) as not_started,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped
                FROM milestones
                WHERE teacher_id = ? AND is_hidden = 0
            """, (teacher_id,)).fetchone()
            
            return dict(summary) if summary else {}
        finally:
            conn.close()
    
    def get_progress_by_grade_subject(self, teacher_id: str) -> List[Dict[str, Any]]:
        """Get progress breakdown by grade and subject"""
        conn = self.get_connection()
        
        try:
            rows = conn.execute("""
                SELECT 
                    grade,
                    subject,
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress
                FROM milestones
                WHERE teacher_id = ? AND is_hidden = 0
                GROUP BY grade, subject
                ORDER BY grade, subject
            """, (teacher_id,)).fetchall()
            
            return [dict(row) for row in rows]
        finally:
            conn.close()
    
    def get_upcoming_milestones(self, teacher_id: str, days_ahead: int = 7) -> List[Dict[str, Any]]:
        """Get milestones due in the next N days"""
        conn = self.get_connection()
        
        try:
            rows = conn.execute("""
                SELECT * FROM milestones
                WHERE teacher_id = ? 
                AND due_date BETWEEN DATE('now') AND DATE('now', '+' || ? || ' days')
                AND status != 'completed'
                AND is_hidden = 0
                ORDER BY due_date
            """, (teacher_id, days_ahead)).fetchall()
            
            return [dict(row) for row in rows]
        finally:
            conn.close()
    
    def bulk_reset(self, teacher_id: str, archive: bool = True) -> int:
        """Reset all milestones for new school year"""
        conn = self.get_connection()
        
        try:
            if archive:
                # Move to history
                conn.execute("""
                    INSERT INTO milestone_history (milestone_id, teacher_id, previous_status, new_status, notes)
                    SELECT id, teacher_id, status, 'not_started', 'Year-end reset: ' || datetime('now')
                    FROM milestones
                    WHERE teacher_id = ?
                """, (teacher_id,))
            
            # Reset all (uncheck all checklist items too)
            rows = conn.execute(
                "SELECT id, checklist_json FROM milestones WHERE teacher_id = ?", (teacher_id,)
            ).fetchall()
            for row in rows:
                if row['checklist_json']:
                    checklist = json.loads(row['checklist_json'])
                    for item in checklist:
                        item['checked'] = False
                    conn.execute(
                        "UPDATE milestones SET checklist_json = ? WHERE id = ?",
                        (json.dumps(checklist), row['id'])
                    )

            result = conn.execute("""
                UPDATE milestones
                SET status = 'not_started',
                    notes = NULL,
                    due_date = NULL,
                    completed_at = NULL,
                    updated_at = CURRENT_TIMESTAMP
                WHERE teacher_id = ?
            """, (teacher_id,))
            
            conn.commit()
            return result.rowcount
        finally:
            conn.close()
    
    def generate_milestones_from_curriculum(
        self,
        teacher_id: str,
        curriculum_pages: List[Dict[str, Any]]
    ) -> int:
        """Generate milestones for all curriculum pages"""
        count = 0
        for page in curriculum_pages:
            try:
                self.create_milestone(
                    teacher_id=teacher_id,
                    topic_id=page.get('id', ''),
                    topic_title=page.get('displayName', ''),
                    grade=page.get('grade', ''),
                    subject=page.get('subject', ''),
                    strand=page.get('strand', ''),
                    route=page.get('route', ''),
                    specific_outcomes=page.get('specificOutcomes', [])
                )
                count += 1
            except Exception as e:
                logger.error(f"Error creating milestone for {page.get('id')}: {e}")

        return count

    def sync_milestones_with_curriculum(
        self,
        teacher_id: str,
        curriculum_pages: List[Dict[str, Any]]
    ) -> Dict[str, int]:
        """Sync milestones with updated curriculum data.

        - Adds new milestones for pages that don't have one yet
        - Removes milestones whose topic_id no longer exists in curriculum
        - Updates topic_title, grade, subject, strand, route for existing milestones

        Returns dict with counts: added, updated, removed
        """
        conn = self.get_connection()
        added = 0
        updated = 0
        removed = 0

        try:
            # Get current milestones for this teacher
            existing = conn.execute(
                "SELECT * FROM milestones WHERE teacher_id = ?", (teacher_id,)
            ).fetchall()
            existing_map = {row['topic_id']: dict(row) for row in existing}

            # Build set of current curriculum page IDs
            curriculum_ids = set()
            for page in curriculum_pages:
                page_id = page.get('id', '')
                if not page_id:
                    continue
                curriculum_ids.add(page_id)

                specific_outcomes = page.get('specificOutcomes', [])

                if page_id in existing_map:
                    # Update existing milestone metadata (preserve status, notes, due_date)
                    milestone_id = existing_map[page_id]['id']
                    # Merge checklist: preserve checked state, add/remove outcomes
                    merged_checklist = self._merge_checklists(
                        existing_map[page_id].get('checklist_json', '[]'),
                        specific_outcomes
                    )
                    conn.execute("""
                        UPDATE milestones
                        SET topic_title = ?, grade = ?, subject = ?, strand = ?, route = ?,
                            checklist_json = ?, updated_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                    """, (
                        page.get('displayName', ''),
                        page.get('grade', ''),
                        page.get('subject', ''),
                        page.get('strand', ''),
                        page.get('route', ''),
                        merged_checklist,
                        milestone_id
                    ))
                    updated += 1
                else:
                    # Add new milestone (inline to reuse existing connection)
                    milestone_id = f"{teacher_id}_{page_id}"
                    checklist_json = self._parse_outcomes_to_checklist(specific_outcomes)
                    conn.execute("""
                        INSERT OR IGNORE INTO milestones
                        (id, teacher_id, topic_id, topic_title, grade, subject, strand, route, status, checklist_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'not_started', ?)
                    """, (
                        milestone_id, teacher_id, page_id,
                        page.get('displayName', ''),
                        page.get('grade', ''),
                        page.get('subject', ''),
                        page.get('strand', ''),
                        page.get('route', ''),
                        checklist_json
                    ))
                    added += 1

            # Remove milestones for pages that no longer exist
            for topic_id, milestone in existing_map.items():
                if topic_id not in curriculum_ids:
                    conn.execute("DELETE FROM milestones WHERE id = ?", (milestone['id'],))
                    removed += 1

            conn.commit()
            logger.info(f"Synced milestones for {teacher_id}: added={added}, updated={updated}, removed={removed}")
            return {"added": added, "updated": updated, "removed": removed}
        finally:
            conn.close()

# Global instance
_milestone_db = None

def get_milestone_db() -> MilestoneDB:
    """Get singleton milestone database instance"""
    global _milestone_db
    if _milestone_db is None:
        _milestone_db = MilestoneDB()
    return _milestone_db