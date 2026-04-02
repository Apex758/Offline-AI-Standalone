import sqlite3
import os
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta


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
    {"level": 2, "title": "Apprentice Teacher",    "required": 5},
    {"level": 3, "title": "Developing Educator",   "required": 12},
    {"level": 4, "title": "Proficient Instructor",  "required": 22},
    {"level": 5, "title": "Experienced Educator",   "required": 33},
    {"level": 6, "title": "Master Teacher",          "required": 45},
    {"level": 7, "title": "OECS Champion",           "required": 55},
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

    # ── Chat / Ask PEARL ──
    {"id": "first_chat",          "name": "Hello PEARL",              "description": "Start your first conversation with PEARL",   "category": "chat",                "icon_name": "Chat",                "rarity": "common",    "check_key": "chat_conversations",     "check_value": 1},
    {"id": "chat_regular",        "name": "Regular Chatter",          "description": "Have 10 conversations with PEARL",           "category": "chat",                "icon_name": "Chat",                "rarity": "uncommon",  "check_key": "chat_conversations",     "check_value": 10},
    {"id": "chat_messages_50",    "name": "Curious Mind",             "description": "Send 50 messages to PEARL",                  "category": "chat",                "icon_name": "MessageEdit",         "rarity": "rare",      "check_key": "chat_messages",          "check_value": 50},
    {"id": "chat_messages_200",   "name": "Deep Thinker",             "description": "Send 200 messages to PEARL",                 "category": "chat",                "icon_name": "MessageEdit",         "rarity": "epic",      "check_key": "chat_messages",          "check_value": 200},

    # ── Brain Dump ──
    {"id": "first_brain_dump",    "name": "Brain Unleashed",          "description": "Use Brain Dump for the first time",          "category": "brain-dump",          "icon_name": "Brain",               "rarity": "common",    "check_key": "brain_dump_uses",        "check_value": 1},
    {"id": "brain_dump_10",       "name": "Thought Machine",          "description": "Use Brain Dump 10 times",                    "category": "brain-dump",          "icon_name": "Brain",               "rarity": "uncommon",  "check_key": "brain_dump_uses",        "check_value": 10},
    {"id": "brain_dump_actions",  "name": "Ideas Into Action",        "description": "Generate 25 actions from Brain Dump",         "category": "brain-dump",          "icon_name": "Lightbulb",           "rarity": "rare",      "check_key": "brain_dump_actions",     "check_value": 25},

    # ── Resource Manager ──
    {"id": "resource_saver_10",   "name": "Resource Collector",       "description": "Save 10 resources across all types",          "category": "exploration",         "icon_name": "Bookmark",            "rarity": "common",    "check_key": "total_resources",        "check_value": 10},
    {"id": "resource_saver_25",   "name": "Resource Curator",         "description": "Save 25 resources across all types",          "category": "exploration",         "icon_name": "Bookmark",            "rarity": "uncommon",  "check_key": "total_resources",        "check_value": 25},

    # ── Multigrade Planner ──
    {"id": "multigrade_first",    "name": "Multi-Level Maestro",      "description": "Create your first multigrade plan",           "category": "exploration",         "icon_name": "Layers",              "rarity": "common",    "check_key": "multigrade_plans",       "check_value": 1},
    {"id": "multigrade_5",        "name": "Combined Class Pro",       "description": "Create 5 multigrade plans",                   "category": "exploration",         "icon_name": "Layers",              "rarity": "uncommon",  "check_key": "multigrade_plans",       "check_value": 5},

    # ── Scan Grading ──
    {"id": "first_scan_grade",    "name": "Scan & Score",             "description": "Grade your first scanned assignment",         "category": "assessment",          "icon_name": "ScanQr",              "rarity": "common",    "check_key": "scan_grades",            "check_value": 1},
    {"id": "scan_grader_20",      "name": "Scanning Expert",          "description": "Grade 20 scanned assignments",                "category": "assessment",          "icon_name": "ScanQr",              "rarity": "rare",      "check_key": "scan_grades",            "check_value": 20},

    # ── Streaks / Consistency ──
    {"id": "streak_3",            "name": "Getting Started",          "description": "Use the app 3 days in a row",                 "category": "power-user",          "icon_name": "Fire",                "rarity": "common",    "check_key": "streak_days",            "check_value": 3},
    {"id": "streak_7",            "name": "Weekly Warrior",           "description": "Use the app 7 days in a row",                 "category": "power-user",          "icon_name": "Fire",                "rarity": "uncommon",  "check_key": "streak_days",            "check_value": 7},
    {"id": "streak_30",           "name": "Monthly Marathoner",       "description": "Use the app 30 days in a row",                "category": "power-user",          "icon_name": "Fire",                "rarity": "epic",      "check_key": "streak_days",            "check_value": 30},
    {"id": "active_days_50",      "name": "Dedicated Educator",       "description": "Use the app on 50 different days",            "category": "power-user",          "icon_name": "Calendar",            "rarity": "rare",      "check_key": "total_active_days",      "check_value": 50},
    {"id": "active_days_100",     "name": "Unstoppable",              "description": "Use the app on 100 different days",            "category": "power-user",          "icon_name": "Calendar",            "rarity": "legendary", "check_key": "total_active_days",      "check_value": 100},

    # ── Analytics ──
    {"id": "first_analytics",     "name": "Data Curious",             "description": "Generate your first AI response (tracked by metrics)", "category": "analytics",   "icon_name": "Chart",               "rarity": "common",    "check_key": "total_generations",      "check_value": 1},
    {"id": "analytics_100",       "name": "Power Generator",          "description": "Generate 100 AI responses",                   "category": "analytics",           "icon_name": "Chart",               "rarity": "uncommon",  "check_key": "total_generations",      "check_value": 100},
    {"id": "analytics_500",       "name": "AI Powerhouse",            "description": "Generate 500 AI responses",                   "category": "analytics",           "icon_name": "Chart",               "rarity": "rare",      "check_key": "total_generations",      "check_value": 500},
    {"id": "image_gen_first",     "name": "First Pixel",              "description": "Generate your first AI image",                "category": "analytics",           "icon_name": "Image",               "rarity": "common",    "check_key": "total_image_generations","check_value": 1},
    {"id": "image_gen_25",        "name": "Visual Virtuoso",          "description": "Generate 25 AI images",                       "category": "analytics",           "icon_name": "Image",               "rarity": "rare",      "check_key": "total_image_generations","check_value": 25},

    # ── Hidden / Secret Achievements ──
    {"id": "night_owl",           "name": "Night Owl",                "description": "Use the app after 10 PM",                    "category": "power-user",          "icon_name": "Moon",                "rarity": "uncommon",  "check_key": "used_after_10pm",        "check_value": 1, "hidden": True},
    {"id": "early_bird",          "name": "Early Bird",               "description": "Use the app before 6 AM",                    "category": "power-user",          "icon_name": "Sun",                 "rarity": "uncommon",  "check_key": "used_before_6am",        "check_value": 1, "hidden": True},
    {"id": "marathon_planner",    "name": "Marathon Planner",         "description": "Spend a session creating 5+ resources",       "category": "power-user",          "icon_name": "Timer",               "rarity": "rare",      "check_key": "resources_in_session",   "check_value": 5, "hidden": True},
    {"id": "variety_pack",        "name": "Variety Pack",             "description": "Create 4 different resource types in one day","category": "exploration",          "icon_name": "Shuffle",             "rarity": "rare",      "check_key": "types_today",            "check_value": 4, "hidden": True},
    {"id": "perfectionist",       "name": "Perfectionist",           "description": "Edit a lesson plan 5 or more times",          "category": "content-creation",    "icon_name": "Edit",                "rarity": "uncommon",  "check_key": "lesson_edits_max",       "check_value": 5, "hidden": True},
    {"id": "century",             "name": "The Century",              "description": "Earn 100 total achievement points",           "category": "power-user",          "icon_name": "Diamond",             "rarity": "rare",      "check_key": "total_achievement_pts",  "check_value": 100, "hidden": True},
    {"id": "half_thousand",       "name": "Half a Thousand",          "description": "Earn 500 total achievement points",           "category": "power-user",          "icon_name": "Diamond",             "rarity": "epic",      "check_key": "total_achievement_pts",  "check_value": 500, "hidden": True},
]

