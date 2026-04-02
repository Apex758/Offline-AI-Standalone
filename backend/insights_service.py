"""
Educator Insights — Data Aggregation Service

Queries all data sources (SQLite DBs + JSON history files) and produces
compact, pre-computed summaries suitable for Tier 1 LLM input.
Each aggregate function returns a dict with:
  - raw numeric data (for frontend summary cards)
  - llm_text (compact string summary for LLM prompts)
  - has_data (bool — skip the LLM pass if False)
"""

import sqlite3
import os
import json
from pathlib import Path
from datetime import datetime, timedelta
from collections import Counter


# ── Date context helpers for interval-based insights ─────────────────────────

def get_first_activity_date(teacher_id: str = "default_teacher", user_id: str | None = None) -> str | None:
    """Return the earliest activity date for this teacher from the achievement log."""
    ach_id = user_id or teacher_id
    try:
        import achievement_service
        db_path = achievement_service._get_db_path()
        if not os.path.exists(db_path):
            return None
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        try:
            row = conn.execute(
                "SELECT MIN(activity_date) as first_date FROM achievement_activity_log WHERE teacher_id = ?",
                (ach_id,)
            ).fetchone()
            return row["first_date"] if row and row["first_date"] else None
        finally:
            conn.close()
    except Exception:
        return None


def get_report_date_context(teacher_id: str = "default_teacher", user_id: str | None = None) -> dict:
    """Build date context for interval-based insight generation.

    Returns:
        is_first_report: True if no previous reports exist
        from_date: Start of the analysis period
        to_date: End of the analysis period (today)
        previous_report: The full previous report dict (or None)
        previous_report_id: ID of the previous report (or None)
    """
    today = datetime.now().strftime("%Y-%m-%d")

    # Load existing reports
    try:
        from routes.insights import _load_reports
        reports = _load_reports()
    except Exception:
        reports = []

    if not reports:
        # First report ever — cover from first activity date to today
        first_date = get_first_activity_date(teacher_id, user_id) or today
        return {
            "is_first_report": True,
            "from_date": first_date,
            "to_date": today,
            "previous_report": None,
            "previous_report_id": None,
        }

    # Get the most recent report
    latest = reports[-1]
    # The new period starts from the previous report's to_date (or generated_at date)
    prev_to = latest.get("to_date") or latest.get("generated_at", today)[:10]

    return {
        "is_first_report": False,
        "from_date": prev_to,
        "to_date": today,
        "previous_report": latest,
        "previous_report_id": latest.get("id"),
    }


# ── DB helpers (reuse patterns from student_service / milestone_db) ──────────

def _get_students_db_path() -> str:
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    return str(data_dir / 'students.db')


def _get_students_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(_get_students_db_path())
    conn.row_factory = sqlite3.Row
    return conn


def _get_data_directory() -> Path:
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


def _load_json_file(filename: str) -> list:
    filepath = _get_data_directory() / filename
    if not filepath.exists():
        return []
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return []


# ── Curriculum Coverage ──────────────────────────────────────────────────────

def aggregate_curriculum_data(teacher_id: str = "default") -> dict:
    """Analyze milestone completion rates by subject/grade."""
    try:
        from milestones.milestone_db import get_milestone_db
        db = get_milestone_db()
        summary = db.get_progress_summary(teacher_id)
        breakdown = db.get_progress_by_grade_subject(teacher_id)
    except Exception:
        return {"has_data": False, "llm_text": "", "total": 0, "completed": 0, "pct": 0, "gaps": [], "breakdown": []}

    total = summary.get("total", 0)
    completed = summary.get("completed", 0)
    in_progress = summary.get("in_progress", 0)

    if total == 0:
        return {"has_data": False, "llm_text": "", "total": 0, "completed": 0, "pct": 0, "gaps": [], "breakdown": []}

    pct = round(completed / total * 100) if total else 0

    # Identify gaps: subjects with < 20% completion
    gaps = []
    for b in breakdown:
        b_total = b.get("total", 0)
        b_completed = b.get("completed", 0)
        if b_total > 0 and (b_completed / b_total) < 0.2:
            gaps.append(f"{b.get('grade', '?')} {b.get('subject', '?')}")

    # Build compact LLM text
    lines = [
        f"Total milestones tracked: {total}",
        f"Completed: {completed} ({pct}%)",
        f"In progress: {in_progress}",
        f"Not started: {summary.get('not_started', 0)}",
        "",
        "Breakdown by grade/subject:"
    ]
    for b in breakdown:
        b_total = b.get("total", 0)
        b_completed = b.get("completed", 0)
        b_pct = round(b_completed / b_total * 100) if b_total else 0
        lines.append(f"- {b.get('grade', '?')} {b.get('subject', '?')}: {b_completed}/{b_total} ({b_pct}%)")

    if gaps:
        lines.append(f"\nGaps (under 20% completion): {', '.join(gaps)}")

    return {
        "has_data": True,
        "llm_text": "\n".join(lines),
        "total": total,
        "completed": completed,
        "pct": pct,
        "gaps": gaps,
        "breakdown": [dict(b) for b in breakdown],
    }


