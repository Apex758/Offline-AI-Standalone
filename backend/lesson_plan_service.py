"""
Lesson Plan Service (Phase 2b)

Backs the lesson plan history with SQLite (`lesson_plans` + `lesson_plan_edits`
tables in `students.db`) instead of `lesson_plan_history.json`. The legacy JSON
file is migrated on first import and renamed to `.bak`.

Public API preserves the exact shape the frontend expects:
  list_histories() -> [
      {
          id, title, timestamp, formData, generatedPlan, parsedLesson,
          curriculumMatches, edit_count, teacher_id, timetable_slot_id,
          suggested_milestone_id, taught_at, status
      },
      ...
  ]

Behavior changes vs. the old JSON-backed endpoint:
  - 50-entry cap is REMOVED (full history preserved)
  - teacher_id defaults to "default" if the caller doesn't supply one
  - Phase 3 auto-binds timetable_slot_id and suggested_milestone_id when possible

NO Unicode symbols anywhere (Windows cp1252).
"""

import json
import logging
import os
import sqlite3
from pathlib import Path
from datetime import datetime
from typing import Any

logger = logging.getLogger(__name__)

DEFAULT_TEACHER_ID = "default"

# Legacy JSON file path (one-shot migration source)
_LEGACY_JSON = Path(__file__).resolve().parent / "lesson_plan_history.json"


