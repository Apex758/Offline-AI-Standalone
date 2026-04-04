"""
Teacher Metrics REST API — endpoints for computing, viewing, and persisting
teacher performance metrics and school phase info.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import logging

import teacher_metrics_service
import insights_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/teacher-metrics", tags=["teacher-metrics"])


# ── Endpoints ──

@router.get("/current")
async def get_current_metrics(teacher_id: str = "default_teacher", user_id: Optional[str] = None):
    """Compute current metrics without saving a snapshot."""
    try:
        aggregated = insights_service.aggregate_all(teacher_id, user_id)
        metrics = teacher_metrics_service.compute_composite_score(teacher_id, aggregated)
        return {"metrics": metrics}
    except Exception as e:
        logger.error(f"Failed to compute current metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_metric_history(teacher_id: str = "default_teacher", limit: int = 50):
    """Return historical snapshots for the timeline graph."""
    try:
        history = teacher_metrics_service.get_metric_history(teacher_id, limit)
        return {"history": history}
    except Exception as e:
        logger.error(f"Failed to get metric history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/snapshot")
async def save_snapshot(teacher_id: str = "default_teacher", user_id: Optional[str] = None):
    """Compute current metrics and save a snapshot."""
    try:
        aggregated = insights_service.aggregate_all(teacher_id, user_id)
        metrics = teacher_metrics_service.compute_composite_score(teacher_id, aggregated)
        teacher_metrics_service.save_metric_snapshot(teacher_id, metrics)
        return {"metrics": metrics}
    except Exception as e:
        logger.error(f"Failed to save metric snapshot: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/phase")
async def get_current_phase(teacher_id: str = "default_teacher"):
    """Return current school phase info."""
    try:
        phase_info = teacher_metrics_service.detect_school_phase(teacher_id)
        return {"phase": phase_info}
    except Exception as e:
        logger.error(f"Failed to detect school phase: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/calendar-import")
async def import_calendar(file: UploadFile = File(...), teacher_id: str = "default_teacher"):
    """Upload and parse a calendar file (.ics or .csv)."""
    try:
        import calendar_import_service
        content = await file.read()
        events = calendar_import_service.parse_calendar_file(file.filename, content)
        return {"events": events, "count": len(events)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to import calendar: {e}")
        raise HTTPException(status_code=500, detail=str(e))
