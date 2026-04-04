import sqlite3
import uuid
import os
import json
from pathlib import Path
from datetime import datetime, timedelta


def _get_db_path() -> str:
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return str(data_dir / 'students.db')


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(_get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_tables():
    conn = _get_conn()
    try:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS school_year_config (
                id          TEXT PRIMARY KEY,
                teacher_id  TEXT NOT NULL,
                label       TEXT NOT NULL,
                start_date  TEXT NOT NULL,
                end_date    TEXT NOT NULL,
                is_active   INTEGER NOT NULL DEFAULT 1,
                created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at  TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(teacher_id, label)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS school_year_events (
                id          TEXT PRIMARY KEY,
                config_id   TEXT NOT NULL,
                teacher_id  TEXT NOT NULL,
                title       TEXT NOT NULL,
                description TEXT,
                event_date  TEXT NOT NULL,
                end_date    TEXT,
                event_type  TEXT NOT NULL,
                color       TEXT,
                subject     TEXT,
                grade_level TEXT,
                all_day     INTEGER DEFAULT 1,
                created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (config_id) REFERENCES school_year_config(id) ON DELETE CASCADE
            )
        ''')
        conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_syc_teacher
            ON school_year_config(teacher_id, is_active)
        ''')
        conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_sye_config
            ON school_year_events(config_id)
        ''')
        conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_sye_date
            ON school_year_events(event_date)
        ''')
        # Migrations for reminder columns
        for col, definition in [
            ('reminders_enabled', 'INTEGER DEFAULT 0'),
            ('reminder_offsets',  "TEXT DEFAULT '[]'"),
        ]:
            try:
                conn.execute(f'ALTER TABLE school_year_events ADD COLUMN {col} {definition}')
            except Exception:
                pass  # Column already exists
        conn.commit()
    finally:
        conn.close()


# Initialize tables on import
init_tables()


# ── Config CRUD ──

def save_config(data: dict) -> dict:
    conn = _get_conn()
    try:
        config_id = data.get('id') or str(uuid.uuid4())
        now = datetime.now().isoformat()

        # If setting as active, deactivate others for this teacher
        if data.get('is_active', 1):
            conn.execute(
                'UPDATE school_year_config SET is_active = 0 WHERE teacher_id = ? AND id != ?',
                (data['teacher_id'], config_id)
            )

        conn.execute('''
            INSERT INTO school_year_config (id, teacher_id, label, start_date, end_date, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                label = excluded.label,
                start_date = excluded.start_date,
                end_date = excluded.end_date,
                is_active = excluded.is_active,
                updated_at = excluded.updated_at
        ''', (
            config_id,
            data['teacher_id'],
            data['label'],
            data['start_date'],
            data['end_date'],
            data.get('is_active', 1),
            now, now
        ))
        conn.commit()
        row = conn.execute('SELECT * FROM school_year_config WHERE id = ?', (config_id,)).fetchone()
        return dict(row)
    finally:
        conn.close()


def get_active_config(teacher_id: str) -> dict | None:
    conn = _get_conn()
    try:
        row = conn.execute(
            'SELECT * FROM school_year_config WHERE teacher_id = ? AND is_active = 1',
            (teacher_id,)
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def list_configs(teacher_id: str) -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT * FROM school_year_config WHERE teacher_id = ? ORDER BY start_date DESC',
            (teacher_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def delete_config(config_id: str) -> bool:
    conn = _get_conn()
    try:
        cursor = conn.execute('DELETE FROM school_year_config WHERE id = ?', (config_id,))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


# ── Event CRUD ──

def save_event(data: dict) -> dict:
    conn = _get_conn()
    try:
        event_id = data.get('id') or str(uuid.uuid4())
        now = datetime.now().isoformat()

        conn.execute('''
            INSERT INTO school_year_events (id, config_id, teacher_id, title, description,
                event_date, end_date, event_type, color, subject, grade_level, all_day,
                reminders_enabled, reminder_offsets, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                description = excluded.description,
                event_date = excluded.event_date,
                end_date = excluded.end_date,
                event_type = excluded.event_type,
                color = excluded.color,
                subject = excluded.subject,
                grade_level = excluded.grade_level,
                all_day = excluded.all_day,
                reminders_enabled = excluded.reminders_enabled,
                reminder_offsets = excluded.reminder_offsets
        ''', (
            event_id,
            data['config_id'],
            data['teacher_id'],
            data['title'],
            data.get('description'),
            data['event_date'],
            data.get('end_date'),
            data['event_type'],
            data.get('color'),
            data.get('subject'),
            data.get('grade_level'),
            data.get('all_day', 1),
            data.get('reminders_enabled', 0),
            data.get('reminder_offsets', '[]'),
            now
        ))
        conn.commit()
        row = conn.execute('SELECT * FROM school_year_events WHERE id = ?', (event_id,)).fetchone()
        return dict(row)
    finally:
        conn.close()


def list_events(config_id: str) -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT * FROM school_year_events WHERE config_id = ? ORDER BY event_date ASC',
            (config_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def list_events_by_range(teacher_id: str, start: str, end: str) -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            '''SELECT * FROM school_year_events
               WHERE teacher_id = ? AND event_date >= ? AND event_date <= ?
               ORDER BY event_date ASC''',
            (teacher_id, start, end)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def delete_event(event_id: str) -> bool:
    conn = _get_conn()
    try:
        cursor = conn.execute('DELETE FROM school_year_events WHERE id = ?', (event_id,))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def bulk_save_events(events: list[dict]) -> list[dict]:
    results = []
    for event in events:
        results.append(save_event(event))
    return results


# ── Reminder Logic ──

OFFSET_LABELS = {
    0:     'now',
    30:    '30 minutes before',
    60:    '1 hour before',
    1440:  '1 day before',
    10080: '1 week before',
}


def get_due_reminders(teacher_id: str, window_minutes: int = 1) -> list[dict]:
    """Return reminders that should fire within [now - window, now + window]."""
    conn = _get_conn()
    try:
        rows = conn.execute(
            '''SELECT id, title, event_type, event_date, reminder_offsets
               FROM school_year_events
               WHERE teacher_id = ? AND reminders_enabled = 1''',
            (teacher_id,)
        ).fetchall()
    finally:
        conn.close()

    now = datetime.now()
    window = timedelta(minutes=window_minutes)
    due = []

    for row in rows:
        event_date_str = row['event_date']
        try:
            # Support both date-only (YYYY-MM-DD) and datetime strings
            if 'T' in event_date_str or ' ' in event_date_str:
                event_dt = datetime.fromisoformat(event_date_str.replace('Z', ''))
            else:
                event_dt = datetime.fromisoformat(event_date_str + 'T00:00:00')
        except ValueError:
            continue

        offsets = json.loads(row['reminder_offsets'] or '[]')
        for offset in offsets:
            trigger_time = event_dt - timedelta(minutes=int(offset))
            if abs((trigger_time - now).total_seconds()) <= window.total_seconds() * 60:
                due.append({
                    'event_id':      row['id'],
                    'title':         row['title'],
                    'event_type':    row['event_type'],
                    'event_date':    event_date_str,
                    'offset_minutes': int(offset),
                    'trigger_label': OFFSET_LABELS.get(int(offset), f'{offset} min before'),
                })

    return due
