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

    # Phase 2d: project into unified_events (cross-DB write to students.db).
    # Wrapped so a projection failure never breaks the task result write.
    _project_scheduled_result_safe({
        'id':         rid,
        'teacher_id': teacher_id,
        'task_type':  task_type,
        'status':     status,
        'week_of':    week_of,
        'created_at': datetime.now().isoformat(),
    })
    return rid


def _project_scheduled_result_safe(result_row: dict) -> None:
    try:
        import sqlite3 as _sql
        import unified_calendar_service as _ucs
        conn = _sql.connect(_ucs._get_db_path())
        try:
            _ucs.project_scheduled_result(conn, result_row)
            conn.commit()
        finally:
            conn.close()
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Failed to project scheduled_result {result_row.get('id')}: {e}")


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
        # Refresh projected metadata
        row = c.execute("SELECT * FROM scheduled_results WHERE id = ?", (result_id,)).fetchone()
    finally:
        c.close()
    if row:
        _project_scheduled_result_safe(dict(row))
    return cur.rowcount > 0


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
    """Feature 3C: assign pending ELOs to specific periods of the upcoming week.

    Pipeline:
      1. GATHER -- school year config + current phase + pending milestones + timetable
      2. PROMPT -- build the timetable-aware system+user prompt
      3. GENERATE -- non-streaming model call (json_schema-constrained)
      4. VALIDATE -- check JSON shape, fall back to skeleton on parse failure
      5. SAVE -- insert_result()
    """
    logger.info(f"[scheduled] run_elo_breakdown REAL for teacher={teacher_id}")
    from datetime import date as _date, timedelta as _td

    # ── 1. GATHER ────────────────────────────────────────────────
    try:
        import school_year_service
        from milestones.milestone_db import get_milestone_db
    except Exception as e:
        logger.error(f"[elo_breakdown] import failed: {e}")
        return _save_elo_failure(teacher_id, f"Import failed: {e}")

    config = school_year_service.get_active_config(teacher_id)
    phase = school_year_service.get_phase_for_date(teacher_id)
    phase_label = phase.get("phase_label") or phase.get("label") or "Current phase" if phase else "Unknown phase"
    phase_id = phase.get("id") if phase else None

    # Pull pending milestones (not_started + in_progress) for the current phase
    db = get_milestone_db()
    try:
        pending = db.get_milestones(teacher_id, phase_id=phase_id) if phase_id else db.get_milestones(teacher_id)
    except Exception as e:
        logger.warning(f"[elo_breakdown] get_milestones failed: {e}")
        pending = []
    pending = [m for m in pending if (m.get("status") or "").lower() in ("not_started", "in_progress")]
    if not pending:
        logger.info(f"[elo_breakdown] No pending milestones for {teacher_id}")
        return insert_result(
            teacher_id=teacher_id,
            task_type="elo_breakdown",
            result_data={
                "week_of": _next_monday().isoformat(),
                "phase_label": phase_label,
                "days": [],
                "notes": "No pending ELOs to schedule for the upcoming week.",
            },
            week_of=_next_monday().isoformat(),
        )

    timetable = []
    try:
        timetable = school_year_service.get_timetable(teacher_id)
    except Exception as e:
        logger.warning(f"[elo_breakdown] get_timetable failed: {e}")

    if not timetable:
        return insert_result(
            teacher_id=teacher_id,
            task_type="elo_breakdown",
            result_data={
                "week_of": _next_monday().isoformat(),
                "phase_label": phase_label,
                "days": [],
                "notes": "No weekly timetable set up yet. Open Planning Hub > Timetable to enter your schedule, then run again.",
            },
            week_of=_next_monday().isoformat(),
        )

    # ── 2. PROMPT ────────────────────────────────────────────────
    week_start = _next_monday()
    week_dates = {
        "Monday":    (week_start + _td(days=0)).isoformat(),
        "Tuesday":   (week_start + _td(days=1)).isoformat(),
        "Wednesday": (week_start + _td(days=2)).isoformat(),
        "Thursday":  (week_start + _td(days=3)).isoformat(),
        "Friday":    (week_start + _td(days=4)).isoformat(),
    }

    timetable_block = _format_timetable_block(timetable)
    elo_block = _format_pending_elos_block(pending)

    system_text = (
        "You are a curriculum scheduler for Caribbean primary schools. "
        "Given the teacher's weekly timetable and the list of pending ELOs, "
        "assign each ELO to a specific period of the upcoming week. Each ELO "
        "MUST match the grade and subject of the period it is assigned to. "
        "If no pending ELO matches a period's grade/subject, leave that period's "
        "elo field as null. Do not invent ELOs or topics. Output valid JSON only."
    )
    user_text = (
        f"PHASE: {phase_label}\n"
        f"WEEK: {week_start.isoformat()} (Monday) through {(week_start + _td(days=4)).isoformat()} (Friday)\n\n"
        f"WEEKLY TIMETABLE:\n{timetable_block}\n\n"
        f"PENDING ELOs:\n{elo_block}\n\n"
        "Assign ELOs to specific periods. Output JSON in exactly this shape:\n"
        '{"week_of":"YYYY-MM-DD","days":[{"day":"Monday","date":"YYYY-MM-DD",'
        '"periods":[{"time":"HH:MM-HH:MM","grade":"3","subject":"Mathematics",'
        '"elo":{"topic_id":"...","topic_title":"...","rationale":"..."}}]}],'
        '"notes":"..."}'
    )

    # ── 3. GENERATE ──────────────────────────────────────────────
    try:
        from inference_factory import get_inference_instance
        inference = get_inference_instance()
        # Build a prompt in the model's native format using main.build_prompt()
        import main
        prompt_fmt = main.get_prompt_format()
        prompt = main.build_prompt(system_text, user_text, prompt_format=prompt_fmt)
        result = await inference.generate(
            tool_name="elo_breakdown",
            input_data="weekly_breakdown",
            prompt_template=prompt,
            max_tokens=3000,
            temperature=0.4,
            repeat_penalty=1.1,
        )
    except Exception as e:
        logger.error(f"[elo_breakdown] generate() failed: {e}")
        return _save_elo_failure(teacher_id, f"Inference failed: {e}", week_of=week_start.isoformat())

    if result.get("metadata", {}).get("status") != "success" or not result.get("result"):
        return _save_elo_failure(
            teacher_id,
            f"Model returned no result: {result.get('metadata', {}).get('error_message', 'unknown')}",
            week_of=week_start.isoformat(),
        )

    raw = (result.get("result") or "").strip()

    # ── 4. VALIDATE ──────────────────────────────────────────────
    parsed = _try_parse_elo_json(raw)
    if not parsed:
        logger.warning(f"[elo_breakdown] JSON parse failed; building fallback skeleton")
        parsed = _build_fallback_breakdown(timetable, week_dates, phase_label, pending)
    else:
        # Stamp with the dates we expect (don't trust model's dates blindly)
        parsed["week_of"] = week_start.isoformat()
        parsed.setdefault("phase_label", phase_label)
        if isinstance(parsed.get("days"), list):
            for day in parsed["days"]:
                day_name = day.get("day")
                if day_name in week_dates:
                    day["date"] = week_dates[day_name]

    # ── 5. SAVE ──────────────────────────────────────────────────
    return insert_result(
        teacher_id=teacher_id,
        task_type="elo_breakdown",
        result_data=parsed,
        week_of=parsed.get("week_of") or week_start.isoformat(),
        status="pending_review",
    )