# ── Achievement Collections (sets of related achievements) ──
ACHIEVEMENT_COLLECTIONS: List[Dict[str, Any]] = [
    {
        "id": "content_master",
        "name": "Content Master",
        "description": "Earn all Content Creation achievements",
        "category": "content-creation",
        "achievement_ids": ["first_lesson", "lesson_veteran", "quiz_creator", "quiz_prolific", "worksheet_first", "rubric_first", "presentation_first"],
    },
    {
        "id": "assessment_guru",
        "name": "Assessment Guru",
        "description": "Earn all Assessment achievements",
        "category": "assessment",
        "achievement_ids": ["first_grade", "grading_streak", "worksheet_grader", "answer_key_master", "first_scan_grade", "scan_grader_20"],
    },
    {
        "id": "student_champion",
        "name": "Student Champion",
        "description": "Earn all Student Management achievements",
        "category": "student-management",
        "achievement_ids": ["first_student", "class_builder", "full_house", "multi_class"],
    },
    {
        "id": "attendance_pro",
        "name": "Attendance Pro",
        "description": "Earn all Attendance achievements",
        "category": "attendance",
        "achievement_ids": ["first_attendance", "attendance_week", "attendance_month", "engagement_tracker"],
    },
    {
        "id": "curriculum_scholar",
        "name": "Curriculum Scholar",
        "description": "Earn all Curriculum achievements",
        "category": "curriculum",
        "achievement_ids": ["first_milestone", "milestone_10", "milestone_50", "subject_mastery"],
    },
    {
        "id": "pearl_companion",
        "name": "PEARL Companion",
        "description": "Earn all Ask PEARL achievements",
        "category": "chat",
        "achievement_ids": ["first_chat", "chat_regular", "chat_messages_50", "chat_messages_200"],
    },
    {
        "id": "explorer_supreme",
        "name": "Explorer Supreme",
        "description": "Earn all Exploration achievements",
        "category": "exploration",
        "achievement_ids": ["explorer", "trailblazer", "kindergarten_pioneer", "cross_curricular", "multigrade_first", "multigrade_5", "resource_saver_10", "resource_saver_25"],
    },
]

