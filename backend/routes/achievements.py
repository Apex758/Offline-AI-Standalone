from fastapi import APIRouter, HTTPException
import logging

import achievement_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/achievements", tags=["achievements"])


@router.get("/definitions")
async def get_definitions():
    """Return the static list of all achievement definitions."""
    return achievement_service.get_definitions()


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