def _next_monday():
    """Return the upcoming Monday's date (today if today is Monday)."""
    from datetime import date as _date, timedelta as _td
    today = _date.today()
    days_ahead = (0 - today.weekday()) % 7  # Monday = 0
    return today + _td(days=days_ahead)


def _format_timetable_block(slots: list) -> str:
    """Render timetable_slots rows as a grouped 'Day -> period: Grade Subject' block."""
    if not slots:
        return "(empty)"
    by_day: Dict[str, List[str]] = {}
    for s in slots:
        day = s.get("day_of_week") or "Unknown"
        line = f"  {s.get('start_time', '?')}-{s.get('end_time', '?')}: Grade {s.get('grade_level', '?')} {s.get('subject', '?')}"
        by_day.setdefault(day, []).append(line)
    out = []
    for day in ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"):
        if day in by_day:
            out.append(f"{day}:")
            out.extend(by_day[day])
    return "\n".join(out) if out else "(empty)"


def _format_pending_elos_block(milestones: list) -> str:
    if not milestones:
        return "(none)"
    lines = []
    for m in milestones[:60]:  # cap at 60 to keep prompt size reasonable
        topic_id = m.get("topic_id") or m.get("id") or "?"
        title = m.get("topic_title") or m.get("title") or "(untitled)"
        grade = m.get("grade") or "?"
        subject = m.get("subject") or "?"
        strand = m.get("strand") or ""
        status = m.get("status") or "?"
        strand_part = f" -- {strand}" if strand else ""
        lines.append(f"- [{topic_id}] Grade {grade} {subject}: {title}{strand_part} ({status})")
    if len(milestones) > 60:
        lines.append(f"... and {len(milestones) - 60} more (truncated for prompt size)")
    return "\n".join(lines)


