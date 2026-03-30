from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from milestones.milestone_db import get_milestone_db
from curriculum_matcher import CurriculumMatcher
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/milestones", tags=["milestones"])

# Pydantic models
class MilestoneUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    due_date: Optional[str] = None
    is_hidden: Optional[bool] = None
    checklist_json: Optional[str] = None

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
    existing = db.get_milestones(teacher_id, include_hidden=True)
    if existing:
        # Sync with current curriculum data (adds new, removes stale, updates metadata)
        result = db.sync_milestones_with_curriculum(
            teacher_id=teacher_id,
            curriculum_pages=curriculum_matcher.pages
        )
        synced = db.get_milestones(teacher_id)
        return {
            "success": True,
            "message": f"Synced milestones: {result['added']} added, {result['updated']} updated, {result['removed']} removed",
            "count": len(synced)
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

@router.post("/sync/{teacher_id}")
async def sync_milestones(teacher_id: str):
    """Sync milestones with updated curriculum data, preserving progress"""
    if not curriculum_matcher:
        raise HTTPException(status_code=500, detail="Curriculum matcher not available")

    db = get_milestone_db()
    result = db.sync_milestones_with_curriculum(
        teacher_id=teacher_id,
        curriculum_pages=curriculum_matcher.pages
    )

    return {
        "success": True,
        "message": f"Synced: {result['added']} added, {result['updated']} updated, {result['removed']} removed",
        **result
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
    """Get overall progress statistics with SCO-level breakdown"""
    db = get_milestone_db()
    summary = db.get_progress_summary(teacher_id)

    # Build SCO-level breakdown by grade/subject
    all_milestones = db.get_milestones(teacher_id)
    gs_map: Dict[str, Dict[str, Any]] = {}
    for m in all_milestones:
        if m.get('status') == 'skipped':
            continue
        key = f"{m['grade']}|{m['subject']}"
        if key not in gs_map:
            gs_map[key] = {'grade': m['grade'], 'subject': m['subject'], 'total': 0, 'completed': 0, 'in_progress': 0}
        checklist = []
        if m.get('checklist_json'):
            try:
                checklist = json.loads(m['checklist_json'])
            except Exception:
                checklist = []
        if checklist:
            gs_map[key]['total'] += len(checklist)
            checked = sum(1 for c in checklist if c.get('checked'))
            gs_map[key]['completed'] += checked
            if checked > 0 and checked < len(checklist):
                gs_map[key]['in_progress'] += len(checklist) - checked
        else:
            gs_map[key]['total'] += 1
            if m.get('status') == 'completed':
                gs_map[key]['completed'] += 1
            elif m.get('status') == 'in_progress':
                gs_map[key]['in_progress'] += 1

    breakdown = sorted(gs_map.values(), key=lambda x: (x['grade'], x['subject']))

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
        is_hidden=update.is_hidden,
        checklist_json=update.checklist_json
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

    # SCO-level percentage: each checklist item contributes individually
    all_milestones = db.get_milestones(teacher_id)
    sco_total = 0
    sco_done = 0
    for m in all_milestones:
        if m.get('status') == 'skipped':
            continue
        checklist = []
        if m.get('checklist_json'):
            try:
                checklist = json.loads(m['checklist_json'])
            except Exception:
                checklist = []
        if checklist:
            sco_total += len(checklist)
            sco_done += sum(1 for c in checklist if c.get('checked'))
        else:
            sco_total += 1
            sco_done += 1 if m.get('status') == 'completed' else 0

    percentage = round((sco_done / sco_total * 100) if sco_total > 0 else 0, 2)

    total = summary.get('total', 0)
    skipped = summary.get('skipped', 0)

    return {
        "totalMilestones": total,
        "completed": summary.get('completed', 0),
        "inProgress": summary.get('in_progress', 0),
        "notStarted": summary.get('not_started', 0),
        "skipped": skipped,
        "completionPercentage": percentage,
        "upcomingThisWeek": len(upcoming)
    }