# ── Student Performance ─────────────────────────────────────────────────────

def aggregate_student_performance() -> dict:
    """Analyze quiz and worksheet grades across all students."""
    try:
        conn = _get_students_conn()
    except Exception:
        return {"has_data": False, "llm_text": "", "avgScore": 0, "totalStudents": 0, "distribution": {}, "bySubject": []}

    try:
        # Count students
        student_count = conn.execute("SELECT COUNT(*) as cnt FROM students").fetchone()["cnt"]

        # All quiz grades
        quiz_grades = conn.execute(
            "SELECT subject, percentage, letter_grade FROM quiz_grades"
        ).fetchall()

        # All worksheet grades
        ws_grades = conn.execute(
            "SELECT subject, percentage, letter_grade FROM worksheet_grades"
        ).fetchall()

        all_grades = [dict(g) for g in quiz_grades] + [dict(g) for g in ws_grades]

        if not all_grades or student_count == 0:
            return {"has_data": False, "llm_text": "", "avgScore": 0, "totalStudents": student_count, "distribution": {}, "bySubject": []}

        # Overall average
        percentages = [g["percentage"] for g in all_grades if g.get("percentage") is not None]
        avg_score = round(sum(percentages) / len(percentages), 1) if percentages else 0

        # Letter grade distribution
        distribution = Counter(g.get("letter_grade", "?") for g in all_grades)

        # Per-subject averages
        subject_scores = {}
        for g in all_grades:
            subj = g.get("subject") or "Unknown"
            if g.get("percentage") is not None:
                subject_scores.setdefault(subj, []).append(g["percentage"])

        by_subject = []
        for subj, scores in sorted(subject_scores.items()):
            by_subject.append({
                "subject": subj,
                "avg": round(sum(scores) / len(scores), 1),
                "count": len(scores)
            })

        # Build LLM text
        lines = [
            f"Total students: {student_count}",
            f"Total assessments graded: {len(all_grades)} (quizzes: {len(quiz_grades)}, worksheets: {len(ws_grades)})",
            f"Overall average score: {avg_score}%",
            "",
            "Grade distribution:",
            f"- A (90-100%): {distribution.get('A', 0)}",
            f"- B (80-89%): {distribution.get('B', 0)}",
            f"- C (70-79%): {distribution.get('C', 0)}",
            f"- D (60-69%): {distribution.get('D', 0)}",
            f"- F (below 60%): {distribution.get('F', 0)}",
            "",
            "Average by subject:"
        ]
        for s in by_subject:
            lines.append(f"- {s['subject']}: {s['avg']}% ({s['count']} assessments)")

        return {
            "has_data": True,
            "llm_text": "\n".join(lines),
            "avgScore": avg_score,
            "totalStudents": student_count,
            "distribution": dict(distribution),
            "bySubject": by_subject,
        }
    finally:
        conn.close()


# ── Content Creation Patterns ────────────────────────────────────────────────

