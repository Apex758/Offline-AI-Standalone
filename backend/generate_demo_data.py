"""
Comprehensive Demo Data Generator for OECS Class Coworker
Generates a full academic year (Sept 2025 - July 2026) of realistic demo data
across all 14 Caribbean 3-term school year phases.

Usage:
    cd backend
    .\\venv\\Scripts\\Activate
    python generate_demo_data.py

Outputs: demo_year_data.json in the project root
"""

import json
import uuid
import random
import os
from datetime import datetime, timedelta, date

random.seed(42)  # Reproducible output

# ── Constants ─────────────────────────────────────────────────────────────────

TEACHER_ID = "default_teacher"
TEACHER_NAME = "Ms. Claudette Joseph"
SCHOOL_NAME = "Castries Combined School"
COUNTRY = "Saint Lucia"

GRADES = ["1", "2", "4"]
SUBJECTS = ["Mathematics", "Science", "Language Arts", "Social Studies"]

# 4 subject-grade teaching assignments across 3 grades
# e.g. the teacher teaches Grade 1 Math, Grade 2 Science, Grade 2 Language Arts, Grade 4 Math
CLASSES = [
    {"grade": "1", "subject": "Mathematics"},
    {"grade": "2", "subject": "Science"},
    {"grade": "2", "subject": "Language Arts"},
    {"grade": "4", "subject": "Mathematics"},
]

# ── Caribbean 3-Term Calendar (2025-2026) ─────────────────────────────────────

YEAR_START = date(2025, 9, 1)
TERM1_END = date(2025, 12, 12)
CHRISTMAS_START = date(2025, 12, 13)
CHRISTMAS_END = date(2026, 1, 4)
TERM2_START = date(2026, 1, 5)
MIDTERM1_START = date(2025, 10, 13)
MIDTERM1_END = date(2025, 10, 17)
MIDTERM2_START = date(2026, 2, 16)
MIDTERM2_END = date(2026, 2, 20)
TERM2_END = date(2026, 3, 27)
EASTER_START = date(2026, 3, 28)
EASTER_END = date(2026, 4, 12)
TERM3_START = date(2026, 4, 13)
FINAL_EXAM_START = date(2026, 6, 12)
FINAL_EXAM_END = date(2026, 6, 26)
YEAR_END = date(2026, 7, 31)

MT1_PREP_START = MIDTERM1_START - timedelta(days=7)
MT2_PREP_START = MIDTERM2_START - timedelta(days=7)
TERM3_MID = TERM3_START + (FINAL_EXAM_START - timedelta(days=1) - TERM3_START) // 2

SCHOOL_YEAR_CONFIG_ID = str(uuid.uuid4())

# 14 phases with (key, label, semester, order, start, end)
PHASES = [
    ("term_1_early",        "Term 1 -- Early",       "Term 1", 1,  YEAR_START,       MT1_PREP_START - timedelta(days=1)),
    ("term_1_midterm_prep", "Term 1 Mid-Term Prep",  "Term 1", 2,  MT1_PREP_START,   MIDTERM1_START - timedelta(days=1)),
    ("term_1_midterm",      "Term 1 Mid-Term",       "Term 1", 3,  MIDTERM1_START,   MIDTERM1_END),
    ("term_1_late",         "Term 1 -- Late",        "Term 1", 4,  MIDTERM1_END + timedelta(days=1), TERM1_END),
    ("christmas_break",     "Christmas Break",        None,     5,  CHRISTMAS_START,  CHRISTMAS_END),
    ("term_2_early",        "Term 2 -- Early",       "Term 2", 6,  TERM2_START,      MT2_PREP_START - timedelta(days=1)),
    ("term_2_midterm_prep", "Term 2 Mid-Term Prep",  "Term 2", 7,  MT2_PREP_START,   MIDTERM2_START - timedelta(days=1)),
    ("term_2_midterm",      "Term 2 Mid-Term",       "Term 2", 8,  MIDTERM2_START,   MIDTERM2_END),
    ("term_2_late",         "Term 2 -- Late",        "Term 2", 9,  MIDTERM2_END + timedelta(days=1), TERM2_END),
    ("easter_break",        "Easter Break",           None,    10,  EASTER_START,     EASTER_END),
    ("term_3_early",        "Term 3 -- Early",       "Term 3", 11, TERM3_START,      TERM3_MID),
    ("term_3_late",         "Term 3 -- Late",        "Term 3", 12, TERM3_MID + timedelta(days=1), FINAL_EXAM_START - timedelta(days=1)),
    ("end_of_year_exam",    "End-of-Year Exams",     "Term 3", 13, FINAL_EXAM_START, FINAL_EXAM_END),
    ("summer_vacation",     "Summer Vacation",        None,    14, FINAL_EXAM_END + timedelta(days=1), YEAR_END),
]

# Composite score progression per phase (min, max)
SCORE_PROGRESSION = {
    "term_1_early":        (56, 63),
    "term_1_midterm_prep": (63, 70),
    "term_1_midterm":      (67, 73),
    "term_1_late":         (70, 76),
    "christmas_break":     (72, 75),
    "term_2_early":        (68, 73),
    "term_2_midterm_prep": (72, 77),
    "term_2_midterm":      (74, 79),
    "term_2_late":         (76, 81),
    "easter_break":        (78, 81),
    "term_3_early":        (78, 83),
    "term_3_late":         (80, 86),
    "end_of_year_exam":    (83, 89),
    "summer_vacation":     (85, 87),
}

# Phase weight profiles (from teacher_metrics_service.py)
PHASE_WEIGHTS = {
    "term_1_early":        {"curriculum": 0.28, "content": 0.27, "performance": 0.15, "attendance": 0.18, "achievements": 0.12},
    "term_1_midterm_prep": {"curriculum": 0.15, "content": 0.20, "performance": 0.35, "attendance": 0.15, "achievements": 0.15},
    "term_1_midterm":      {"curriculum": 0.10, "content": 0.10, "performance": 0.42, "attendance": 0.22, "achievements": 0.16},
    "term_1_late":         {"curriculum": 0.20, "content": 0.20, "performance": 0.30, "attendance": 0.18, "achievements": 0.12},
    "christmas_break":     {"curriculum": 0.30, "content": 0.32, "performance": 0.05, "attendance": 0.05, "achievements": 0.28},
    "term_2_early":        {"curriculum": 0.28, "content": 0.25, "performance": 0.15, "attendance": 0.22, "achievements": 0.10},
    "term_2_midterm_prep": {"curriculum": 0.15, "content": 0.20, "performance": 0.35, "attendance": 0.15, "achievements": 0.15},
    "term_2_midterm":      {"curriculum": 0.10, "content": 0.10, "performance": 0.42, "attendance": 0.22, "achievements": 0.16},
    "term_2_late":         {"curriculum": 0.20, "content": 0.20, "performance": 0.30, "attendance": 0.18, "achievements": 0.12},
    "easter_break":        {"curriculum": 0.30, "content": 0.32, "performance": 0.05, "attendance": 0.05, "achievements": 0.28},
    "term_3_early":        {"curriculum": 0.20, "content": 0.20, "performance": 0.25, "attendance": 0.20, "achievements": 0.15},
    "term_3_late":         {"curriculum": 0.15, "content": 0.15, "performance": 0.38, "attendance": 0.15, "achievements": 0.17},
    "end_of_year_exam":    {"curriculum": 0.10, "content": 0.08, "performance": 0.48, "attendance": 0.20, "achievements": 0.14},
    "summer_vacation":     {"curriculum": 0.30, "content": 0.30, "performance": 0.05, "attendance": 0.05, "achievements": 0.30},
}


_id_counter = 0

def uid():
    return str(uuid.uuid4())


def unique_ts(d):
    """Generate a unique timestamp-based ID suffix from a date, with a counter to avoid collisions."""
    global _id_counter
    _id_counter += 1
    ts = int(datetime(d.year, d.month, d.day, random.randint(7, 17), random.randint(0, 59), random.randint(0, 59)).timestamp() * 1000)
    return ts + _id_counter


def iso(d, hour=9, minute=0):
    """date -> ISO string with time"""
    return datetime(d.year, d.month, d.day, hour, minute).isoformat() + "Z"


def random_date_in_range(start, end):
    """Random date between start and end (inclusive)"""
    delta = (end - start).days
    if delta <= 0:
        return start
    return start + timedelta(days=random.randint(0, delta))


