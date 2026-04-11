"""
Unified Calendar Backfill Migration (Phase 6)

Reads every existing source of time/date data and projects it into the
`unified_events` table via the projector functions defined in
`unified_calendar_service`. Idempotent — safe to run repeatedly. Additive
only: never deletes from source tables, only writes/upserts into
`unified_events`.

Sources backfilled in this version:
  - school_year_events (already shipped)
  - timetable_slots    (expanded as recurring rules, bounded by active config)
  - milestones with due_date (from milestones.db)

Sources deferred to Phase 2 (require their own SQLite migration first):
  - lesson_plans   (currently lesson_plan_history.json)
  - daily_plans    (currently Kindergarten localStorage)
  - scheduled_results (chat_memory.db)

Run from inside the backend venv:
    python -m migrations.unify_calendar [--teacher-id TEACHER_ID] [--validate]
"""

import argparse
import logging
import os
import sqlite3
import sys
from pathlib import Path

# Make `backend/` importable when run as a script
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import unified_calendar_service as ucs

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')


# ── Helpers to find each source DB ──

def _students_db_path() -> str:
    if os.name == 'nt':
        return str(Path(os.environ.get('APPDATA', os.path.expanduser('~')))
                   / 'OECS Class Coworker' / 'data' / 'students.db')
    return str(Path.home() / '.olh_ai_education' / 'data' / 'students.db')


def _milestones_db_path() -> str:
    if os.name == 'nt':
        return str(Path(os.environ.get('APPDATA', os.path.expanduser('~')))
                   / 'OECS Class Coworker' / 'data' / 'milestones.db')
    return str(Path.home() / '.olh_ai_education' / 'data' / 'milestones.db')


# ── Per-source backfill functions ──

def backfill_school_year_events(unified_conn: sqlite3.Connection, teacher_id: str | None) -> int:
    """Project every row in school_year_events into unified_events."""
    sql = 'SELECT * FROM school_year_events'
    params = ()
    if teacher_id:
        sql += ' WHERE teacher_id = ?'
        params = (teacher_id,)

    try:
        rows = unified_conn.execute(sql, params).fetchall()
    except sqlite3.OperationalError as e:
        logger.warning(f"school_year_events table not found, skipping: {e}")
        return 0

    count = 0
    for row in rows:
        try:
            ucs.project_school_year_event(unified_conn, dict(row))
            count += 1
        except Exception as e:
            logger.error(f"Failed to project school_year_event {row['id']}: {e}")
    return count


def backfill_timetable_slots(unified_conn: sqlite3.Connection, teacher_id: str | None) -> int:
    """
    Project timetable_slots as recurring parent events. Each slot needs
    school year bounds (start/end dates) from the teacher's active config.
    """
    # First, build a teacher_id -> active config map
    try:
        config_rows = unified_conn.execute(
            'SELECT teacher_id, start_date, end_date FROM school_year_config WHERE is_active = 1'
        ).fetchall()
    except sqlite3.OperationalError:
        config_rows = []
    config_map = {r['teacher_id']: {'start_date': r['start_date'], 'end_date': r['end_date']}
                  for r in config_rows}

    sql = 'SELECT * FROM timetable_slots'
    params = ()
    if teacher_id:
        sql += ' WHERE teacher_id = ?'
        params = (teacher_id,)

    try:
        slots = unified_conn.execute(sql, params).fetchall()
    except sqlite3.OperationalError as e:
        logger.warning(f"timetable_slots table not found, skipping: {e}")
        return 0

    count = 0
    skipped_no_config = 0
    for slot in slots:
        bounds = config_map.get(slot['teacher_id'])
        if not bounds:
            skipped_no_config += 1
            continue
        try:
            ucs.project_timetable_slot(unified_conn, dict(slot), school_year_bounds=bounds)
            count += 1
        except Exception as e:
            logger.error(f"Failed to project timetable_slot {slot['id']}: {e}")

    if skipped_no_config:
        logger.info(f"  Skipped {skipped_no_config} timetable slot(s) without an active school year config")
    return count