def aggregate_content_creation() -> dict:
    """Analyze resource creation history across all content types."""
    history_files = {
        "Lesson Plans": "lesson_plan_history.json",
        "Quizzes": "quiz_history.json",
        "Worksheets": "worksheet_history.json",
        "Rubrics": "rubric_history.json",
        "Kindergarten Plans": "kindergarten_history.json",
        "Multigrade Plans": "multigrade_history.json",
        "Cross-Curricular Plans": "cross_curricular_history.json",
        "Presentations": "presentation_history.json",
        "Images": "images_history.json",
    }

    by_type = {}
    total = 0
    subject_counter = Counter()
    recent_7d = 0
    recent_30d = 0
    now = datetime.now()

    for label, filename in history_files.items():
        items = _load_json_file(filename)
        count = len(items)
        by_type[label] = count
        total += count

        for item in items:
            # Extract subject from formData
            form_data = item.get("formData") or item.get("form_data") or {}
            if isinstance(form_data, dict):
                subj = form_data.get("subject") or form_data.get("Subject")
                if subj:
                    subject_counter[subj] += 1

            # Check recency
            ts = item.get("timestamp") or item.get("createdAt") or item.get("created_at") or ""
            if ts:
                try:
                    created = datetime.fromisoformat(ts.replace("Z", "+00:00").replace("Z", ""))
                    # Make naive for comparison
                    if created.tzinfo:
                        created = created.replace(tzinfo=None)
                    delta = (now - created).days
                    if delta <= 7:
                        recent_7d += 1
                    if delta <= 30:
                        recent_30d += 1
                except (ValueError, TypeError):
                    pass

    if total == 0:
        return {"has_data": False, "llm_text": "", "totalResources": 0, "byType": {}, "topType": "", "subjectDistribution": {}}

    # Top type
    top_type = max(by_type, key=by_type.get) if by_type else ""
    least_used = [k for k, v in by_type.items() if v == 0]

    # Build LLM text
    lines = [
        f"Total resources created: {total}",
        f"Created in last 7 days: {recent_7d}",
        f"Created in last 30 days: {recent_30d}",
        "",
        "By type:"
    ]
    for label, count in sorted(by_type.items(), key=lambda x: -x[1]):
        lines.append(f"- {label}: {count}")

    if subject_counter:
        lines.append("\nSubjects covered:")
        for subj, cnt in subject_counter.most_common(10):
            lines.append(f"- {subj}: {cnt} resources")

    if least_used:
        lines.append(f"\nUnused content types: {', '.join(least_used)}")

    return {
        "has_data": True,
        "llm_text": "\n".join(lines),
        "totalResources": total,
        "byType": by_type,
        "topType": top_type,
        "subjectDistribution": dict(subject_counter),
        "recent7d": recent_7d,
        "recent30d": recent_30d,
    }


# ── Attendance & Engagement ──────────────────────────────────────────────────

def aggregate_attendance_engagement() -> dict:
    """Analyze attendance rates and engagement levels."""
    try:
        conn = _get_students_conn()
    except Exception:
        return {"has_data": False, "llm_text": "", "avgRate": 0, "atRiskCount": 0, "engagementDistribution": {}}

    try:
        # All attendance records
        records = conn.execute(
            "SELECT student_id, class_name, date, status, engagement_level FROM attendance"
        ).fetchall()

        if not records:
            return {"has_data": False, "llm_text": "", "avgRate": 0, "atRiskCount": 0, "engagementDistribution": {}}

        records = [dict(r) for r in records]

        # Attendance rate
        present_count = sum(1 for r in records if r.get("status") in ("Present", "Late"))
        total_records = len(records)
        avg_rate = round(present_count / total_records * 100, 1) if total_records else 0

        # Engagement distribution
        engagement_counter = Counter(r.get("engagement_level", "Unknown") for r in records)

        # At-risk students: > 3 absences in last 30 days
        cutoff = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        recent_absences = {}
        for r in records:
            if r.get("date", "") >= cutoff and r.get("status") == "Absent":
                sid = r.get("student_id", "?")
                recent_absences[sid] = recent_absences.get(sid, 0) + 1
        at_risk = {sid: cnt for sid, cnt in recent_absences.items() if cnt > 3}

        # Per-class rates
        class_records = {}
        for r in records:
            cls = r.get("class_name", "Unknown")
            class_records.setdefault(cls, {"present": 0, "total": 0})
            class_records[cls]["total"] += 1
            if r.get("status") in ("Present", "Late"):
                class_records[cls]["present"] += 1

        # Build LLM text
        lines = [
            f"Total attendance records: {total_records}",
            f"Overall attendance rate: {avg_rate}%",
            f"Students at risk (>3 absences in 30 days): {len(at_risk)}",
            "",
            "Engagement levels:"
        ]
        for level, cnt in engagement_counter.most_common():
            pct = round(cnt / total_records * 100)
            lines.append(f"- {level}: {cnt} ({pct}%)")

        if class_records:
            lines.append("\nBy class:")
            for cls, data in sorted(class_records.items()):
                rate = round(data["present"] / data["total"] * 100, 1) if data["total"] else 0
                lines.append(f"- {cls}: {rate}% attendance ({data['total']} records)")

        return {
            "has_data": True,
            "llm_text": "\n".join(lines),
            "avgRate": avg_rate,
            "atRiskCount": len(at_risk),
            "engagementDistribution": dict(engagement_counter),
            "byClass": {cls: round(d["present"] / d["total"] * 100, 1) if d["total"] else 0 for cls, d in class_records.items()},
        }
    finally:
        conn.close()