def weekdays_in_range(start, end):
    """Return list of weekday dates in range"""
    days = []
    d = start
    while d <= end:
        if d.weekday() < 5:  # Mon-Fri
            days.append(d)
        d += timedelta(days=1)
    return days


def letter_grade(pct):
    if pct >= 90: return "A"
    if pct >= 80: return "B"
    if pct >= 70: return "C"
    if pct >= 60: return "D"
    return "F"


def is_teaching_phase(phase_key):
    return phase_key not in ("christmas_break", "easter_break", "summer_vacation")


# ── Student Roster ────────────────────────────────────────────────────────────

# (first, last, gender, grade)
STUDENT_NAMES = [
    # Grade 1 (8 students)
    ("Aaron", "Williams", "male", "1"),
    ("Brianna", "Charles", "female", "1"),
    ("Carlos", "Frederick", "male", "1"),
    ("Diana", "George", "female", "1"),
    ("Ethan", "Harris", "male", "1"),
    ("Faith", "Isaac", "female", "1"),
    ("Gabriel", "John", "male", "1"),
    ("Hannah", "King", "female", "1"),
    # Grade 2 (8 students)
    ("Ian", "Lewis", "male", "2"),
    ("Jade", "Martin", "female", "2"),
    ("Kevin", "Nelson", "male", "2"),
    ("Leah", "Octave", "female", "2"),
    ("Marcus", "Paul", "male", "2"),
    ("Naomi", "Quinn", "female", "2"),
    ("Darius", "Regis", "male", "2"),
    ("Sophia", "St. Rose", "female", "2"),
    # Grade 4 (8 students)
    ("Oliver", "Roberts", "male", "4"),
    ("Priya", "Samuel", "female", "4"),
    ("Quincy", "Thomas", "male", "4"),
    ("Rachel", "Ureaux", "female", "4"),
    ("Samuel", "Victor", "male", "4"),
    ("Tanya", "Walcott", "female", "4"),
    ("Tyler", "Augustin", "male", "4"),
    ("Zara", "Biscette", "female", "4"),
]


def generate_students():
    students = []
    for first, last, gender, grade in STUDENT_NAMES:
        sid = f"{first[0]}{last[0]}{random.randint(10000, 99999)}"
        students.append({
            "id": sid,
            "full_name": f"{first} {last}",
            "first_name": first,
            "middle_name": "",
            "last_name": last,
            "date_of_birth": f"{2025 - (5 + int(grade)):04d}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "class_name": f"Grade {grade}",
            "grade_level": grade,
            "gender": gender,
            "contact_info": json.dumps({"parent": f"Parent of {first}", "phone": f"1-758-{random.randint(200,799)}-{random.randint(1000,9999)}"}),
            "created_at": "2025-09-01 08:30:00",
        })
    return students


# ── Curriculum Topics (for milestones) ────────────────────────────────────────

# Real curriculum topic_ids from the app's CurriculumMatcher
# Format: grade{N}-{subject-slug}-{strand-slug}
REAL_CURRICULUM_TOPICS = {
    "1": [
        ("grade1-mathematics-number-sense", "Mathematics - Number Sense", "Mathematics", "number-sense"),
        ("grade1-mathematics-operations-with-numbers", "Mathematics - Operations with Numbers", "Mathematics", "operations-with-numbers"),
        ("grade1-mathematics-patterns-and-relationships", "Mathematics - Patterns and Relationships", "Mathematics", "patterns-and-relationships"),
        ("grade1-mathematics-geometrical-thinking", "Mathematics - Geometrical Thinking", "Mathematics", "geometrical-thinking"),
        ("grade1-mathematics-measurement", "Mathematics - Measurement", "Mathematics", "measurement"),
        ("grade1-mathematics-data-handling-and-probability", "Mathematics - Data Handling and Probability", "Mathematics", "data-handling-and-probability"),
        ("grade1-language-arts-listening-and-speaking", "Language Arts - Listening and Speaking", "Language Arts", "listening-and-speaking"),
        ("grade1-language-arts-reading-and-viewing", "Language Arts - Reading and Viewing", "Language Arts", "reading-and-viewing"),
        ("grade1-language-arts-writing-and-representing", "Language Arts - Writing and Representing", "Language Arts", "writing-and-representing"),
        ("grade1-science-waves", "Science - Waves", "Science", "waves"),
        ("grade1-science-structure,-function,-and-information-processing", "Science - Structure, Function, and Information Processing", "Science", "structure,-function,-and-information-processing"),
        ("grade1-science-space-systems:-patterns-and-cycles", "Science - Space Systems: Patterns and Cycles", "Science", "space-systems:-patterns-and-cycles"),
        ("grade1-social-studies-historical-and-cultural-thinking", "Social Studies - Historical and Cultural Thinking", "Social Studies", "historical-and-cultural-thinking"),
        ("grade1-social-studies-civic-participation", "Social Studies - Civic Participation", "Social Studies", "civic-participation"),
        ("grade1-social-studies-spatial-thinking", "Social Studies - Spatial Thinking", "Social Studies", "spatial-thinking"),
        ("grade1-social-studies-economic-decision-making", "Social Studies - Economic Decision Making", "Social Studies", "economic-decision-making"),
    ],
    "2": [
        ("grade2-mathematics-number-sense", "Mathematics - Number Sense", "Mathematics", "number-sense"),
        ("grade2-mathematics-operations-with-numbers", "Mathematics - Operations with Numbers", "Mathematics", "operations-with-numbers"),
        ("grade2-mathematics-patterns-and-relationships", "Mathematics - Patterns and Relationships", "Mathematics", "patterns-and-relationships"),
        ("grade2-mathematics-geometrical-thinking", "Mathematics - Geometrical Thinking", "Mathematics", "geometrical-thinking"),
        ("grade2-mathematics-measurement", "Mathematics - Measurement", "Mathematics", "measurement"),
        ("grade2-mathematics-data-handling-and-probability", "Mathematics - Data Handling and Probability", "Mathematics", "data-handling-and-probability"),
        ("grade2-language-arts-listening-and-speaking", "Language Arts - Listening and Speaking", "Language Arts", "listening-and-speaking"),
        ("grade2-language-arts-reading-and-viewing", "Language Arts - Reading and Viewing", "Language Arts", "reading-and-viewing"),
        ("grade2-language-arts-writing-and-representing", "Language Arts - Writing and Representing", "Language Arts", "writing-and-representing"),
        ("grade2-science-structure-and-properties-of-matter", "Science - Structure and Properties of Matter", "Science", "structure-and-properties-of-matter"),
        ("grade2-science-interdependent-relationships-in-ecosystems", "Science - Interdependent Relationships in Ecosystems", "Science", "interdependent-relationships-in-ecosystems"),
        ("grade2-science-earth-systems", "Science - Earth Systems", "Science", "earth-systems"),
        ("grade2-science-engineering-design", "Science - Engineering Design", "Science", "engineering-design"),
        ("grade2-social-studies-historical-and-cultural-thinking", "Social Studies - Historical and Cultural Thinking", "Social Studies", "historical-and-cultural-thinking"),
        ("grade2-social-studies-spatial-thinking", "Social Studies - Spatial Thinking", "Social Studies", "spatial-thinking"),
        ("grade2-social-studies-civic-participation", "Social Studies - Civic Participation", "Social Studies", "civic-participation"),
        ("grade2-social-studies-economic-decision-making", "Social Studies - Economic Decision Making", "Social Studies", "economic-decision-making"),
    ],
    "4": [
        ("grade4-mathematics-patterns-and-relationships", "Mathematics - Patterns and Relationships", "Mathematics", "patterns-and-relationships"),
        ("grade4-mathematics-number-sense", "Mathematics - Number Sense", "Mathematics", "number-sense"),
        ("grade4-mathematics-operations-with-numbers", "Mathematics - Operations with Numbers", "Mathematics", "operations-with-numbers"),
        ("grade4-mathematics-geometrical-thinking", "Mathematics - Geometrical Thinking", "Mathematics", "geometrical-thinking"),
        ("grade4-mathematics-measurement", "Mathematics - Measurement", "Mathematics", "measurement"),
        ("grade4-mathematics-data-handling-and-probability", "Mathematics - Data Handling and Probability", "Mathematics", "data-handling-and-probability"),
        ("grade4-language-arts-listening-and-speaking", "Language Arts - Listening and Speaking", "Language Arts", "listening-and-speaking"),
        ("grade4-language-arts-reading-and-viewing", "Language Arts - Reading and Viewing", "Language Arts", "reading-and-viewing"),
        ("grade4-language-arts-writing-and-representing", "Language Arts - Writing and Representing", "Language Arts", "writing-and-representing"),
        ("grade4-science-energy", "Science - Energy", "Science", "energy"),
        ("grade4-science-waves", "Science - Waves", "Science", "waves"),
        ("grade4-science-earth-systems", "Science - Earth Systems", "Science", "earth-systems"),
        ("grade4-social-studies-historical-and-cultural-thinking", "Social Studies - Historical and Cultural Thinking", "Social Studies", "historical-and-cultural-thinking"),
        ("grade4-social-studies-spatial-thinking", "Social Studies - Spatial Thinking", "Social Studies", "spatial-thinking"),
        ("grade4-social-studies-civic-participation", "Social Studies - Civic Participation", "Social Studies", "civic-participation"),
        ("grade4-social-studies-economic-decision-making", "Social Studies - Economic Decision Making", "Social Studies", "economic-decision-making"),
    ],
}