def _try_parse_elo_json(raw: str) -> Optional[Dict[str, Any]]:
    """Tolerant JSON parser for the model's ELO breakdown output."""
    if not raw:
        return None
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
        text = text.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        return None
    try:
        parsed = json.loads(text[start:end + 1])
    except (json.JSONDecodeError, ValueError):
        return None
    if not isinstance(parsed, dict):
        return None
    # Minimal shape validation
    if "days" in parsed and not isinstance(parsed["days"], list):
        return None
    return parsed


def _build_fallback_breakdown(timetable, week_dates, phase_label, pending):
    """When the model output can't be parsed, write a structured skeleton from
    the raw timetable + pending list so the teacher still sees something useful."""
    by_day: Dict[str, List[Dict[str, Any]]] = {}
    for s in timetable:
        day = s.get("day_of_week") or ""
        if day not in week_dates:
            continue
        by_day.setdefault(day, []).append({
            "time": f"{s.get('start_time', '?')}-{s.get('end_time', '?')}",
            "grade": str(s.get("grade_level", "")),
            "subject": s.get("subject") or "",
            "elo": None,
        })
    days = []
    for day_name in ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"):
        if day_name in by_day:
            days.append({
                "day": day_name,
                "date": week_dates[day_name],
                "periods": by_day[day_name],
            })
    return {
        "week_of": list(week_dates.values())[0] if week_dates else "",
        "phase_label": phase_label,
        "days": days,
        "notes": (
            "The model's output could not be parsed as JSON. This is a "
            "skeleton built from your timetable -- assign ELOs manually, or "
            "click Run Now again."
        ),
        "_fallback": True,
    }


def _save_elo_failure(teacher_id: str, message: str, week_of: Optional[str] = None) -> str:
    """Persist a failure result so the user sees the failure in the panel."""
    return insert_result(
        teacher_id=teacher_id,
        task_type="elo_breakdown",
        result_data={
            "week_of": week_of or datetime.now().strftime("%Y-%m-%d"),
            "days": [],
            "notes": message,
            "_failed": True,
        },
        week_of=week_of,
        status="pending_review",
    )