# ── Tier groups for visual tiering ──
TIER_GROUPS: Dict[str, List[Dict[str, Any]]] = {
    "lesson_plans":     [{"id": "first_lesson",    "tier": "bronze"}, {"id": "lesson_veteran",  "tier": "silver"}],
    "quizzes":          [{"id": "quiz_creator",     "tier": "bronze"}, {"id": "quiz_prolific",   "tier": "silver"}],
    "students":         [{"id": "first_student",    "tier": "bronze"}, {"id": "class_builder",   "tier": "silver"}, {"id": "full_house",       "tier": "gold"}],
    "milestones":       [{"id": "first_milestone",  "tier": "bronze"}, {"id": "milestone_10",    "tier": "silver"}, {"id": "milestone_50",     "tier": "gold"}],
    "attendance":       [{"id": "first_attendance", "tier": "bronze"}, {"id": "attendance_week",  "tier": "silver"}, {"id": "attendance_month", "tier": "gold"}, {"id": "engagement_tracker", "tier": "diamond"}],
    "resources":        [{"id": "resource_saver_10","tier": "bronze"}, {"id": "resource_saver_25","tier": "silver"}, {"id": "content_50",       "tier": "gold"}, {"id": "content_100",        "tier": "diamond"}],
    "chat":             [{"id": "first_chat",       "tier": "bronze"}, {"id": "chat_regular",     "tier": "silver"}, {"id": "chat_messages_50", "tier": "gold"}, {"id": "chat_messages_200",  "tier": "diamond"}],
    "streak":           [{"id": "streak_3",         "tier": "bronze"}, {"id": "streak_7",         "tier": "silver"}, {"id": "streak_30",        "tier": "gold"}],
    "active_days":      [{"id": "active_days_50",   "tier": "bronze"}, {"id": "active_days_100",  "tier": "silver"}],
    "generations":      [{"id": "first_analytics",  "tier": "bronze"}, {"id": "analytics_100",    "tier": "silver"}, {"id": "analytics_500",    "tier": "gold"}],
}