# ── Achievements & Engagement ───────────────────────────────────────────────

def aggregate_achievement_data(teacher_id: str = "default_teacher", user_id: str | None = None) -> dict:
    """Analyze achievement progress, rank, streaks, and platform engagement.

    Achievements may be stored under user_id (e.g. '1') rather than teacher_id
    (e.g. 'admin'), so we accept both and prefer user_id for achievement queries.
    """
    ach_id = user_id or teacher_id
    try:
        import achievement_service
        earned_data = achievement_service.get_earned_achievements(ach_id)
        streak_data = achievement_service._get_streak_counts(ach_id)
    except Exception:
        return {
            "has_data": False, "llm_text": "",
            "totalEarned": 0, "totalAvailable": 0, "totalPoints": 0,
            "rank": None, "streakDays": 0, "totalActiveDays": 0, "byCategory": {},
        }

    all_earned = earned_data.get("all_earned", [])
    total_earned = len(all_earned)
    total_available = earned_data.get("total_available", 0)
    total_points = earned_data.get("total_points", 0)
    rank = earned_data.get("rank", {})
    by_category = earned_data.get("by_category", {})
    streak_days = streak_data.get("streak_days", 0)
    total_active_days = streak_data.get("total_active_days", 0)

    if total_earned == 0 and total_active_days == 0:
        return {
            "has_data": False, "llm_text": "",
            "totalEarned": 0, "totalAvailable": total_available, "totalPoints": 0,
            "rank": rank, "streakDays": 0, "totalActiveDays": 0, "byCategory": by_category,
        }

    # Build compact LLM text
    lines = [
        f"Achievements earned: {total_earned}/{total_available}",
        f"Total points: {total_points}",
        f"Current rank: {rank.get('title', 'Unknown')} (level {rank.get('level', 0)})",
        f"Current streak: {streak_days} days",
        f"Total active days on platform: {total_active_days}",
        "",
        "Achievement progress by category:",
    ]
    for cat, counts in sorted(by_category.items()):
        earned = counts.get("earned", 0)
        total = counts.get("total", 0)
        pct = round(earned / total * 100) if total else 0
        lines.append(f"- {cat}: {earned}/{total} ({pct}%)")

    # Highlight strongest and weakest categories
    if by_category:
        sorted_cats = sorted(by_category.items(), key=lambda x: x[1].get("earned", 0) / max(x[1].get("total", 1), 1), reverse=True)
        strongest = sorted_cats[0][0] if sorted_cats else ""
        weakest = sorted_cats[-1][0] if sorted_cats else ""
        if strongest != weakest:
            lines.append(f"\nStrongest area: {strongest}")
            lines.append(f"Least explored: {weakest}")

    return {
        "has_data": True,
        "llm_text": "\n".join(lines),
        "totalEarned": total_earned,
        "totalAvailable": total_available,
        "totalPoints": total_points,
        "rank": rank,
        "streakDays": streak_days,
        "totalActiveDays": total_active_days,
        "byCategory": by_category,
    }


# ── Combined Aggregation ────────────────────────────────────────────────────

def aggregate_all(teacher_id: str = "default_teacher", user_id: str | None = None) -> dict:
    """Aggregate all data sources. Returns both raw data and LLM text summaries."""
    return {
        "curriculum": aggregate_curriculum_data(teacher_id),
        "performance": aggregate_student_performance(),
        "content": aggregate_content_creation(),
        "attendance": aggregate_attendance_engagement(),
        "achievements": aggregate_achievement_data(teacher_id, user_id),
    }