# ── Lesson Plan Topics Pool ──────────────────────────────────────────────────

LESSON_TOPICS = {
    ("Mathematics", "1"): ["Counting to 20", "Addition Facts", "Subtraction Intro", "Patterns", "Comparing Numbers"],
    ("Mathematics", "2"): ["Place Value", "Adding Two-Digit Numbers", "Subtracting with Regrouping", "Skip Counting", "Telling Time"],
    ("Mathematics", "4"): ["Fractions", "Equivalent Fractions", "Long Multiplication", "Division with Remainders", "Area and Perimeter"],
    ("Science", "1"): ["My Five Senses", "Animals Around Us", "Push and Pull", "Living vs Non-Living"],
    ("Science", "2"): ["Plant Parts", "Weather Patterns", "Water Cycle Basics", "Healthy Eating"],
    ("Science", "4"): ["Ecosystems", "Food Chains", "Simple Machines", "States of Matter", "The Solar System"],
    ("Language Arts", "2"): ["Reading Comprehension", "Phonics Review", "Sentence Writing", "Story Elements", "Vocabulary Building"],
    ("Social Studies", "2"): ["My Community", "Community Helpers", "Maps and Directions", "National Symbols", "Caribbean Traditions"],
}

QUIZ_TOPICS = {
    ("Mathematics", "1"): ["Counting Quiz", "Addition Facts Assessment"],
    ("Mathematics", "2"): ["Place Value Quiz", "Addition & Subtraction Test"],
    ("Mathematics", "4"): ["Fractions Quiz", "Multiplication Test", "Division Assessment"],
    ("Science", "1"): ["Living Things Quiz"],
    ("Science", "2"): ["Plants Quiz", "Weather Quiz"],
    ("Science", "4"): ["Ecosystems Quiz", "Simple Machines Test"],
    ("Language Arts", "2"): ["Reading Comprehension Quiz", "Grammar Assessment", "Vocabulary Test"],
    ("Social Studies", "2"): ["Community Helpers Quiz", "Maps Quiz", "National Symbols Test"],
}

WORKSHEET_TOPICS = {
    ("Mathematics", "1"): ["Counting Practice", "Addition Worksheet"],
    ("Mathematics", "2"): ["Place Value Practice", "Subtraction Worksheet"],
    ("Mathematics", "4"): ["Fractions Worksheet", "Multiplication Practice", "Division Worksheet"],
    ("Science", "1"): ["Animals Worksheet"],
    ("Science", "2"): ["Plants Worksheet"],
    ("Science", "4"): ["Ecosystems Worksheet", "Machines Worksheet"],
    ("Language Arts", "2"): ["Reading Comprehension Worksheet", "Sentence Building Practice", "Spelling Worksheet"],
    ("Social Studies", "2"): ["Community Map Activity", "National Heroes Worksheet", "Caribbean Culture Worksheet"],
}

# Kindergarten topics
KINDER_TOPICS = [
    ("Animals Around Us", "Science", "living-things"),
    ("Colors and Shapes", "Mathematics", "geometry"),
    ("My Family", "Social Studies", "community"),
    ("Healthy Foods", "Science", "health"),
    ("Numbers 1-10", "Mathematics", "number-operations"),
    ("Days of the Week", "Language Arts", "literacy"),
    ("Weather", "Science", "earth-science"),
    ("Body Parts", "Science", "living-things"),
]


# ── Chat Templates ────────────────────────────────────────────────────────────

CHAT_TOPICS = [
    ("Help with fractions lesson", "How can I teach fractions to Grade 4 students using hands-on activities?"),
    ("Differentiated instruction ideas", "I have students at different levels in my Grade 2 class. How can I differentiate my math lessons?"),
    ("Classroom management tips", "Some of my students are having trouble staying focused during longer lessons. Any strategies?"),
    ("Science experiment planning", "I want to do a simple experiment about plants for Grade 2. What are some ideas?"),
    ("Assessment strategies", "What are effective ways to assess Grade 1 students who are still learning to write?"),
    ("Parent communication", "How should I communicate student progress to parents for mid-term reports?"),
    ("Special needs support", "I have a student who may need extra support with reading. How can I help?"),
    ("Term planning advice", "How should I plan my curriculum coverage for Term 2?"),
    ("End of year review activities", "What fun review activities can I use before final exams?"),
    ("Behavior management", "How do I handle a student who is frequently disruptive?"),
    ("Cross-curricular connections", "How can I connect math and science in my Grade 4 lessons?"),
    ("Homework strategies", "Should I assign homework to Grade 1 students? What kind?"),
    ("Group work activities", "What are good group activities for mixed-ability Grade 2 students?"),
    ("Technology integration", "How can I use limited technology resources effectively in my classroom?"),
]


# ── Main Generator Functions ──────────────────────────────────────────────────

def generate_school_year_config():
    return {
        "id": SCHOOL_YEAR_CONFIG_ID,
        "teacher_id": TEACHER_ID,
        "label": "2025-2026 Academic Year",
        "start_date": YEAR_START.isoformat(),
        "end_date": YEAR_END.isoformat(),
        "is_active": 1,
        "structure_type": "caribbean_three_term",
        "created_at": iso(YEAR_START - timedelta(days=14)),
        "updated_at": iso(YEAR_START - timedelta(days=14)),
    }


def generate_academic_phases():
    phases = []
    for key, label, semester, order, start, end in PHASES:
        phases.append({
            "id": uid(),
            "config_id": SCHOOL_YEAR_CONFIG_ID,
            "teacher_id": TEACHER_ID,
            "phase_key": key,
            "phase_label": label,
            "semester": semester,
            "start_date": start.isoformat(),
            "end_date": end.isoformat(),
            "phase_order": order,
            "created_at": iso(YEAR_START - timedelta(days=14)),
        })
    return phases


