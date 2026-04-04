"""
Teacher Metrics Service — Composite scoring system for teaching effectiveness.

Derives 5 dimension scores (0–100) entirely from existing app activity data,
applies phase-aware dynamic weighting from the school calendar, and produces
a composite score mapped to letter grades (A+ through F).

Dimensions:
  - Curriculum: milestone completion rates
  - Performance: student assessment quality
  - Content: resource creation activity
  - Attendance: attendance rates + engagement
  - Achievements: platform engagement + streaks
"""

import sqlite3
import uuid
import os
import math
import json
import logging
from pathlib import Path
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


# ── Data directory + DB path ─────────────────────────────────────────────────

def _get_data_directory() -> Path:
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


def _get_db_path() -> str:
    return str(_get_data_directory() / 'teacher.db')


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(_get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _init_db():
    conn = _get_conn()
    try:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS teacher_metric_snapshots (
                id              TEXT PRIMARY KEY,
                teacher_id      TEXT NOT NULL,
                computed_at     TEXT NOT NULL,
                phase           TEXT NOT NULL,
                composite_score REAL NOT NULL,
                composite_grade TEXT NOT NULL,
                curriculum_score  REAL,
                performance_score REAL,
                content_score     REAL,
                attendance_score  REAL,
                achievements_score REAL,
                weights_json    TEXT,
                phase_label     TEXT,
                UNIQUE(teacher_id, computed_at)
            );

            CREATE INDEX IF NOT EXISTS idx_tms_teacher
            ON teacher_metric_snapshots(teacher_id, computed_at);

            CREATE TABLE IF NOT EXISTS consultant_conversations (
                id              TEXT PRIMARY KEY,
                teacher_id      TEXT NOT NULL,
                title           TEXT,
                dimension_focus TEXT,
                summary         TEXT DEFAULT '',
                summary_msg_count INTEGER DEFAULT 0,
                created_at      TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at      TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS consultant_messages (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                chat_id     TEXT NOT NULL,
                msg_id      TEXT NOT NULL,
                role        TEXT NOT NULL,
                content     TEXT NOT NULL,
                timestamp   TEXT NOT NULL,
                FOREIGN KEY (chat_id) REFERENCES consultant_conversations(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_cm_chat_id
            ON consultant_messages(chat_id);
        """)
        conn.commit()
    finally:
        conn.close()


# Initialize tables on import
_init_db()


# ── Letter grade scale ───────────────────────────────────────────────────────

def score_to_grade(score: float) -> str:
    """Map a 0–100 score to a letter grade."""
    if score >= 97: return "A+"
    if score >= 93: return "A"
    if score >= 90: return "A-"
    if score >= 87: return "B+"
    if score >= 83: return "B"
    if score >= 80: return "B-"
    if score >= 77: return "C+"
    if score >= 73: return "C"
    if score >= 70: return "C-"
    if score >= 60: return "D"
    return "F"


# ── Phase detection ──────────────────────────────────────────────────────────

PHASE_WEIGHT_PROFILES = {
    "start_of_year":  {"curriculum": 0.30, "content": 0.30, "performance": 0.10, "attendance": 0.15, "achievements": 0.15},
    "early_year":     {"curriculum": 0.25, "content": 0.25, "performance": 0.15, "attendance": 0.20, "achievements": 0.15},
    "mid_year":       {"curriculum": 0.20, "content": 0.20, "performance": 0.25, "attendance": 0.20, "achievements": 0.15},
    "pre_exam":       {"curriculum": 0.15, "content": 0.25, "performance": 0.30, "attendance": 0.15, "achievements": 0.15},
    "exam_period":    {"curriculum": 0.10, "content": 0.10, "performance": 0.40, "attendance": 0.20, "achievements": 0.20},
    "post_exam":      {"curriculum": 0.15, "content": 0.15, "performance": 0.35, "attendance": 0.15, "achievements": 0.20},
    "vacation":       {"curriculum": 0.30, "content": 0.30, "performance": 0.05, "attendance": 0.05, "achievements": 0.30},
    "reopening":      {"curriculum": 0.30, "content": 0.25, "performance": 0.10, "attendance": 0.25, "achievements": 0.10},
}

PHASE_LABELS = {
    "start_of_year": "Start of Year",
    "early_year": "Early Year",
    "mid_year": "Mid-Year",
    "pre_exam": "Pre-Exam",
    "exam_period": "Exam Period",
    "post_exam": "Post-Exam",
    "vacation": "Vacation",
    "reopening": "Reopening",
}

EQUAL_WEIGHTS = {"curriculum": 0.20, "content": 0.20, "performance": 0.20, "attendance": 0.20, "achievements": 0.20}


def detect_school_phase(teacher_id: str) -> dict:
    """Determine current academic phase from the school calendar.

    Returns: {phase, phase_label, next_event, days_until, weights}
    """
    try:
        import school_year_service
        config = school_year_service.get_active_config(teacher_id)
    except Exception:
        config = None

    if not config:
        return {
            "phase": "mid_year",
            "phase_label": "Mid-Year (no calendar)",
            "next_event": None,
            "days_until": None,
            "weights": EQUAL_WEIGHTS,
        }

    today = datetime.now().date()
    start_date = datetime.fromisoformat(config["start_date"]).date()
    end_date = datetime.fromisoformat(config["end_date"]).date()

    # Load events for this config
    try:
        events = school_year_service.list_events(config["id"])
    except Exception:
        events = []

    # Parse exam/midterm events
    exam_events = []
    for evt in events:
        etype = (evt.get("event_type") or "").lower()
        if etype in ("exam", "midterm"):
            evt_start = datetime.fromisoformat(evt["event_date"]).date()
            evt_end = datetime.fromisoformat(evt["end_date"]).date() if evt.get("end_date") else evt_start
            exam_events.append({"title": evt["title"], "start": evt_start, "end": evt_end})

    # Sort exam events by start date
    exam_events.sort(key=lambda e: e["start"])

    # Find next upcoming event (any type) for context
    next_event = None
    days_until = None
    for evt in sorted(events, key=lambda e: e.get("event_date", "")):
        evt_date = datetime.fromisoformat(evt["event_date"]).date()
        if evt_date >= today:
            next_event = evt.get("title")
            days_until = (evt_date - today).days
            break

    # Priority-based phase detection
    phase = _detect_phase_priority(today, start_date, end_date, exam_events)

    return {
        "phase": phase,
        "phase_label": PHASE_LABELS.get(phase, phase),
        "next_event": next_event,
        "days_until": days_until,
        "weights": PHASE_WEIGHT_PROFILES.get(phase, EQUAL_WEIGHTS),
    }


def _detect_phase_priority(today, start_date, end_date, exam_events) -> str:
    """Apply phase detection with priority: exam_period > pre_exam > post_exam > vacation > positional."""
    # Vacation: before start or after end
    if today < start_date or today > end_date:
        return "vacation"

    # Check exam-related phases (highest priority)
    for exam in exam_events:
        # During exam
        if exam["start"] <= today <= exam["end"]:
            return "exam_period"
        # Pre-exam: 2 weeks before exam start
        pre_exam_start = exam["start"] - timedelta(days=14)
        if pre_exam_start <= today < exam["start"]:
            return "pre_exam"
        # Post-exam: 2 weeks after exam end
        post_exam_end = exam["end"] + timedelta(days=14)
        if exam["end"] < today <= post_exam_end:
            return "post_exam"

    # Positional phases based on weeks since start
    days_in = (today - start_date).days
    total_days = (end_date - start_date).days or 1

    # Check for reopening: first 2 weeks of a new term after a break
    # (simplified: check if within first 2 weeks after any post_exam period ended)
    # For now, use positional detection

    if days_in <= 28:  # First 4 weeks
        return "start_of_year"
    if days_in <= 56:  # Weeks 5-8
        return "early_year"

    # Default middle portion
    return "mid_year"


# ── Dimension scoring ────────────────────────────────────────────────────────

def compute_dimension_score(dimension: str, data: dict, phase: str) -> dict:
    """Compute a single dimension score (0–100) from aggregated data.

    Returns: {score, grade, weight, weighted_score, description, components[], tips[]}
    """
    weights = PHASE_WEIGHT_PROFILES.get(phase, EQUAL_WEIGHTS)
    weight = weights.get(dimension, 0.20)

    if dimension == "curriculum":
        score, components = _score_curriculum(data)
        description = "How thoroughly you're covering curriculum milestones"
    elif dimension == "performance":
        score, components = _score_performance(data)
        description = "How well your students are performing on assessments"
    elif dimension == "content":
        score, components = _score_content(data)
        description = "How actively and diversely you're creating teaching resources"
    elif dimension == "attendance":
        score, components = _score_attendance(data)
        description = "How consistently your students are attending and engaging"
    elif dimension == "achievements":
        score, components = _score_achievements(data)
        description = "How actively you're engaging with the platform and earning achievements"
    else:
        score, components = 0, []
        description = "Unknown dimension"

    score = min(100, max(0, round(score, 1)))
    grade = score_to_grade(score)
    tips = get_phase_tips(dimension, score, phase)

    return {
        "score": score,
        "grade": grade,
        "weight": weight,
        "weighted_score": round(score * weight, 1),
        "description": description,
        "components": components,
        "tips": tips,
    }


def _score_curriculum(data: dict) -> tuple[float, list]:
    """Curriculum: completion_pct + (5 if no gaps) + min(10, period_completed * 2)"""
    if not data.get("has_data"):
        return 0, []

    pct = data.get("pct", 0)
    gaps = data.get("gaps", [])
    period_completed = data.get("periodCompleted", 0)

    base = pct
    gap_bonus = 5 if not gaps else 0
    period_bonus = min(10, period_completed * 2)
    total = min(100, base + gap_bonus + period_bonus)

    components = [
        {"label": "Completion rate", "value": round(pct, 1), "max": 100},
        {"label": "No curriculum gaps", "value": gap_bonus, "max": 5},
        {"label": "Recent completions", "value": period_bonus, "max": 10},
    ]
    return total, components


def _score_performance(data: dict) -> tuple[float, list]:
    """Performance: avgScore * 0.5 + distribution_quality * 0.3 + grading_frequency * 0.2"""
    if not data.get("has_data"):
        return 0, []

    avg_score = data.get("avgScore", 0)
    distribution = data.get("distribution", {})
    period_assessments = data.get("periodAssessments", 0)

    # Distribution quality: penalize heavy F-skew, reward balanced A/B
    total_grades = sum(distribution.values()) or 1
    f_ratio = distribution.get("F", 0) / total_grades
    ab_ratio = (distribution.get("A", 0) + distribution.get("B", 0)) / total_grades
    dist_quality = max(0, min(100, (ab_ratio * 80) - (f_ratio * 40) + 20))

    # Grading frequency: rewards consistent assessment activity
    freq_score = min(100, period_assessments * 5)

    total = avg_score * 0.5 + dist_quality * 0.3 + freq_score * 0.2

    components = [
        {"label": "Average score", "value": round(avg_score, 1), "max": 100},
        {"label": "Grade distribution quality", "value": round(dist_quality, 1), "max": 100},
        {"label": "Grading frequency", "value": round(freq_score, 1), "max": 100},
    ]
    return total, components


def _score_content(data: dict) -> tuple[float, list]:
    """Content: min(100, log2(totalResources+1) * 15 + type_variety_pct * 20 + recency_bonus * 20)"""
    if not data.get("has_data"):
        return 0, []

    total_resources = data.get("totalResources", 0)
    by_type = data.get("byType", {})
    recent_7d = data.get("recent7d", 0)
    recent_30d = data.get("recent30d", 0)

    # Volume score using log scale
    volume = math.log2(total_resources + 1) * 15

    # Type variety: fraction of 9 content types used
    types_used = sum(1 for v in by_type.values() if v > 0)
    type_variety_pct = types_used / 9
    variety = type_variety_pct * 20

    # Recency bonus: scaled from recent activity
    recency = 0
    if recent_7d > 0:
        recency = min(1.0, recent_7d / 5) * 12  # Up to 12 points for weekly activity
    if recent_30d > 0:
        recency += min(1.0, recent_30d / 15) * 8  # Up to 8 points for monthly activity

    total = min(100, volume + variety + recency)

    components = [
        {"label": "Resource volume", "value": round(volume, 1), "max": 60},
        {"label": "Type variety", "value": round(variety, 1), "max": 20},
        {"label": "Recent activity", "value": round(recency, 1), "max": 20},
    ]
    return total, components


def _score_attendance(data: dict) -> tuple[float, list]:
    """Attendance: avgRate * 0.6 + (100 - atRisk_penalty) * 0.25 + engagement_quality * 0.15"""
    if not data.get("has_data"):
        return 0, []

    avg_rate = data.get("avgRate", 0)
    at_risk_count = data.get("atRiskCount", 0)

    # At-risk penalty: scales with count (more at-risk students = bigger penalty)
    at_risk_penalty = min(100, at_risk_count * 15)
    at_risk_component = 100 - at_risk_penalty

    # Engagement quality: proportion of high-engagement records
    engagement_dist = data.get("engagementDistribution", {})
    total_eng = sum(engagement_dist.values()) or 1
    high_eng = engagement_dist.get("High", 0) + engagement_dist.get("Very High", 0)
    engagement_quality = (high_eng / total_eng) * 100

    total = avg_rate * 0.6 + at_risk_component * 0.25 + engagement_quality * 0.15

    components = [
        {"label": "Attendance rate", "value": round(avg_rate, 1), "max": 100},
        {"label": "Low at-risk students", "value": round(at_risk_component, 1), "max": 100},
        {"label": "Engagement quality", "value": round(engagement_quality, 1), "max": 100},
    ]
    return total, components


def _score_achievements(data: dict) -> tuple[float, list]:
    """Achievements: earned_pct * 0.4 + streak_score * 0.3 + active_days_score * 0.3"""
    if not data.get("has_data"):
        return 0, []

    total_earned = data.get("totalEarned", 0)
    total_available = data.get("totalAvailable", 1) or 1
    streak_days = data.get("streakDays", 0)
    total_active_days = data.get("totalActiveDays", 0)

    earned_pct = (total_earned / total_available) * 100
    streak_score = min(100, math.log2(streak_days + 1) * 25)
    active_days_score = min(100, math.log2(total_active_days + 1) * 20)

    total = earned_pct * 0.4 + streak_score * 0.3 + active_days_score * 0.3

    components = [
        {"label": "Achievements earned", "value": round(earned_pct, 1), "max": 100},
        {"label": "Streak score", "value": round(streak_score, 1), "max": 100},
        {"label": "Active days score", "value": round(active_days_score, 1), "max": 100},
    ]
    return total, components


# ── Phase-aware tips ─────────────────────────────────────────────────────────

def get_phase_tips(dimension: str, score: float, phase: str) -> list[str]:
    """Return 1–3 actionable improvement tips based on dimension, score, and phase."""
    tips = []

    if dimension == "curriculum":
        if score < 50:
            tips.append("Focus on completing milestones for your highest-priority subjects first.")
        if score < 70:
            tips.append("Review curriculum gaps — subjects under 20% completion need attention.")
        if phase in ("pre_exam", "exam_period"):
            tips.append("During exam season, ensure tested topics have completed milestones.")
        if phase == "start_of_year":
            tips.append("Great time to plan your curriculum roadmap for the year ahead.")
        if score >= 90:
            tips.append("Excellent coverage! Consider mentoring colleagues on curriculum planning.")

    elif dimension == "performance":
        if score < 50:
            tips.append("Consider reviewing assessment difficulty — a high F-rate may indicate misalignment.")
        if score < 70:
            tips.append("Try targeted review sessions for students scoring below 60%.")
        if phase in ("pre_exam", "exam_period"):
            tips.append("Run practice assessments to identify gaps before the actual exam.")
        if phase == "post_exam":
            tips.append("Analyze exam results to identify topics that need re-teaching.")
        if score >= 90:
            tips.append("Strong student performance! Share your assessment strategies with peers.")

    elif dimension == "content":
        if score < 50:
            tips.append("Try creating at least 2–3 resources per week to build your library.")
        if score < 70:
            tips.append("Diversify your content types — quizzes, worksheets, and presentations each serve different learning needs.")
        if phase == "start_of_year":
            tips.append("Build a resource bank now so you're prepared for the busy mid-year period.")
        if phase == "vacation":
            tips.append("Use the break to prepare resources for the upcoming term.")
        if score >= 90:
            tips.append("Impressive content creation! Your resource diversity is a strength.")

    elif dimension == "attendance":
        if score < 50:
            tips.append("Reach out to at-risk students and their families about attendance patterns.")
        if score < 70:
            tips.append("Consider engagement-boosting activities to improve attendance.")
        if phase == "reopening":
            tips.append("After a break, establish strong attendance routines early.")
        if phase == "mid_year":
            tips.append("Mid-year is when attendance often dips — stay proactive with follow-ups.")
        if score >= 90:
            tips.append("Great attendance rates! Your classroom environment clearly engages students.")

    elif dimension == "achievements":
        if score < 50:
            tips.append("Explore different features of the platform to unlock new achievements.")
        if score < 70:
            tips.append("Try to maintain a daily activity streak for consistent engagement.")
        if phase == "vacation":
            tips.append("Use the break to explore platform features you haven't tried yet.")
        if score >= 90:
            tips.append("You're a platform power user! Keep up the great engagement.")

    # Limit to 3 tips
    return tips[:3]


# ── Composite score computation ──────────────────────────────────────────────

def compute_composite_score(teacher_id: str, aggregated_data: dict = None) -> dict:
    """Compute all dimension scores + weighted composite.

    Args:
        teacher_id: Teacher identifier for phase detection
        aggregated_data: Pre-computed aggregation from insights_service.aggregate_all().
                        If None, will call aggregate_all() fresh.

    Returns: {composite_score, composite_grade, phase{}, dimensions{}, computed_at}
    """
    # Get aggregated data if not provided
    if aggregated_data is None:
        import insights_service
        aggregated_data = insights_service.aggregate_all(teacher_id)

    # Detect school phase
    phase_info = detect_school_phase(teacher_id)
    phase = phase_info["phase"]

    # Compute each dimension
    dimensions = {}
    for dim_key in ["curriculum", "performance", "content", "attendance", "achievements"]:
        dim_data = aggregated_data.get(dim_key, {})
        dimensions[dim_key] = compute_dimension_score(dim_key, dim_data, phase)

    # Compute weighted composite
    composite = sum(d["weighted_score"] for d in dimensions.values())
    composite = min(100, max(0, round(composite, 1)))
    composite_grade = score_to_grade(composite)

    return {
        "composite_score": composite,
        "composite_grade": composite_grade,
        "phase": {
            "phase": phase_info["phase"],
            "phase_label": phase_info["phase_label"],
            "next_event": phase_info["next_event"],
            "days_until": phase_info["days_until"],
        },
        "dimensions": dimensions,
        "computed_at": datetime.now().isoformat(),
    }


# ── Snapshot persistence ─────────────────────────────────────────────────────

def save_metric_snapshot(teacher_id: str, snapshot: dict) -> None:
    """Persist a metric snapshot to the database."""
    conn = _get_conn()
    try:
        snapshot_id = str(uuid.uuid4())
        computed_at = snapshot.get("computed_at", datetime.now().isoformat())
        phase = snapshot.get("phase", {}).get("phase", "mid_year")
        phase_label = snapshot.get("phase", {}).get("phase_label", "")
        dims = snapshot.get("dimensions", {})

        weights = {}
        for dim_key, dim_data in dims.items():
            weights[dim_key] = dim_data.get("weight", 0.20)

        conn.execute("""
            INSERT OR REPLACE INTO teacher_metric_snapshots
            (id, teacher_id, computed_at, phase, composite_score, composite_grade,
             curriculum_score, performance_score, content_score, attendance_score,
             achievements_score, weights_json, phase_label)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            snapshot_id,
            teacher_id,
            computed_at,
            phase,
            snapshot.get("composite_score", 0),
            snapshot.get("composite_grade", "F"),
            dims.get("curriculum", {}).get("score", 0),
            dims.get("performance", {}).get("score", 0),
            dims.get("content", {}).get("score", 0),
            dims.get("attendance", {}).get("score", 0),
            dims.get("achievements", {}).get("score", 0),
            json.dumps(weights),
            phase_label,
        ))
        conn.commit()
    except Exception as e:
        logger.error(f"Failed to save metric snapshot: {e}")
    finally:
        conn.close()


def get_metric_history(teacher_id: str, limit: int = 50) -> list[dict]:
    """Retrieve historical metric snapshots for the timeline graph."""
    conn = _get_conn()
    try:
        rows = conn.execute("""
            SELECT id, teacher_id, computed_at, phase, phase_label,
                   composite_score, composite_grade,
                   curriculum_score, performance_score, content_score,
                   attendance_score, achievements_score, weights_json
            FROM teacher_metric_snapshots
            WHERE teacher_id = ?
            ORDER BY computed_at ASC
            LIMIT ?
        """, (teacher_id, limit)).fetchall()
        return [dict(r) for r in rows]
    except Exception as e:
        logger.error(f"Failed to get metric history: {e}")
        return []
    finally:
        conn.close()
