"""
Teacher Metrics REST API — endpoints for computing, viewing, and persisting
teacher performance metrics and school phase info.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
import logging

import teacher_metrics_service
import insights_service
import school_year_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/teacher-metrics", tags=["teacher-metrics"])


class CaribbeanSetupDates(BaseModel):
    year_start:       str
    sem1_end:         str
    break_end:        str
    year_end:         str
    midterm1_start:   str
    midterm1_end:     str
    midterm2_start:   str
    midterm2_end:     str
    final_exam_start: Optional[str] = None
    final_exam_end:   Optional[str] = None


class SchoolYearSetupRequest(BaseModel):
    teacher_id:     str = "default_teacher"
    label:          str
    structure_type: str = "caribbean_two_semester"
    dates:          CaribbeanSetupDates


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


@router.get("/history-by-phase")
async def get_history_by_phase(teacher_id: str = "default_teacher"):
    """Return metric snapshot history grouped by academic phase."""
    try:
        data = teacher_metrics_service.get_metric_history_by_phase(teacher_id)
        return {"phases": data}
    except Exception as e:
        logger.error(f"Failed to get history by phase: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/academic-phases")
async def list_academic_phases(teacher_id: str = "default_teacher"):
    """Return all academic phases for the teacher's active school year config."""
    try:
        config = school_year_service.get_active_config(teacher_id)
        if not config:
            return {"phases": [], "config": None}
        phases = school_year_service.list_academic_phases(config["id"])
        return {"phases": phases, "config": config}
    except Exception as e:
        logger.error(f"Failed to list academic phases: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/setup-caribbean-year")
async def setup_caribbean_year(body: SchoolYearSetupRequest):
    """Create/update a Caribbean two-semester school year config with phases."""
    try:
        # Save the school year config
        config = school_year_service.save_config({
            "teacher_id":    body.teacher_id,
            "label":         body.label,
            "start_date":    body.dates.year_start,
            "end_date":      body.dates.year_end,
            "is_active":     1,
            "structure_type": "caribbean_two_semester",
        })

        # Build and save the academic phases
        dates_dict = body.dates.model_dump()
        phases = school_year_service.build_caribbean_phases(config["id"], body.teacher_id, dates_dict)
        saved_phases = school_year_service.save_academic_phases(phases)

        return {"config": config, "phases": saved_phases}
    except Exception as e:
        logger.error(f"Failed to setup Caribbean year: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/phase-summary/{phase_key}")
async def generate_phase_summary(phase_key: str, teacher_id: str = "default_teacher"):
    """Generate (or regenerate) a summary for a completed academic phase."""
    try:
        summary = teacher_metrics_service.generate_phase_summary(teacher_id, phase_key)
        if not summary:
            raise HTTPException(status_code=404, detail="Phase not found or no snapshots available")
        return {"summary": summary}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate phase summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/phase-summaries")
async def list_phase_summaries(teacher_id: str = "default_teacher"):
    """Return all phase summaries for this teacher."""
    try:
        summaries = school_year_service.list_phase_summaries(teacher_id)
        return {"summaries": summaries}
    except Exception as e:
        logger.error(f"Failed to list phase summaries: {e}")
        raise HTTPException(status_code=500, detail=str(e))
