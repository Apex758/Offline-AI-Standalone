from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import logging

import achievement_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/achievements", tags=["achievements"])


@router.get("/definitions")
async def get_definitions():
    """Return the static list of all achievement definitions."""
    return achievement_service.get_definitions()


@router.get("/collections")
async def get_collections():
    """Return the list of achievement collections/sets."""
    return achievement_service.get_collections()


@router.post("/check/{teacher_id}")
async def check_achievements(teacher_id: str):
    """Run achievement checks and return newly earned + all earned + stats."""
    try:
        return achievement_service.check_achievements(teacher_id)
    except Exception as e:
        logger.error(f"Failed to check achievements: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{teacher_id}")
async def get_earned(teacher_id: str):
    """Return earned achievements + stats for a teacher."""
    try:
        return achievement_service.get_earned_achievements(teacher_id)
    except Exception as e:
        logger.error(f"Failed to get achievements: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── Showcase (pinned trophies) ──

class ShowcaseUpdate(BaseModel):
    achievement_ids: List[str]


@router.get("/showcase/{teacher_id}")
async def get_showcase(teacher_id: str):
    """Get the teacher's pinned showcase achievements (max 5)."""
    try:
        return achievement_service.get_showcase(teacher_id)
    except Exception as e:
        logger.error(f"Failed to get showcase: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class TrackFlagBody(BaseModel):
    flag_key: str
    mode: str = "increment"  # "increment" | "set"
    value: int = 1


@router.post("/track/{teacher_id}")
async def track_flag(teacher_id: str, body: TrackFlagBody):
    """Report a frontend-side metric flag to the backend.

    Supported flag_keys:
    - insights_views      (increment each time Educator Insights is opened)
    - profile_complete    (set to 1 when profile is fully filled in)
    - checklist_complete  (set to 1 when welcome checklist is fully checked off)
    """
    allowed_keys = {"insights_views", "profile_complete", "checklist_complete"}
    if body.flag_key not in allowed_keys:
        raise HTTPException(status_code=400, detail=f"Unknown flag_key: {body.flag_key}")
    try:
        if body.mode == "increment":
            achievement_service.increment_teacher_flag(teacher_id, body.flag_key)
        else:
            achievement_service.set_teacher_flag(teacher_id, body.flag_key, body.value)
        return {"ok": True}
    except Exception as e:
        logger.error(f"Failed to track flag: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/showcase/{teacher_id}")
async def update_showcase(teacher_id: str, body: ShowcaseUpdate):
    """Update the teacher's showcase (max 5 pinned achievement IDs)."""
    try:
        return achievement_service.update_showcase(teacher_id, body.achievement_ids[:5])
    except Exception as e:
        logger.error(f"Failed to update showcase: {e}")
        raise HTTPException(status_code=500, detail=str(e))
