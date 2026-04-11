"""
Daily Plan Service (Phase 2c)

Backend SQLite store for Kindergarten / Early Childhood daily activity plans.
Replaces the previous frontend-only localStorage approach. Routes wire to
unified_events via project_daily_plan().
"""

import json
import logging
import os
import sqlite3
import uuid
from pathlib import Path
from datetime import datetime

logger = logging.getLogger(__name__)


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
    return conn


def _row_to_dict(row: sqlite3.Row) -> dict:
    d = dict(row)
    if d.get('activities_json'):
        try:
            d['activities'] = json.loads(d['activities_json'])
        except Exception:
            d['activities'] = []
    else:
        d['activities'] = []
    return d


def list_plans(teacher_id: str | None = None) -> list[dict]:
    conn = _get_conn()
    try:
        if teacher_id:
            rows = conn.execute(
                "SELECT * FROM daily_plans WHERE teacher_id = ? ORDER BY plan_date DESC",
                (teacher_id,)
            ).fetchall()
        else:
            rows = conn.execute("SELECT * FROM daily_plans ORDER BY plan_date DESC").fetchall()
        return [_row_to_dict(r) for r in rows]
    finally:
        conn.close()


def get_plan(plan_id: str) -> dict | None:
    conn = _get_conn()
    try:
        row = conn.execute("SELECT * FROM daily_plans WHERE id = ?", (plan_id,)).fetchone()
        return _row_to_dict(row) if row else None
    finally:
        conn.close()


def save_plan(plan: dict) -> dict:
    """Upsert a daily plan and project into unified_events on the same connection."""
    import unified_calendar_service as ucs
    plan_id = plan.get('id') or str(uuid.uuid4())
    now = datetime.now().isoformat()

    conn = _get_conn()
    try:
        conn.execute('''
            INSERT INTO daily_plans (
                id, teacher_id, plan_date, theme, activities_json,
                literacy_focus, math_focus, materials, notes, color,
                created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                teacher_id      = excluded.teacher_id,
                plan_date       = excluded.plan_date,
                theme           = excluded.theme,
                activities_json = excluded.activities_json,
                literacy_focus  = excluded.literacy_focus,
                math_focus      = excluded.math_focus,
                materials       = excluded.materials,
                notes           = excluded.notes,
                color           = excluded.color,
                updated_at      = excluded.updated_at
        ''', (
            plan_id,
            plan.get('teacher_id') or 'default',
            plan['plan_date'],
            plan.get('theme'),
            json.dumps(plan.get('activities') or []),
            plan.get('literacy_focus'),
            plan.get('math_focus'),
            plan.get('materials'),
            plan.get('notes'),
            plan.get('color'),
            now, now,
        ))

        row = conn.execute("SELECT * FROM daily_plans WHERE id = ?", (plan_id,)).fetchone()
        try:
            ucs.project_daily_plan(conn, dict(row))
        except Exception as e:
            logger.error(f"Failed to project daily_plan {plan_id}: {e}")

        conn.commit()
        return _row_to_dict(row)
    finally:
        conn.close()


def delete_plan(plan_id: str) -> bool:
    import unified_calendar_service as ucs
    conn = _get_conn()
    try:
        cursor = conn.execute("DELETE FROM daily_plans WHERE id = ?", (plan_id,))
        try:
            ucs.delete_unified_event(conn, 'daily_plan', plan_id)
        except Exception as e:
            logger.error(f"Failed to delete unified_events row for daily_plan {plan_id}: {e}")
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()
