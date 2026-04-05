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


def get_report_date_context(teacher_id: str = "default_teacher", user_id: str | None = None, registration_date: str | None = None) -> dict:
    """Build date context for interval-based insight generation.

    Returns:
        is_first_report: True if no previous reports exist
        from_date: Start of the analysis period
        to_date: End of the analysis period (today)
        previous_report: The full previous report dict (or None)
        previous_report_id: ID of the previous report (or None)
        report_count: Number of existing reports (0 for first)
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
        first_date = registration_date[:10] if registration_date else None
        first_date = first_date or get_first_activity_date(teacher_id, user_id) or today
        return {
            "is_first_report": True,
            "from_date": first_date,
            "to_date": today,
            "previous_report": None,
            "previous_report_id": None,
            "report_count": 0,
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
        "report_count": len(reports),
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

def _normalize_grade(g: str) -> str:
    """Normalize grade strings to a comparable lowercase key, e.g. 'Grade 1' → '1', 'K' → 'k'."""
    g = g.strip().lower()
    g = g.replace("grade ", "").replace("kindergarten", "k")
    return g


def aggregate_curriculum_data(teacher_id: str = "default", from_date: str | None = None, to_date: str | None = None,
                               grade_subjects: dict | None = None, phase_id: str | None = None) -> dict:
    """Analyze milestone completion rates by subject/grade.

    When from_date/to_date are provided, shows both overall totals AND
    milestones completed within the period (totals + delta approach).
    If grade_subjects is provided (e.g. {"1": ["Math"], "3": ["Science"]}),
    only grades/subjects the teacher actually teaches are included.
    If phase_id is provided, only milestones assigned to that phase are counted.
    """
    try:
        from milestones.milestone_db import get_milestone_db
        db = get_milestone_db()
        if phase_id:
            # Use phase-scoped progress for both summary and breakdown
            phase_progress = db.get_phase_progress(teacher_id, phase_id)
            milestones = db.get_milestones(teacher_id, phase_id=phase_id)
            # Build breakdown from phase milestones
            gs_map = {}
            for m in milestones:
                key = f"{m['grade']}|{m['subject']}"
                if key not in gs_map:
                    gs_map[key] = {"grade": m["grade"], "subject": m["subject"], "total": 0, "completed": 0, "in_progress": 0}
                gs_map[key]["total"] += 1
                if m.get("status") == "completed":
                    gs_map[key]["completed"] += 1
                elif m.get("status") == "in_progress":
                    gs_map[key]["in_progress"] += 1
            summary = {"total": phase_progress["total_milestones"], "completed": phase_progress["completed_milestones"]}
            breakdown = sorted(gs_map.values(), key=lambda x: (x["grade"], x["subject"]))
        else:
            summary = db.get_progress_summary(teacher_id)
            breakdown = db.get_progress_by_grade_subject(teacher_id)
    except Exception:
        return {"has_data": False, "llm_text": "", "total": 0, "completed": 0, "pct": 0, "gaps": [], "breakdown": []}

    # Apply grade/subject filter when teacher profile is set
    if grade_subjects:
        allowed = {_normalize_grade(g): {s.lower() for s in subjs} for g, subjs in grade_subjects.items()}
        breakdown = [
            b for b in breakdown
            if _normalize_grade(str(b.get("grade", ""))) in allowed
            and b.get("subject", "").lower() in allowed.get(_normalize_grade(str(b.get("grade", ""))), set())
        ]
        # Recompute totals from filtered breakdown
        total_filtered = sum(b.get("total", 0) for b in breakdown)
        completed_filtered = sum(b.get("completed", 0) for b in breakdown)
        if total_filtered > 0:
            summary = {"total": total_filtered, "completed": completed_filtered,
                       "in_progress": sum(b.get("in_progress", 0) for b in breakdown),
                       "not_started": sum(b.get("not_started", 0) for b in breakdown)}

    total = summary.get("total", 0)
    completed = summary.get("completed", 0)
    in_progress = summary.get("in_progress", 0)

    if total == 0:
        return {"has_data": False, "llm_text": "", "total": 0, "completed": 0, "pct": 0, "gaps": [], "breakdown": []}

    pct = round(completed / total * 100) if total else 0

    # Count milestones completed in this period (if date range provided)
    period_completed = 0
    if from_date and to_date:
        try:
            conn = db.get_connection()
            try:
                row = conn.execute(
                    "SELECT COUNT(*) as cnt FROM milestones WHERE teacher_id = ? AND status = 'completed' AND completed_at >= ? AND completed_at <= ?",
                    (teacher_id, from_date, to_date + " 23:59:59")
                ).fetchone()
                period_completed = row["cnt"] if row else 0
            finally:
                conn.close()
        except Exception:
            pass

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
        f"Overall completed: {completed} ({pct}%)",
        f"In progress: {in_progress}",
        f"Not started: {summary.get('not_started', 0)}",
    ]
    if from_date and to_date:
        lines.append(f"\nCompleted in this period ({from_date} to {to_date}): {period_completed}")

    lines.append("")
    lines.append("Breakdown by grade/subject:")
    if len(breakdown) <= 10:
        # Small enough — show all
        for b in breakdown:
            b_total = b.get("total", 0)
            b_completed = b.get("completed", 0)
            b_pct = round(b_completed / b_total * 100) if b_total else 0
            lines.append(f"- {b.get('grade', '?')} {b.get('subject', '?')}: {b_completed}/{b_total} ({b_pct}%)")
    else:
        # Balanced mix: 4 lowest + 4 highest so insights cover both gaps and wins
        sorted_bd = sorted(breakdown, key=lambda b: (b.get("completed", 0) / max(b.get("total", 1), 1)))
        selected = sorted_bd[:4] + sorted_bd[-4:]
        lines.append("(Showing top 4 strongest and 4 weakest areas)")
        for b in selected:
            b_total = b.get("total", 0)
            b_completed = b.get("completed", 0)
            b_pct = round(b_completed / b_total * 100) if b_total else 0
            lines.append(f"- {b.get('grade', '?')} {b.get('subject', '?')}: {b_completed}/{b_total} ({b_pct}%)")
        lines.append(f"  ... and {len(breakdown) - 8} more grade/subject combos")

    if gaps:
        lines.append(f"\nGaps (under 20% completion): {', '.join(gaps)}")

    return {
        "has_data": True,
        "llm_text": "\n".join(lines),
        "total": total,
        "completed": completed,
        "pct": pct,
        "periodCompleted": period_completed,
        "gaps": gaps,
        "breakdown": [dict(b) for b in breakdown],
    }


# ── Student Performance ─────────────────────────────────────────────────────

def aggregate_student_performance(from_date: str | None = None, to_date: str | None = None,
                                   grade_subjects: dict | None = None) -> dict:
    """Analyze quiz and worksheet grades across all students.

    When from_date/to_date are provided, shows overall averages plus
    period-specific assessment counts and averages.
    If grade_subjects provided, only subjects the teacher teaches are included.
    """
    try:
        conn = _get_students_conn()
    except Exception:
        return {"has_data": False, "llm_text": "", "avgScore": 0, "totalStudents": 0, "distribution": {}, "bySubject": []}

    try:
        # Count students
        student_count = conn.execute("SELECT COUNT(*) as cnt FROM students").fetchone()["cnt"]

        # All quiz grades (for overall totals)
        quiz_grades = conn.execute(
            "SELECT subject, percentage, letter_grade FROM quiz_grades"
        ).fetchall()

        # All worksheet grades (for overall totals)
        ws_grades = conn.execute(
            "SELECT subject, percentage, letter_grade FROM worksheet_grades"
        ).fetchall()

        all_grades = [dict(g) for g in quiz_grades] + [dict(g) for g in ws_grades]

        # Filter by teacher's subjects when profile is set
        if grade_subjects:
            allowed_subjects = {s.lower() for subjs in grade_subjects.values() for s in subjs}
            all_grades = [g for g in all_grades if (g.get("subject") or "").lower() in allowed_subjects]

        if not all_grades or student_count == 0:
            return {"has_data": False, "llm_text": "", "avgScore": 0, "totalStudents": student_count, "distribution": {}, "bySubject": []}

        # Overall average
        percentages = [g["percentage"] for g in all_grades if g.get("percentage") is not None]
        avg_score = round(sum(percentages) / len(percentages), 1) if percentages else 0

        # Letter grade distribution
        distribution = Counter(g.get("letter_grade", "?") for g in all_grades)

        # Period-specific grades (if date range provided)
        period_grades = []
        period_avg = 0
        if from_date and to_date:
            to_dt = to_date + " 23:59:59"
            period_quiz = conn.execute(
                "SELECT subject, percentage, letter_grade FROM quiz_grades WHERE graded_at >= ? AND graded_at <= ?",
                (from_date, to_dt)
            ).fetchall()
            period_ws = conn.execute(
                "SELECT subject, percentage, letter_grade FROM worksheet_grades WHERE graded_at >= ? AND graded_at <= ?",
                (from_date, to_dt)
            ).fetchall()
            period_grades = [dict(g) for g in period_quiz] + [dict(g) for g in period_ws]
            period_pcts = [g["percentage"] for g in period_grades if g.get("percentage") is not None]
            period_avg = round(sum(period_pcts) / len(period_pcts), 1) if period_pcts else 0

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
            f"Total assessments graded (all time): {len(all_grades)} (quizzes: {len(quiz_grades)}, worksheets: {len(ws_grades)})",
            f"Overall average score: {avg_score}%",
        ]
        if from_date and to_date:
            lines.append(f"\nIn this period ({from_date} to {to_date}): {len(period_grades)} assessments graded, average: {period_avg}%")

        lines.extend([
            "",
            "Grade distribution (all time):",
            f"- A (90-100%): {distribution.get('A', 0)}",
            f"- B (80-89%): {distribution.get('B', 0)}",
            f"- C (70-79%): {distribution.get('C', 0)}",
            f"- D (60-69%): {distribution.get('D', 0)}",
            f"- F (below 60%): {distribution.get('F', 0)}",
            "",
            "Average by subject:"
        ])
        if len(by_subject) <= 10:
            for s in by_subject:
                lines.append(f"- {s['subject']}: {s['avg']}% ({s['count']} assessments)")
        else:
            # Balanced: 4 lowest avg + 4 highest avg so insights cover struggles and strengths
            sorted_subjects = sorted(by_subject, key=lambda s: s['avg'])
            selected = sorted_subjects[:4] + sorted_subjects[-4:]
            lines.append("(Showing 4 strongest and 4 weakest subjects)")
            for s in selected:
                lines.append(f"- {s['subject']}: {s['avg']}% ({s['count']} assessments)")
            lines.append(f"  ... and {len(by_subject) - 8} more subjects")

        return {
            "has_data": True,
            "llm_text": "\n".join(lines),
            "avgScore": avg_score,
            "totalStudents": student_count,
            "distribution": dict(distribution),
            "bySubject": by_subject,
            "periodAssessments": len(period_grades),
            "periodAvg": period_avg,
        }
    finally:
        conn.close()


# ── Content Creation Patterns ────────────────────────────────────────────────

def _parse_item_timestamp(item: dict) -> datetime | None:
    """Extract and parse timestamp from a content history item."""
    ts = item.get("timestamp") or item.get("createdAt") or item.get("created_at") or ""
    if not ts:
        return None
    try:
        created = datetime.fromisoformat(ts.replace("Z", "+00:00").replace("Z", ""))
        if created.tzinfo:
            created = created.replace(tzinfo=None)
        return created
    except (ValueError, TypeError):
        return None


def aggregate_content_creation(from_date: str | None = None, to_date: str | None = None,
                               grade_subjects: dict | None = None) -> dict:
    """Analyze resource creation history across all content types.

    When from_date/to_date are provided, shows both overall totals AND
    resources created within the period.
    If grade_subjects provided, subject_counter is limited to teacher's subjects.
    """
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
    period_count = 0
    period_by_type = Counter()
    now = datetime.now()

    # Parse date range boundaries
    period_start = datetime.fromisoformat(from_date) if from_date else None
    period_end = datetime.fromisoformat(to_date).replace(hour=23, minute=59, second=59) if to_date else None

    for label, filename in history_files.items():
        items = _load_json_file(filename)
        count = len(items)
        by_type[label] = count
        total += count

        _allowed_subjects = {s.lower() for subjs in grade_subjects.values() for s in subjs} if grade_subjects else None
        for item in items:
            # Extract subject from formData
            form_data = item.get("formData") or item.get("form_data") or {}
            if isinstance(form_data, dict):
                subj = form_data.get("subject") or form_data.get("Subject")
                if subj:
                    if _allowed_subjects is None or subj.lower() in _allowed_subjects:
                        subject_counter[subj] += 1

            # Check recency and period membership
            created = _parse_item_timestamp(item)
            if created:
                delta = (now - created).days
                if delta <= 7:
                    recent_7d += 1
                if delta <= 30:
                    recent_30d += 1
                if period_start and period_end and period_start <= created <= period_end:
                    period_count += 1
                    period_by_type[label] += 1

    if total == 0:
        return {"has_data": False, "llm_text": "", "totalResources": 0, "byType": {}, "topType": "", "subjectDistribution": {}}

    # Top type
    top_type = max(by_type, key=by_type.get) if by_type else ""
    least_used = [k for k, v in by_type.items() if v == 0]

    # Build LLM text
    lines = [
        f"Total resources created (all time): {total}",
        f"Created in last 7 days: {recent_7d}",
        f"Created in last 30 days: {recent_30d}",
    ]
    if from_date and to_date:
        lines.append(f"\nCreated in this period ({from_date} to {to_date}): {period_count}")
        if period_by_type:
            for label, cnt in period_by_type.most_common():
                lines.append(f"  - {label}: {cnt}")

    lines.append("")
    lines.append("By type (all time):")
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
        "periodCount": period_count,
    }


# ── Attendance & Engagement ──────────────────────────────────────────────────

def aggregate_attendance_engagement(from_date: str | None = None, to_date: str | None = None) -> dict:
    """Analyze attendance rates and engagement levels.

    When from_date/to_date are provided, shows both overall rates AND
    period-specific attendance data.
    """
    try:
        conn = _get_students_conn()
    except Exception:
        return {"has_data": False, "llm_text": "", "avgRate": 0, "atRiskCount": 0, "engagementDistribution": {}}

    try:
        # All attendance records (for overall totals)
        records = conn.execute(
            "SELECT student_id, class_name, date, status, engagement_level FROM attendance"
        ).fetchall()

        if not records:
            return {"has_data": False, "llm_text": "", "avgRate": 0, "atRiskCount": 0, "engagementDistribution": {}}

        records = [dict(r) for r in records]

        # Attendance rate (overall)
        present_count = sum(1 for r in records if r.get("status") in ("Present", "Late"))
        total_records = len(records)
        avg_rate = round(present_count / total_records * 100, 1) if total_records else 0

        # Engagement distribution (overall)
        engagement_counter = Counter(r.get("engagement_level", "Unknown") for r in records)

        # Period-specific records
        period_records = []
        period_rate = 0
        if from_date and to_date:
            period_records = [r for r in records if from_date <= r.get("date", "") <= to_date]
            period_present = sum(1 for r in period_records if r.get("status") in ("Present", "Late"))
            period_rate = round(period_present / len(period_records) * 100, 1) if period_records else 0

        # At-risk students: > 3 absences in last 30 days
        cutoff = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        recent_absences = {}
        for r in records:
            if r.get("date", "") >= cutoff and r.get("status") == "Absent":
                sid = r.get("student_id", "?")
                recent_absences[sid] = recent_absences.get(sid, 0) + 1
        at_risk = {sid: cnt for sid, cnt in recent_absences.items() if cnt > 3}

        # Per-class rates (overall)
        class_records = {}
        for r in records:
            cls = r.get("class_name", "Unknown")
            class_records.setdefault(cls, {"present": 0, "total": 0})
            class_records[cls]["total"] += 1
            if r.get("status") in ("Present", "Late"):
                class_records[cls]["present"] += 1

        # Build LLM text
        lines = [
            f"Total attendance records (all time): {total_records}",
            f"Overall attendance rate: {avg_rate}%",
            f"Students at risk (>3 absences in 30 days): {len(at_risk)}",
        ]
        if from_date and to_date:
            lines.append(f"\nIn this period ({from_date} to {to_date}): {len(period_records)} records, attendance rate: {period_rate}%")

        lines.extend(["", "Engagement levels:"])
        for level, cnt in engagement_counter.most_common():
            pct = round(cnt / total_records * 100)
            lines.append(f"- {level}: {cnt} ({pct}%)")

        if class_records:
            lines.append("\nBy class:")
            if len(class_records) <= 10:
                for cls, data in sorted(class_records.items()):
                    rate = round(data["present"] / data["total"] * 100, 1) if data["total"] else 0
                    lines.append(f"- {cls}: {rate}% attendance ({data['total']} records)")
            else:
                # Balanced: 4 lowest rate + 4 highest rate so insights cover both concerns and wins
                sorted_classes = sorted(class_records.items(), key=lambda x: x[1]["present"] / max(x[1]["total"], 1))
                selected = sorted_classes[:4] + sorted_classes[-4:]
                lines.append("(Showing 4 best and 4 worst attendance classes)")
                for cls, data in selected:
                    rate = round(data["present"] / data["total"] * 100, 1) if data["total"] else 0
                    lines.append(f"- {cls}: {rate}% attendance ({data['total']} records)")
                lines.append(f"  ... and {len(class_records) - 8} more classes")

        return {
            "has_data": True,
            "llm_text": "\n".join(lines),
            "avgRate": avg_rate,
            "atRiskCount": len(at_risk),
            "engagementDistribution": dict(engagement_counter),
            "byClass": {cls: round(d["present"] / d["total"] * 100, 1) if d["total"] else 0 for cls, d in class_records.items()},
            "periodRecords": len(period_records),
            "periodRate": period_rate,
        }
    finally:
        conn.close()


# ── Achievements & Engagement ───────────────────────────────────────────────

def aggregate_achievement_data(teacher_id: str = "default_teacher", user_id: str | None = None, from_date: str | None = None, to_date: str | None = None) -> dict:
    """Analyze achievement progress, rank, streaks, and platform engagement.

    Achievements may be stored under user_id (e.g. '1') or teacher_id (e.g.
    'admin').  We try the primary ID first; if it yields no earned achievements
    AND a different alternate ID is available, we fall back to the alternate so
    that teachers who registered before the unified-ID migration still see data.
    When from_date/to_date provided, shows achievements earned in that period
    alongside overall totals.
    """
    ach_id = user_id or teacher_id
    try:
        import achievement_service
        earned_data = achievement_service.get_earned_achievements(ach_id)
        # Fallback chain: try all candidate IDs until one returns achievements.
        # This handles: numeric user_id "1", username "admin", legacy "default_teacher".
        if not earned_data.get("all_earned"):
            # Build ordered candidate list (deduplicated, excluding primary ach_id)
            candidates = []
            for cid in [user_id, teacher_id, "1", "admin", "default_teacher"]:
                if cid and cid != ach_id and cid not in candidates:
                    candidates.append(cid)
            for cid in candidates:
                alt_earned = achievement_service.get_earned_achievements(cid)
                if alt_earned.get("all_earned"):
                    earned_data = alt_earned
                    ach_id = cid
                    break
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

    # Count achievements earned in this period
    period_earned = 0
    if from_date and to_date:
        try:
            db_path = achievement_service._get_db_path()
            conn = sqlite3.connect(db_path)
            conn.row_factory = sqlite3.Row
            try:
                row = conn.execute(
                    "SELECT COUNT(*) as cnt FROM earned_achievements WHERE teacher_id = ? AND earned_at >= ? AND earned_at <= ?",
                    (ach_id, from_date, to_date + " 23:59:59")
                ).fetchone()
                period_earned = row["cnt"] if row else 0
            finally:
                conn.close()
        except Exception:
            pass

    # Build compact LLM text
    lines = [
        f"Achievements earned (all time): {total_earned}/{total_available}",
        f"Total points: {total_points}",
        f"Current rank: {rank.get('title', 'Unknown')} (level {rank.get('level', 0)})",
        f"Current streak: {streak_days} days",
        f"Total active days on platform: {total_active_days}",
    ]
    if from_date and to_date:
        lines.append(f"\nAchievements earned in this period ({from_date} to {to_date}): {period_earned}")

    lines.extend(["", "Achievement progress by category:"])
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
        "periodEarned": period_earned,
    }


# ── Combined Aggregation ────────────────────────────────────────────────────

def aggregate_all(teacher_id: str = "default_teacher", user_id: str | None = None,
                  from_date: str | None = None, to_date: str | None = None,
                  grade_subjects: dict | None = None,
                  phase_id: str | None = None) -> dict:
    """Aggregate all data sources. Returns both raw data and LLM text summaries.

    When from_date/to_date are provided, each aggregate function includes
    both overall totals and period-specific deltas in its llm_text.
    If grade_subjects is provided (e.g. {"1": ["Math"], "k": ["Language Arts"]}),
    curriculum/performance/content data is restricted to what the teacher teaches.
    If phase_id is provided, curriculum data is scoped to milestones in that phase,
    and date-sensitive queries use the phase date range.
    """
    # When phase-scoped, override date range with phase dates if not already set
    effective_from = from_date
    effective_to = to_date
    if phase_id:
        try:
            from school_year_service import SchoolYearService
            svc = SchoolYearService()
            config = svc.get_active_config(teacher_id)
            if config:
                phases = svc.list_academic_phases(config["id"])
                phase = next((p for p in phases if p["id"] == phase_id), None)
                if phase:
                    effective_from = effective_from or phase["start_date"]
                    effective_to = effective_to or phase["end_date"]
        except Exception as e:
            logger.warning(f"Failed to resolve phase dates for {phase_id}: {e}")

    return {
        "curriculum": aggregate_curriculum_data(teacher_id, effective_from, effective_to, grade_subjects, phase_id=phase_id),
        "performance": aggregate_student_performance(effective_from, effective_to, grade_subjects),
        "content": aggregate_content_creation(effective_from, effective_to, grade_subjects),
        "attendance": aggregate_attendance_engagement(effective_from, effective_to),
        "achievements": aggregate_achievement_data(teacher_id, user_id, effective_from, effective_to),
    }
