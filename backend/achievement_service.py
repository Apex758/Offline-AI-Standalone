import sqlite3
import os
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime


# ──────────────────────────────────────────────
# Data directory (same pattern as student_service)
# ──────────────────────────────────────────────

def _get_data_directory() -> Path:
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


def _get_db_path() -> str:
    return str(_get_data_directory() / 'achievements.db')


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(_get_db_path())
    conn.row_factory = sqlite3.Row
    return conn


# ──────────────────────────────────────────────
# Schema
# ──────────────────────────────────────────────

def init_db():
    conn = _get_conn()
    try:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS earned_achievements (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                teacher_id      TEXT NOT NULL,
                achievement_id  TEXT NOT NULL,
                earned_at       TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(teacher_id, achievement_id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS achievement_activity_log (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                teacher_id      TEXT NOT NULL,
                activity_date   TEXT NOT NULL,
                UNIQUE(teacher_id, activity_date)
            )
        ''')
        conn.commit()
    finally:
        conn.close()


# ──────────────────────────────────────────────
# Achievement definitions
# ──────────────────────────────────────────────

RANKS = [
    {"level": 1, "title": "Newcomer",             "required": 0},
    {"level": 2, "title": "Apprentice Teacher",    "required": 3},
    {"level": 3, "title": "Developing Educator",   "required": 7},
    {"level": 4, "title": "Proficient Instructor",  "required": 12},
    {"level": 5, "title": "Experienced Educator",   "required": 18},
    {"level": 6, "title": "Master Teacher",          "required": 24},
    {"level": 7, "title": "OECS Champion",           "required": 30},
]

RARITY_POINTS = {
    "common": 10,
    "uncommon": 25,
    "rare": 50,
    "epic": 100,
    "legendary": 200,
}

ACHIEVEMENT_DEFINITIONS: List[Dict[str, Any]] = [
    # ── Content Creation ──
    {"id": "first_lesson",        "name": "First Steps",              "description": "Create your first lesson plan",              "category": "content-creation",    "icon_name": "Notebook",            "rarity": "common",    "check_key": "lesson_plans",           "check_value": 1},
    {"id": "lesson_veteran",      "name": "Lesson Architect",         "description": "Create 10 lesson plans",                     "category": "content-creation",    "icon_name": "NoteEdit",            "rarity": "uncommon",  "check_key": "lesson_plans",           "check_value": 10},
    {"id": "quiz_creator",        "name": "Quiz Master",              "description": "Create your first quiz",                     "category": "content-creation",    "icon_name": "QuizQuestion",        "rarity": "common",    "check_key": "quizzes",                "check_value": 1},
    {"id": "quiz_prolific",       "name": "Quiz Factory",             "description": "Create 10 quizzes",                          "category": "content-creation",    "icon_name": "QuizQuestion",        "rarity": "uncommon",  "check_key": "quizzes",                "check_value": 10},
    {"id": "worksheet_first",     "name": "Sheet Starter",            "description": "Create your first worksheet",                "category": "content-creation",    "icon_name": "FileEdit",            "rarity": "common",    "check_key": "worksheets",             "check_value": 1},
    {"id": "rubric_first",        "name": "Fair Judge",               "description": "Create your first rubric",                   "category": "content-creation",    "icon_name": "TickDouble",          "rarity": "common",    "check_key": "rubrics",                "check_value": 1},
    {"id": "presentation_first",  "name": "Slide Debut",              "description": "Build your first presentation",              "category": "content-creation",    "icon_name": "PresentationBarChart","rarity": "common",    "check_key": "presentations",          "check_value": 1},

    # ── Student Management ──
    {"id": "first_student",       "name": "Roll Call",                "description": "Add your first student",                     "category": "student-management",  "icon_name": "UserAdd",             "rarity": "common",    "check_key": "students",               "check_value": 1},
    {"id": "class_builder",       "name": "Class Builder",            "description": "Add 10 students",                            "category": "student-management",  "icon_name": "UserGroup",           "rarity": "uncommon",  "check_key": "students",               "check_value": 10},
    {"id": "full_house",          "name": "Full House",               "description": "Add 30 students",                            "category": "student-management",  "icon_name": "UserMultiple",        "rarity": "rare",      "check_key": "students",               "check_value": 30},
    {"id": "multi_class",         "name": "Multi-Class Manager",      "description": "Have students in 3+ different classes",       "category": "student-management",  "icon_name": "SchoolBell",          "rarity": "rare",      "check_key": "distinct_classes",       "check_value": 3},

    # ── Assessment ──
    {"id": "first_grade",         "name": "First Mark",               "description": "Grade your first quiz",                      "category": "assessment",          "icon_name": "CheckmarkCircle",     "rarity": "common",    "check_key": "quiz_grades",            "check_value": 1},
    {"id": "grading_streak",      "name": "Grading Machine",          "description": "Grade 25 quizzes",                           "category": "assessment",          "icon_name": "TaskDone",            "rarity": "uncommon",  "check_key": "quiz_grades",            "check_value": 25},
    {"id": "worksheet_grader",    "name": "Worksheet Evaluator",      "description": "Grade 10 worksheets",                        "category": "assessment",          "icon_name": "FileCheck",           "rarity": "uncommon",  "check_key": "worksheet_grades",       "check_value": 10},
    {"id": "answer_key_master",   "name": "Key Keeper",               "description": "Create 5 answer keys",                       "category": "assessment",          "icon_name": "Key",                 "rarity": "rare",      "check_key": "answer_keys",            "check_value": 5},

    # ── Attendance & Engagement ──
    {"id": "first_attendance",    "name": "Present!",                 "description": "Record your first attendance",               "category": "attendance",          "icon_name": "Calendar",            "rarity": "common",    "check_key": "attendance_records",     "check_value": 1},
    {"id": "attendance_week",     "name": "Week Tracker",             "description": "Record attendance for 5 different dates",     "category": "attendance",          "icon_name": "CalendarCheck",       "rarity": "uncommon",  "check_key": "attendance_dates",       "check_value": 5},
    {"id": "attendance_month",    "name": "Month Monitor",            "description": "Record attendance for 20 different dates",    "category": "attendance",          "icon_name": "CalendarStar",        "rarity": "rare",      "check_key": "attendance_dates",       "check_value": 20},
    {"id": "engagement_tracker",  "name": "Engagement Expert",        "description": "Record 50+ attendance entries",               "category": "attendance",          "icon_name": "Fire",                "rarity": "epic",      "check_key": "attendance_records",     "check_value": 50},

    # ── Curriculum Progress ──
    {"id": "first_milestone",     "name": "On Track",                 "description": "Complete your first curriculum milestone",    "category": "curriculum",          "icon_name": "Flag",                "rarity": "common",    "check_key": "milestones_completed",   "check_value": 1},
    {"id": "milestone_10",        "name": "Making Progress",          "description": "Complete 10 milestones",                     "category": "curriculum",          "icon_name": "Route",               "rarity": "uncommon",  "check_key": "milestones_completed",   "check_value": 10},
    {"id": "milestone_50",        "name": "Halfway Hero",             "description": "Complete 50 milestones",                     "category": "curriculum",          "icon_name": "Medal",               "rarity": "rare",      "check_key": "milestones_completed",   "check_value": 50},
    {"id": "subject_mastery",     "name": "Subject Master",           "description": "Complete all milestones for one subject in one grade", "category": "curriculum", "icon_name": "Crown",               "rarity": "legendary", "check_key": "subject_mastery",        "check_value": 1},

    # ── Exploration ──
    {"id": "explorer",            "name": "Explorer",                 "description": "Use 5 different tool types",                 "category": "exploration",         "icon_name": "Compass",             "rarity": "common",    "check_key": "distinct_tools",         "check_value": 5},
    {"id": "trailblazer",         "name": "Trailblazer",              "description": "Use 8 different tool types",                 "category": "exploration",         "icon_name": "Map",                 "rarity": "uncommon",  "check_key": "distinct_tools",         "check_value": 8},
    {"id": "kindergarten_pioneer","name": "Early Childhood Champion", "description": "Create a kindergarten lesson plan",           "category": "exploration",         "icon_name": "Baby",                "rarity": "common",    "check_key": "kindergarten_plans",     "check_value": 1},
    {"id": "cross_curricular",    "name": "Integration Innovator",    "description": "Create a cross-curricular plan",             "category": "exploration",         "icon_name": "Link",                "rarity": "uncommon",  "check_key": "cross_curricular_plans", "check_value": 1},

    # ── Power User ──
    {"id": "content_50",          "name": "Prolific Creator",         "description": "Create 50 total resources across all types",  "category": "power-user",          "icon_name": "Star",                "rarity": "rare",      "check_key": "total_resources",        "check_value": 50},
    {"id": "content_100",         "name": "Content Machine",          "description": "Create 100 total resources",                 "category": "power-user",          "icon_name": "Trophy",              "rarity": "epic",      "check_key": "total_resources",        "check_value": 100},
    {"id": "image_creator",       "name": "Visual Designer",          "description": "Create 5 images in Image Studio",            "category": "power-user",          "icon_name": "Image",               "rarity": "uncommon",  "check_key": "images",                 "check_value": 5},
]

# Add points to each definition
for defn in ACHIEVEMENT_DEFINITIONS:
    defn["points"] = RARITY_POINTS[defn["rarity"]]


def get_definitions() -> List[Dict[str, Any]]:
    return ACHIEVEMENT_DEFINITIONS


# ──────────────────────────────────────────────
# Count helpers (lightweight queries)
# ──────────────────────────────────────────────

def _load_json_history(filename: str) -> list:
    filepath = _get_data_directory() / filename
    if not filepath.exists():
        return []
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return []


def _get_content_counts() -> Dict[str, int]:
    files_map = {
        "lesson_plans":           "lesson_plan_history.json",
        "quizzes":                "quiz_history.json",
        "worksheets":             "worksheet_history.json",
        "rubrics":                "rubric_history.json",
        "presentations":          "presentation_history.json",
        "images":                 "images_history.json",
        "kindergarten_plans":     "kindergarten_history.json",
        "multigrade_plans":       "multigrade_history.json",
        "cross_curricular_plans": "cross_curricular_history.json",
    }
    counts = {}
    for key, fname in files_map.items():
        counts[key] = len(_load_json_history(fname))

    counts["total_resources"] = sum(counts.values())

    # Distinct tool types used
    tool_types_used = sum(1 for k, v in counts.items() if k != "total_resources" and v > 0)
    counts["distinct_tools"] = tool_types_used

    return counts


def _get_student_counts() -> Dict[str, int]:
    db_path = str(_get_data_directory() / 'students.db')
    if not os.path.exists(db_path):
        return {
            "students": 0,
            "distinct_classes": 0,
            "quiz_grades": 0,
            "worksheet_grades": 0,
            "answer_keys": 0,
            "attendance_records": 0,
            "attendance_dates": 0,
        }
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        students = conn.execute("SELECT COUNT(*) as c FROM students").fetchone()["c"]
        distinct_classes = conn.execute("SELECT COUNT(DISTINCT class_name) as c FROM students WHERE class_name IS NOT NULL AND class_name != ''").fetchone()["c"]
        quiz_grades = conn.execute("SELECT COUNT(*) as c FROM quiz_grades").fetchone()["c"]
        worksheet_grades = conn.execute("SELECT COUNT(*) as c FROM worksheet_grades").fetchone()["c"]
        attendance_records = conn.execute("SELECT COUNT(*) as c FROM attendance").fetchone()["c"]
        attendance_dates = conn.execute("SELECT COUNT(DISTINCT date) as c FROM attendance").fetchone()["c"]

        # Answer keys from both tables
        quiz_keys = conn.execute("SELECT COUNT(*) as c FROM quiz_answer_keys").fetchone()["c"]
        ws_keys = conn.execute("SELECT COUNT(*) as c FROM worksheet_answer_keys").fetchone()["c"]
        answer_keys = quiz_keys + ws_keys

        return {
            "students": students,
            "distinct_classes": distinct_classes,
            "quiz_grades": quiz_grades,
            "worksheet_grades": worksheet_grades,
            "answer_keys": answer_keys,
            "attendance_records": attendance_records,
            "attendance_dates": attendance_dates,
        }
    except Exception:
        return {
            "students": 0,
            "distinct_classes": 0,
            "quiz_grades": 0,
            "worksheet_grades": 0,
            "answer_keys": 0,
            "attendance_records": 0,
            "attendance_dates": 0,
        }
    finally:
        conn.close()


def _get_milestone_counts(teacher_id: str) -> Dict[str, int]:
    db_path = str(_get_data_directory() / 'milestones.db')
    if not os.path.exists(db_path):
        return {"milestones_completed": 0, "subject_mastery": 0}
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        completed = conn.execute(
            "SELECT COUNT(*) as c FROM milestones WHERE teacher_id = ? AND status = 'completed'",
            (teacher_id,)
        ).fetchone()["c"]

        # Check if any grade+subject combo is 100% complete
        rows = conn.execute("""
            SELECT grade, subject,
                   COUNT(*) as total,
                   SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as done
            FROM milestones
            WHERE teacher_id = ?
            GROUP BY grade, subject
            HAVING total > 0
        """, (teacher_id,)).fetchall()

        subject_mastery = sum(1 for r in rows if r["done"] == r["total"])

        return {
            "milestones_completed": completed,
            "subject_mastery": subject_mastery,
        }
    except Exception:
        return {"milestones_completed": 0, "subject_mastery": 0}
    finally:
        conn.close()


# ──────────────────────────────────────────────
# Core achievement logic
# ──────────────────────────────────────────────

def _get_rank(earned_count: int) -> Dict[str, Any]:
    current_rank = RANKS[0]
    for r in RANKS:
        if earned_count >= r["required"]:
            current_rank = r
    next_rank = None
    for r in RANKS:
        if r["level"] == current_rank["level"] + 1:
            next_rank = r
            break
    return {
        "level": current_rank["level"],
        "title": current_rank["title"],
        "next_title": next_rank["title"] if next_rank else None,
        "achievements_for_next": next_rank["required"] if next_rank else None,
    }


def check_achievements(teacher_id: str) -> Dict[str, Any]:
    conn = _get_conn()
    try:
        # Log activity for today
        today = datetime.now().strftime("%Y-%m-%d")
        conn.execute(
            "INSERT OR IGNORE INTO achievement_activity_log (teacher_id, activity_date) VALUES (?, ?)",
            (teacher_id, today)
        )
        conn.commit()

        # Get already-earned
        rows = conn.execute(
            "SELECT achievement_id, earned_at FROM earned_achievements WHERE teacher_id = ?",
            (teacher_id,)
        ).fetchall()
        already_earned = {r["achievement_id"]: r["earned_at"] for r in rows}

        # Gather all counts
        counts = {}
        counts.update(_get_content_counts())
        counts.update(_get_student_counts())
        counts.update(_get_milestone_counts(teacher_id))

        # Check each unearned achievement
        newly_earned = []
        for defn in ACHIEVEMENT_DEFINITIONS:
            if defn["id"] in already_earned:
                continue
            check_key = defn["check_key"]
            check_value = defn["check_value"]
            current_value = counts.get(check_key, 0)
            if current_value >= check_value:
                now = datetime.now().isoformat()
                conn.execute(
                    "INSERT OR IGNORE INTO earned_achievements (teacher_id, achievement_id, earned_at) VALUES (?, ?, ?)",
                    (teacher_id, defn["id"], now)
                )
                newly_earned.append({
                    "achievement_id": defn["id"],
                    "earned_at": now,
                    **{k: defn[k] for k in ("name", "description", "category", "icon_name", "rarity", "points")},
                })
                already_earned[defn["id"]] = now

        conn.commit()

        # Build response
        all_earned = [
            {"achievement_id": aid, "earned_at": eat}
            for aid, eat in already_earned.items()
        ]
        total_points = sum(
            defn["points"]
            for defn in ACHIEVEMENT_DEFINITIONS
            if defn["id"] in already_earned
        )
        rank = _get_rank(len(all_earned))

        # Category breakdown
        by_category: Dict[str, Dict[str, int]] = {}
        for defn in ACHIEVEMENT_DEFINITIONS:
            cat = defn["category"]
            if cat not in by_category:
                by_category[cat] = {"earned": 0, "total": 0}
            by_category[cat]["total"] += 1
            if defn["id"] in already_earned:
                by_category[cat]["earned"] += 1

        # Progress for unearned achievements
        progress = {}
        for defn in ACHIEVEMENT_DEFINITIONS:
            if defn["id"] not in already_earned:
                current = counts.get(defn["check_key"], 0)
                progress[defn["id"]] = {
                    "current": min(current, defn["check_value"]),
                    "target": defn["check_value"],
                }

        return {
            "newly_earned": newly_earned,
            "all_earned": all_earned,
            "total_points": total_points,
            "rank": rank,
            "by_category": by_category,
            "progress": progress,
            "total_available": len(ACHIEVEMENT_DEFINITIONS),
        }
    finally:
        conn.close()


def get_earned_achievements(teacher_id: str) -> Dict[str, Any]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            "SELECT achievement_id, earned_at FROM earned_achievements WHERE teacher_id = ?",
            (teacher_id,)
        ).fetchall()
        all_earned = [{"achievement_id": r["achievement_id"], "earned_at": r["earned_at"]} for r in rows]
        earned_ids = {r["achievement_id"] for r in rows}

        total_points = sum(
            defn["points"]
            for defn in ACHIEVEMENT_DEFINITIONS
            if defn["id"] in earned_ids
        )
        rank = _get_rank(len(all_earned))

        by_category: Dict[str, Dict[str, int]] = {}
        for defn in ACHIEVEMENT_DEFINITIONS:
            cat = defn["category"]
            if cat not in by_category:
                by_category[cat] = {"earned": 0, "total": 0}
            by_category[cat]["total"] += 1
            if defn["id"] in earned_ids:
                by_category[cat]["earned"] += 1

        return {
            "all_earned": all_earned,
            "total_points": total_points,
            "rank": rank,
            "by_category": by_category,
            "total_available": len(ACHIEVEMENT_DEFINITIONS),
        }
    finally:
        conn.close()
