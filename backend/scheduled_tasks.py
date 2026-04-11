"""
Feature 3B: Scheduled Task configuration + runner.

Stores per-teacher schedule config and results in SQLite (shares the
chat_memory.db file with chat_memory and teacher_memory). Uses the main
AsyncIOScheduler that's already created in main.lifespan.

This module provides:
  - Schema init + config / result CRUD
  - apply_schedule(config) -> register or remove an APScheduler cron job
  - run_all_scheduled_tasks(teacher_id) -> entry point the job invokes
  - Stub task runners (run_elo_breakdown / run_attendance_summary /
    run_progress_report). Phases 3C and 3D replace the stubs with the real
    LLM-driven implementations.

Task types (for reference):
  'elo_breakdown'      -- Phase 10 (Feature 3C)
  'attendance_summary' -- Phase 11 (Feature 3D)
  'progress_report'    -- Phase 11 (Feature 3D)
"""

import json
import logging
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# Map day-of-week strings to APScheduler cron day_of_week values
DAY_MAP = {
    "monday": "mon", "tuesday": "tue", "wednesday": "wed",
    "thursday": "thu", "friday": "fri", "saturday": "sat", "sunday": "sun",
}

VALID_TASK_TYPES = frozenset({"elo_breakdown", "attendance_summary", "progress_report"})


def _get_db_path() -> Path:
    """Reuse chat_memory.db so Feature 3B doesn't fragment the data dir."""
    import os
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Class Coworker' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir / 'chat_memory.db'


def _conn() -> sqlite3.Connection:
    conn = sqlite3.connect(str(_get_db_path()))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the scheduled_task_config + scheduled_results tables if missing."""
    c = _conn()
    try:
        c.execute("PRAGMA journal_mode=WAL")
        c.executescript("""
            CREATE TABLE IF NOT EXISTS scheduled_task_config (
                id TEXT PRIMARY KEY,
                teacher_id TEXT NOT NULL UNIQUE,
                schedule_day TEXT NOT NULL DEFAULT 'sunday',
                schedule_time TEXT NOT NULL DEFAULT '18:00',
                reminder_offset_min INTEGER DEFAULT 60,
                tasks_enabled TEXT DEFAULT '["elo_breakdown"]',
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS scheduled_results (
                id TEXT PRIMARY KEY,
                teacher_id TEXT NOT NULL,
                task_type TEXT NOT NULL,
                status TEXT DEFAULT 'pending_review',
                result_json TEXT NOT NULL,
                week_of TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                reviewed_at TEXT
            );

            CREATE INDEX IF NOT EXISTS idx_scheduled_results_teacher
                ON scheduled_results(teacher_id);
            CREATE INDEX IF NOT EXISTS idx_scheduled_results_status
                ON scheduled_results(teacher_id, status);
        """)
        c.commit()
    finally:
        c.close()


# ── Config CRUD ───────────────────────────────────────────────────────

def get_config(teacher_id: str) -> Optional[Dict[str, Any]]:
    c = _conn()
    try:
        row = c.execute(
            "SELECT id, teacher_id, schedule_day, schedule_time, reminder_offset_min, "
            "tasks_enabled, is_active, created_at, updated_at "
            "FROM scheduled_task_config WHERE teacher_id = ?",
            (teacher_id,)
        ).fetchone()
        if not row:
            return None
        d = dict(row)
        try:
            d["tasks_enabled"] = json.loads(d.get("tasks_enabled") or "[]")
        except (json.JSONDecodeError, TypeError):
            d["tasks_enabled"] = []
        d["is_active"] = bool(d.get("is_active"))
        return d
    finally:
        c.close()


def upsert_config(
    teacher_id: str,
    schedule_day: str = "sunday",
    schedule_time: str = "18:00",
    reminder_offset_min: int = 60,
    tasks_enabled: Optional[List[str]] = None,
    is_active: bool = True,
) -> Dict[str, Any]:
    """Insert or update a teacher's schedule config. Returns the stored row."""
    if schedule_day not in DAY_MAP:
        raise ValueError(f"Invalid schedule_day: {schedule_day}")
    if not _is_valid_time(schedule_time):
        raise ValueError(f"Invalid schedule_time (expected HH:MM): {schedule_time}")
    tasks = [t for t in (tasks_enabled or ["elo_breakdown"]) if t in VALID_TASK_TYPES]
    if not tasks:
        tasks = ["elo_breakdown"]

    now = datetime.now().isoformat()
    c = _conn()
    try:
        existing = c.execute(
            "SELECT id FROM scheduled_task_config WHERE teacher_id = ?",
            (teacher_id,)
        ).fetchone()
        if existing:
            c.execute(
                "UPDATE scheduled_task_config SET schedule_day = ?, schedule_time = ?, "
                "reminder_offset_min = ?, tasks_enabled = ?, is_active = ?, updated_at = ? "
                "WHERE teacher_id = ?",
                (schedule_day, schedule_time, reminder_offset_min,
                 json.dumps(tasks), 1 if is_active else 0, now, teacher_id)
            )
        else:
            c.execute(
                "INSERT INTO scheduled_task_config "
                "(id, teacher_id, schedule_day, schedule_time, reminder_offset_min, "
                "tasks_enabled, is_active, created_at, updated_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (str(uuid.uuid4()), teacher_id, schedule_day, schedule_time,
                 reminder_offset_min, json.dumps(tasks),
                 1 if is_active else 0, now, now)
            )
        c.commit()
    finally:
        c.close()

    config = get_config(teacher_id)
    apply_schedule(config)
    return config


