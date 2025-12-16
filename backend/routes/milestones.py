from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from models.milestone_db import get_milestone_db
from curriculum_matcher import CurriculumMatcher
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/milestones", tags=["milestones"])

# Pydantic models
class MilestoneUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    due_date: Optional[str] = None
    is_hidden: Optional[bool] = None

class BulkResetRequest(BaseModel):
    teacher_id: str
    archive: bool = True

# Initialize curriculum matcher for milestone generation
curriculum_matcher = None
try:
    curriculum_matcher = CurriculumMatcher()
except Exception as e:
    logger.error(f"Failed to initialize CurriculumMatcher: {e}")

@router.post("/initialize/{teacher_id}")
async def initialize_milestones(teacher_id: str):
    """Generate milestones for all curriculum topics"""
    if not curriculum_matcher:
        raise HTTPException(status_code=500, detail="Curriculum matcher not available")
    
    db = get_milestone_db()
    
    # Check if already initialized
    existing = db.get_milestones(teacher_id)
    if existing:
        return {
            "success": True,
            "message": "Milestones already initialized",
            "count": len(existing)
        }
    
    # Generate from curriculum
    count = db.generate_milestones_from_curriculum(
        teacher_id=teacher_id,
        curriculum_pages=curriculum_matcher.pages
    )
    
    return {
        "success": True,
        "message": f"Generated {count} milestones",
        "count": count
    }

@router.get("/{teacher_id}")
async def get_milestones(
    teacher_id: str,
    grade: Optional[str] = None,
    subject: Optional[str] = None,
    status: Optional[str] = None,
    include_hidden: bool = False
):
    """Get milestones with optional filters"""
    db = get_milestone_db()
    milestones = db.get_milestones(
        teacher_id=teacher_id,
        grade=grade,
        subject=subject,
        status=status,
        include_hidden=include_hidden
    )
    return {"milestones": milestones, "count": len(milestones)}

@router.get("/{teacher_id}/progress")
async def get_progress(teacher_id: str):
    """Get overall progress statistics"""
    db = get_milestone_db()
    summary = db.get_progress_summary(teacher_id)
    breakdown = db.get_progress_by_grade_subject(teacher_id)
    
    return {
        "summary": summary,
        "byGradeSubject": breakdown
    }

@router.get("/{teacher_id}/upcoming")
async def get_upcoming(teacher_id: str, days: int = 7):
    """Get upcoming milestones"""
    db = get_milestone_db()
    milestones = db.get_upcoming_milestones(teacher_id, days_ahead=days)
    return {"milestones": milestones, "count": len(milestones)}

@router.patch("/{milestone_id}")
async def update_milestone(milestone_id: str, update: MilestoneUpdate):
    """Update a milestone"""
    db = get_milestone_db()
    
    updated = db.update_milestone(
        milestone_id=milestone_id,
        status=update.status,
        notes=update.notes,
        due_date=update.due_date,
        is_hidden=update.is_hidden
    )
    
    if not updated:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    return {"success": True, "milestone": updated}

@router.post("/bulk-reset")
async def bulk_reset(request: BulkResetRequest):
    """Reset all milestones for new school year"""
    db = get_milestone_db()
    count = db.bulk_reset(request.teacher_id, archive=request.archive)
    
    return {
        "success": True,
        "message": f"Reset {count} milestones",
        "count": count
    }

@router.get("/{teacher_id}/stats")
async def get_stats(teacher_id: str):
    """Get comprehensive statistics for analytics dashboard"""
    db = get_milestone_db()
    
    summary = db.get_progress_summary(teacher_id)
    upcoming = db.get_upcoming_milestones(teacher_id, days_ahead=7)
    
    # Calculate percentage
    total = summary.get('total', 0)
    completed = summary.get('completed', 0)
    percentage = round((completed / total * 100) if total > 0 else 0, 1)
    
    return {
        "totalMilestones": total,
        "completed": completed,
        "inProgress": summary.get('in_progress', 0),
        "notStarted": summary.get('not_started', 0),
        "completionPercentage": percentage,
        "upcomingThisWeek": len(upcoming)
    }