async def run_attendance_summary(teacher_id: str) -> str:
    """Feature 3D: Weekly attendance patterns + flagged students + suggestions."""
    logger.info(f"[scheduled] run_attendance_summary REAL for teacher={teacher_id}")
    from datetime import date as _date, timedelta as _td

    # ── 1. GATHER ────────────────────────────────────────────────
    try:
        import student_service
    except Exception as e:
        return _save_task_failure(teacher_id, "attendance_summary", f"Import failed: {e}")

    week_start = _last_monday()
    week_end = week_start + _td(days=6)

    # Pull all students once, then their attendance for the past week
    try:
        students = student_service.list_students()
    except Exception as e:
        return _save_task_failure(teacher_id, "attendance_summary", f"list_students failed: {e}")

    if not students:
        return insert_result(
            teacher_id=teacher_id,
            task_type="attendance_summary",
            result_data={
                "week_of": week_start.isoformat(),
                "stats": {"present": 0, "absent": 0, "late": 0, "students": 0},
                "flagged": [],
                "summary": "No students enrolled yet. Add students in Class Management to enable attendance summaries.",
            },
            week_of=week_start.isoformat(),
        )

    week_attendance = _gather_week_attendance(students, week_start, week_end)
    stats, flagged = _compute_attendance_stats(students, week_attendance)

    if stats["records"] == 0:
        return insert_result(
            teacher_id=teacher_id,
            task_type="attendance_summary",
            result_data={
                "week_of": week_start.isoformat(),
                "stats": stats,
                "flagged": [],
                "summary": "No attendance was recorded last week. Open Class Management to mark attendance.",
            },
            week_of=week_start.isoformat(),
        )

    # ── 2. PROMPT ────────────────────────────────────────────────
    flagged_block = _format_flagged_block(flagged)
    system_text = (
        "You are a classroom attendance analyst for a Caribbean primary school teacher. "
        "Given last week's attendance statistics and a list of students with concerning "
        "patterns, write a SHORT (4-6 sentences) summary the teacher can scan in 30 seconds. "
        "Be specific. Cite numbers. End with one concrete follow-up action."
    )
    user_text = (
        f"WEEK: {week_start.isoformat()} (Mon) to {week_end.isoformat()} (Sun)\n\n"
        f"OVERALL STATS:\n"
        f"  Total students: {stats['students']}\n"
        f"  Total records:  {stats['records']}\n"
        f"  Present: {stats['present']}\n"
        f"  Absent:  {stats['absent']}\n"
        f"  Late:    {stats['late']}\n"
        f"  Average attendance rate: {stats['avg_attendance_pct']}%\n\n"
        f"FLAGGED STUDENTS (>=2 absences or repeated lateness):\n{flagged_block}\n\n"
        "Write the summary now (no JSON, just plain prose):"
    )

    summary_text = await _generate_short_summary(
        system_text=system_text,
        user_text=user_text,
        max_tokens=400,
        fallback="Attendance was recorded last week. Review the flagged students below.",
    )

    # ── 3. SAVE ──────────────────────────────────────────────────
    return insert_result(
        teacher_id=teacher_id,
        task_type="attendance_summary",
        result_data={
            "week_of": week_start.isoformat(),
            "stats": stats,
            "flagged": flagged,
            "summary": summary_text,
        },
        week_of=week_start.isoformat(),
        status="pending_review",
    )


async def run_progress_report(teacher_id: str) -> str:
    """Feature 3D: Student progress snapshot with recent grade trends."""
    logger.info(f"[scheduled] run_progress_report REAL for teacher={teacher_id}")
    from datetime import date as _date, timedelta as _td

    # ── 1. GATHER ────────────────────────────────────────────────
    try:
        import student_service
    except Exception as e:
        return _save_task_failure(teacher_id, "progress_report", f"Import failed: {e}")

    week_start = _last_monday()
    week_end = week_start + _td(days=6)

    try:
        students = student_service.list_students()
    except Exception as e:
        return _save_task_failure(teacher_id, "progress_report", f"list_students failed: {e}")

    if not students:
        return insert_result(
            teacher_id=teacher_id,
            task_type="progress_report",
            result_data={
                "week_of": week_start.isoformat(),
                "by_subject": {},
                "highlights": [],
                "concerns": [],
                "summary": "No students enrolled yet.",
            },
            week_of=week_start.isoformat(),
        )

    grades = _gather_recent_grades(students, week_start, week_end)
    by_subject, highlights, concerns = _compute_progress_stats(grades)

    if not grades:
        return insert_result(
            teacher_id=teacher_id,
            task_type="progress_report",
            result_data={
                "week_of": week_start.isoformat(),
                "by_subject": {},
                "highlights": [],
                "concerns": [],
                "summary": "No graded work last week. Run a quiz or worksheet to start tracking progress.",
            },
            week_of=week_start.isoformat(),
        )

    # ── 2. PROMPT ────────────────────────────────────────────────
    by_subject_block = _format_by_subject_block(by_subject)
    highlights_block = _format_student_list_block(highlights, label="strong performers")
    concerns_block = _format_student_list_block(concerns, label="students needing support")

    system_text = (
        "You are a classroom progress analyst for a Caribbean primary school teacher. "
        "Given last week's grade data, write a SHORT (5-7 sentences) progress snapshot. "
        "Cite specific subject averages and student names. End with one concrete next step."
    )
    user_text = (
        f"WEEK: {week_start.isoformat()} (Mon) to {week_end.isoformat()} (Sun)\n\n"
        f"AVERAGES BY SUBJECT:\n{by_subject_block}\n\n"
        f"HIGHLIGHTS:\n{highlights_block}\n\n"
        f"CONCERNS:\n{concerns_block}\n\n"
        "Write the snapshot now (no JSON, just plain prose):"
    )

    summary_text = await _generate_short_summary(
        system_text=system_text,
        user_text=user_text,
        max_tokens=500,
        fallback="Grades were recorded last week. Review the per-subject averages and student lists below.",
    )

    # ── 3. SAVE ──────────────────────────────────────────────────
    return insert_result(
        teacher_id=teacher_id,
        task_type="progress_report",
        result_data={
            "week_of": week_start.isoformat(),
            "by_subject": by_subject,
            "highlights": highlights,
            "concerns": concerns,
            "summary": summary_text,
        },
        week_of=week_start.isoformat(),
        status="pending_review",
    )