# Build lookup maps: achievement_id -> tier_group, tier
_TIER_LOOKUP: Dict[str, Dict[str, str]] = {}
for group_name, tiers in TIER_GROUPS.items():
    for entry in tiers:
        _TIER_LOOKUP[entry["id"]] = {"tier_group": group_name, "tier": entry["tier"]}

# Add points, hidden flag, tier info to each definition
for defn in ACHIEVEMENT_DEFINITIONS:
    defn["points"] = RARITY_POINTS[defn["rarity"]]
    if "hidden" not in defn:
        defn["hidden"] = False
    tier_info = _TIER_LOOKUP.get(defn["id"])
    if tier_info:
        defn["tier_group"] = tier_info["tier_group"]
        defn["tier"] = tier_info["tier"]
    else:
        defn["tier"] = "gold"


def get_definitions() -> List[Dict[str, Any]]:
    """Return definitions — hidden ones are included but with name/description masked if not earned."""
    return ACHIEVEMENT_DEFINITIONS


def get_collections() -> List[Dict[str, Any]]:
    return ACHIEVEMENT_COLLECTIONS


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


def _get_chat_counts() -> Dict[str, int]:
    """Count conversations and messages from chat_memory.db."""
    db_path = str(_get_data_directory() / 'chat_memory.db')
    if not os.path.exists(db_path):
        return {"chat_conversations": 0, "chat_messages": 0}
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        conversations = conn.execute("SELECT COUNT(*) as c FROM chats").fetchone()["c"]
        messages = conn.execute("SELECT COUNT(*) as c FROM messages WHERE role = 'user'").fetchone()["c"]
        return {"chat_conversations": conversations, "chat_messages": messages}
    except Exception:
        return {"chat_conversations": 0, "chat_messages": 0}
    finally:
        conn.close()


def _get_brain_dump_counts() -> Dict[str, int]:
    """Count brain dump uses from metrics (task_type = 'brain-dump')."""
    db_path = str(_get_data_directory() / 'metrics.db')
    if not os.path.exists(db_path):
        return {"brain_dump_uses": 0, "brain_dump_actions": 0}
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        # Each brain-dump generation counts as a use
        uses = conn.execute(
            "SELECT COUNT(*) as c FROM inference_metrics WHERE task_type = 'brain-dump'"
        ).fetchone()["c"]
        # Action generations are separate brain-dump calls (approximated by total)
        actions = conn.execute(
            "SELECT COUNT(*) as c FROM inference_metrics WHERE task_type = 'brain-dump'"
        ).fetchone()["c"]
        return {"brain_dump_uses": uses, "brain_dump_actions": actions}
    except Exception:
        return {"brain_dump_uses": 0, "brain_dump_actions": 0}
    finally:
        conn.close()


def _get_metrics_counts() -> Dict[str, int]:
    """Count total text and image generations from metrics.db."""
    db_path = str(_get_data_directory() / 'metrics.db')
    if not os.path.exists(db_path):
        return {"total_generations": 0, "total_image_generations": 0}
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        text_gens = conn.execute("SELECT COUNT(*) as c FROM inference_metrics").fetchone()["c"]
        img_gens = conn.execute("SELECT COUNT(*) as c FROM image_metrics").fetchone()["c"]
        return {"total_generations": text_gens, "total_image_generations": img_gens}
    except Exception:
        return {"total_generations": 0, "total_image_generations": 0}
    finally:
        conn.close()


