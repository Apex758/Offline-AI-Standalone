from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import logging

import school_year_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/school-year", tags=["school-year"])


# ── Pydantic Models ──

class SchoolYearConfigCreate(BaseModel):
    id: Optional[str] = None
    teacher_id: str
    label: str
    start_date: str
    end_date: str
    is_active: int = 1


class SchoolYearEventCreate(BaseModel):
    id: Optional[str] = None
    config_id: str
    teacher_id: str
    title: str
    description: Optional[str] = None
    event_date: str
    end_date: Optional[str] = None
    event_type: str
    color: Optional[str] = None
    subject: Optional[str] = None
    grade_level: Optional[str] = None
    all_day: int = 1
    reminders_enabled: int = 0
    reminder_offsets: Optional[str] = '[]'
    blocks_classes: int = 0  # Phase 2: holidays that block the timetable


class BulkEventsCreate(BaseModel):
    events: List[SchoolYearEventCreate]


class TimetableSlotCreate(BaseModel):
    id: Optional[str] = None
    teacher_id: str
    day_of_week: str
    start_time: str
    end_time: str
    subject: str
    grade_level: str
    class_name: Optional[str] = None
    notes: Optional[str] = None


# ── Config Endpoints ──

@router.get("/config/{teacher_id}")
async def get_configs(teacher_id: str):
    try:
        return {"configs": school_year_service.list_configs(teacher_id)}
    except Exception as e:
        logger.error(f"Failed to list school year configs: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/config/{teacher_id}/active")
async def get_active_config(teacher_id: str):
    try:
        config = school_year_service.get_active_config(teacher_id)
        return {"config": config}
    except Exception as e:
        logger.error(f"Failed to get active config: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/config")
async def save_config(data: SchoolYearConfigCreate):
    try:
        config = school_year_service.save_config(data.dict())
        return {"config": config}
    except Exception as e:
        logger.error(f"Failed to save school year config: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/config/{config_id}")
async def delete_config(config_id: str):
    try:
        deleted = school_year_service.delete_config(config_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Config not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete config: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── Event Endpoints ──

@router.get("/events/{config_id}")
async def get_events(config_id: str):
    try:
        return {"events": school_year_service.list_events(config_id)}
    except Exception as e:
        logger.error(f"Failed to list events: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/events/range")
async def get_events_by_range(teacher_id: str, start: str, end: str):
    try:
        return {"events": school_year_service.list_events_by_range(teacher_id, start, end)}
    except Exception as e:
        logger.error(f"Failed to list events by range: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/events")
async def save_event(data: SchoolYearEventCreate):
    try:
        event = school_year_service.save_event(data.dict())
        return {"event": event}
    except Exception as e:
        logger.error(f"Failed to save event: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/events/bulk")
async def bulk_save_events(data: BulkEventsCreate):
    try:
        events = school_year_service.bulk_save_events([e.dict() for e in data.events])
        return {"events": events}
    except Exception as e:
        logger.error(f"Failed to bulk save events: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/events/{event_id}")
async def delete_event(event_id: str):
    try:
        deleted = school_year_service.delete_event(event_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete event: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── Reminder Endpoints ──

@router.get("/reminders/due")
async def get_due_reminders(teacher_id: str):
    try:
        reminders = school_year_service.get_due_reminders(teacher_id)
        return {"reminders": reminders}
    except Exception as e:
        logger.error(f"Failed to get due reminders: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# -- Timetable Endpoints --

@router.get("/timetable/{teacher_id}")
async def get_timetable(teacher_id: str):
    try:
        return {"slots": school_year_service.get_timetable(teacher_id)}
    except Exception as e:
        logger.error(f"Failed to get timetable: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/timetable")
async def upsert_timetable_slot(data: TimetableSlotCreate):
    try:
        slot = school_year_service.upsert_timetable_slot(data.dict())
        return {"slot": slot}
    except Exception as e:
        logger.error(f"Failed to upsert timetable slot: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/timetable/{slot_id}")
async def delete_timetable_slot(slot_id: str):
    try:
        deleted = school_year_service.delete_timetable_slot(slot_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Slot not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete timetable slot: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/timetable/{teacher_id}/lookup")
async def lookup_timetable_slot(teacher_id: str, grade_level: str, subject: str):
    try:
        slot = school_year_service.lookup_timetable_slot(teacher_id, grade_level, subject)
        return {"slot": slot}
    except Exception as e:
        logger.error(f"Failed to lookup timetable slot: {e}")
        raise HTTPException(status_code=500, detail=str(e))
