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
                id                  TEXT PRIMARY KEY,
                teacher_id          TEXT NOT NULL,
                label               TEXT NOT NULL,
                start_date          TEXT NOT NULL,
                end_date            TEXT NOT NULL,
                is_active           INTEGER NOT NULL DEFAULT 1,
                structure_type      TEXT NOT NULL DEFAULT 'generic',
                created_at          TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at          TEXT DEFAULT CURRENT_TIMESTAMP,
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

        # ── Academic phases (Caribbean semester model) ──
        conn.execute('''
            CREATE TABLE IF NOT EXISTS academic_phases (
                id              TEXT PRIMARY KEY,
                config_id       TEXT NOT NULL,
                teacher_id      TEXT NOT NULL,
                phase_key       TEXT NOT NULL,
                phase_label     TEXT NOT NULL,
                semester        TEXT,
                start_date      TEXT NOT NULL,
                end_date        TEXT NOT NULL,
                phase_order     INTEGER NOT NULL DEFAULT 0,
                created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (config_id) REFERENCES school_year_config(id) ON DELETE CASCADE
            )
        ''')
        conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_ap_config
            ON academic_phases(config_id)
        ''')
        conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_ap_teacher
            ON academic_phases(teacher_id)
        ''')

        # ── Phase summaries (generated at end of each phase) ──
        conn.execute('''
            CREATE TABLE IF NOT EXISTS academic_phase_summaries (
                id                      TEXT PRIMARY KEY,
                config_id               TEXT NOT NULL,
                teacher_id              TEXT NOT NULL,
                phase_key               TEXT NOT NULL,
                phase_label             TEXT NOT NULL,
                semester                TEXT,
                start_date              TEXT NOT NULL,
                end_date                TEXT NOT NULL,
                avg_composite           REAL,
                peak_composite          REAL,
                low_composite           REAL,
                snapshot_count          INTEGER DEFAULT 0,
                dimension_deltas_json   TEXT,
                narrative               TEXT,
                generated_at            TEXT NOT NULL,
                FOREIGN KEY (config_id) REFERENCES school_year_config(id) ON DELETE CASCADE
            )
        ''')
        conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_aps_teacher
            ON academic_phase_summaries(teacher_id)
        ''')

        # Migrations for existing tables
        for col, definition in [
            ('reminders_enabled', 'INTEGER DEFAULT 0'),
            ('reminder_offsets',  "TEXT DEFAULT '[]'"),
        ]:
            try:
                conn.execute(f'ALTER TABLE school_year_events ADD COLUMN {col} {definition}')
            except Exception:
                pass  # Column already exists

        for col, definition in [
            ('structure_type', "TEXT NOT NULL DEFAULT 'generic'"),
        ]:
            try:
                conn.execute(f'ALTER TABLE school_year_config ADD COLUMN {col} {definition}')
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
            INSERT INTO school_year_config (id, teacher_id, label, start_date, end_date, is_active, structure_type, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                label = excluded.label,
                start_date = excluded.start_date,
                end_date = excluded.end_date,
                is_active = excluded.is_active,
                structure_type = excluded.structure_type,
                updated_at = excluded.updated_at
        ''', (
            config_id,
            data['teacher_id'],
            data['label'],
            data['start_date'],
            data['end_date'],
            data.get('is_active', 1),
            data.get('structure_type', 'generic'),
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


# ── Caribbean Academic Phase Setup ────────────────────────────────────────────

CARIBBEAN_PHASE_DEFS = [
    # (phase_key, phase_label, semester, order)
    ('semester_1_early',     'Semester 1 — Early',       'Semester 1', 1),
    ('midterm_1_prep',       'Mid-Term 1 Prep',          'Semester 1', 2),
    ('midterm_1',            'Mid-Term 1',               'Semester 1', 3),
    ('semester_1_late',      'Semester 1 — Late',        'Semester 1', 4),
    ('inter_semester_break', 'Inter-Semester Break',     None,         5),
    ('semester_2_early',     'Semester 2 — Early',       'Semester 2', 6),
    ('midterm_2_prep',       'Mid-Term 2 Prep',          'Semester 2', 7),
    ('midterm_2',            'Mid-Term 2',               'Semester 2', 8),
    ('semester_2_late',      'Semester 2 — Late',        'Semester 2', 9),
    ('end_of_year_exam',     'End-of-Year Exams',        'Semester 2', 10),
]


def build_caribbean_phases(config_id: str, teacher_id: str, dates: dict) -> list[dict]:
    """
    Build academic_phases records from Caribbean setup wizard dates.

    dates = {
        'year_start':       'YYYY-MM-DD',   # School year start
        'sem1_end':         'YYYY-MM-DD',   # Last day of Semester 1
        'break_end':        'YYYY-MM-DD',   # Last day of inter-semester break (Semester 2 start = break_end + 1 day)
        'year_end':         'YYYY-MM-DD',   # Last day of school year
        'midterm1_start':   'YYYY-MM-DD',
        'midterm1_end':     'YYYY-MM-DD',
        'midterm2_start':   'YYYY-MM-DD',
        'midterm2_end':     'YYYY-MM-DD',
        'final_exam_start': 'YYYY-MM-DD',
        'final_exam_end':   'YYYY-MM-DD',
    }
    """
    from datetime import date as _date, timedelta as _td

    def d(s):
        return _date.fromisoformat(s)

    year_start       = d(dates['year_start'])
    sem1_end         = d(dates['sem1_end'])
    break_start      = sem1_end + _td(days=1)
    break_end        = d(dates['break_end'])
    sem2_start       = break_end + _td(days=1)
    year_end         = d(dates['year_end'])
    mt1_start        = d(dates['midterm1_start'])
    mt1_end          = d(dates['midterm1_end'])
    mt2_start        = d(dates['midterm2_start'])
    mt2_end          = d(dates['midterm2_end'])
    fe_start         = d(dates.get('final_exam_start') or str(year_end - _td(days=13)))
    fe_end           = d(dates.get('final_exam_end') or str(year_end))

    # Prep window = 7 days before each midterm
    mt1_prep_start   = mt1_start - _td(days=7)
    mt2_prep_start   = mt2_start - _td(days=7)

    phase_date_map = {
        'semester_1_early':     (year_start,      mt1_prep_start - _td(days=1)),
        'midterm_1_prep':       (mt1_prep_start,  mt1_start - _td(days=1)),
        'midterm_1':            (mt1_start,       mt1_end),
        'semester_1_late':      (mt1_end + _td(days=1), sem1_end),
        'inter_semester_break': (break_start,     break_end),
        'semester_2_early':     (sem2_start,      mt2_prep_start - _td(days=1)),
        'midterm_2_prep':       (mt2_prep_start,  mt2_start - _td(days=1)),
        'midterm_2':            (mt2_start,       mt2_end),
        'semester_2_late':      (mt2_end + _td(days=1), fe_start - _td(days=1)),
        'end_of_year_exam':     (fe_start,        fe_end),
    }

    phases = []
    for (phase_key, phase_label, semester, order) in CARIBBEAN_PHASE_DEFS:
        start, end = phase_date_map[phase_key]
        phases.append({
            'id':          str(uuid.uuid4()),
            'config_id':   config_id,
            'teacher_id':  teacher_id,
            'phase_key':   phase_key,
            'phase_label': phase_label,
            'semester':    semester,
            'start_date':  str(start),
            'end_date':    str(end),
            'phase_order': order,
        })
    return phases


def save_academic_phases(phases: list[dict]) -> list[dict]:
    """Replace all academic phases for a config and save the new set."""
    if not phases:
        return []
    config_id = phases[0]['config_id']
    conn = _get_conn()
    try:
        conn.execute('DELETE FROM academic_phases WHERE config_id = ?', (config_id,))
        for phase in phases:
            conn.execute('''
                INSERT INTO academic_phases
                    (id, config_id, teacher_id, phase_key, phase_label, semester, start_date, end_date, phase_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                phase['id'], phase['config_id'], phase['teacher_id'],
                phase['phase_key'], phase['phase_label'], phase.get('semester'),
                phase['start_date'], phase['end_date'], phase.get('phase_order', 0),
            ))
        conn.commit()
        rows = conn.execute(
            'SELECT * FROM academic_phases WHERE config_id = ? ORDER BY phase_order ASC',
            (config_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def list_academic_phases(config_id: str) -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT * FROM academic_phases WHERE config_id = ? ORDER BY phase_order ASC',
            (config_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_phase_for_date(teacher_id: str, date_str: str = None) -> dict | None:
    """Return the academic_phase record that contains the given date (or today)."""
    from datetime import date as _date
    target = _date.fromisoformat(date_str) if date_str else _date.today()

    config = get_active_config(teacher_id)
    if not config:
        return None

    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT * FROM academic_phases WHERE config_id = ? ORDER BY phase_order ASC',
            (config['id'],)
        ).fetchall()
    finally:
        conn.close()

    for row in rows:
        start = _date.fromisoformat(row['start_date'])
        end   = _date.fromisoformat(row['end_date'])
        if start <= target <= end:
            return dict(row)
    return None


# ── Phase Summaries ───────────────────────────────────────────────────────────

def save_phase_summary(summary: dict) -> dict:
    conn = _get_conn()
    try:
        summary_id = summary.get('id') or str(uuid.uuid4())
        conn.execute('''
            INSERT INTO academic_phase_summaries
                (id, config_id, teacher_id, phase_key, phase_label, semester,
                 start_date, end_date, avg_composite, peak_composite, low_composite,
                 snapshot_count, dimension_deltas_json, narrative, generated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                avg_composite           = excluded.avg_composite,
                peak_composite          = excluded.peak_composite,
                low_composite           = excluded.low_composite,
                snapshot_count          = excluded.snapshot_count,
                dimension_deltas_json   = excluded.dimension_deltas_json,
                narrative               = excluded.narrative,
                generated_at            = excluded.generated_at
        ''', (
            summary_id,
            summary['config_id'],
            summary['teacher_id'],
            summary['phase_key'],
            summary['phase_label'],
            summary.get('semester'),
            summary['start_date'],
            summary['end_date'],
            summary.get('avg_composite'),
            summary.get('peak_composite'),
            summary.get('low_composite'),
            summary.get('snapshot_count', 0),
            json.dumps(summary.get('dimension_deltas', {})),
            summary.get('narrative'),
            summary.get('generated_at', datetime.now().isoformat()),
        ))
        conn.commit()
        row = conn.execute(
            'SELECT * FROM academic_phase_summaries WHERE id = ?', (summary_id,)
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


def list_phase_summaries(teacher_id: str) -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            '''SELECT * FROM academic_phase_summaries
               WHERE teacher_id = ?
               ORDER BY start_date ASC''',
            (teacher_id,)
        ).fetchall()
        results = []
        for r in rows:
            d = dict(r)
            try:
                d['dimension_deltas'] = json.loads(d.get('dimension_deltas_json') or '{}')
            except Exception:
                d['dimension_deltas'] = {}
            results.append(d)
        return results
    finally:
        conn.close()


def get_phase_summary(teacher_id: str, phase_key: str) -> dict | None:
    conn = _get_conn()
    try:
        row = conn.execute(
            '''SELECT * FROM academic_phase_summaries
               WHERE teacher_id = ? AND phase_key = ?
               ORDER BY generated_at DESC LIMIT 1''',
            (teacher_id, phase_key)
        ).fetchone()
        if not row:
            return None
        d = dict(row)
        try:
            d['dimension_deltas'] = json.loads(d.get('dimension_deltas_json') or '{}')
        except Exception:
            d['dimension_deltas'] = {}
        return d
    finally:
        conn.close()