# ── Phase 11 helpers ──────────────────────────────────────────────────

def _last_monday():
    """Return the most recent Monday (today if today is Monday). Used to scope
    'last week' for attendance and progress summaries."""
    from datetime import date as _date, timedelta as _td
    today = _date.today()
    # Monday = 0, so today.weekday() gives days since the most recent Monday
    return today - _td(days=today.weekday())


def _gather_week_attendance(students: list, week_start, week_end) -> Dict[str, list]:
    """Return {student_id: [attendance_record, ...]} for a date range."""
    import sqlite3
    import student_service

    out: Dict[str, list] = {}
    try:
        conn = sqlite3.connect(student_service._get_db_path())
        conn.row_factory = sqlite3.Row
        try:
            rows = conn.execute(
                "SELECT student_id, date, status, engagement_level "
                "FROM attendance WHERE date >= ? AND date <= ?",
                (week_start.isoformat(), week_end.isoformat())
            ).fetchall()
            for r in rows:
                out.setdefault(r["student_id"], []).append(dict(r))
        finally:
            conn.close()
    except Exception as e:
        logger.warning(f"[attendance] gather failed: {e}")
    return out


def _compute_attendance_stats(students: list, week_attendance: Dict[str, list]):
    """Aggregate per-student attendance into class totals + flagged students."""
    present = absent = late = total = 0
    flagged: List[Dict[str, Any]] = []

    for s in students:
        sid = s.get("id")
        if not sid:
            continue
        records = week_attendance.get(sid, [])
        s_present = sum(1 for r in records if (r.get("status") or "").lower() == "present")
        s_absent  = sum(1 for r in records if (r.get("status") or "").lower() == "absent")
        s_late    = sum(1 for r in records if (r.get("status") or "").lower() == "late")
        present += s_present
        absent  += s_absent
        late    += s_late
        total   += len(records)

        if s_absent >= 2 or s_late >= 3:
            flagged.append({
                "student_id": sid,
                "name": s.get("full_name") or s.get("first_name") or sid,
                "class_name": s.get("class_name") or "",
                "absent": s_absent,
                "late": s_late,
                "present": s_present,
            })

    avg_pct = round((present / total * 100), 1) if total > 0 else 0
    stats = {
        "students": len(students),
        "records": total,
        "present": present,
        "absent": absent,
        "late": late,
        "avg_attendance_pct": avg_pct,
    }
    return stats, flagged


def _format_flagged_block(flagged: list) -> str:
    if not flagged:
        return "(none -- no concerning patterns this week)"
    lines = []
    for f in flagged[:30]:
        lines.append(
            f"  - {f['name']} (Class {f['class_name']}): "
            f"{f['absent']} absent, {f['late']} late, {f['present']} present"
        )
    if len(flagged) > 30:
        lines.append(f"  ... and {len(flagged) - 30} more (truncated)")
    return "\n".join(lines)


def _gather_recent_grades(students: list, week_start, week_end) -> List[Dict[str, Any]]:
    """Return all quiz + worksheet grades recorded in the date range."""
    import sqlite3
    import student_service

    out: List[Dict[str, Any]] = []
    student_lookup = {s.get("id"): s for s in students if s.get("id")}

    try:
        conn = sqlite3.connect(student_service._get_db_path())
        conn.row_factory = sqlite3.Row
        try:
            for table, kind in (("quiz_grades", "quiz"), ("worksheet_grades", "worksheet")):
                rows = conn.execute(
                    f"SELECT student_id, subject, percentage, letter_grade, graded_at "
                    f"FROM {table} WHERE graded_at >= ? AND graded_at <= ?",
                    (week_start.isoformat(), (week_end.isoformat() + " 23:59:59"))
                ).fetchall()
                for r in rows:
                    sid = r["student_id"]
                    student = student_lookup.get(sid)
                    out.append({
                        "kind": kind,
                        "student_id": sid,
                        "student_name": (student.get("full_name") if student else sid),
                        "class_name": (student.get("class_name") if student else ""),
                        "subject": r["subject"] or "Unknown",
                        "percentage": r["percentage"] or 0,
                        "letter_grade": r["letter_grade"] or "",
                        "graded_at": r["graded_at"],
                    })
        finally:
            conn.close()
    except Exception as e:
        logger.warning(f"[progress] grade gather failed: {e}")
    return out