def backfill_milestones(unified_conn: sqlite3.Connection, teacher_id: str | None) -> int:
    """
    Read milestones from milestones.db and project the ones with a due_date.
    Cross-DB: source read = milestones.db, projection write = students.db.
    """
    milestones_path = _milestones_db_path()
    if not Path(milestones_path).exists():
        logger.warning(f"milestones.db not found at {milestones_path}, skipping")
        return 0

    src = sqlite3.connect(milestones_path)
    src.row_factory = sqlite3.Row
    try:
        sql = 'SELECT * FROM milestones WHERE due_date IS NOT NULL AND COALESCE(is_hidden, 0) = 0'
        params = ()
        if teacher_id:
            sql += ' AND teacher_id = ?'
            params = (teacher_id,)
        try:
            rows = src.execute(sql, params).fetchall()
        except sqlite3.OperationalError as e:
            logger.warning(f"milestones table not found: {e}")
            return 0
    finally:
        src.close()

    count = 0
    for row in rows:
        try:
            result = ucs.project_milestone(unified_conn, dict(row))
            if result:
                count += 1
        except Exception as e:
            logger.error(f"Failed to project milestone {row['id']}: {e}")
    return count


def backfill_lesson_plans(unified_conn: sqlite3.Connection, teacher_id: str | None) -> int:
    """Phase 2b: project all lesson_plans rows."""
    sql = 'SELECT * FROM lesson_plans'
    params = ()
    if teacher_id:
        sql += ' WHERE teacher_id = ?'
        params = (teacher_id,)
    try:
        rows = unified_conn.execute(sql, params).fetchall()
    except sqlite3.OperationalError as e:
        logger.warning(f"lesson_plans table not found, skipping: {e}")
        return 0
    count = 0
    for row in rows:
        try:
            ucs.project_lesson_plan(unified_conn, dict(row))
            count += 1
        except Exception as e:
            logger.error(f"Failed to project lesson_plan {row['id']}: {e}")
    return count


def backfill_daily_plans(unified_conn: sqlite3.Connection, teacher_id: str | None) -> int:
    """Phase 2c: project all daily_plans rows."""
    sql = 'SELECT * FROM daily_plans'
    params = ()
    if teacher_id:
        sql += ' WHERE teacher_id = ?'
        params = (teacher_id,)
    try:
        rows = unified_conn.execute(sql, params).fetchall()
    except sqlite3.OperationalError as e:
        logger.warning(f"daily_plans table not found, skipping: {e}")
        return 0
    count = 0
    for row in rows:
        try:
            ucs.project_daily_plan(unified_conn, dict(row))
            count += 1
        except Exception as e:
            logger.error(f"Failed to project daily_plan {row['id']}: {e}")
    return count


def backfill_scheduled_results(unified_conn: sqlite3.Connection, teacher_id: str | None) -> int:
    """
    Phase 2d: read scheduled_results from chat_memory.db (cross-DB) and project.
    """
    if os.name == 'nt':
        path = Path(os.environ.get('APPDATA', os.path.expanduser('~'))) / 'OECS Class Coworker' / 'data' / 'chat_memory.db'
    else:
        path = Path.home() / '.olh_ai_education' / 'data' / 'chat_memory.db'
    if not path.exists():
        logger.warning(f"chat_memory.db not found at {path}, skipping")
        return 0

    src = sqlite3.connect(str(path))
    src.row_factory = sqlite3.Row
    try:
        sql = 'SELECT * FROM scheduled_results'
        params = ()
        if teacher_id:
            sql += ' WHERE teacher_id = ?'
            params = (teacher_id,)
        try:
            rows = src.execute(sql, params).fetchall()
        except sqlite3.OperationalError as e:
            logger.warning(f"scheduled_results table not found: {e}")
            return 0
    finally:
        src.close()

    count = 0
    for row in rows:
        try:
            ucs.project_scheduled_result(unified_conn, dict(row))
            count += 1
        except Exception as e:
            logger.error(f"Failed to project scheduled_result {row['id']}: {e}")
    return count


# ── Validation suite ──

