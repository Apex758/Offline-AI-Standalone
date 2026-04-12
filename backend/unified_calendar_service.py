"""
Unified Calendar Service (Phase 1 — foundation)

A single derived event layer (`unified_events`) that every time/date system in
the app projects into. The originals remain authoritative; this table is purely
a join-friendly view that can be rebuilt at any time by re-running projectors.

Design decisions (locked):
  - Same SQLite file as school_year/timetable (`students.db`) so projectors run
    in the same transaction as their source writes (no consistency window).
  - source_id is TEXT — every existing source uses UUID strings.
  - Timetable slots store one parent row with an RRULE + EXDATE string;
    occurrences are expanded at query time via dateutil.rrule (cheap, bounded).
  - Status enum normalized: planned | in_progress | completed | cancelled | overdue.
  - Phase 1 ships only the schema, the projector function stubs, and the query
    helpers needed by `routes/unified_calendar.py`. Live wiring happens in Phase 2.

NO Unicode symbols anywhere (Windows cp1252 console).
"""

import os
import sqlite3
import json
import uuid
from pathlib import Path
from datetime import datetime, date, timedelta


# ── DB path (mirrors school_year_service / milestone_db pattern) ──

def _get_db_path() -> str:
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Teacher Assistant' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return str(data_dir / 'students.db')


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(_get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


# ── Schema ──

VALID_SOURCE_TYPES = (
    'school_year',     # school_year_events (non-holiday)
    'holiday',         # school_year_events with event_type='holiday'
    'timetable_slot',  # weekly recurring class meeting
    'milestone',       # curriculum milestone with due_date
    'lesson_plan',     # lesson_plan row (Phase 2)
    'scheduled_task',  # scheduled task result
    'daily_plan',      # kindergarten daily activity plan (Phase 2)
)

VALID_STATUSES = ('planned', 'in_progress', 'completed', 'cancelled', 'overdue')


def init_schema():
    """Create unified_events table + indexes. Idempotent."""
    conn = _get_conn()
    try:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS unified_events (
                id              TEXT PRIMARY KEY,
                teacher_id      TEXT NOT NULL,
                source_type     TEXT NOT NULL,
                source_id       TEXT NOT NULL,
                title           TEXT NOT NULL,
                description     TEXT,
                start_datetime  TEXT NOT NULL,
                end_datetime    TEXT,
                all_day         INTEGER DEFAULT 0,
                recurrence_rule TEXT,
                phase_id        TEXT,
                grade_level     TEXT,
                subject         TEXT,
                status          TEXT NOT NULL DEFAULT 'planned',
                color           TEXT,
                metadata_json   TEXT,
                created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at      TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(source_type, source_id)
            )
        ''')
        conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_unified_teacher_date
            ON unified_events(teacher_id, start_datetime)
        ''')
        conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_unified_source
            ON unified_events(source_type, source_id)
        ''')
        conn.execute('''
            CREATE INDEX IF NOT EXISTS idx_unified_phase
            ON unified_events(phase_id)
        ''')
        conn.commit()
    finally:
        conn.close()


# Initialize on import (matches school_year_service pattern)
init_schema()


# ── Core upsert helper (used by every projector) ──

def upsert_unified_event(conn: sqlite3.Connection, row: dict) -> str:
    """
    Upsert a unified_events row. Caller owns the connection and the commit.

    Required keys: teacher_id, source_type, source_id, title, start_datetime
    Optional keys: description, end_datetime, all_day, recurrence_rule,
                   phase_id, grade_level, subject, status, color, metadata_json
    """
    if row.get('source_type') not in VALID_SOURCE_TYPES:
        raise ValueError(f"Invalid source_type: {row.get('source_type')}")
    status = row.get('status', 'planned')
    if status not in VALID_STATUSES:
        raise ValueError(f"Invalid status: {status}")

    event_id = row.get('id') or str(uuid.uuid4())
    now = datetime.now().isoformat()

    metadata = row.get('metadata_json')
    if isinstance(metadata, dict):
        metadata = json.dumps(metadata)

    conn.execute('''
        INSERT INTO unified_events (
            id, teacher_id, source_type, source_id, title, description,
            start_datetime, end_datetime, all_day, recurrence_rule,
            phase_id, grade_level, subject, status, color, metadata_json,
            created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(source_type, source_id) DO UPDATE SET
            title           = excluded.title,
            description     = excluded.description,
            start_datetime  = excluded.start_datetime,
            end_datetime    = excluded.end_datetime,
            all_day         = excluded.all_day,
            recurrence_rule = excluded.recurrence_rule,
            phase_id        = excluded.phase_id,
            grade_level     = excluded.grade_level,
            subject         = excluded.subject,
            status          = excluded.status,
            color           = excluded.color,
            metadata_json   = excluded.metadata_json,
            updated_at      = excluded.updated_at
    ''', (
        event_id,
        row['teacher_id'],
        row['source_type'],
        str(row['source_id']),
        row['title'],
        row.get('description'),
        row['start_datetime'],
        row.get('end_datetime'),
        int(row.get('all_day', 0)),
        row.get('recurrence_rule'),
        row.get('phase_id'),
        row.get('grade_level'),
        row.get('subject'),
        status,
        row.get('color'),
        metadata,
        now,
        now,
    ))
    return event_id


def delete_unified_event(conn: sqlite3.Connection, source_type: str, source_id: str) -> bool:
    cursor = conn.execute(
        'DELETE FROM unified_events WHERE source_type = ? AND source_id = ?',
        (source_type, str(source_id))
    )
    return cursor.rowcount > 0


# ── Projector function stubs (Phase 2 will wire these into source services) ──
#
# Each projector is a PURE function that takes a connection + a source row
# (already loaded by the caller) and upserts into unified_events on the SAME
# connection. Callers commit. This guarantees the source write and the
# projection succeed or fail together.

def project_school_year_event(conn: sqlite3.Connection, event: dict) -> str:
    """Project a school_year_events row. Holidays use a separate source_type."""
    is_holiday = (event.get('event_type') == 'holiday')
    source_type = 'holiday' if is_holiday else 'school_year'

    start_dt = event['event_date']
    end_dt = event.get('end_date') or event['event_date']
    all_day = int(event.get('all_day', 1))

    # Promote bare YYYY-MM-DD to ISO datetime for consistent indexing
    if all_day and len(start_dt) == 10:
        start_dt = f"{start_dt}T00:00:00"
    if end_dt and len(end_dt) == 10:
        end_dt = f"{end_dt}T23:59:59"

    return upsert_unified_event(conn, {
        'teacher_id':     event['teacher_id'],
        'source_type':    source_type,
        'source_id':      event['id'],
        'title':          event['title'],
        'description':    event.get('description'),
        'start_datetime': start_dt,
        'end_datetime':   end_dt,
        'all_day':        all_day,
        'subject':        event.get('subject'),
        'grade_level':    event.get('grade_level'),
        'color':          event.get('color'),
        'status':         'planned',
        'metadata_json':  {
            'event_type': event.get('event_type'),
            'config_id':  event.get('config_id'),
            'blocks_classes': int(event.get('blocks_classes', 0)),
        },
    })


def project_timetable_slot(conn: sqlite3.Connection, slot: dict, school_year_bounds: dict | None = None) -> str:
    """
    Project a timetable_slots row as a single recurring parent event.
    school_year_bounds = {'start_date': 'YYYY-MM-DD', 'end_date': 'YYYY-MM-DD'}
    The RRULE + EXDATE is recomputed from active holidays at projection time.
    """
    # Map day name to RRULE BYDAY token
    day_map = {
        'Monday': 'MO', 'Tuesday': 'TU', 'Wednesday': 'WE',
        'Thursday': 'TH', 'Friday': 'FR', 'Saturday': 'SA', 'Sunday': 'SU',
    }
    byday = day_map.get(slot['day_of_week'], 'MO')

    # DTSTART anchors to the first matching weekday on/after the school year start
    if school_year_bounds:
        sy_start = date.fromisoformat(school_year_bounds['start_date'])
        sy_end = date.fromisoformat(school_year_bounds['end_date'])
    else:
        sy_start = date.today()
        sy_end = sy_start + timedelta(days=180)

    # Advance sy_start to the first occurrence of this weekday
    target_weekday = list(day_map.keys()).index(slot['day_of_week'])
    days_ahead = (target_weekday - sy_start.weekday()) % 7
    first_occurrence = sy_start + timedelta(days=days_ahead)

    start_iso = f"{first_occurrence.isoformat()}T{slot['start_time']}:00"
    end_iso = f"{first_occurrence.isoformat()}T{slot['end_time']}:00"
    until_str = sy_end.strftime('%Y%m%dT235959')

    # Use iCal multi-line format so dateutil.rrulestr can parse RRULE + EXDATE.
    # Inline ";EXDATE=..." is NOT valid RRULE syntax; EXDATE must be its own line.
    rrule_lines = [f"RRULE:FREQ=WEEKLY;BYDAY={byday};UNTIL={until_str}"]

    # EXDATE comes from holidays with blocks_classes=1 inside the date range
    exdates = _collect_blocking_holidays(conn, slot['teacher_id'], sy_start, sy_end, slot['start_time'])
    if exdates:
        rrule_lines.append("EXDATE:" + ",".join(exdates))
    rrule = "\n".join(rrule_lines)

    title = f"{slot['subject']} - Grade {slot['grade_level']}"
    if slot.get('class_name'):
        title += f" ({slot['class_name']})"

    return upsert_unified_event(conn, {
        'teacher_id':      slot['teacher_id'],
        'source_type':     'timetable_slot',
        'source_id':       slot['id'],
        'title':           title,
        'description':     slot.get('notes'),
        'start_datetime':  start_iso,
        'end_datetime':    end_iso,
        'all_day':         0,
        'recurrence_rule': rrule,
        'subject':         slot['subject'],
        'grade_level':     slot['grade_level'],
        'status':          'planned',
        'metadata_json':   {
            'day_of_week': slot['day_of_week'],
            'start_time':  slot['start_time'],
            'end_time':    slot['end_time'],
            'class_name':  slot.get('class_name'),
        },
    })


def project_milestone(conn: sqlite3.Connection, milestone: dict) -> str | None:
    """Project a milestone with a due_date as an all-day event."""
    if not milestone.get('due_date'):
        return None
    due = milestone['due_date']
    if len(due) == 10:
        start_dt = f"{due}T00:00:00"
        end_dt = f"{due}T23:59:59"
    else:
        start_dt = end_dt = due

    status_map = {
        'not_started': 'planned',
        'in_progress': 'in_progress',
        'completed':   'completed',
        'skipped':     'cancelled',
    }
    status = status_map.get(milestone.get('status', 'not_started'), 'planned')

    return upsert_unified_event(conn, {
        'teacher_id':     milestone['teacher_id'],
        'source_type':    'milestone',
        'source_id':      milestone['id'],
        'title':          milestone.get('topic_title') or 'Milestone',
        'description':    milestone.get('notes'),
        'start_datetime': start_dt,
        'end_datetime':   end_dt,
        'all_day':        1,
        'phase_id':       milestone.get('phase_id'),
        'grade_level':    milestone.get('grade'),
        'subject':        milestone.get('subject'),
        'status':         status,
        'metadata_json':  {
            'topic_id': milestone.get('topic_id'),
            'strand':   milestone.get('strand'),
            'route':    milestone.get('route'),
        },
    })


def project_lesson_plan(conn: sqlite3.Connection, plan: dict) -> str:
    """
    Project a lesson_plans row into unified_events.

    Date strategy:
      - If timetable_slot_id is set, look up the slot and anchor start_datetime
        to the next matching weekday on/after the lesson plan's created_at
      - Otherwise, fall back to created_at as an all-day marker
    """
    import json as _json
    teacher_id = plan.get('teacher_id') or 'default'
    title = plan.get('title') or 'Lesson Plan'
    created = plan.get('created_at') or datetime.now().isoformat()

    form_data = {}
    if plan.get('form_data_json'):
        try:
            form_data = _json.loads(plan['form_data_json'])
        except Exception:
            form_data = {}

    duration_min = 45
    try:
        duration_min = int(form_data.get('duration') or 45)
    except (TypeError, ValueError):
        duration_min = 45

    grade = form_data.get('gradeLevel') or form_data.get('grade')
    subject = form_data.get('subject')

    start_dt = created
    end_dt = None
    all_day = 1

    slot_id = plan.get('timetable_slot_id')
    if slot_id:
        try:
            slot_row = conn.execute(
                'SELECT day_of_week, start_time, end_time FROM timetable_slots WHERE id = ?',
                (slot_id,)
            ).fetchone()
        except sqlite3.OperationalError:
            slot_row = None
        if slot_row:
            day_map = {'Monday': 0, 'Tuesday': 1, 'Wednesday': 2,
                       'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6}
            target_dow = day_map.get(slot_row['day_of_week'], 0)
            try:
                base_dt = datetime.fromisoformat(created.replace('Z', ''))
            except Exception:
                base_dt = datetime.now()
            base_date = base_dt.date()
            days_ahead = (target_dow - base_date.weekday()) % 7
            anchored = base_date + timedelta(days=days_ahead)
            hh, mm = slot_row['start_time'].split(':')[:2]
            ehh, emm = slot_row['end_time'].split(':')[:2]
            start_dt = f"{anchored.isoformat()}T{hh}:{mm}:00"
            end_dt = f"{anchored.isoformat()}T{ehh}:{emm}:00"
            all_day = 0

    if all_day:
        if 'T' not in start_dt:
            start_dt = f"{start_dt[:10]}T00:00:00"
        end_dt = f"{start_dt[:10]}T23:59:59"

    status_map = {'draft': 'planned', 'completed': 'completed', 'cancelled': 'cancelled'}
    status = status_map.get(plan.get('status') or 'draft', 'planned')

    return upsert_unified_event(conn, {
        'teacher_id':     teacher_id,
        'source_type':    'lesson_plan',
        'source_id':      plan['id'],
        'title':          title,
        'start_datetime': start_dt,
        'end_datetime':   end_dt,
        'all_day':        all_day,
        'grade_level':    str(grade) if grade else None,
        'subject':        subject,
        'status':         status,
        'metadata_json':  {
            'timetable_slot_id':       plan.get('timetable_slot_id'),
            'suggested_milestone_id':  plan.get('suggested_milestone_id'),
            'duration_minutes':        duration_min,
            'taught_at':               plan.get('taught_at'),
        },
    })


def project_scheduled_result(conn: sqlite3.Connection, result: dict) -> str:
    """
    Project a scheduled task result row into unified_events.
    Anchors to `week_of` if present, otherwise to `created_at`.
    """
    type_labels = {
        'elo_breakdown':       'ELO Breakdown Report',
        'attendance_summary':  'Attendance Summary',
        'progress_report':     'Progress Report',
    }
    task_type = result.get('task_type') or 'scheduled_task'
    title = type_labels.get(task_type, task_type.replace('_', ' ').title())

    anchor = result.get('week_of') or result.get('created_at') or datetime.now().isoformat()
    if len(anchor) == 10:
        start_dt = f"{anchor}T00:00:00"
        end_dt = f"{anchor}T23:59:59"
    else:
        start_dt = anchor
        end_dt = anchor

    return upsert_unified_event(conn, {
        'teacher_id':     result['teacher_id'],
        'source_type':    'scheduled_task',
        'source_id':      result['id'],
        'title':          title,
        'start_datetime': start_dt,
        'end_datetime':   end_dt,
        'all_day':        1,
        'status':         'planned',
        'color':          '#7c3aed',
        'metadata_json':  {
            'task_type':       task_type,
            'review_status':   result.get('status'),
            'week_of':         result.get('week_of'),
        },
    })


def project_daily_plan(conn: sqlite3.Connection, plan: dict) -> str:
    """
    Project a daily_plans row (Kindergarten / Early Childhood) into unified_events.
    Anchored to plan_date as an all-day event.
    """
    plan_date = plan['plan_date']
    if len(plan_date) == 10:
        start_dt = f"{plan_date}T00:00:00"
        end_dt = f"{plan_date}T23:59:59"
    else:
        start_dt = end_dt = plan_date

    title = plan.get('theme') or 'Daily Plan'
    return upsert_unified_event(conn, {
        'teacher_id':     plan['teacher_id'],
        'source_type':    'daily_plan',
        'source_id':      plan['id'],
        'title':          title,
        'start_datetime': start_dt,
        'end_datetime':   end_dt,
        'all_day':        1,
        'status':         'planned',
        'color':          plan.get('color') or '#10b981',
        'metadata_json':  {
            'literacy_focus': plan.get('literacy_focus'),
            'math_focus':     plan.get('math_focus'),
            'materials':      plan.get('materials'),
            'notes':          plan.get('notes'),
        },
    })


# ── Holiday EXDATE collection ──

def _collect_blocking_holidays(
    conn: sqlite3.Connection, teacher_id: str, range_start: date, range_end: date, slot_time: str
) -> list[str]:
    """
    Find holidays in the date range that block classes and return them as
    RRULE EXDATE-formatted strings (YYYYMMDDTHHMMSS).
    Reads directly from school_year_events to avoid a circular projection dep.
    """
    try:
        rows = conn.execute('''
            SELECT event_date, end_date FROM school_year_events
            WHERE teacher_id = ?
              AND event_type = 'holiday'
              AND COALESCE(blocks_classes, 0) = 1
              AND event_date <= ?
              AND COALESCE(end_date, event_date) >= ?
        ''', (teacher_id, range_end.isoformat(), range_start.isoformat())).fetchall()
    except sqlite3.OperationalError:
        # blocks_classes column doesn't exist yet (Phase 2 adds it)
        return []

    exdates = []
    hh, mm = slot_time.split(':')[:2]
    for row in rows:
        start = date.fromisoformat(row['event_date'])
        end = date.fromisoformat(row['end_date']) if row['end_date'] else start
        cur = max(start, range_start)
        last = min(end, range_end)
        while cur <= last:
            exdates.append(f"{cur.strftime('%Y%m%d')}T{hh}{mm}00")
            cur += timedelta(days=1)
    return exdates


# ── Query helpers (used by routes/unified_calendar.py) ──

def query_unified_events(
    teacher_id: str,
    range_start: str,
    range_end: str,
    source_types: list[str] | None = None,
    grade_level: str | None = None,
    subject: str | None = None,
) -> list[dict]:
    """
    Return all unified events for a teacher between two ISO datetimes.
    Recurring events (timetable_slot) are expanded into per-occurrence dicts.
    """
    conn = _get_conn()
    try:
        sql = '''
            SELECT * FROM unified_events
            WHERE teacher_id = ?
              AND (
                  recurrence_rule IS NOT NULL
                  OR (start_datetime <= ? AND COALESCE(end_datetime, start_datetime) >= ?)
              )
        '''
        params = [teacher_id, range_end, range_start]

        if source_types:
            placeholders = ','.join('?' * len(source_types))
            sql += f' AND source_type IN ({placeholders})'
            params.extend(source_types)
        if grade_level:
            sql += ' AND grade_level = ?'
            params.append(grade_level)
        if subject:
            sql += ' AND subject = ?'
            params.append(subject)

        rows = conn.execute(sql, params).fetchall()
    finally:
        conn.close()

    results = []
    for row in rows:
        d = dict(row)
        if d.get('metadata_json'):
            try:
                d['metadata'] = json.loads(d['metadata_json'])
            except Exception:
                d['metadata'] = {}
        if d.get('recurrence_rule'):
            results.extend(_expand_recurring(d, range_start, range_end))
        else:
            results.append(d)
    results.sort(key=lambda r: r['start_datetime'])
    return results


def _expand_recurring(parent: dict, range_start: str, range_end: str) -> list[dict]:
    """Expand an RRULE-bearing event into discrete occurrence dicts."""
    try:
        from dateutil.rrule import rrulestr
    except ImportError:
        # Fail soft: return the parent as a single event if dateutil is missing
        return [parent]

    try:
        dtstart = datetime.fromisoformat(parent['start_datetime'])
        dtend = datetime.fromisoformat(parent['end_datetime']) if parent.get('end_datetime') else dtstart
        duration = dtend - dtstart

        rule = rrulestr(parent['recurrence_rule'], dtstart=dtstart)
        window_start = datetime.fromisoformat(range_start)
        window_end = datetime.fromisoformat(range_end)

        occurrences = []
        for occ in rule.between(window_start, window_end, inc=True):
            child = dict(parent)
            child['start_datetime'] = occ.isoformat()
            child['end_datetime'] = (occ + duration).isoformat()
            child['is_occurrence'] = True
            child['parent_id'] = parent['id']
            occurrences.append(child)
        return occurrences
    except Exception:
        return [parent]


def detect_conflicts(teacher_id: str) -> list[dict]:
    """
    Phase 3: real conflict detection.

    Returns a list of conflict dicts. Each conflict has:
      - kind: 'lesson_plan_orphan' | 'lesson_plan_holiday' | 'timetable_holiday_overlap'
      - severity: 'warning' | 'error'
      - message: human-readable description
      - lesson_plan_id / timetable_slot_id / holiday_id (where applicable)
    """
    conflicts: list[dict] = []
    conn = _get_conn()
    try:
        # 1. Lesson plans bound to a non-existent or stale timetable slot
        try:
            rows = conn.execute('''
                SELECT lp.id, lp.title, lp.timetable_slot_id, lp.taught_at,
                       ts.id AS slot_exists
                FROM lesson_plans lp
                LEFT JOIN timetable_slots ts ON ts.id = lp.timetable_slot_id
                WHERE lp.teacher_id = ?
                  AND lp.timetable_slot_id IS NOT NULL
                  AND lp.taught_at IS NULL
            ''', (teacher_id,)).fetchall()
            for row in rows:
                if row['slot_exists'] is None:
                    conflicts.append({
                        'kind':             'lesson_plan_orphan',
                        'severity':         'warning',
                        'message':          f"Lesson plan '{row['title']}' is bound to a timetable slot that no longer exists.",
                        'lesson_plan_id':   row['id'],
                        'timetable_slot_id': row['timetable_slot_id'],
                    })
        except sqlite3.OperationalError:
            pass

        # 2. Lesson plans whose anchored date falls on a blocking holiday
        try:
            rows = conn.execute('''
                SELECT lp.id, lp.title, ue.start_datetime
                FROM lesson_plans lp
                JOIN unified_events ue
                  ON ue.source_type = 'lesson_plan' AND ue.source_id = lp.id
                WHERE lp.teacher_id = ?
                  AND lp.taught_at IS NULL
            ''', (teacher_id,)).fetchall()
            for row in rows:
                day = (row['start_datetime'] or '')[:10]
                if not day:
                    continue
                holiday = conn.execute('''
                    SELECT id, title FROM school_year_events
                    WHERE teacher_id = ?
                      AND event_type = 'holiday'
                      AND COALESCE(blocks_classes, 0) = 1
                      AND event_date <= ?
                      AND COALESCE(end_date, event_date) >= ?
                    LIMIT 1
                ''', (teacher_id, day, day)).fetchone()
                if holiday:
                    conflicts.append({
                        'kind':           'lesson_plan_holiday',
                        'severity':       'error',
                        'message':        f"Lesson plan '{row['title']}' is scheduled on holiday '{holiday['title']}' ({day}).",
                        'lesson_plan_id': row['id'],
                        'holiday_id':     holiday['id'],
                    })
        except sqlite3.OperationalError:
            pass

        # 3. Timetable slots whose recurring weekday equals a multi-day holiday block
        # (This is informational — the EXDATE recompute already suppresses occurrences,
        # but we surface the overlap for transparency.)
        try:
            holidays = conn.execute('''
                SELECT id, title, event_date, end_date FROM school_year_events
                WHERE teacher_id = ?
                  AND event_type = 'holiday'
                  AND COALESCE(blocks_classes, 0) = 1
            ''', (teacher_id,)).fetchall()
            slots = conn.execute(
                'SELECT id, day_of_week, subject, grade_level FROM timetable_slots WHERE teacher_id = ?',
                (teacher_id,)
            ).fetchall()
            for h in holidays:
                start = date.fromisoformat(h['event_date'])
                end = date.fromisoformat(h['end_date']) if h['end_date'] else start
                if (end - start).days < 1:
                    continue  # single-day holidays handled by case 2 already
                day_names = set()
                cur = start
                while cur <= end:
                    day_names.add(cur.strftime('%A'))
                    cur += timedelta(days=1)
                for s in slots:
                    if s['day_of_week'] in day_names:
                        conflicts.append({
                            'kind':              'timetable_holiday_overlap',
                            'severity':          'warning',
                            'message':           f"Timetable {s['subject']} (Grade {s['grade_level']}) on {s['day_of_week']} overlaps with holiday block '{h['title']}'.",
                            'timetable_slot_id': s['id'],
                            'holiday_id':        h['id'],
                        })
        except sqlite3.OperationalError:
            pass

    finally:
        conn.close()

    return conflicts


def rebuild_all(teacher_id: str | None = None) -> dict:
    """
    Phase 1 stub: full backfill lives in backend/migrations/unify_calendar.py
    (Phase 6). This endpoint exists so the route can be wired now.
    """
    return {
        'rebuilt': 0,
        'note': 'Backfill is implemented in Phase 6 (backend/migrations/unify_calendar.py)',
    }