def _get_scan_grade_counts() -> Dict[str, int]:
    """Count scan-graded assignments (grades with source = 'scan')."""
    db_path = str(_get_data_directory() / 'students.db')
    if not os.path.exists(db_path):
        return {"scan_grades": 0}
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        # Check if source column exists in quiz_grades
        cols = [r[1] for r in conn.execute("PRAGMA table_info(quiz_grades)").fetchall()]
        if 'source' in cols:
            quiz_scans = conn.execute("SELECT COUNT(*) as c FROM quiz_grades WHERE source = 'scan'").fetchone()["c"]
        else:
            quiz_scans = 0
        cols_ws = [r[1] for r in conn.execute("PRAGMA table_info(worksheet_grades)").fetchall()]
        if 'source' in cols_ws:
            ws_scans = conn.execute("SELECT COUNT(*) as c FROM worksheet_grades WHERE source = 'scan'").fetchone()["c"]
        else:
            ws_scans = 0
        return {"scan_grades": quiz_scans + ws_scans}
    except Exception:
        return {"scan_grades": 0}
    finally:
        conn.close()


def _get_time_based_counts() -> Dict[str, int]:
    """Check time-of-day achievements and daily variety."""
    now = datetime.now()
    hour = now.hour
    counts: Dict[str, int] = {
        "used_after_10pm": 1 if hour >= 22 else 0,
        "used_before_6am": 1 if hour < 6 else 0,
    }

    # Variety pack: count distinct resource types created today
    today_str = now.strftime("%Y-%m-%d")
    files_map = {
        "lesson_plans": "lesson_plan_history.json",
        "quizzes": "quiz_history.json",
        "worksheets": "worksheet_history.json",
        "rubrics": "rubric_history.json",
        "presentations": "presentation_history.json",
        "images": "images_history.json",
        "kindergarten_plans": "kindergarten_history.json",
        "multigrade_plans": "multigrade_history.json",
        "cross_curricular_plans": "cross_curricular_history.json",
    }
    types_today = 0
    resources_today = 0
    for _key, fname in files_map.items():
        items = _load_json_history(fname)
        today_items = [
            i for i in items
            if isinstance(i, dict)
            and (i.get("created_at", "") or i.get("timestamp", "") or i.get("date", "")).startswith(today_str)
        ]
        if today_items:
            types_today += 1
            resources_today += len(today_items)
    counts["types_today"] = types_today
    counts["resources_in_session"] = resources_today

    # Perfectionist: check max edits on any lesson plan
    lesson_plans = _load_json_history("lesson_plan_history.json")
    max_edits = 0
    for lp in lesson_plans:
        if isinstance(lp, dict):
            edits = lp.get("edit_count", lp.get("version", 1))
            if isinstance(edits, int) and edits > max_edits:
                max_edits = edits
    counts["lesson_edits_max"] = max_edits

    return counts