def delete_config(teacher_id: str) -> bool:
    c = _conn()
    try:
        cur = c.execute(
            "DELETE FROM scheduled_task_config WHERE teacher_id = ?",
            (teacher_id,)
        )
        c.commit()
        removed = cur.rowcount > 0
    finally:
        c.close()
    # Remove any registered APScheduler job
    _remove_job_for_teacher(teacher_id)
    return removed


def list_all_active_configs() -> List[Dict[str, Any]]:
    c = _conn()
    try:
        rows = c.execute(
            "SELECT teacher_id FROM scheduled_task_config WHERE is_active = 1"
        ).fetchall()
        teacher_ids = [r["teacher_id"] for r in rows]
    finally:
        c.close()
    return [get_config(tid) for tid in teacher_ids if get_config(tid) is not None]


# ── Result CRUD ───────────────────────────────────────────────────────

def insert_result(
    teacher_id: str,
    task_type: str,
    result_data: Any,
    week_of: Optional[str] = None,
    status: str = "pending_review",
) -> str:
    rid = str(uuid.uuid4())
    c = _conn()
    try:
        c.execute(
            "INSERT INTO scheduled_results "
            "(id, teacher_id, task_type, status, result_json, week_of) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (rid, teacher_id, task_type, status, json.dumps(result_data), week_of)
        )
        c.commit()
    finally:
        c.close()
    return rid


def list_results(
    teacher_id: str,
    status: Optional[str] = None,
    task_type: Optional[str] = None,
    limit: int = 50,
) -> List[Dict[str, Any]]:
    c = _conn()
    try:
        sql = "SELECT * FROM scheduled_results WHERE teacher_id = ?"
        params: List[Any] = [teacher_id]
        if status:
            sql += " AND status = ?"
            params.append(status)
        if task_type:
            sql += " AND task_type = ?"
            params.append(task_type)
        sql += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)
        rows = c.execute(sql, params).fetchall()
    finally:
        c.close()
    out = []
    for r in rows:
        d = dict(r)
        try:
            d["result"] = json.loads(d.pop("result_json"))
        except (json.JSONDecodeError, TypeError):
            d["result"] = None
        out.append(d)
    return out


