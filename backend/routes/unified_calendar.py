"""
Unified Calendar API (Phase 1)

A single endpoint to ask "what's happening for this teacher between dates X
and Y?" across every time/date system in the app. Reads from the
unified_events table populated by projectors in school_year_service,
milestone_db, etc.

Phase 1 ships only the read endpoints + a sync stub. Live writes are wired
into source services in Phase 2.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
import logging

import unified_calendar_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/calendar", tags=["unified-calendar"])


@router.get("/unified")
async def get_unified_events(
    teacher_id: str = Query(..., description="Teacher ID to fetch events for"),
    start: str = Query(..., description="ISO datetime range start (inclusive)"),
    end: str = Query(..., description="ISO datetime range end (inclusive)"),
    source_types: Optional[str] = Query(
        None,
        description="Comma-separated list of source types to filter by "
                    "(school_year, holiday, timetable_slot, milestone, lesson_plan, scheduled_task, daily_plan)"
    ),
    grade_level: Optional[str] = None,
    subject: Optional[str] = None,
):
    """
    Return all unified events for the given teacher in the given range.
    Recurring events (timetable slots) are expanded into per-occurrence rows.
    """
    try:
        types_list = [t.strip() for t in source_types.split(',')] if source_types else None
        events = unified_calendar_service.query_unified_events(
            teacher_id=teacher_id,
            range_start=start,
            range_end=end,
            source_types=types_list,
            grade_level=grade_level,
            subject=subject,
        )
        return {"events": events, "count": len(events)}
    except Exception as e:
        logger.error(f"Failed to fetch unified events: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sync")
async def sync_unified_calendar(teacher_id: Optional[str] = None):
    """
    Manual rebuild trigger. Phase 1 returns a stub response; the real backfill
    lives in backend/migrations/unify_calendar.py (Phase 6).
    """
    try:
        result = unified_calendar_service.rebuild_all(teacher_id)
        return result
    except Exception as e:
        logger.error(f"Failed to sync unified calendar: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conflicts")
async def get_conflicts(teacher_id: str = Query(...)):
    """
    Return scheduling conflicts for a teacher.
    Phase 1 stub: returns an empty list. Phase 3 populates this with:
      - timetable occurrences falling on blocks_classes=true holidays
      - lesson plans whose start_datetime no longer matches their bound slot
    """
    try:
        conflicts = unified_calendar_service.detect_conflicts(teacher_id)
        return {"conflicts": conflicts, "count": len(conflicts)}
    except Exception as e:
        logger.error(f"Failed to detect conflicts: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
