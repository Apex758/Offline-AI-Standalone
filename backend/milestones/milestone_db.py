import sqlite3
import json
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
        
        conn.commit()
        conn.close()
        logger.info(f"Milestone database initialized at {self.db_path}")
    
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
        status: str = "not_started"
    ) -> Dict[str, Any]:
        """Create a new milestone"""
        milestone_id = f"{teacher_id}_{topic_id}"
        
        conn = self.get_connection()
        try:
            conn.execute("""
                INSERT OR IGNORE INTO milestones 
                (id, teacher_id, topic_id, topic_title, grade, subject, strand, route, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (milestone_id, teacher_id, topic_id, topic_title, grade, subject, strand, route, status))
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
        is_hidden: Optional[bool] = None
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
            
            # Reset all
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
                    route=page.get('route', '')
                )
                count += 1
            except Exception as e:
                logger.error(f"Error creating milestone for {page.get('id')}: {e}")
        
        return count

# Global instance
_milestone_db = None

def get_milestone_db() -> MilestoneDB:
    """Get singleton milestone database instance"""
    global _milestone_db
    if _milestone_db is None:
        _milestone_db = MilestoneDB()
    return _milestone_db