def _get_db_path() -> str:
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Class Coworker' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return str(data_dir / 'students.db')


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(_get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _row_to_history_dict(row: sqlite3.Row) -> dict:
    """Map a lesson_plans SQLite row back to the frontend shape."""
    d = dict(row)
    return {
        'id':                    d['id'],
        'title':                 d['title'],
        'timestamp':             d.get('created_at') or d.get('updated_at'),
        'formData':              json.loads(d.get('form_data_json') or '{}'),
        'generatedPlan':         d.get('generated_plan'),
        'parsedLesson':          json.loads(d['parsed_lesson_json']) if d.get('parsed_lesson_json') else None,
        'curriculumMatches':     json.loads(d['curriculum_matches_json']) if d.get('curriculum_matches_json') else [],
        'edit_count':            d.get('edit_count') or 1,
        'teacher_id':            d.get('teacher_id') or DEFAULT_TEACHER_ID,
        'timetable_slot_id':     d.get('timetable_slot_id'),
        'scheduled_for':         d.get('scheduled_for'),
        'suggested_milestone_id': d.get('suggested_milestone_id'),
        'taught_at':             d.get('taught_at'),
        'status':                d.get('status') or 'draft',
    }


def _ensure_edit_count_column(conn: sqlite3.Connection):
    try:
        conn.execute("ALTER TABLE lesson_plans ADD COLUMN edit_count INTEGER DEFAULT 1")
    except sqlite3.OperationalError:
        pass  # already exists


def _ensure_scheduled_for_column(conn: sqlite3.Connection):
    """Phase 5: concrete calendar date this plan is scheduled to be taught on.

    Distinct from `taught_at`: scheduled_for is the target date picked at
    generation time (e.g. 'Wed 2026-04-15'); taught_at is only set once the
    teacher marks the lesson as taught. Together they let the backend report
    'N upcoming lessons without plans' without conflating draft and done.
    """
    try:
        conn.execute("ALTER TABLE lesson_plans ADD COLUMN scheduled_for TEXT")
    except sqlite3.OperationalError:
        pass  # already exists


def _migrate_legacy_json_if_needed():
    """One-shot: migrate lesson_plan_history.json into the lesson_plans table."""
    if not _LEGACY_JSON.exists():
        return
    conn = _get_conn()
    try:
        _ensure_edit_count_column(conn)
        existing = conn.execute("SELECT COUNT(*) FROM lesson_plans").fetchone()[0]
        if existing > 0:
            # Already migrated (or new rows already exist) — leave the JSON alone
            return

        try:
            with _LEGACY_JSON.open('r', encoding='utf-8') as f:
                histories = json.load(f)
        except (json.JSONDecodeError, ValueError):
            logger.warning(f"Legacy lesson_plan_history.json is malformed, skipping migration")
            return

        if not isinstance(histories, list):
            return

        migrated = 0
        for h in histories:
            try:
                _upsert_row(conn, {
                    'id':                  h['id'],
                    'teacher_id':          h.get('teacher_id') or DEFAULT_TEACHER_ID,
                    'title':               h.get('title') or 'Untitled Lesson Plan',
                    'form_data_json':      json.dumps(h.get('formData') or {}),
                    'generated_plan':      h.get('generatedPlan'),
                    'parsed_lesson_json':  json.dumps(h['parsedLesson']) if h.get('parsedLesson') else None,
                    'curriculum_matches_json': json.dumps(h.get('curriculumMatches') or []),
                    'edit_count':          int(h.get('edit_count') or 1),
                    'created_at':          h.get('timestamp') or datetime.now().isoformat(),
                    'status':              'draft',
                })
                migrated += 1
            except Exception as e:
                logger.error(f"Failed to migrate lesson plan {h.get('id')}: {e}")
        conn.commit()
        logger.info(f"[lesson_plan_service] migrated {migrated} legacy lesson plan(s) from JSON")

        # Rename source file to .bak so it isn't re-migrated and isn't deleted
        try:
            backup_path = _LEGACY_JSON.with_suffix('.json.bak')
            _LEGACY_JSON.rename(backup_path)
            logger.info(f"[lesson_plan_service] renamed legacy file to {backup_path.name}")
        except Exception as e:
            logger.error(f"Failed to rename legacy lesson_plan_history.json: {e}")
    finally:
        conn.close()


def _upsert_row(conn: sqlite3.Connection, row: dict) -> None:
    """Internal upsert. Caller owns the connection and the commit."""
    now = datetime.now().isoformat()
    conn.execute('''
        INSERT INTO lesson_plans (
            id, teacher_id, timetable_slot_id, title, form_data_json,
            generated_plan, parsed_lesson_json, curriculum_matches_json,
            suggested_milestone_id, taught_at, scheduled_for, status, edit_count,
            created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            teacher_id              = excluded.teacher_id,
            timetable_slot_id       = COALESCE(excluded.timetable_slot_id, lesson_plans.timetable_slot_id),
            title                   = excluded.title,
            form_data_json          = excluded.form_data_json,
            generated_plan          = excluded.generated_plan,
            parsed_lesson_json      = excluded.parsed_lesson_json,
            curriculum_matches_json = excluded.curriculum_matches_json,
            suggested_milestone_id  = COALESCE(excluded.suggested_milestone_id, lesson_plans.suggested_milestone_id),
            taught_at               = COALESCE(excluded.taught_at, lesson_plans.taught_at),
            scheduled_for           = COALESCE(excluded.scheduled_for, lesson_plans.scheduled_for),
            status                  = excluded.status,
            edit_count              = excluded.edit_count,
            updated_at              = excluded.updated_at
    ''', (
        row['id'],
        row.get('teacher_id') or DEFAULT_TEACHER_ID,
        row.get('timetable_slot_id'),
        row['title'],
        row.get('form_data_json'),
        row.get('generated_plan'),
        row.get('parsed_lesson_json'),
        row.get('curriculum_matches_json'),
        row.get('suggested_milestone_id'),
        row.get('taught_at'),
        row.get('scheduled_for'),
        row.get('status') or 'draft',
        int(row.get('edit_count') or 1),
        row.get('created_at') or now,
        now,
    ))


# ── Auto-link helpers (Phase 3) ──

def _auto_bind_slot(conn: sqlite3.Connection, teacher_id: str, form_data: dict) -> str | None:
    """Look up a matching timetable slot for grade + subject. Returns slot_id or None."""
    grade = form_data.get('gradeLevel') or form_data.get('grade')
    subject = form_data.get('subject')
    if not grade or not subject:
        return None
    try:
        import school_year_service
        slot = school_year_service.lookup_timetable_slot(teacher_id, str(grade), str(subject))
        if slot:
            return slot.get('id')
    except Exception as e:
        logger.error(f"_auto_bind_slot failed: {e}")
    return None


def _suggest_milestone(curriculum_matches: list, teacher_id: str) -> str | None:
    """
    Phase 3: pick the top curriculum match and look up its milestone id.
    The milestone id is `{teacher_id}_{topic_id}` per milestone_db.create_milestone.
    """
    if not curriculum_matches:
        return None
    try:
        top = curriculum_matches[0]
        if isinstance(top, dict):
            topic_id = top.get('topic_id') or top.get('id') or top.get('topicId')
            if topic_id:
                return f"{teacher_id}_{topic_id}"
    except Exception as e:
        logger.error(f"_suggest_milestone failed: {e}")
    return None


# ── Public API ──

def init_service():
    """Run the one-shot migration. Safe to call repeatedly."""
    _migrate_legacy_json_if_needed()


def list_histories(teacher_id: str | None = None) -> list[dict]:
    """Return all lesson plans (frontend shape), newest first."""
    conn = _get_conn()
    try:
        _ensure_edit_count_column(conn)
        _ensure_scheduled_for_column(conn)
        if teacher_id:
            rows = conn.execute(
                "SELECT * FROM lesson_plans WHERE teacher_id = ? ORDER BY COALESCE(created_at, updated_at) DESC",
                (teacher_id,)
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM lesson_plans ORDER BY COALESCE(created_at, updated_at) DESC"
            ).fetchall()
        return [_row_to_history_dict(r) for r in rows]
    finally:
        conn.close()


def get_history(plan_id: str) -> dict | None:
    conn = _get_conn()
    try:
        _ensure_edit_count_column(conn)
        _ensure_scheduled_for_column(conn)
        row = conn.execute("SELECT * FROM lesson_plans WHERE id = ?", (plan_id,)).fetchone()
        return _row_to_history_dict(row) if row else None
    finally:
        conn.close()


def save_history(plan: dict) -> dict:
    """
    Upsert a lesson plan and project into unified_events.
    `plan` matches the frontend shape (id, title, timestamp, formData, ...).
    """
    import unified_calendar_service as ucs
    teacher_id = plan.get('teacher_id') or DEFAULT_TEACHER_ID
    form_data = plan.get('formData') or {}

    conn = _get_conn()
    try:
        _ensure_edit_count_column(conn)
        _ensure_scheduled_for_column(conn)

        # Phase 5: caller may pass an explicit timetable_slot_id (picked via
        # GenerateForSelector). Prefer that over the auto-bind guess.
        existing = conn.execute("SELECT * FROM lesson_plans WHERE id = ?", (plan['id'],)).fetchone()
        explicit_slot_id = plan.get('timetable_slot_id')
        slot_id = (
            explicit_slot_id
            or (existing['timetable_slot_id'] if existing else None)
            or _auto_bind_slot(conn, teacher_id, form_data)
        )
        suggested_milestone_id = (
            (existing['suggested_milestone_id'] if existing else None)
            or _suggest_milestone(plan.get('curriculumMatches') or [], teacher_id)
        )

        row = {
            'id':                      plan['id'],
            'teacher_id':              teacher_id,
            'timetable_slot_id':       slot_id,
            'title':                   plan.get('title') or 'Untitled Lesson Plan',
            'form_data_json':          json.dumps(form_data),
            'generated_plan':          plan.get('generatedPlan'),
            'parsed_lesson_json':      json.dumps(plan['parsedLesson']) if plan.get('parsedLesson') else None,
            'curriculum_matches_json': json.dumps(plan.get('curriculumMatches') or []),
            'suggested_milestone_id':  suggested_milestone_id,
            'taught_at':               plan.get('taught_at'),
            'scheduled_for':           plan.get('scheduled_for'),
            'status':                  plan.get('status') or 'draft',
            'edit_count':              int(plan.get('edit_count') or 1),
            'created_at':              plan.get('timestamp'),
        }
        _upsert_row(conn, row)

        # Append edit history snapshot
        try:
            conn.execute(
                "INSERT INTO lesson_plan_edits (lesson_plan_id, snapshot_json) VALUES (?, ?)",
                (plan['id'], json.dumps(plan)),
            )
        except Exception as e:
            logger.error(f"Failed to record lesson_plan_edit for {plan['id']}: {e}")

        # Project into unified_events on the SAME connection
        full_row = conn.execute("SELECT * FROM lesson_plans WHERE id = ?", (plan['id'],)).fetchone()
        full_dict = dict(full_row)
        try:
            ucs.project_lesson_plan(conn, full_dict)
        except Exception as e:
            logger.error(f"Failed to project lesson_plan {plan['id']}: {e}")

        conn.commit()
        return _row_to_history_dict(full_row)
    finally:
        conn.close()


def delete_history(plan_id: str) -> bool:
    import unified_calendar_service as ucs
    conn = _get_conn()
    try:
        cursor = conn.execute("DELETE FROM lesson_plans WHERE id = ?", (plan_id,))
        try:
            ucs.delete_unified_event(conn, 'lesson_plan', plan_id)
        except Exception as e:
            logger.error(f"Failed to delete unified_events row for lesson plan {plan_id}: {e}")
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def mark_as_taught(plan_id: str) -> dict:
    """
    Phase 3: 'Mark as taught' workflow.
    Transactionally flips: lesson_plan -> completed, unified_events -> completed,
    and (if a suggested_milestone_id is set and not hidden) the linked milestone -> completed.
    Returns a summary dict describing what was updated.
    """
    import unified_calendar_service as ucs
    summary = {'lesson_plan_id': plan_id, 'milestone_updated': False, 'milestone_id': None}
    now = datetime.now().isoformat()

    conn = _get_conn()
    try:
        row = conn.execute("SELECT * FROM lesson_plans WHERE id = ?", (plan_id,)).fetchone()
        if not row:
            return {'error': 'not_found', **summary}
        suggested = row['suggested_milestone_id']

        # 1. Flip lesson_plans row
        conn.execute(
            "UPDATE lesson_plans SET taught_at = ?, status = 'completed', updated_at = ? WHERE id = ?",
            (now, now, plan_id)
        )

        # 2. Flip unified_events row for the lesson plan
        conn.execute(
            "UPDATE unified_events SET status = 'completed', updated_at = ? WHERE source_type = 'lesson_plan' AND source_id = ?",
            (now, plan_id)
        )
        conn.commit()
    finally:
        conn.close()

    # 3. Flip the linked milestone (cross-DB write to milestones.db)
    if suggested:
        try:
            from milestones.milestone_db import MilestoneDB
            mdb = MilestoneDB()
            updated = mdb.update_milestone(suggested, status='completed')
            if updated:
                summary['milestone_updated'] = True
                summary['milestone_id'] = suggested
        except Exception as e:
            logger.error(f"Failed to flip milestone {suggested} from mark_as_taught: {e}")

    return {'success': True, **summary}


# Run migration on import (idempotent)
init_service()
