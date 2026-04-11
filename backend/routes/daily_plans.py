"""
Daily Plan API (Phase 2c)

CRUD endpoints for Kindergarten / Early Childhood daily activity plans.
Part of the unified calendar layer — every write live-projects into
unified_events.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
import logging

import daily_plan_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/daily-plans", tags=["daily-plans"])


class DailyPlanCreate(BaseModel):
    model_config = {"extra": "allow"}

    id: Optional[str] = None
    teacher_id: Optional[str] = None
    plan_date: str
    theme: Optional[str] = None
    activities: Optional[list] = None
    literacy_focus: Optional[str] = None
    math_focus: Optional[str] = None
    materials: Optional[str] = None
    notes: Optional[str] = None
    color: Optional[str] = None


@router.get("")
async def list_daily_plans(teacher_id: Optional[str] = Query(None)) -> List[dict]:
    try:
        return daily_plan_service.list_plans(teacher_id=teacher_id)
    except Exception as e:
        logger.error(f"Failed to list daily plans: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{plan_id}")
async def get_daily_plan(plan_id: str):
    plan = daily_plan_service.get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Daily plan not found")
    return plan


@router.post("")
async def save_daily_plan(plan: DailyPlanCreate):
    try:
        return daily_plan_service.save_plan(plan.model_dump())
    except Exception as e:
        logger.error(f"Failed to save daily plan: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{plan_id}")
async def delete_daily_plan(plan_id: str):
    ok = daily_plan_service.delete_plan(plan_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Daily plan not found")
    return {"success": True}