def update_result_status(result_id: str, status: str) -> bool:
    if status not in ("pending_review", "accepted", "rejected"):
        raise ValueError(f"Invalid status: {status}")
    c = _conn()
    try:
        cur = c.execute(
            "UPDATE scheduled_results SET status = ?, reviewed_at = ? WHERE id = ?",
            (status, datetime.now().isoformat(), result_id)
        )
        c.commit()
        return cur.rowcount > 0
    finally:
        c.close()


def delete_result(result_id: str) -> bool:
    c = _conn()
    try:
        cur = c.execute("DELETE FROM scheduled_results WHERE id = ?", (result_id,))
        c.commit()
        return cur.rowcount > 0
    finally:
        c.close()


# ── Scheduler registration ───────────────────────────────────────────

def _job_id_for_teacher(teacher_id: str) -> str:
    # Sanitize: APScheduler accepts any string but we keep it clean for logs
    safe = "".join(ch if ch.isalnum() or ch in ("-", "_") else "_" for ch in teacher_id)
    return f"scheduled_tasks_{safe}"


def _remove_job_for_teacher(teacher_id: str):
    try:
        import main
        if getattr(main, "_scheduler", None) is None:
            return
        try:
            main._scheduler.remove_job(_job_id_for_teacher(teacher_id))
            logger.info(f"[scheduled] Removed job for teacher {teacher_id}")
        except Exception:
            pass  # Job didn't exist
    except Exception as e:
        logger.warning(f"[scheduled] _remove_job_for_teacher failed: {e}")


def apply_schedule(config: Optional[Dict[str, Any]]):
    """Register or remove the APScheduler cron job for this teacher's config."""
    if not config:
        return
    teacher_id = config["teacher_id"]
    _remove_job_for_teacher(teacher_id)

    if not config.get("is_active"):
        return

    try:
        import main
        scheduler = getattr(main, "_scheduler", None)
        if scheduler is None:
            logger.warning("[scheduled] _scheduler not initialized; job not registered")
            return

        day_str = config.get("schedule_day", "sunday").lower()
        day_abbrev = DAY_MAP.get(day_str, "sun")
        time_str = config.get("schedule_time", "18:00")
        h, m = _parse_time(time_str)

        scheduler.add_job(
            run_all_scheduled_tasks,
            trigger="cron",
            day_of_week=day_abbrev,
            hour=h,
            minute=m,
            id=_job_id_for_teacher(teacher_id),
            kwargs={"teacher_id": teacher_id},
            replace_existing=True,
        )
        logger.info(
            f"[scheduled] Registered job for teacher={teacher_id} "
            f"day={day_abbrev} time={h:02d}:{m:02d} tasks={config.get('tasks_enabled')}"
        )
    except Exception as e:
        logger.error(f"[scheduled] apply_schedule failed: {e}")


def restore_all_schedules():
    """Called from main.lifespan on startup to re-register saved configs."""
    try:
        init_db()
        configs = list_all_active_configs()
        for cfg in configs:
            apply_schedule(cfg)
        logger.info(f"[scheduled] Restored {len(configs)} active schedule(s) on startup")
    except Exception as e:
        logger.error(f"[scheduled] restore_all_schedules failed: {e}")


# ── Task runner (stubs for Phase 3B; Phases 3C/3D replace with real impls) ──

async def _ensure_model_loaded():
    """Force-load the primary model so scheduled tasks have inference available
    even when the app has been hidden to tray (Feature 3A)."""
    try:
        from inference_factory import is_model_loaded, reload_local_model
        if not is_model_loaded():
            logger.info("[scheduled] Loading model before running tasks...")
            reload_local_model()
    except Exception as e:
        logger.warning(f"[scheduled] _ensure_model_loaded failed: {e}")


def _unload_after_tasks():
    """Release the model after scheduled tasks finish — frees RAM if the app
    was in the background (Feature 3A)."""
    try:
        from inference_factory import unload_all_models
        unload_all_models()
        logger.info("[scheduled] Model unloaded after scheduled tasks")
    except Exception as e:
        logger.warning(f"[scheduled] _unload_after_tasks failed: {e}")


