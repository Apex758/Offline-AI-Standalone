"""
Calendar Import Service — Parse .ics and .csv calendar files into school year events.

Supports:
  - ICS/iCalendar format (using the `icalendar` library)
  - CSV with auto-detected columns (title, date, end_date, type, description)
"""

import csv
import io
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Keywords → event_type mapping
EVENT_TYPE_KEYWORDS = {
    "exam": "exam",
    "final": "exam",
    "midterm": "midterm",
    "mid-term": "midterm",
    "test": "exam",
    "grading": "grading_deadline",
    "grade deadline": "grading_deadline",
    "report card": "report_card",
    "report": "report_card",
    "holiday": "custom",
    "break": "custom",
    "vacation": "custom",
    "meeting": "custom",
    "pta": "custom",
    "conference": "custom",
}


def _guess_event_type(title: str) -> str:
    """Infer event_type from the event title via keyword matching."""
    lower = title.lower()
    for keyword, etype in EVENT_TYPE_KEYWORDS.items():
        if keyword in lower:
            return etype
    return "custom"


def parse_ics_file(content: bytes) -> list[dict]:
    """Parse an ICS/iCalendar file into a list of event dicts."""
    try:
        from icalendar import Calendar
    except ImportError:
        raise ValueError("ICS parsing requires the 'icalendar' package. Install it with: pip install icalendar>=5.0.0")

    try:
        cal = Calendar.from_ical(content)
    except Exception as e:
        raise ValueError(f"Invalid ICS file: {e}")

    events = []
    for component in cal.walk():
        if component.name != "VEVENT":
            continue

        summary = str(component.get("SUMMARY", "Untitled Event"))
        description = str(component.get("DESCRIPTION", "")) if component.get("DESCRIPTION") else None

        dtstart = component.get("DTSTART")
        dtend = component.get("DTEND")

        if not dtstart:
            continue

        start_dt = dtstart.dt
        end_dt = dtend.dt if dtend else None

        # Convert to date strings
        if hasattr(start_dt, "strftime"):
            event_date = start_dt.strftime("%Y-%m-%d")
        else:
            event_date = str(start_dt)

        end_date = None
        if end_dt:
            if hasattr(end_dt, "strftime"):
                end_date = end_dt.strftime("%Y-%m-%d")
            else:
                end_date = str(end_dt)

        events.append({
            "title": summary,
            "description": description,
            "event_date": event_date,
            "end_date": end_date,
            "event_type": _guess_event_type(summary),
            "all_day": 1,
        })

    return events


def parse_csv_calendar(content: bytes) -> list[dict]:
    """Parse a CSV calendar file with auto-detected columns."""
    try:
        text = content.decode("utf-8-sig")  # Handle BOM
    except UnicodeDecodeError:
        text = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        raise ValueError("CSV file appears to be empty or has no header row.")

    # Auto-detect column mapping (case-insensitive)
    fields_lower = {f.lower().strip(): f for f in reader.fieldnames}

    def _find_col(*candidates: str) -> str | None:
        for c in candidates:
            for fl, orig in fields_lower.items():
                if c in fl:
                    return orig
        return None

    title_col = _find_col("title", "summary", "name", "event", "subject")
    date_col = _find_col("date", "start", "event_date", "begin")
    end_col = _find_col("end", "end_date", "finish")
    type_col = _find_col("type", "event_type", "category", "kind")
    desc_col = _find_col("description", "desc", "notes", "details")

    if not title_col or not date_col:
        raise ValueError(
            f"CSV must have at least a title and date column. Found columns: {', '.join(reader.fieldnames)}"
        )

    events = []
    for row in reader:
        title = (row.get(title_col) or "").strip()
        date_str = (row.get(date_col) or "").strip()
        if not title or not date_str:
            continue

        # Try to parse the date
        event_date = _parse_flexible_date(date_str)
        if not event_date:
            logger.warning(f"Skipping row with unparseable date: {date_str}")
            continue

        end_date = None
        if end_col and row.get(end_col):
            end_date = _parse_flexible_date(row[end_col].strip())

        event_type = "custom"
        if type_col and row.get(type_col):
            raw_type = row[type_col].strip().lower()
            if raw_type in ("exam", "midterm", "grading_deadline", "report_card", "custom"):
                event_type = raw_type
            else:
                event_type = _guess_event_type(raw_type) or _guess_event_type(title)
        else:
            event_type = _guess_event_type(title)

        description = row.get(desc_col, "").strip() if desc_col else None

        events.append({
            "title": title,
            "description": description or None,
            "event_date": event_date,
            "end_date": end_date,
            "event_type": event_type,
            "all_day": 1,
        })

    return events


def _parse_flexible_date(date_str: str) -> str | None:
    """Try multiple date formats and return YYYY-MM-DD or None."""
    formats = [
        "%Y-%m-%d",
        "%m/%d/%Y",
        "%d/%m/%Y",
        "%m-%d-%Y",
        "%d-%m-%Y",
        "%Y/%m/%d",
        "%B %d, %Y",
        "%b %d, %Y",
        "%d %B %Y",
        "%d %b %Y",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def parse_calendar_file(filename: str, content: bytes) -> list[dict]:
    """Route to the correct parser based on file extension."""
    if not filename:
        raise ValueError("No filename provided.")

    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext == "ics":
        return parse_ics_file(content)
    elif ext == "csv":
        return parse_csv_calendar(content)
    else:
        raise ValueError(f"Unsupported file type '.{ext}'. Accepted: .ics, .csv")