def generate_metric_snapshots(academic_phases):
    """Generate 2-3 metric snapshots per phase with realistic score progression."""
    snapshots = []
    phase_id_map = {p["phase_key"]: p["id"] for p in academic_phases}

    for key, label, semester, order, start, end in PHASES:
        lo, hi = SCORE_PROGRESSION[key]
        weights = PHASE_WEIGHTS[key]
        phase_days = (end - start).days

        # 2-3 snapshots per phase depending on duration
        n_snaps = 3 if phase_days > 14 else (2 if phase_days > 5 else 1)

        for i in range(n_snaps):
            # Spread snapshots evenly through the phase
            if n_snaps == 1:
                snap_date = start + timedelta(days=phase_days // 2)
            else:
                offset = int(phase_days * (i + 1) / (n_snaps + 1))
                snap_date = start + timedelta(days=offset)

            # Composite score interpolates from lo to hi across snapshots
            progress = i / max(n_snaps - 1, 1)
            composite = lo + (hi - lo) * progress + random.uniform(-1.5, 1.5)
            composite = round(max(0, min(100, composite)), 1)

            # Generate dimension scores that roughly support the composite
            # Each dimension drifts around the composite with some variance
            dim_scores = {}
            for dim, weight in weights.items():
                base = composite + random.uniform(-12, 12)
                # Performance higher during exam phases, curriculum higher early
                if dim == "performance" and "midterm" in key or "exam" in key:
                    base += 5
                if dim == "curriculum" and "early" in key:
                    base -= 5
                if dim == "attendance":
                    base = max(base, 70)  # Attendance tends to stay higher
                dim_scores[dim] = round(max(0, min(100, base)), 1)

            snapshots.append({
                "id": uid(),
                "teacher_id": TEACHER_ID,
                "computed_at": iso(snap_date, random.randint(8, 17), random.randint(0, 59)),
                "phase": key,
                "composite_score": composite,
                "composite_grade": letter_grade(composite),
                "curriculum_score": dim_scores.get("curriculum", 0),
                "performance_score": dim_scores.get("performance", 0),
                "content_score": dim_scores.get("content", 0),
                "attendance_score": dim_scores.get("attendance", 0),
                "achievements_score": dim_scores.get("achievements", 0),
                "weights_json": json.dumps(weights),
                "phase_label": label,
                "academic_phase_id": phase_id_map.get(key),
                "academic_phase_key": key,
                "semester_label": semester,
            })

    return snapshots


def generate_phase_summaries(academic_phases, snapshots):
    """Generate summaries for completed phases (all except summer_vacation)."""
    summaries = []
    phase_id_map = {p["phase_key"]: p for p in academic_phases}

    for key, label, semester, order, start, end in PHASES:
        if key == "summer_vacation":
            continue
        phase_snaps = [s for s in snapshots if s["phase"] == key]
        if not phase_snaps:
            continue

        scores = [s["composite_score"] for s in phase_snaps]
        avg_score = sum(scores) / len(scores)
        peak_score = max(scores)
        low_score = min(scores)

        # Dimension deltas: last - first
        first = phase_snaps[0]
        last = phase_snaps[-1]
        deltas = {}
        for dim in ["curriculum", "performance", "content", "attendance", "achievements"]:
            f_key = f"{dim}_score"
            deltas[dim] = round((last.get(f_key, 0) or 0) - (first.get(f_key, 0) or 0), 1)

        phase_info = phase_id_map.get(key, {})
        summaries.append({
            "id": uid(),
            "config_id": SCHOOL_YEAR_CONFIG_ID,
            "teacher_id": TEACHER_ID,
            "phase_key": key,
            "phase_label": label,
            "semester": semester,
            "start_date": start.isoformat(),
            "end_date": end.isoformat(),
            "avg_composite": round(avg_score, 1),
            "peak_composite": round(peak_score, 1),
            "low_composite": round(low_score, 1),
            "snapshot_count": len(phase_snaps),
            "dimension_deltas_json": json.dumps(deltas),
            "narrative": None,
            "generated_at": iso(end + timedelta(days=1)),
        })

    return summaries


def pick_class_subject():
    """Pick a random teaching assignment (grade + subject)."""
    cls = random.choice(CLASSES)
    return cls, cls["subject"]


def generate_lesson_plans():
    """Generate lesson plans distributed across teaching phases."""
    plans = []
    topic_idx = {k: 0 for k in LESSON_TOPICS}

    for key, label, semester, order, start, end in PHASES:
        if not is_teaching_phase(key):
            continue
        # 3-5 plans per teaching phase (more because 4 classes)
        n_plans = random.randint(3, 5)
        for _ in range(n_plans):
            cls, subject = pick_class_subject()
            grade = cls["grade"]
            topics = LESSON_TOPICS.get((subject, grade), ["General Topic"])
            topic = topics[topic_idx.get((subject, grade), 0) % len(topics)]
            topic_idx[(subject, grade)] = topic_idx.get((subject, grade), 0) + 1

            plan_date = random_date_in_range(start, end)
            ts = unique_ts(plan_date)
            plans.append({
                "id": f"plan_{ts}",
                "title": f"{subject} - {topic} (Grade {grade})",
                "timestamp": iso(plan_date),
                "formData": {
                    "subject": subject,
                    "gradeLevel": grade,
                    "topic": topic,
                    "strand": {"Mathematics": "number-operations", "Science": "living-things", "Language Arts": "reading", "Social Studies": "community"}.get(subject, "general"),
                    "essentialOutcomes": f"Students will understand key concepts of {topic}",
                    "specificOutcomes": f"Students will be able to demonstrate understanding of {topic} through practice activities",
                    "studentCount": str(random.randint(20, 30)),
                    "duration": str(random.choice([45, 60, 90])),
                    "pedagogicalStrategies": random.sample(["differentiated-instruction", "hands-on", "cooperative-learning", "inquiry-based"], 2),
                    "learningStyles": random.sample(["visual", "kinesthetic", "auditory"], 2),
                    "learningPreferences": [],
                    "multipleIntelligences": [random.choice(["logical-mathematical", "naturalist", "linguistic"])],
                    "customLearningStyles": "",
                    "materials": f"Textbooks, worksheets, manipulatives for {topic}",
                    "prerequisiteSkills": f"Basic understanding of prerequisite concepts for {topic}",
                    "specialNeeds": False,
                    "specialNeedsDetails": "",
                    "additionalInstructions": "",
                    "referenceUrl": "",
                },
                "generatedPlan": f"# {topic}\n\n## Objective\nStudents will learn about {topic}.\n\n## Introduction (10 min)\nReview prior knowledge and introduce new concepts.\n\n## Development (30 min)\nGuided practice with examples and activities.\n\n## Closure (10 min)\nReview key points and assign practice work.",
                "parsedLesson": None,
                "curriculumMatches": None,
                "edit_count": random.randint(0, 3),
            })

    return plans


def generate_kindergarten_plans():
    """Generate kindergarten plans for teaching phases."""
    plans = []
    topic_idx = 0
    for key, label, semester, order, start, end in PHASES:
        if not is_teaching_phase(key):
            continue
        n = random.randint(1, 2)
        for _ in range(n):
            topic_name, subj, strand = KINDER_TOPICS[topic_idx % len(KINDER_TOPICS)]
            topic_idx += 1
            plan_date = random_date_in_range(start, end)
            ts = unique_ts(plan_date)
            plans.append({
                "id": f"kindergarten_{ts}",
                "title": f"{topic_name} - {subj} (Age 3-4)",
                "timestamp": iso(plan_date),
                "formData": {
                    "lessonTopic": topic_name,
                    "curriculumUnit": subj,
                    "week": str(random.randint(1, 12)),
                    "dayOfWeek": random.choice(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
                    "date": plan_date.isoformat(),
                    "ageGroup": "3-4",
                    "students": "20",
                    "creativityLevel": random.randint(5, 9),
                    "learningDomains": random.sample(["cognitive", "physical", "social-emotional", "creative"], 3),
                    "duration": "45",
                    "additionalRequirements": "",
                    "includeAssessments": True,
                    "includeMaterials": True,
                    "curriculumSubject": subj,
                    "strand": strand,
                    "essentialOutcomes": f"Children will explore {topic_name}",
                    "specificOutcomes": f"Children will demonstrate understanding of {topic_name}",
                },
                "generatedPlan": f"# {topic_name}\n\nCircle Time (10 min)\nIntroduce the topic with a song.\n\nExploration (20 min)\nHands-on activity.\n\nWrap Up (15 min)\nReview and share.",
                "parsedPlan": None,
            })
    return plans


def generate_multigrade_plans():
    """One multigrade plan per teaching phase."""
    plans = []
    for key, label, semester, order, start, end in PHASES:
        if not is_teaching_phase(key):
            continue
        subject = random.choice(["Mathematics", "Science"])
        topic = random.choice(LESSON_TOPICS.get((subject, "2"), ["Mixed Topic"]))
        plan_date = random_date_in_range(start, end)
        ts = unique_ts(plan_date)
        plans.append({
            "id": f"multigrade_{ts}",
            "title": f"{subject} - {topic} (Grades 1-2)",
            "timestamp": iso(plan_date),
            "formData": {
                "subject": subject,
                "gradeRange": "1-2",
                "topic": topic,
                "essentialLearningOutcomes": f"Students across grades will understand {topic}",
                "specificLearningObjectives": f"Grade-appropriate mastery of {topic}",
                "totalStudents": "35",
                "prerequisiteSkills": "Basic foundational skills",
                "duration": "60",
                "materials": "Textbooks, worksheets, manipulatives",
                "learningStyles": ["visual", "kinesthetic", "auditory"],
                "learningPreferences": [],
                "multipleIntelligences": ["logical-mathematical"],
                "customLearningStyles": "",
                "pedagogicalStrategies": ["differentiated-instruction", "cooperative-learning"],
                "multigradeStrategies": ["tiered-assignments", "flexible-grouping"],
                "specialNeeds": False,
                "specialNeedsDetails": "",
                "differentiationNotes": "Tiered assignments based on grade level",
                "strand": {"Mathematics": "number-operations", "Science": "living-things", "Language Arts": "reading", "Social Studies": "community"}.get(subject, "general"),
                "essentialOutcomes": f"Students will explore {topic}",
                "specificOutcomes": f"Students will demonstrate grade-appropriate understanding",
            },
            "generatedPlan": f"# {topic} (Multigrade)\n\nShared introduction followed by tiered group work.",
            "parsedPlan": None,
        })
    return plans


def generate_cross_curricular_plans():
    """One cross-curricular plan every 2-3 teaching phases."""
    plans = []
    teaching_phases = [(k, l, s, o, st, en) for k, l, s, o, st, en in PHASES if is_teaching_phase(k)]
    for i in range(0, len(teaching_phases), 3):
        phase = teaching_phases[i]
        key, label, semester, order, start, end = phase
        plan_date = random_date_in_range(start, end)
        ts = unique_ts(plan_date)
        grade = random.choice(GRADES)
        plans.append({
            "id": f"cross_curricular_{ts}",
            "title": f"Math & Science Integration (Grade {grade})",
            "timestamp": iso(plan_date),
            "formData": {
                "lessonTitle": f"Exploring Connections - Grade {grade}",
                "gradeLevel": grade,
                "duration": "90",
                "bigIdea": "Mathematics and science are interconnected",
                "integrationModel": "multidisciplinary",
                "primarySubject": "Mathematics",
                "supportingSubjects": "Science",
                "learningStandards": "Integrated standards",
                "primaryObjective": "Apply math concepts in scientific contexts",
                "secondaryObjectives": "Use scientific method with mathematical reasoning",
                "studentsWillKnow": "How math and science connect",
                "studentsWillBeSkilled": "Applying knowledge across disciplines",
                "keyVocabulary": "",
                "introduction": "Review connections between subjects",
                "coreActivities": "Hands-on integrated activities",
                "closureActivities": "Reflection and sharing",
                "differentiationStrategies": "Tiered support",
                "assessmentMethods": "Observation and rubric",
                "mostChildren": "Will demonstrate basic integration",
                "someNotProgressed": "Will need additional support",
                "someProgressedFurther": "Will show advanced connections",
                "reflectionPrompts": "What connections did you discover?",
                "teachingStrategies": ["inquiry-based", "cooperative-learning"],
                "learningStyles": ["visual", "kinesthetic"],
                "learningPreferences": [],
                "multipleIntelligences": ["logical-mathematical", "naturalist"],
                "customLearningStyles": "",
                "materials": "Various manipulatives and science equipment",
                "crossCurricularConnections": "Mathematics + Science",
                "strand": "number-operations",
                "essentialOutcomes": "Integrated understanding",
                "specificOutcomes": "Cross-disciplinary application",
            },
            "generatedPlan": "# Math & Science Integration\n\nIntegrated lesson combining mathematical and scientific concepts.",
            "parsedPlan": None,
        })
    return plans


def generate_quizzes():
    """Generate quizzes - heavy during midterm phases."""
    quizzes = []
    quiz_refs = []  # Track for grades
    topic_idx = {k: 0 for k in QUIZ_TOPICS}

    for key, label, semester, order, start, end in PHASES:
        if not is_teaching_phase(key):
            continue
        # More quizzes during midterm phases
        if "midterm" in key:
            n = random.randint(2, 3)
        elif "exam" in key:
            n = 2
        else:
            n = random.randint(1, 2)

        for _ in range(n):
            cls, subject = pick_class_subject()
            grade = cls["grade"]
            topics = QUIZ_TOPICS.get((subject, grade), ["General Quiz"])
            topic = topics[topic_idx.get((subject, grade), 0) % len(topics)]
            topic_idx[(subject, grade)] = topic_idx.get((subject, grade), 0) + 1

            quiz_date = random_date_in_range(start, end)
            ts = unique_ts(quiz_date)
            num_q = random.choice([8, 10, 12, 15])
            quiz_id = f"quiz_{ts}"
            quizzes.append({
                "id": quiz_id,
                "title": f"{subject} - {topic} (Grade {grade})",
                "timestamp": iso(quiz_date),
                "formData": {
                    "subject": subject,
                    "gradeLevel": grade,
                    "learningOutcomes": f"Assess student understanding of {topic}",
                    "questionTypes": ["multiple-choice", "short-answer"],
                    "cognitiveLevels": ["knowledge", "comprehension", "application"],
                    "timeLimitPerQuestion": "2",
                    "numberOfQuestions": str(num_q),
                    "strand": {"Mathematics": "number-operations", "Science": "living-things", "Language Arts": "reading", "Social Studies": "community"}.get(subject, "general"),
                    "essentialOutcomes": f"Assess {topic}",
                    "specificOutcomes": f"Evaluate understanding of {topic}",
                },
                "generatedQuiz": f"# {topic}\n\n1. Question 1\n2. Question 2\n...",
                "parsedQuiz": None,
            })
            quiz_refs.append({
                "id": quiz_id,
                "date": quiz_date,
                "subject": subject,
                "grade": grade,
                "total": num_q,
                "title": topic,
            })
    return quizzes, quiz_refs


def generate_worksheets():
    """Generate worksheets distributed across teaching phases."""
    worksheets = []
    ws_refs = []
    topic_idx = {k: 0 for k in WORKSHEET_TOPICS}

    for key, label, semester, order, start, end in PHASES:
        if not is_teaching_phase(key):
            continue
        n = random.randint(1, 2)
        for _ in range(n):
            cls, subject = pick_class_subject()
            grade = cls["grade"]
            topics = WORKSHEET_TOPICS.get((subject, grade), ["General Worksheet"])
            topic = topics[topic_idx.get((subject, grade), 0) % len(topics)]
            topic_idx[(subject, grade)] = topic_idx.get((subject, grade), 0) + 1

            ws_date = random_date_in_range(start, end)
            ts = unique_ts(ws_date)
            num_q = random.choice([6, 8, 10])
            ws_id = f"worksheet_{ts}"
            worksheets.append({
                "id": ws_id,
                "title": f"{subject} - {topic} (Grade {grade})",
                "timestamp": iso(ws_date),
                "formData": {
                    "subject": subject,
                    "gradeLevel": grade,
                    "strand": {"Mathematics": "number-operations", "Science": "living-things", "Language Arts": "reading", "Social Studies": "community"}.get(subject, "general"),
                    "topic": topic,
                    "studentCount": "25",
                    "questionCount": str(num_q),
                    "questionType": "mixed",
                    "selectedTemplate": "standard",
                    "worksheetTitle": topic,
                    "imageMode": "none",
                    "imageStyle": "",
                    "imagePlacement": "",
                    "essentialOutcomes": f"Practice {topic}",
                    "specificOutcomes": f"Reinforce understanding of {topic}",
                },
                "generatedWorksheet": f"# {topic}\n\nName: ___________\nDate: ___________\n\n1. ...\n2. ...",
                "parsedWorksheet": None,
            })
            ws_refs.append({
                "id": ws_id,
                "date": ws_date,
                "subject": subject,
                "grade": grade,
                "total": num_q,
                "title": topic,
            })
    return worksheets, ws_refs


def generate_rubrics():
    """One rubric per term."""
    rubrics = []
    term_dates = [
        (YEAR_START + timedelta(days=14), "Term 1", "4"),
        (TERM2_START + timedelta(days=14), "Term 2", "2"),
        (TERM3_START + timedelta(days=14), "Term 3", "1"),
    ]
    for rd, term, grade in term_dates:
        subject = random.choice(SUBJECTS)
        ts = unique_ts(rd)
        rubrics.append({
            "id": f"rubric_{ts}",
            "title": f"{term} Assessment Rubric - {subject} (Grade {grade})",
            "timestamp": iso(rd),
            "formData": {
                "assignmentTitle": f"{term} Project",
                "assignmentType": "project",
                "subject": subject,
                "gradeLevel": grade,
                "strand": "number-operations",
                "essentialOutcomes": "Assess term learning",
                "specificOutcomes": "Evaluate comprehensive understanding",
                "learningObjectives": f"Demonstrate {term} learning",
                "specificRequirements": "",
                "performanceLevels": "4",
                "includePointValues": True,
                "focusAreas": ["content-knowledge", "critical-thinking"],
            },
            "generatedRubric": f"# {term} Assessment Rubric\n\n| Criteria | Excellent (4) | Good (3) | Fair (2) | Needs Improvement (1) |",
            "parsedRubric": None,
        })
    return rubrics


def generate_attendance(students):
    """Generate daily attendance for all teaching days."""
    attendance = []
    for key, label, semester, order, start, end in PHASES:
        if not is_teaching_phase(key):
            continue
        school_days = weekdays_in_range(start, end)
        for day in school_days:
            for student in students:
                r = random.random()
                if r < 0.92:
                    status = "Present"
                elif r < 0.96:
                    status = "Late"
                else:
                    status = "Absent"
                # Engagement level for present/late students
                if status != "Absent":
                    eng_r = random.random()
                    if eng_r < 0.35:
                        engagement = "Very High"
                    elif eng_r < 0.70:
                        engagement = "High"
                    elif eng_r < 0.90:
                        engagement = "Engaged"
                    else:
                        engagement = "Low"
                else:
                    engagement = ""
                attendance.append({
                    "id": uid(),
                    "student_id": student["id"],
                    "class_name": student["class_name"],
                    "date": day.isoformat(),
                    "status": status,
                    "engagement_level": engagement,
                    "notes": "",
                    "recorded_at": iso(day, 8, 30),
                })
    return attendance


def students_for_class_subject(students, grade, subject):
    """Find students in this grade (all students in a grade take the same subjects)."""
    return [s for s in students if s["grade_level"] == grade]


def generate_quiz_grades(students, quiz_refs):
    """Generate grades for each student on each quiz, with realistic bell curve."""
    grades = []
    for qref in quiz_refs:
        relevant_students = students_for_class_subject(students, qref["grade"], qref["subject"])
        if not relevant_students:
            relevant_students = students[:5]
        for student in relevant_students:
            # Bell curve around 72% with std dev of 15
            pct = random.gauss(72, 15)
            pct = max(15, min(100, pct))
            score = round(pct / 100 * qref["total"])
            actual_pct = round(score / qref["total"] * 100, 1)
            graded_date = qref["date"] + timedelta(days=random.randint(1, 5))
            grades.append({
                "id": uid(),
                "student_id": student["id"],
                "quiz_id": qref["id"],
                "quiz_title": qref["title"],
                "subject": qref["subject"],
                "score": score,
                "total_points": qref["total"],
                "percentage": actual_pct,
                "letter_grade": letter_grade(actual_pct),
                "graded_at": iso(graded_date, random.randint(14, 17)),
                "source": "manual",
            })
    return grades


def generate_worksheet_grades(students, ws_refs):
    """Generate grades for each student on each worksheet."""
    grades = []
    for wref in ws_refs:
        relevant_students = students_for_class_subject(students, wref["grade"], wref["subject"])
        if not relevant_students:
            relevant_students = students[:5]
        for student in relevant_students:
            pct = random.gauss(74, 14)
            pct = max(20, min(100, pct))
            score = round(pct / 100 * wref["total"])
            actual_pct = round(score / wref["total"] * 100, 1)
            graded_date = wref["date"] + timedelta(days=random.randint(1, 5))
            grades.append({
                "id": uid(),
                "student_id": student["id"],
                "worksheet_id": wref["id"],
                "worksheet_title": wref["title"],
                "subject": wref["subject"],
                "score": score,
                "total_points": wref["total"],
                "percentage": actual_pct,
                "letter_grade": letter_grade(actual_pct),
                "graded_at": iso(graded_date, random.randint(14, 17)),
                "source": "manual",
            })
    return grades


def generate_milestones(academic_phases):
    """Generate curriculum milestones using REAL topic_ids, progressively completed."""
    milestones = []
    teaching_phases = [(k, l, s, o, st, en) for k, l, s, o, st, en in PHASES if is_teaching_phase(k)]
    # Build a lookup from phase_key to the academic_phase UUID for phase_id assignment
    phase_key_to_id = {p["phase_key"]: p["id"] for p in academic_phases}

    # Collect all topics for grades we teach
    all_topics = []
    for grade in GRADES:
        topics = REAL_CURRICULUM_TOPICS.get(grade, [])
        for topic_id, display_name, subject, strand in topics:
            all_topics.append((topic_id, display_name, subject, strand, grade))

    # Shuffle then progressively complete through the year
    # ~65% completed, ~15% in-progress, ~20% not started (realistic for mid-year)
    random.shuffle(all_topics)
    n_total = len(all_topics)
    n_completed = int(n_total * 0.65)
    n_in_progress = int(n_total * 0.15)

    for i, (topic_id, display_name, subject, strand, grade) in enumerate(all_topics):
        # Spread completed milestones across teaching phases
        if i < n_completed:
            status = "completed"
            phase_idx = min(int(i / n_completed * len(teaching_phases)), len(teaching_phases) - 1)
            phase_key, _, _, _, phase_start, phase_end = teaching_phases[phase_idx]
            completed_at = random_date_in_range(phase_start, phase_end)
            completed_str = f"{completed_at.isoformat()} {random.randint(10,16)}:{random.randint(0,59):02d}:00"
            due_date = phase_end.isoformat()
            milestone_phase_id = phase_key_to_id.get(phase_key)
        elif i < n_completed + n_in_progress:
            status = "in-progress"
            completed_str = None
            # In-progress items are in recent phases
            phase_idx = min(len(teaching_phases) - 1, len(teaching_phases) - 3 + (i - n_completed))
            phase_key, _, _, _, phase_start, phase_end = teaching_phases[phase_idx]
            due_date = phase_end.isoformat()
            milestone_phase_id = phase_key_to_id.get(phase_key)
        else:
            status = "not_started"
            completed_str = None
            phase_start = YEAR_START
            phase_end = YEAR_END
            due_date = None
            milestone_phase_id = None

        # Build checklist with 3 sub-items
        checklist = []
        for ci in range(3):
            if status == "completed":
                checked = True
            elif status == "in-progress":
                checked = ci < 2  # 2 of 3 checked
            else:
                checked = False
            checklist.append({
                "key": str(ci),
                "text": f"Outcome {ci + 1}: {display_name} part {ci + 1}",
                "checked": checked,
                "checked_at": iso(random_date_in_range(phase_start, phase_end)) if checked else None,
            })

        milestones.append({
            "id": f"{TEACHER_ID}_{topic_id}",
            "teacher_id": TEACHER_ID,
            "topic_id": topic_id,
            "topic_title": display_name,
            "grade": grade,
            "subject": subject,
            "strand": strand,
            "route": "",
            "status": status,
            "notes": None,
            "due_date": due_date,
            "is_hidden": 0,
            "completed_at": completed_str,
            "created_at": f"{YEAR_START.isoformat()} 09:00:00",
            "updated_at": f"{random_date_in_range(phase_start, phase_end).isoformat()} 09:00:00",
            "checklist_json": json.dumps(checklist),
            "phase_id": milestone_phase_id,
        })
    return milestones


ACHIEVEMENT_TIMELINE = [
    ("first_lesson", 3),
    ("first_chat", 3),
    ("first_student", 2),
    ("first_attendance", 5),
    ("first_analytics", 7),
    ("quiz_creator", 10),
    ("worksheet_first", 12),
    ("rubric_first", 15),
    ("kindergarten_pioneer", 18),
    ("explorer", 20),
    ("presentation_first", 25),
    ("class_builder", 30),
    ("first_grade", 35),
    ("resource_saver_10", 40),
    ("first_milestone", 45),
    ("attendance_week", 50),
    ("first_brain_dump", 55),
    ("streak_3", 60),
    ("multigrade_first", 65),
    ("cross_curricular", 70),
    ("lesson_veteran", 80),
    ("full_house", 90),
    ("chat_regular", 100),
    ("quiz_prolific", 110),
    ("resource_saver_25", 120),
    ("attendance_month", 130),
    ("grading_streak", 140),
    ("streak_7", 150),
    ("milestone_10", 160),
    ("trailblazer", 170),
    ("worksheet_grader", 180),
    ("brain_dump_10", 190),
    ("answer_key_master", 200),
    ("content_50", 220),
    ("century", 250),
    ("night_owl", 270),
]


def generate_achievements():
    """Generate achievements earned progressively through the year."""
    earned = []
    activity_log = []

    # Activity log: one entry per school day
    for key, label, semester, order, start, end in PHASES:
        if not is_teaching_phase(key):
            continue
        school_days = weekdays_in_range(start, end)
        for day in school_days:
            activity_log.append({
                "teacher_id": TEACHER_ID,
                "activity_date": day.isoformat(),
            })

    # Achievements earned at day offsets from YEAR_START
    for achievement_id, day_offset in ACHIEVEMENT_TIMELINE:
        earn_date = YEAR_START + timedelta(days=day_offset)
        earned.append({
            "teacher_id": TEACHER_ID,
            "achievement_id": achievement_id,
            "earned_at": iso(earn_date, random.randint(8, 17)),
        })

    return {"all_earned": earned, "activity_log": activity_log}


def generate_tasks():
    """Generate tasks distributed across phases with progressive completion."""
    tasks = []
    task_templates = [
        ("Prepare Term 1 lesson plans", "Outline all Math and Science lessons for September-December", "high"),
        ("Set up student roster", "Enter all student information into the system", "high"),
        ("Create first quiz", "Design initial assessment for Grade 4 Mathematics", "medium"),
        ("Record attendance for week 1", "Mark attendance for all classes", "medium"),
        ("Plan midterm review activities", "Create review materials for Term 1 midterms", "high"),
        ("Grade midterm quizzes", "Score and record all midterm assessments", "urgent"),
        ("Prepare term reports", "Write progress comments for each student", "high"),
        ("Plan Term 2 curriculum", "Map out topics and timeline for January-March", "medium"),
        ("Create differentiated worksheets", "Design leveled worksheets for mixed-ability groups", "medium"),
        ("Parent-teacher conference prep", "Prepare student progress summaries", "high"),
        ("Update curriculum tracker", "Mark completed topics and plan remaining ones", "medium"),
        ("Plan Easter activities", "Design fun review activities before Easter break", "low"),
        ("Prepare Term 3 materials", "Organize resources for the final term", "medium"),
        ("Create end-of-year review", "Design comprehensive review materials", "high"),
        ("Final exam preparation", "Prepare and organize all exam materials", "urgent"),
        ("Year-end reflection", "Document lessons learned and plans for next year", "low"),
    ]

    for i, (title, desc, priority) in enumerate(task_templates):
        # Spread tasks across the year
        days_offset = int(i / len(task_templates) * 300)
        task_date = YEAR_START + timedelta(days=days_offset)
        completed = i < len(task_templates) - 3  # Last 3 not completed
        tasks.append({
            "id": uid(),
            "title": title,
            "description": desc,
            "date": task_date.isoformat(),
            "priority": priority,
            "completed": completed,
            "createdAt": iso(task_date - timedelta(days=random.randint(1, 7))),
            "updatedAt": iso(task_date + timedelta(days=random.randint(0, 5))) if completed else iso(task_date),
        })
    return tasks


def generate_chats():
    """Generate chat conversations distributed across phases."""
    chats = []
    phase_idx = 0
    for topic_title, user_msg in CHAT_TOPICS:
        phase = PHASES[phase_idx % len(PHASES)]
        key, label, semester, order, start, end = phase
        chat_date = random_date_in_range(start, end)
        phase_idx += 1

        chats.append({
            "id": f"chat_{uid()[:12]}",
            "title": topic_title,
            "timestamp": iso(chat_date),
            "messages": [
                {
                    "id": f"msg_{uid()[:12]}",
                    "role": "user",
                    "content": user_msg,
                    "timestamp": iso(chat_date, 9, random.randint(0, 30)),
                    "attachments": None,
                },
                {
                    "id": f"msg_{uid()[:12]}",
                    "role": "assistant",
                    "content": f"Great question! Here are some suggestions for {topic_title.lower()}:\n\n1. Start with concrete examples that students can relate to\n2. Use collaborative activities to engage different learning styles\n3. Build on prior knowledge and scaffold new concepts\n4. Incorporate formative assessment throughout the lesson\n\nWould you like me to help you plan a specific lesson around this?",
                    "timestamp": iso(chat_date, 9, random.randint(31, 59)),
                    "attachments": None,
                },
            ],
        })
    return chats


def generate_brain_dumps():
    """Generate brain dump entries across phases."""
    dumps = []
    dump_texts = [
        "Need to prepare fractions worksheets for next week. Also should check if the manipulatives kit has enough fraction tiles.",
        "Parent of Marcus mentioned he's struggling with reading at home. Should coordinate with the reading specialist.",
        "Great idea for a science experiment - growing beans in different conditions. Need to get supplies.",
        "Midterm coming up. Need to review all topics covered so far and create a study guide.",
        "Christmas concert planning - need to coordinate with the music teacher.",
        "New term resolutions: more hands-on activities, better attendance tracking, weekly brain dumps.",
        "Should try the jigsaw method for the next group activity. Worked well in the workshop.",
        "Term 2 midterms need to include more application questions, not just recall.",
        "Easter break - good time to reorganize classroom library and update bulletin boards.",
        "Need to plan end-of-year celebrations. Maybe a science fair combined with a math competition?",
        "Final exam schedule needs to be communicated to parents early. Draft the letter this week.",
        "Reflection: students improved significantly in fractions this year. The hands-on approach worked.",
    ]

    for i, text in enumerate(dump_texts):
        phase_idx = i % len(PHASES)
        key, label, semester, order, start, end = PHASES[phase_idx]
        dump_date = random_date_in_range(start, end)
        ts = unique_ts(dump_date)
        dumps.append({
            "id": f"entry-{ts}",
            "text": text,
            "timestamp": iso(dump_date),
            "actions": [],
            "suggestions": [],
        })
    return dumps


def generate_calendar(quiz_refs, ws_refs):
    """Generate calendar reminders for quizzes, worksheets, and key events."""
    reminders = []

    # Quiz reminders
    for qref in quiz_refs:
        reminders.append({
            "id": uid(),
            "title": qref["title"],
            "description": f"Grade {qref['grade']} {qref['subject']} Assessment",
            "test_date": qref["date"].isoformat(),
            "test_time": "09:00",
            "type": "quiz",
            "reference_id": qref["id"],
            "subject": qref["subject"],
            "grade_level": qref["grade"],
            "created_at": iso(qref["date"] - timedelta(days=7)),
        })

    # Worksheet reminders
    for wref in ws_refs[:5]:  # Just a few
        reminders.append({
            "id": uid(),
            "title": f"{wref['title']} Due",
            "description": f"Grade {wref['grade']} worksheet due",
            "test_date": (wref["date"] + timedelta(days=3)).isoformat(),
            "test_time": "09:00",
            "type": "worksheet",
            "reference_id": wref["id"],
            "subject": wref["subject"],
            "grade_level": wref["grade"],
            "created_at": iso(wref["date"]),
        })

    # Key school events
    key_events = [
        (MIDTERM1_START, "Term 1 Mid-Term Exams Begin"),
        (CHRISTMAS_START, "Christmas Break Begins"),
        (TERM2_START, "Term 2 Begins"),
        (MIDTERM2_START, "Term 2 Mid-Term Exams Begin"),
        (EASTER_START, "Easter Break Begins"),
        (TERM3_START, "Term 3 Begins"),
        (FINAL_EXAM_START, "End-of-Year Exams Begin"),
    ]
    for event_date, title in key_events:
        reminders.append({
            "id": uid(),
            "title": title,
            "description": title,
            "test_date": event_date.isoformat(),
            "test_time": "08:00",
            "type": "reminder",
            "reference_id": "",
            "subject": "",
            "grade_level": "",
            "created_at": iso(event_date - timedelta(days=14)),
        })

    return {"reminders": reminders}


def generate_sticky_notes():
    """Generate a few sticky notes."""
    notes = [
        ("Collect permission slips by Friday", "#FFE066"),
        ("Order new math manipulatives", "#A7F3D0"),
        ("Staff meeting Thursday 3pm", "#BFDBFE"),
        ("Update bulletin board - Term 2 theme", "#FCA5A5"),
        ("Send parent progress reports", "#DDD6FE"),
        ("Grade 4 science fair project ideas", "#FDE68A"),
    ]
    group_id = uid()
    return {
        "notes": [
            {
                "id": uid(),
                "text": text,
                "color": color,
                "groupId": group_id,
                "position": {"x": 50 + i * 60, "y": 50 + (i % 3) * 80},
                "createdAt": iso(YEAR_START + timedelta(days=i * 30)),
                "updatedAt": iso(YEAR_START + timedelta(days=i * 30 + random.randint(0, 5))),
            }
            for i, (text, color) in enumerate(notes)
        ]
    }


def generate_presentations():
    """One presentation per term."""
    presentations = []
    terms = [
        (YEAR_START + timedelta(days=30), "Term 1 Parent Night", "1"),
        (TERM2_START + timedelta(days=30), "Term 2 Science Showcase", "4"),
        (TERM3_START + timedelta(days=20), "End of Year Review", "2"),
    ]
    for pdate, title, grade in terms:
        ts = unique_ts(pdate)
        presentations.append({
            "id": f"presentation_{ts}",
            "title": title,
            "timestamp": iso(pdate),
            "formData": {
                "topic": title,
                "gradeLevel": grade,
                "subject": random.choice(SUBJECTS),
                "slideCount": str(random.randint(8, 15)),
            },
            "generatedPresentation": f"# {title}\n\nSlide 1: Introduction\nSlide 2: Overview\n...",
        })
    return presentations


def generate_storybooks():
    """Two storybooks."""
    books = [
        ("The Mango Tree", "1", "Science", "A story about a mango tree and the creatures that live in it"),
        ("The Counting Carnival", "2", "Mathematics", "A fun adventure through a carnival using counting and patterns"),
    ]
    storybooks = {"metadata": []}
    for title, grade, subject, desc in books:
        storybooks["metadata"].append({
            "id": uid(),
            "savedAt": iso(YEAR_START + timedelta(days=random.randint(30, 120))),
            "status": "completed",
            "formData": {
                "title": title,
                "gradeLevel": grade,
                "subject": subject,
                "description": desc,
                "numberOfPages": 5,
                "ageGroup": "5-7",
                "theme": "educational",
            },
            "parsedBook": {
                "title": title,
                "pages": [
                    {"pageNumber": i + 1, "text": f"Page {i + 1} of {title}.", "characterName": "Main Character"}
                    for i in range(5)
                ],
            },
            "hasImages": False,
            "hasAudio": False,
        })
    return storybooks


def generate_images():
    """A few generated images."""
    images = []
    image_topics = [
        ("Fraction circles diagram", "Mathematics", "4"),
        ("Water cycle illustration", "Science", "2"),
        ("Number line to 20", "Mathematics", "1"),
        ("Food chain poster", "Science", "4"),
    ]
    for title, subject, grade in image_topics:
        img_date = random_date_in_range(YEAR_START, TERM2_END)
        ts = unique_ts(img_date)
        images.append({
            "id": f"image_{ts}",
            "title": title,
            "timestamp": iso(img_date),
            "formData": {
                "prompt": title,
                "subject": subject,
                "gradeLevel": grade,
            },
        })
    return images


def generate_settings():
    # appSettings must match the frontend Settings interface from SettingsContext.tsx
    # The profile.gradeSubjects mapping drives which grades/subjects appear throughout the app
    return {
        "appSettings": {
            "fontSize": 100,
            "theme": "light",
            "language": "en",
            "aiModel": "default",
            "profile": {
                "displayName": TEACHER_NAME,
                "school": SCHOOL_NAME,
                "gradeSubjects": {
                    "1": ["Mathematics"],
                    "2": ["Science", "Language Arts"],
                    "4": ["Mathematics"],
                },
                "filterContentByProfile": True,
            },
        },
        "user": {
            "username": TEACHER_ID,
            "name": TEACHER_NAME,
            "email": "claudette.joseph@example.com",
            "role": "teacher",
            "school": SCHOOL_NAME,
            "country": COUNTRY,
        },
        "profileImage": None,
        "dashboardTabs": None,
        "dashboardActiveTab": None,
        "dashboardSplitView": None,
    }


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("Generating comprehensive demo data...")

    # Core data
    students = generate_students()
    academic_phases = generate_academic_phases()
    snapshots = generate_metric_snapshots(academic_phases)
    phase_summaries = generate_phase_summaries(academic_phases, snapshots)

    lesson_plans = generate_lesson_plans()
    kindergarten = generate_kindergarten_plans()
    multigrade = generate_multigrade_plans()
    cross_curricular = generate_cross_curricular_plans()
    quizzes, quiz_refs = generate_quizzes()
    worksheets, ws_refs = generate_worksheets()
    rubrics = generate_rubrics()

    attendance = generate_attendance(students)
    quiz_grades = generate_quiz_grades(students, quiz_refs)
    worksheet_grades = generate_worksheet_grades(students, ws_refs)
    milestones = generate_milestones(academic_phases)
    achievements = generate_achievements()
    tasks = generate_tasks()
    chats = generate_chats()
    brain_dumps = generate_brain_dumps()
    calendar = generate_calendar(quiz_refs, ws_refs)
    sticky_notes = generate_sticky_notes()
    presentations = generate_presentations()
    storybooks = generate_storybooks()
    images = generate_images()
    settings = generate_settings()

    # Build the backup JSON
    backup = {
        "exportDate": datetime.now().isoformat() + "Z",
        "version": "1.0.0",
        "categories": [
            "chats", "lesson_plans", "kindergarten", "multigrade",
            "cross_curricular", "quizzes", "rubrics", "worksheets",
            "images", "presentations", "brain_dumps", "tasks",
            "milestones", "achievements", "students", "calendar",
            "storybooks", "sticky_notes", "lesson_drafts", "settings",
            "teacher_metrics",
        ],
        "data": {
            "chats": chats,
            "lesson_plans": lesson_plans,
            "kindergarten": kindergarten,
            "multigrade": multigrade,
            "cross_curricular": cross_curricular,
            "quizzes": quizzes,
            "rubrics": rubrics,
            "worksheets": worksheets,
            "images": images,
            "presentations": presentations,
            "brain_dumps": brain_dumps,
            "tasks": tasks,
            "milestones": milestones,
            "achievements": achievements,
            "students": {
                "students": students,
                "attendance": attendance,
                "quiz_grades": quiz_grades,
                "worksheet_grades": worksheet_grades,
                "quiz_answer_keys": [],
                "worksheet_answer_keys": [],
                "quiz_instances": [],
                "worksheet_instances": [],
                "worksheet_packages": [],
                "answer_region_templates": [],
            },
            "calendar": calendar,
            "storybooks": storybooks,
            "sticky_notes": sticky_notes,
            "lesson_drafts": [],
            "settings": settings,
            "teacher_metrics": {
                "snapshots": snapshots,
                "school_year_config": [generate_school_year_config()],
                "academic_phases": academic_phases,
                "academic_phase_summaries": phase_summaries,
                "school_year_events": [],
            },
        },
    }

    # Write output
    output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "demo_year_data.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(backup, f, indent=2, ensure_ascii=True)

    # Print summary
    print(f"\nDemo data generated: {output_path}")
    print(f"  Students: {len(students)}")
    print(f"  Attendance records: {len(attendance)}")
    print(f"  Lesson plans: {len(lesson_plans)}")
    print(f"  Kindergarten plans: {len(kindergarten)}")
    print(f"  Multigrade plans: {len(multigrade)}")
    print(f"  Cross-curricular plans: {len(cross_curricular)}")
    print(f"  Quizzes: {len(quizzes)}")
    print(f"  Worksheets: {len(worksheets)}")
    print(f"  Rubrics: {len(rubrics)}")
    print(f"  Quiz grades: {len(quiz_grades)}")
    print(f"  Worksheet grades: {len(worksheet_grades)}")
    print(f"  Milestones: {len(milestones)}")
    print(f"  Achievements earned: {len(achievements['all_earned'])}")
    print(f"  Activity log entries: {len(achievements['activity_log'])}")
    print(f"  Tasks: {len(tasks)}")
    print(f"  Chats: {len(chats)}")
    print(f"  Brain dumps: {len(brain_dumps)}")
    print(f"  Calendar reminders: {len(calendar['reminders'])}")
    print(f"  Metric snapshots: {len(snapshots)}")
    print(f"  Phase summaries: {len(phase_summaries)}")
    print(f"  Presentations: {len(presentations)}")
    print(f"  Storybooks: {len(storybooks['metadata'])}")
    print(f"  Images: {len(images)}")
    print(f"  Sticky notes: {len(sticky_notes['notes'])}")


if __name__ == "__main__":
    main()
