"""
Feature 3B: REST endpoints for scheduled task configuration + results review.

Endpoints:
  GET    /api/scheduled/config/{teacher_id}        -> read a teacher's config
  POST   /api/scheduled/config                     -> upsert a teacher's config
  DELETE /api/scheduled/config/{teacher_id}        -> remove config + job
  GET    /api/scheduled/results                    -> list results (filter by teacher/status/task)
  PATCH  /api/scheduled/results/{result_id}        -> update status (accepted/rejected)
  DELETE /api/scheduled/results/{result_id}        -> delete a result
  POST   /api/scheduled/trigger/{teacher_id}       -> run all enabled tasks immediately
"""

import logging
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/scheduled", tags=["scheduled"])


# ── Schemas ───────────────────────────────────────────────────────────

class ScheduleConfigIn(BaseModel):
    teacher_id: str
    schedule_day: str = "sunday"
    schedule_time: str = "18:00"
    reminder_offset_min: int = 60
    tasks_enabled: List[str] = Field(default_factory=lambda: ["elo_breakdown"])
    is_active: bool = True


class ResultStatusIn(BaseModel):
    status: str  # "pending_review" | "accepted" | "rejected"


# ── Config routes ─────────────────────────────────────────────────────

@router.get("/config/{teacher_id}")
async def get_scheduled_config(teacher_id: str):
    from scheduled_tasks import get_config
    config = get_config(teacher_id)
    if not config:
        return {"config": None}
    return {"config": config}


@router.post("/config")
async def save_scheduled_config(payload: ScheduleConfigIn):
    from scheduled_tasks import upsert_config
    try:
        config = upsert_config(
            teacher_id=payload.teacher_id,
            schedule_day=payload.schedule_day,
            schedule_time=payload.schedule_time,
            reminder_offset_min=payload.reminder_offset_min,
            tasks_enabled=payload.tasks_enabled,
            is_active=payload.is_active,
        )
        return {"success": True, "config": config}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"save_scheduled_config failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to save schedule config")


@router.delete("/config/{teacher_id}")
async def delete_scheduled_config(teacher_id: str):
    from scheduled_tasks import delete_config
    try:
        removed = delete_config(teacher_id)
        return {"success": True, "removed": removed}
    except Exception as e:
        logger.error(f"delete_scheduled_config failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete schedule config")


# ── Results routes ────────────────────────────────────────────────────

@router.get("/results")
async def list_scheduled_results(
    teacher_id: str,
    status: Optional[str] = None,
    task_type: Optional[str] = None,
    limit: int = 50,
):
    from scheduled_tasks import list_results
    try:
        results = list_results(teacher_id, status=status, task_type=task_type, limit=limit)
        return {"results": results, "count": len(results)}
    except Exception as e:
        logger.error(f"list_scheduled_results failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to list scheduled results")


@router.patch("/results/{result_id}")
async def update_scheduled_result(result_id: str, payload: ResultStatusIn):
    from scheduled_tasks import update_result_status
    try:
        ok = update_result_status(result_id, payload.status)
        if not ok:
            raise HTTPException(status_code=404, detail="Result not found")
        return {"success": True}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"update_scheduled_result failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update result")


@router.delete("/results/{result_id}")
async def delete_scheduled_result(result_id: str):
    from scheduled_tasks import delete_result
    try:
        removed = delete_result(result_id)
        if not removed:
            raise HTTPException(status_code=404, detail="Result not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"delete_scheduled_result failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete result")


# ── Manual trigger ────────────────────────────────────────────────────

@router.post("/trigger/{teacher_id}")
async def trigger_scheduled_tasks(teacher_id: str):
    """Manually run all enabled tasks for this teacher now (bypasses the cron)."""
    from scheduled_tasks import run_all_scheduled_tasks
    try:
        result = await run_all_scheduled_tasks(teacher_id)
        return {"success": True, **result}
    except Exception as e:
        logger.error(f"trigger_scheduled_tasks failed: {e}")
        raise HTTPException(status_code=500, detail=f"Trigger failed: {e}")
