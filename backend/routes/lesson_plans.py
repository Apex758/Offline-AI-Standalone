"""
Lesson Plan API (Phase 2b)

Drop-in replacement for the legacy inline endpoints in main.py:1604-1683.
URLs and response shapes are preserved verbatim so existing frontend callers
(LessonPlanner, Chat, AnalyticsDashboard, ResourceManager, QuizGenerator,
PresentationBuilder) continue to work without changes.

Backed by SQLite (`lesson_plans` table) instead of `lesson_plan_history.json`.
The 50-entry cap is removed. Phase 3 auto-binds timetable slots and suggests
milestones; "Mark as taught" lives at POST /api/lesson-plans/{id}/mark-taught.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Any
import logging

import lesson_plan_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["lesson-plans"])


class LessonPlanHistory(BaseModel):
    model_config = {"extra": "allow"}

    id: str
    title: str
    timestamp: str
    formData: dict
    generatedPlan: Optional[str] = None
    parsedLesson: Optional[dict] = None
    curriculumMatches: Optional[list] = None
    edit_count: Optional[int] = 1
    teacher_id: Optional[str] = None


# ── Legacy URLs (preserved verbatim) ──

@router.get("/api/lesson-plan-history")
async def get_lesson_plan_history(teacher_id: Optional[str] = Query(None)) -> List[dict]:
    """Get all lesson plan histories. Returns an array (not wrapped)."""
    try:
        return lesson_plan_service.list_histories(teacher_id=teacher_id)
    except Exception as e:
        logger.error(f"Error loading lesson plan history: {e}", exc_info=True)
        return []


@router.post("/api/lesson-plan-history")
async def save_lesson_plan_history(plan: LessonPlanHistory):
    """Save or update a lesson plan history."""
    try:
        plan_dict = plan.model_dump()
        saved = lesson_plan_service.save_history(plan_dict)
        return {"success": True, "id": saved['id']}
    except Exception as e:
        logger.error(f"Error saving lesson plan history: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save lesson plan")


@router.delete("/api/lesson-plan-history/{plan_id}")
async def delete_lesson_plan_history(plan_id: str):
    """Delete a lesson plan history."""
    try:
        ok = lesson_plan_service.delete_history(plan_id)
        if not ok:
            raise HTTPException(status_code=404, detail="Lesson plan history not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting lesson plan history: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete lesson plan")


# ── Phase 3: Mark as taught (new endpoint) ──

@router.post("/api/lesson-plans/{plan_id}/mark-taught")
async def mark_as_taught(plan_id: str):
    """
    Flip a lesson plan to 'completed' and (if a suggested_milestone_id is set)
    cascade the completion to the linked milestone in milestones.db.
    """
    try:
        result = lesson_plan_service.mark_as_taught(plan_id)
        if result.get('error') == 'not_found':
            raise HTTPException(status_code=404, detail="Lesson plan not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in mark_as_taught for {plan_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to mark as taught")