def _compute_progress_stats(grades: list):
    """Aggregate grades into per-subject averages + highlight/concern lists."""
    by_subject: Dict[str, Dict[str, Any]] = {}
    by_student: Dict[str, Dict[str, Any]] = {}

    for g in grades:
        subj = g.get("subject") or "Unknown"
        pct = float(g.get("percentage") or 0)
        if subj not in by_subject:
            by_subject[subj] = {"count": 0, "total": 0.0, "average": 0.0}
        by_subject[subj]["count"] += 1
        by_subject[subj]["total"] += pct

        sid = g.get("student_id")
        if sid not in by_student:
            by_student[sid] = {
                "student_id": sid,
                "name": g.get("student_name") or sid,
                "class_name": g.get("class_name") or "",
                "scores": [],
            }
        by_student[sid]["scores"].append(pct)

    for subj, data in by_subject.items():
        data["average"] = round(data["total"] / data["count"], 1) if data["count"] > 0 else 0
        del data["total"]

    student_avgs = []
    for sid, data in by_student.items():
        scores = data["scores"]
        avg = round(sum(scores) / len(scores), 1) if scores else 0
        student_avgs.append({**data, "average": avg, "count": len(scores)})
    student_avgs.sort(key=lambda x: x["average"], reverse=True)

    highlights = [s for s in student_avgs if s["average"] >= 80][:5]
    concerns = [s for s in reversed(student_avgs) if s["average"] < 60][:5]
    # Strip the raw scores list from the output so result_json stays compact
    for lst in (highlights, concerns):
        for s in lst:
            s.pop("scores", None)
    return by_subject, highlights, concerns


def _format_by_subject_block(by_subject: Dict[str, Dict[str, Any]]) -> str:
    if not by_subject:
        return "(none)"
    lines = []
    for subj, data in sorted(by_subject.items()):
        lines.append(f"  {subj}: {data['average']}% (across {data['count']} grade(s))")
    return "\n".join(lines)


def _format_student_list_block(students: list, label: str) -> str:
    if not students:
        return f"(no {label} this week)"
    lines = []
    for s in students:
        cls = f" Class {s.get('class_name')}" if s.get('class_name') else ""
        lines.append(f"  - {s.get('name')}{cls}: {s.get('average')}% across {s.get('count')} grade(s)")
    return "\n".join(lines)


async def _generate_short_summary(system_text: str, user_text: str, max_tokens: int, fallback: str) -> str:
    """Run a small non-streaming generate call. Returns fallback on any error."""
    try:
        from inference_factory import get_inference_instance
        import main
        inference = get_inference_instance()
        prompt_fmt = main.get_prompt_format()
        prompt = main.build_prompt(system_text, user_text, prompt_format=prompt_fmt)
        result = await inference.generate(
            tool_name="scheduled_summary",
            input_data="summarize",
            prompt_template=prompt,
            max_tokens=max_tokens,
            temperature=0.4,
            repeat_penalty=1.1,
        )
        if result.get("metadata", {}).get("status") == "success" and result.get("result"):
            text = result["result"].strip()
            if len(text) > 20:
                return text
    except Exception as e:
        logger.warning(f"[scheduled] short summary generation failed: {e}")
    return fallback


def _save_task_failure(teacher_id: str, task_type: str, message: str) -> str:
    """Persist a failure result so the teacher sees what went wrong."""
    return insert_result(
        teacher_id=teacher_id,
        task_type=task_type,
        result_data={
            "week_of": datetime.now().strftime("%Y-%m-%d"),
            "summary": message,
            "_failed": True,
        },
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
