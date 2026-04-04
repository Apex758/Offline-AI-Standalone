from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import json
import uuid
import os
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/insights", tags=["insights"])

# ── Schedule helpers ──────────────────────────────────────────────────────────

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEDULE_FILE = os.path.join(BASE_DIR, "insights_schedule.json")

class ScheduleConfig(BaseModel):
    mode: str          # "manual" | "daily" | "interval"
    time: str | None = None        # "HH:MM" for daily/interval
    every_days: int | None = None  # 1-14 for interval mode


def _load_schedule() -> dict:
    try:
        if os.path.exists(SCHEDULE_FILE):
            with open(SCHEDULE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return {"mode": "manual"}


def _save_schedule(config: dict):
    try:
        with open(SCHEDULE_FILE, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to save schedule: {e}")


def _apply_schedule(config: dict):
    """Register or remove the APScheduler job based on config."""
    try:
        from main import _scheduler
        if _scheduler is None:
            return

        job_id = "insights_auto"
        # Remove existing job if present
        try:
            _scheduler.remove_job(job_id)
        except Exception:
            pass

        mode = config.get("mode", "manual")
        if mode == "manual":
            return

        time_str = config.get("time", "08:00")
        try:
            h, m = map(int, time_str.split(":"))
        except Exception:
            h, m = 8, 0

        if mode == "daily":
            _scheduler.add_job(
                _run_scheduled_insights,
                trigger="cron",
                hour=h,
                minute=m,
                id=job_id,
                replace_existing=True,
            )
            logger.info(f"Scheduled daily insights at {h:02d}:{m:02d}")
        elif mode == "interval":
            every_days = max(1, min(14, int(config.get("every_days", 1))))
            _scheduler.add_job(
                _run_scheduled_insights,
                trigger="interval",
                days=every_days,
                id=job_id,
                replace_existing=True,
            )
            logger.info(f"Scheduled interval insights every {every_days} day(s)")
    except Exception as e:
        logger.error(f"Failed to apply schedule: {e}")


async def _run_scheduled_insights():
    """Run insights generation non-interactively and save the report."""
    try:
        import insights_service
        from routes.insights import _load_reports, save_report

        # Resolve teacher/user IDs from a stored user session or fall back to defaults
        teacher_id = "default_teacher"
        user_id = "default_teacher"

        data = insights_service.aggregate_all(teacher_id, user_id)
        date_ctx = insights_service.get_report_date_context(teacher_id, user_id)

        # Build a minimal report with the synthesis text only (no LLM streaming)
        report = {
            "id": str(uuid.uuid4()),
            "generated_at": datetime.now().isoformat(),
            "from_date": date_ctx.get("from_date"),
            "to_date": date_ctx.get("to_date"),
            "passes": [],
            "synthesis": "(Scheduled report — open Educator Insights to regenerate with full AI analysis.)",
        }
        save_report(report)
        logger.info("Scheduled insights report saved.")
    except Exception as e:
        logger.error(f"Scheduled insights run failed: {e}")


def _load_reports() -> list:
    """Load stored insight reports."""
    try:
        from main import load_json_data
        return load_json_data("insights_reports.json")
    except Exception:
        return []


def _save_reports(reports: list):
    """Save insight reports (keep last 10)."""
    try:
        from main import save_json_data
        save_json_data("insights_reports.json", reports[-50:])
    except Exception as e:
        logger.error(f"Failed to save insights reports: {e}")


@router.get("/data")
async def get_insights_data(teacher_id: str = "default_teacher", user_id: str | None = None, grade_subjects: str | None = None):
    """Return aggregated data from all sources (no LLM). Fast endpoint for summary cards."""
    try:
        import insights_service
        import json as _json
        gs = None
        if grade_subjects:
            try:
                gs = _json.loads(grade_subjects)
            except Exception:
                gs = None
        data = insights_service.aggregate_all(teacher_id, user_id, grade_subjects=gs)
        return data
    except Exception as e:
        logger.error(f"Error aggregating insights data: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reports")
async def get_reports():
    """Return stored insight report history."""
    return _load_reports()


@router.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    """Delete a specific report by ID."""
    reports = _load_reports()
    filtered = [r for r in reports if r.get("id") != report_id]
    if len(filtered) == len(reports):
        raise HTTPException(status_code=404, detail="Report not found")
    _save_reports(filtered)
    return {"status": "deleted"}


def save_report(report: dict, teacher_id: str = "default_teacher"):
    """Save a new report (called from WebSocket handler)."""
    if not report.get("id"):
        report["id"] = str(uuid.uuid4())
    if not report.get("generated_at"):
        report["generated_at"] = datetime.now().isoformat()

    # Tag report with current academic phase
    if not report.get("academic_phase_key"):
        try:
            import teacher_metrics_service
            phase_info = teacher_metrics_service.detect_school_phase(teacher_id)
            report["academic_phase_key"] = phase_info.get("phase")
            report["academic_phase_label"] = phase_info.get("phase_label")
            report["semester_label"] = phase_info.get("semester")
        except Exception:
            pass

    reports = _load_reports()
    reports.append(report)
    _save_reports(reports)
    return report


# ── Schedule endpoints ────────────────────────────────────────────────────────

@router.get("/schedule")
async def get_schedule():
    """Return the current insights schedule config."""
    return _load_schedule()


@router.post("/schedule")
async def set_schedule(body: ScheduleConfig):
    """Save and apply a new schedule."""
    if body.mode not in ("manual", "daily", "interval"):
        raise HTTPException(status_code=400, detail="mode must be manual, daily, or interval")
    if body.mode in ("daily", "interval") and not body.time:
        raise HTTPException(status_code=400, detail="time is required for daily/interval mode")
    if body.mode == "interval":
        every_days = body.every_days or 1
        if not (1 <= every_days <= 14):
            raise HTTPException(status_code=400, detail="every_days must be 1–14")

    config = body.model_dump()
    _save_schedule(config)
    _apply_schedule(config)
    return {"status": "ok", "schedule": config}


@router.delete("/schedule")
async def clear_schedule():
    """Reset schedule to manual (no auto-run)."""
    config = {"mode": "manual"}
    _save_schedule(config)
    _apply_schedule(config)
    return {"status": "ok"}
