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


@router.put("/showcase/{teacher_id}")
async def update_showcase(teacher_id: str, body: ShowcaseUpdate):
    """Update the teacher's showcase (max 5 pinned achievement IDs)."""
    try:
        return achievement_service.update_showcase(teacher_id, body.achievement_ids[:5])
    except Exception as e:
        logger.error(f"Failed to update showcase: {e}")
        raise HTTPException(status_code=500, detail=str(e))