def _get_streak_counts(teacher_id: str) -> Dict[str, int]:
    """Calculate current streak (with forgiveness) and total active days.

    Streak forgiveness: allows up to 2 gap days per 7-day window,
    so weekends and sick days don't break streaks.
    """
    conn = _get_conn()
    try:
        rows = conn.execute(
            "SELECT activity_date FROM achievement_activity_log WHERE teacher_id = ? ORDER BY activity_date DESC",
            (teacher_id,)
        ).fetchall()
        if not rows:
            return {"streak_days": 0, "total_active_days": 0}

        date_set = set(r["activity_date"] for r in rows)
        dates = sorted(date_set, reverse=True)
        total_active_days = len(dates)

        # Calculate streak with forgiveness (2 grace days per 7-day window)
        today = datetime.now().date()
        today_str = today.strftime("%Y-%m-%d")

        # Start from today or yesterday
        if today_str in date_set:
            cursor = today
        elif (today - timedelta(days=1)).strftime("%Y-%m-%d") in date_set:
            cursor = today - timedelta(days=1)
        else:
            return {"streak_days": 0, "total_active_days": total_active_days}

        streak = 0
        grace_used = 0
        max_grace_per_week = 2

        # Walk backwards from cursor
        check = cursor
        while True:
            check_str = check.strftime("%Y-%m-%d")
            if check_str in date_set:
                streak += 1
                check -= timedelta(days=1)
                # Reset grace counter every 7 streak days
                if streak % 7 == 0:
                    grace_used = 0
            else:
                # Use a grace day
                if grace_used < max_grace_per_week:
                    grace_used += 1
                    check -= timedelta(days=1)
                    # Don't count grace days as streak days, just skip
                else:
                    break

        return {"streak_days": streak, "total_active_days": total_active_days}
    except Exception:
        return {"streak_days": 0, "total_active_days": 0}
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
        counts.update(_get_chat_counts())
        counts.update(_get_brain_dump_counts())
        counts.update(_get_metrics_counts())
        counts.update(_get_scan_grade_counts())
        counts.update(_get_streak_counts(teacher_id))
        counts.update(_get_time_based_counts())

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

        # After first pass, update total_achievement_pts and re-check point-based hidden achievements
        counts["total_achievement_pts"] = total_points
        for defn in ACHIEVEMENT_DEFINITIONS:
            if defn["id"] in already_earned:
                continue
            if defn.get("check_key") == "total_achievement_pts":
                if total_points >= defn["check_value"]:
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

        # Recalculate total points after potential new earnings
        total_points = sum(
            defn["points"]
            for defn in ACHIEVEMENT_DEFINITIONS
            if defn["id"] in already_earned
        )

        # Progress for unearned achievements (skip hidden ones that aren't close)
        progress = {}
        for defn in ACHIEVEMENT_DEFINITIONS:
            if defn["id"] not in already_earned:
                current = counts.get(defn["check_key"], 0)
                progress[defn["id"]] = {
                    "current": min(current, defn["check_value"]),
                    "target": defn["check_value"],
                }

        # Collection progress
        collections_progress = []
        for coll in ACHIEVEMENT_COLLECTIONS:
            coll_earned = sum(1 for aid in coll["achievement_ids"] if aid in already_earned)
            collections_progress.append({
                "id": coll["id"],
                "name": coll["name"],
                "description": coll["description"],
                "category": coll["category"],
                "achievement_ids": coll["achievement_ids"],
                "earned_count": coll_earned,
                "total_count": len(coll["achievement_ids"]),
                "completed": coll_earned == len(coll["achievement_ids"]),
            })

        return {
            "newly_earned": newly_earned,
            "all_earned": all_earned,
            "total_points": total_points,
            "rank": rank,
            "by_category": by_category,
            "progress": progress,
            "total_available": len(ACHIEVEMENT_DEFINITIONS),
            "collections": collections_progress,
            "counts": counts,
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


# ──────────────────────────────────────────────
# Showcase (pinned trophies)
# ──────────────────────────────────────────────

def _ensure_showcase_table():
    conn = _get_conn()
    try:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS achievement_showcase (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                teacher_id  TEXT NOT NULL,
                achievement_id TEXT NOT NULL,
                position    INTEGER NOT NULL DEFAULT 0,
                UNIQUE(teacher_id, achievement_id)
            )
        ''')
        conn.commit()
    finally:
        conn.close()


def get_showcase(teacher_id: str) -> List[str]:
    _ensure_showcase_table()
    conn = _get_conn()
    try:
        rows = conn.execute(
            "SELECT achievement_id FROM achievement_showcase WHERE teacher_id = ? ORDER BY position",
            (teacher_id,)
        ).fetchall()
        return [r["achievement_id"] for r in rows]
    finally:
        conn.close()


def update_showcase(teacher_id: str, achievement_ids: List[str]) -> Dict[str, Any]:
    _ensure_showcase_table()
    conn = _get_conn()
    try:
        conn.execute("DELETE FROM achievement_showcase WHERE teacher_id = ?", (teacher_id,))
        for i, aid in enumerate(achievement_ids[:5]):
            conn.execute(
                "INSERT INTO achievement_showcase (teacher_id, achievement_id, position) VALUES (?, ?, ?)",
                (teacher_id, aid, i)
            )
        conn.commit()
        return {"success": True, "showcase": achievement_ids[:5]}
    finally:
        conn.close()