async def run_all_scheduled_tasks(teacher_id: str) -> Dict[str, Any]:
    """Entry point the APScheduler job calls. Runs each enabled task
    sequentially. Each task writes its own row to scheduled_results."""
    logger.info(f"[scheduled] ===> Running scheduled tasks for teacher={teacher_id}")
    config = get_config(teacher_id)
    if not config or not config.get("is_active"):
        logger.info(f"[scheduled] Config inactive or missing; skipping {teacher_id}")
        return {"ran": []}

    tasks = config.get("tasks_enabled", [])
    results = {"ran": [], "errors": []}

    await _ensure_model_loaded()

    try:
        for task_type in tasks:
            try:
                if task_type == "elo_breakdown":
                    rid = await run_elo_breakdown(teacher_id)
                elif task_type == "attendance_summary":
                    rid = await run_attendance_summary(teacher_id)
                elif task_type == "progress_report":
                    rid = await run_progress_report(teacher_id)
                else:
                    logger.warning(f"[scheduled] Unknown task type: {task_type}")
                    continue
                results["ran"].append({"task": task_type, "result_id": rid})
                logger.info(f"[scheduled] {task_type} -> result_id={rid}")
            except Exception as e:
                logger.error(f"[scheduled] {task_type} failed: {e}")
                results["errors"].append({"task": task_type, "error": str(e)})
    finally:
        # Only unload if the app is hidden (best-effort check via Electron signal).
        # For now we always release to match the plan's simpler semantics.
        _unload_after_tasks()

    logger.info(f"[scheduled] <=== Done. ran={len(results['ran'])} errors={len(results['errors'])}")
    return results


# Phase 3B ships these as stubs that write placeholder results so the full
# schedule -> DB -> notification flow is testable end-to-end without the real
# LLM logic. Phases 3C (ELO) and 3D (Attendance/Progress) replace them.

async def run_elo_breakdown(teacher_id: str) -> str:
    """STUB: Phase 3C will replace this with the real LLM-driven implementation."""
    logger.info(f"[scheduled] run_elo_breakdown STUB for teacher={teacher_id}")
    placeholder = {
        "week_of": datetime.now().strftime("%Y-%m-%d"),
        "days": [],
        "notes": "ELO breakdown runner not yet implemented (Phase 3C).",
        "_stub": True,
    }
    return insert_result(
        teacher_id=teacher_id,
        task_type="elo_breakdown",
        result_data=placeholder,
        week_of=placeholder["week_of"],
        status="pending_review",
    )


async def run_attendance_summary(teacher_id: str) -> str:
    """STUB: Phase 3D will replace this."""
    logger.info(f"[scheduled] run_attendance_summary STUB for teacher={teacher_id}")
    placeholder = {
        "week_of": datetime.now().strftime("%Y-%m-%d"),
        "summary": "Attendance summary runner not yet implemented (Phase 3D).",
        "_stub": True,
    }
    return insert_result(
        teacher_id=teacher_id,
        task_type="attendance_summary",
        result_data=placeholder,
        week_of=placeholder["week_of"],
        status="pending_review",
    )


async def run_progress_report(teacher_id: str) -> str:
    """STUB: Phase 3D will replace this."""
    logger.info(f"[scheduled] run_progress_report STUB for teacher={teacher_id}")
    placeholder = {
        "week_of": datetime.now().strftime("%Y-%m-%d"),
        "summary": "Progress report runner not yet implemented (Phase 3D).",
        "_stub": True,
    }
    return insert_result(
        teacher_id=teacher_id,
        task_type="progress_report",
        result_data=placeholder,
        week_of=placeholder["week_of"],
        status="pending_review",
    )


# ── Helpers ───────────────────────────────────────────────────────────

def _is_valid_time(s: str) -> bool:
    try:
        h, m = _parse_time(s)
        return 0 <= h <= 23 and 0 <= m <= 59
    except Exception:
        return False


def _parse_time(s: str):
    parts = s.split(":")
    if len(parts) != 2:
        raise ValueError(f"Invalid time: {s}")
    return int(parts[0]), int(parts[1])
