from fastapi import APIRouter, HTTPException
import logging
import json
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/insights", tags=["insights"])


def _load_reports() -> list:
    """Load stored insight reports."""
    try:
        from main import load_json_data
        return load_json_data("insights_reports.json")
    except Exception:
        return []


def _save_reports(reports: list):
    """Save insight reports (keep last 10)."""
    try:
        from main import save_json_data
        save_json_data("insights_reports.json", reports[-10:])
    except Exception as e:
        logger.error(f"Failed to save insights reports: {e}")


@router.get("/data")
async def get_insights_data():
    """Return aggregated data from all sources (no LLM). Fast endpoint for summary cards."""
    try:
        import insights_service
        data = insights_service.aggregate_all()
        return data
    except Exception as e:
        logger.error(f"Error aggregating insights data: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reports")
async def get_reports():
    """Return stored insight report history."""
    return _load_reports()


@router.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    """Delete a specific report by ID."""
    reports = _load_reports()
    filtered = [r for r in reports if r.get("id") != report_id]
    if len(filtered) == len(reports):
        raise HTTPException(status_code=404, detail="Report not found")
    _save_reports(filtered)
    return {"status": "deleted"}


def save_report(report: dict):
    """Save a new report (called from WebSocket handler)."""
    if not report.get("id"):
        report["id"] = str(uuid.uuid4())
    if not report.get("generated_at"):
        report["generated_at"] = datetime.now().isoformat()
    reports = _load_reports()
    reports.append(report)
    _save_reports(reports)
    return report