def validate(unified_conn: sqlite3.Connection, teacher_id: str | None) -> dict:
    """
    Verify counts in unified_events match the source tables. Returns a dict
    of {source_type: {expected, actual, ok}}.
    """
    results = {}

    # school_year (excluding holidays which use a separate source_type)
    try:
        sql = "SELECT COUNT(*) FROM school_year_events WHERE COALESCE(event_type, '') != 'holiday'"
        params = ()
        if teacher_id:
            sql += ' AND teacher_id = ?'
            params = (teacher_id,)
        expected = unified_conn.execute(sql, params).fetchone()[0]
    except sqlite3.OperationalError:
        expected = 0

    sql = "SELECT COUNT(*) FROM unified_events WHERE source_type = 'school_year'"
    params = ()
    if teacher_id:
        sql += ' AND teacher_id = ?'
        params = (teacher_id,)
    actual = unified_conn.execute(sql, params).fetchone()[0]
    results['school_year'] = {'expected': expected, 'actual': actual, 'ok': expected == actual}

    # holiday
    try:
        sql = "SELECT COUNT(*) FROM school_year_events WHERE event_type = 'holiday'"
        params = ()
        if teacher_id:
            sql += ' AND teacher_id = ?'
            params = (teacher_id,)
        expected = unified_conn.execute(sql, params).fetchone()[0]
    except sqlite3.OperationalError:
        expected = 0
    sql = "SELECT COUNT(*) FROM unified_events WHERE source_type = 'holiday'"
    params = ()
    if teacher_id:
        sql += ' AND teacher_id = ?'
        params = (teacher_id,)
    actual = unified_conn.execute(sql, params).fetchone()[0]
    results['holiday'] = {'expected': expected, 'actual': actual, 'ok': expected == actual}

    # timetable_slot — only slots whose teacher has an active config are projected
    try:
        sql = '''
            SELECT COUNT(*) FROM timetable_slots t
            WHERE EXISTS (
                SELECT 1 FROM school_year_config c
                WHERE c.teacher_id = t.teacher_id AND c.is_active = 1
            )
        '''
        params = ()
        if teacher_id:
            sql += ' AND t.teacher_id = ?'
            params = (teacher_id,)
        expected = unified_conn.execute(sql, params).fetchone()[0]
    except sqlite3.OperationalError:
        expected = 0
    sql = "SELECT COUNT(*) FROM unified_events WHERE source_type = 'timetable_slot'"
    params = ()
    if teacher_id:
        sql += ' AND teacher_id = ?'
        params = (teacher_id,)
    actual = unified_conn.execute(sql, params).fetchone()[0]
    results['timetable_slot'] = {'expected': expected, 'actual': actual, 'ok': expected == actual}

    # milestone — count from milestones.db
    expected = 0
    milestones_path = _milestones_db_path()
    if Path(milestones_path).exists():
        src = sqlite3.connect(milestones_path)
        try:
            sql = 'SELECT COUNT(*) FROM milestones WHERE due_date IS NOT NULL AND COALESCE(is_hidden, 0) = 0'
            params = ()
            if teacher_id:
                sql += ' AND teacher_id = ?'
                params = (teacher_id,)
            try:
                expected = src.execute(sql, params).fetchone()[0]
            except sqlite3.OperationalError:
                expected = 0
        finally:
            src.close()
    sql = "SELECT COUNT(*) FROM unified_events WHERE source_type = 'milestone'"
    params = ()
    if teacher_id:
        sql += ' AND teacher_id = ?'
        params = (teacher_id,)
    actual = unified_conn.execute(sql, params).fetchone()[0]
    results['milestone'] = {'expected': expected, 'actual': actual, 'ok': expected == actual}

    # lesson_plan
    try:
        sql = 'SELECT COUNT(*) FROM lesson_plans'
        params = ()
        if teacher_id:
            sql += ' WHERE teacher_id = ?'
            params = (teacher_id,)
        expected = unified_conn.execute(sql, params).fetchone()[0]
    except sqlite3.OperationalError:
        expected = 0
    sql = "SELECT COUNT(*) FROM unified_events WHERE source_type = 'lesson_plan'"
    params = ()
    if teacher_id:
        sql += ' AND teacher_id = ?'
        params = (teacher_id,)
    actual = unified_conn.execute(sql, params).fetchone()[0]
    results['lesson_plan'] = {'expected': expected, 'actual': actual, 'ok': expected == actual}

    # daily_plan
    try:
        sql = 'SELECT COUNT(*) FROM daily_plans'
        params = ()
        if teacher_id:
            sql += ' WHERE teacher_id = ?'
            params = (teacher_id,)
        expected = unified_conn.execute(sql, params).fetchone()[0]
    except sqlite3.OperationalError:
        expected = 0
    sql = "SELECT COUNT(*) FROM unified_events WHERE source_type = 'daily_plan'"
    params = ()
    if teacher_id:
        sql += ' AND teacher_id = ?'
        params = (teacher_id,)
    actual = unified_conn.execute(sql, params).fetchone()[0]
    results['daily_plan'] = {'expected': expected, 'actual': actual, 'ok': expected == actual}

    # scheduled_task — count from chat_memory.db
    expected = 0
    if os.name == 'nt':
        cm_path = Path(os.environ.get('APPDATA', os.path.expanduser('~'))) / 'OECS Class Coworker' / 'data' / 'chat_memory.db'
    else:
        cm_path = Path.home() / '.olh_ai_education' / 'data' / 'chat_memory.db'
    if cm_path.exists():
        src = sqlite3.connect(str(cm_path))
        try:
            sql = 'SELECT COUNT(*) FROM scheduled_results'
            params = ()
            if teacher_id:
                sql += ' WHERE teacher_id = ?'
                params = (teacher_id,)
            try:
                expected = src.execute(sql, params).fetchone()[0]
            except sqlite3.OperationalError:
                expected = 0
        finally:
            src.close()
    sql = "SELECT COUNT(*) FROM unified_events WHERE source_type = 'scheduled_task'"
    params = ()
    if teacher_id:
        sql += ' AND teacher_id = ?'
        params = (teacher_id,)
    actual = unified_conn.execute(sql, params).fetchone()[0]
    results['scheduled_task'] = {'expected': expected, 'actual': actual, 'ok': expected == actual}

    # Orphan check: any unified_events with an unknown source_type
    rows = unified_conn.execute('''
        SELECT source_type, COUNT(*) FROM unified_events
        GROUP BY source_type
    ''').fetchall()
    known = set(ucs.VALID_SOURCE_TYPES)
    orphans = [(r[0], r[1]) for r in rows if r[0] not in known]
    results['_orphans'] = orphans

    return results


# ── Entry point ──

def run(teacher_id: str | None = None, validate_only: bool = False) -> dict:
    """
    Main entry point. Returns a summary dict suitable for logging or testing.
    """
    db_path = _students_db_path()
    if not Path(db_path).exists():
        logger.error(f"students.db not found at {db_path}")
        return {'error': 'students.db not found'}

    # Make sure the unified_events schema exists before backfill
    ucs.init_schema()

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")

    summary = {}
    try:
        if not validate_only:
            logger.info("Backfilling school_year_events...")
            summary['school_year_events'] = backfill_school_year_events(conn, teacher_id)
            logger.info(f"  projected {summary['school_year_events']} row(s)")

            logger.info("Backfilling timetable_slots...")
            summary['timetable_slots'] = backfill_timetable_slots(conn, teacher_id)
            logger.info(f"  projected {summary['timetable_slots']} row(s)")

            logger.info("Backfilling milestones (with due_date)...")
            summary['milestones'] = backfill_milestones(conn, teacher_id)
            logger.info(f"  projected {summary['milestones']} row(s)")

            logger.info("Backfilling lesson_plans...")
            summary['lesson_plans'] = backfill_lesson_plans(conn, teacher_id)
            logger.info(f"  projected {summary['lesson_plans']} row(s)")

            logger.info("Backfilling daily_plans...")
            summary['daily_plans'] = backfill_daily_plans(conn, teacher_id)
            logger.info(f"  projected {summary['daily_plans']} row(s)")

            logger.info("Backfilling scheduled_results...")
            summary['scheduled_results'] = backfill_scheduled_results(conn, teacher_id)
            logger.info(f"  projected {summary['scheduled_results']} row(s)")

            conn.commit()

        logger.info("Validating...")
        summary['validation'] = validate(conn, teacher_id)
        all_ok = all(v.get('ok', True) for k, v in summary['validation'].items() if k != '_orphans')
        no_orphans = not summary['validation'].get('_orphans')
        summary['valid'] = all_ok and no_orphans

        for src_type, info in summary['validation'].items():
            if src_type == '_orphans':
                if info:
                    logger.warning(f"  ORPHAN source_types found: {info}")
                continue
            tag = 'OK  ' if info['ok'] else 'FAIL'
            logger.info(f"  [{tag}] {src_type}: expected={info['expected']} actual={info['actual']}")

    finally:
        conn.close()

    return summary


def main():
    parser = argparse.ArgumentParser(description='Backfill unified_events table.')
    parser.add_argument('--teacher-id', help='Limit backfill to a single teacher')
    parser.add_argument('--validate', action='store_true', help='Only run validation, no writes')
    args = parser.parse_args()

    summary = run(teacher_id=args.teacher_id, validate_only=args.validate)
    if summary.get('valid'):
        logger.info("[OK] Migration complete and validated.")
        sys.exit(0)
    else:
        logger.error("[FAIL] Migration finished with validation errors.")
        sys.exit(1)


if __name__ == '__main__':
    main()
