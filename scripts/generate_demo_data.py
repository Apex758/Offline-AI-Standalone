"""
Generate demo data for the OECS Learning Hub app.

Produces a JSON backup file that can be imported via Settings > Import
to populate a fresh app with a full academic year of realistic teacher data.

Usage:
    python scripts/generate_demo_data.py --school-year 2024 --output demo_backup.json
"""

import argparse
import json
import random
import uuid
import hashlib
from datetime import datetime, timedelta, date
from typing import List, Dict, Any, Optional, Tuple

# ---------------------------------------------------------------------------
# Caribbean name pools
# ---------------------------------------------------------------------------
FEMALE_FIRST = [
    "Aaliyah", "Brianna", "Camille", "Destiny", "Eleana", "Fiona", "Genique",
    "Hashana", "Imani", "Jalissa", "Kiara", "Latoya", "Monique", "Nadia",
    "Ornella", "Priya", "Quiana", "Renelle", "Simone", "Tashara", "Uniqua",
    "Vanessa", "Wanda", "Xandria", "Yolanda", "Zara", "Anika", "Davina",
    "Elissa", "Gabrielle",
]

MALE_FIRST = [
    "Aaron", "Brandon", "Caleb", "Demarco", "Emmanuel", "Frankie", "Giovanni",
    "Hakeem", "Isaiah", "Jaylon", "Keon", "Linton", "Marcus", "Nathan",
    "Omari", "Pharrell", "Quinton", "Ricardo", "Shaquille", "Tremaine",
    "Ulric", "Vincent", "Wycliffe", "Xavier", "Yannick", "Zion", "Andre",
    "Darnell", "Ethan", "Garfield",
]

LAST_NAMES = [
    "Baptiste", "Belmar", "Charles", "Clarke", "Daniel", "Edwards", "Felix",
    "George", "Henry", "Isaac", "James", "Joseph", "King", "Lewis", "Martin",
    "Noel", "Oscar", "Peters", "Phillip", "Roberts", "Samuel", "Thomas",
    "Victor", "Williams", "Xavier", "Young", "Alexander", "Brown", "Francis",
    "St. Rose",
]

# ---------------------------------------------------------------------------
# Curriculum data
# ---------------------------------------------------------------------------
MATH_TOPICS = {
    "1": [
        ("Counting to 20", "number-operations", "Count forward and backward from 0 to 20"),
        ("Addition to 10", "number-operations", "Add whole numbers with sums to 10"),
        ("Subtraction from 10", "number-operations", "Subtract from numbers up to 10"),
        ("Shapes Around Us", "geometry", "Identify and name basic 2D shapes"),
        ("Patterns", "patterns-algebra", "Recognize and extend simple patterns"),
        ("Comparing Numbers", "number-operations", "Compare and order numbers to 20"),
    ],
    "2": [
        ("Place Value to 100", "number-operations", "Understand tens and ones place value"),
        ("Addition to 100", "number-operations", "Add two-digit numbers with and without regrouping"),
        ("Subtraction to 100", "number-operations", "Subtract two-digit numbers"),
        ("Introduction to Multiplication", "number-operations", "Understand multiplication as repeated addition"),
        ("Measurement - Length", "measurement", "Measure length using standard and non-standard units"),
        ("Time and Calendar", "measurement", "Read time to the half hour and use calendar"),
        ("Data Collection", "data-statistics", "Collect and organize data using tally charts"),
    ],
    "4": [
        ("Fractions", "number-operations", "Identify, compare, and order fractions"),
        ("Decimal Numbers", "number-operations", "Understand decimals to hundredths"),
        ("Multi-digit Multiplication", "number-operations", "Multiply multi-digit numbers"),
        ("Division", "number-operations", "Divide with single-digit divisors"),
        ("Area and Perimeter", "measurement", "Calculate area and perimeter of rectangles"),
        ("Data and Statistics", "data-statistics", "Create and interpret bar graphs and pictographs"),
        ("Geometry - Angles", "geometry", "Identify and measure angles"),
        ("Problem Solving Strategies", "number-operations", "Apply strategies to solve multi-step word problems"),
    ],
}

SCIENCE_TOPICS = {
    "1": [
        ("Living Things", "living-things", "Identify living and non-living things"),
        ("My Five Senses", "living-things", "Explore the five senses and their functions"),
        ("Weather", "earth-science", "Observe and describe daily weather patterns"),
        ("Materials Around Us", "matter-energy", "Classify materials by properties"),
        ("Plants We Know", "living-things", "Identify parts of a plant and their needs"),
        ("Animals and Their Homes", "living-things", "Describe different animal habitats"),
    ],
    "2": [
        ("Plants and Animals", "living-things", "Compare and classify plants and animals"),
        ("Habitats", "living-things", "Describe different habitats and how animals adapt"),
        ("Simple Machines", "matter-energy", "Identify simple machines in everyday life"),
        ("The Water Cycle", "earth-science", "Describe the stages of the water cycle"),
        ("Healthy Bodies", "living-things", "Understand nutrition and hygiene"),
        ("Push and Pull Forces", "matter-energy", "Investigate push and pull forces"),
    ],
}

# ---------------------------------------------------------------------------
# School calendar helpers
# ---------------------------------------------------------------------------
# Public holidays for a Caribbean OECS context (approximate)
def get_public_holidays(year: int) -> set:
    """Return set of date objects for public holidays in the school year."""
    holidays = set()
    # New Year
    holidays.add(date(year + 1, 1, 1))
    holidays.add(date(year + 1, 1, 2))
    # Carnival (Feb)
    holidays.add(date(year + 1, 2, 17))
    holidays.add(date(year + 1, 2, 18))
    # Easter approximate (mid-April)
    holidays.add(date(year + 1, 4, 18))
    holidays.add(date(year + 1, 4, 21))
    # Labour Day
    holidays.add(date(year + 1, 5, 1))
    # Whit Monday (late May)
    holidays.add(date(year + 1, 5, 19))
    # Emancipation Day (Aug 1 - outside school year usually)
    # Independence Day (Oct 22 for Saint Lucia)
    holidays.add(date(year, 10, 22))
    # Thanksgiving / Heritage (Oct)
    holidays.add(date(year, 10, 28))
    # Christmas
    holidays.add(date(year, 12, 25))
    holidays.add(date(year, 12, 26))
    return holidays


def get_school_terms(year: int) -> List[Tuple[date, date]]:
    """Return (start, end) for each of the 3 school terms."""
    return [
        (date(year, 9, 2), date(year, 12, 13)),      # Term 1
        (date(year + 1, 1, 6), date(year + 1, 3, 27)),  # Term 2
        (date(year + 1, 4, 21), date(year + 1, 6, 27)),  # Term 3
    ]


def get_school_days(year: int) -> List[date]:
    """Return all school days (Mon-Fri, excluding holidays and breaks)."""
    terms = get_school_terms(year)
    holidays = get_public_holidays(year)
    days = []
    for start, end in terms:
        d = start
        while d <= end:
            if d.weekday() < 5 and d not in holidays:  # Mon-Fri
                days.append(d)
            d += timedelta(days=1)
    return days


def iso_ts(d: date, hour: int = 9, minute: int = 0) -> str:
    """Generate ISO timestamp string."""
    return datetime(d.year, d.month, d.day, hour, minute, 0).isoformat() + ".000Z"


def random_ts(d: date, hour_range: Tuple[int, int] = (7, 18)) -> str:
    """Generate random ISO timestamp on a given date within school hours."""
    h = random.randint(hour_range[0], hour_range[1])
    m = random.randint(0, 59)
    s = random.randint(0, 59)
    ms = random.randint(0, 999)
    return f"{d.isoformat()}T{h:02d}:{m:02d}:{s:02d}.{ms:03d}Z"


def sqlite_ts(d: date, hour: int = 9, minute: int = 0) -> str:
    """Generate SQLite timestamp format."""
    return f"{d.isoformat()} {hour:02d}:{minute:02d}:00"


def gen_id(prefix: str, d: date) -> str:
    """Generate a realistic ID with timestamp-like suffix."""
    ts = int(datetime(d.year, d.month, d.day, random.randint(7, 18), random.randint(0, 59)).timestamp() * 1000)
    return f"{prefix}_{ts}"


def gen_student_id(first: str, last: str) -> str:
    """Generate student ID in XY12345 format."""
    initials = (first[0] + last[0]).upper()
    h = hashlib.md5(f"{first}{last}".encode()).hexdigest()
    num = int(h[:5], 16) % 100000
    return f"{initials}{num:05d}"


# ---------------------------------------------------------------------------
# Student generation
# ---------------------------------------------------------------------------
def generate_students(num: int, class_name: str, grade: str, rng: random.Random) -> List[Dict]:
    """Generate a class of students."""
    students = []
    used_names = set()
    for i in range(num):
        while True:
            gender = rng.choice(["male", "female"])
            first = rng.choice(MALE_FIRST if gender == "male" else FEMALE_FIRST)
            last = rng.choice(LAST_NAMES)
            if (first, last) not in used_names:
                used_names.add((first, last))
                break
        sid = gen_student_id(first, last)
        # Random DOB for age-appropriate students
        birth_year = 2024 - int(grade) - rng.randint(5, 6)
        birth_month = rng.randint(1, 12)
        birth_day = rng.randint(1, 28)
        students.append({
            "id": sid,
            "full_name": f"{first} {last}",
            "first_name": first,
            "middle_name": "",
            "last_name": last,
            "date_of_birth": f"{birth_year}-{birth_month:02d}-{birth_day:02d}",
            "class_name": class_name,
            "grade_level": grade,
            "gender": gender,
            "contact_info": json.dumps({"parent": f"Parent of {first}", "phone": f"1-758-{rng.randint(100,999)}-{rng.randint(1000,9999)}"}),
            "created_at": sqlite_ts(date(2024, 9, 2), 8, 30),
        })
    return students


# ---------------------------------------------------------------------------
# Attendance generation
# ---------------------------------------------------------------------------
def generate_attendance(students: List[Dict], school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate attendance records for all students across the year."""
    records = []
    for student in students:
        # Each student has a random sick week
        sick_start = rng.choice(school_days[20:-20])
        sick_days = set()
        d = sick_start
        for _ in range(rng.randint(3, 5)):
            sick_days.add(d)
            d += timedelta(days=1)

        for day in school_days:
            if day in sick_days:
                status = "absent"
            else:
                roll = rng.random()
                if roll < 0.95:
                    status = "present"
                elif roll < 0.98:
                    status = "late"
                else:
                    status = "absent"
            records.append({
                "id": str(uuid.uuid4()),
                "student_id": student["id"],
                "date": day.isoformat(),
                "status": status,
                "note": "",
            })
    return records


# ---------------------------------------------------------------------------
# Quiz / Worksheet grades
# ---------------------------------------------------------------------------
def generate_quiz_grades(
    students: List[Dict], quiz_ids: List[str], dates: List[date],
    rng: random.Random, total_questions: int = 10
) -> List[Dict]:
    """Generate quiz grades for students."""
    grades = []
    for qi, qid in enumerate(quiz_ids):
        grade_date = dates[qi] if qi < len(dates) else dates[-1]
        for student in students:
            # Realistic distribution: mean ~72%, std ~12%
            score = max(0, min(total_questions, int(rng.gauss(7.2, 1.2))))
            percentage = round(score / total_questions * 100, 1)
            grades.append({
                "id": str(uuid.uuid4()),
                "student_id": student["id"],
                "quiz_id": qid,
                "score": score,
                "total": total_questions,
                "percentage": percentage,
                "graded_at": random_ts(grade_date + timedelta(days=rng.randint(1, 3))),
                "source": "manual",
            })
    return grades


def generate_worksheet_grades(
    students: List[Dict], ws_ids: List[str], dates: List[date],
    rng: random.Random, total_questions: int = 8
) -> List[Dict]:
    """Generate worksheet grades for students."""
    grades = []
    for wi, wid in enumerate(ws_ids):
        grade_date = dates[wi] if wi < len(dates) else dates[-1]
        for student in students:
            score = max(0, min(total_questions, int(rng.gauss(6.0, 1.5))))
            percentage = round(score / total_questions * 100, 1)
            grades.append({
                "id": str(uuid.uuid4()),
                "student_id": student["id"],
                "worksheet_id": wid,
                "score": score,
                "total": total_questions,
                "percentage": percentage,
                "graded_at": random_ts(grade_date + timedelta(days=rng.randint(1, 3))),
                "source": "manual",
            })
    return grades


# ---------------------------------------------------------------------------
# Content generators
# ---------------------------------------------------------------------------
def generate_lesson_plans(school_days: List[date], year: int, rng: random.Random) -> List[Dict]:
    """Generate 40+ lesson plans spread across the year."""
    plans = []
    # Distribute across classes: Grade 4 Math, Grade 2 Math, Grade 2 Science, Grade 1 Science
    class_configs = [
        ("4", "Mathematics", MATH_TOPICS["4"]),
        ("2", "Mathematics", MATH_TOPICS["2"]),
        ("2", "Science", SCIENCE_TOPICS["2"]),
        ("1", "Science", SCIENCE_TOPICS["1"]),
    ]

    # Spread ~10 plans per class config across the year
    for grade, subject, topics in class_configs:
        # Pick ~10 evenly spaced school days
        step = max(1, len(school_days) // 11)
        plan_days = [school_days[i * step + rng.randint(0, max(0, step - 1))]
                     for i in range(10) if i * step < len(school_days)]

        for i, day in enumerate(plan_days):
            topic_name, strand, outcome = topics[i % len(topics)]
            pid = gen_id("plan", day)
            plans.append({
                "id": pid,
                "title": f"{subject} - {topic_name} (Grade {grade})",
                "timestamp": random_ts(day),
                "formData": {
                    "subject": subject,
                    "gradeLevel": grade,
                    "topic": topic_name,
                    "strand": strand,
                    "essentialOutcomes": f"Students will understand {topic_name.lower()}",
                    "specificOutcomes": outcome,
                    "studentCount": "25",
                    "duration": "60",
                    "pedagogicalStrategies": rng.sample(
                        ["direct-instruction", "cooperative-learning", "inquiry-based",
                         "differentiated-instruction", "hands-on"], 2),
                    "learningStyles": ["visual", "kinesthetic"],
                    "learningPreferences": [],
                    "multipleIntelligences": ["logical-mathematical"],
                    "customLearningStyles": "",
                    "materials": f"Textbook, whiteboard, {topic_name.lower()} manipulatives",
                    "prerequisiteSkills": f"Basic understanding of {strand.replace('-', ' ')}",
                    "specialNeeds": False,
                    "specialNeedsDetails": "",
                    "additionalInstructions": "",
                    "referenceUrl": "",
                },
                "generatedPlan": f"# {topic_name}\n\n## Objective\n{outcome}\n\n## Introduction (10 min)\nBegin with a review of previous concepts...\n\n## Development (35 min)\nGuided practice with {topic_name.lower()}...\n\n## Closure (15 min)\nStudents summarize key learning points...",
                "parsedLesson": None,
                "curriculumMatches": None,
                "edit_count": 1,
            })
    return plans


def generate_quizzes(school_days: List[date], year: int, rng: random.Random) -> Tuple[List[Dict], List[Dict]]:
    """Generate quiz history entries and answer keys. Returns (quizzes, answer_keys)."""
    quizzes = []
    answer_keys = []
    terms = get_school_terms(year)

    # 6 quizzes per term = 18 total, spread across Grade 4 Math, Grade 2 Math, Grade 1 Science
    quiz_configs = [
        ("4", "Mathematics"), ("4", "Mathematics"),
        ("2", "Mathematics"), ("2", "Mathematics"),
        ("2", "Science"), ("1", "Science"),
    ]

    quiz_dates = []
    for term_start, term_end in terms:
        # Place quizzes near mid-term and end-of-term
        mid = term_start + (term_end - term_start) // 2
        for offset in [-5, -2, 0, 3, 5, 8]:
            d = mid + timedelta(days=offset)
            while d.weekday() >= 5:
                d += timedelta(days=1)
            quiz_dates.append(d)

    for i, (grade, subject) in enumerate(quiz_configs * 3):
        if i >= 18:
            break
        day = quiz_dates[i] if i < len(quiz_dates) else school_days[-10 + i]
        topics = MATH_TOPICS.get(grade, SCIENCE_TOPICS.get(grade, []))
        topic_name, strand, outcome = topics[i % len(topics)]
        qid = gen_id("quiz", day)

        quizzes.append({
            "id": qid,
            "title": f"{subject} - {topic_name} Quiz (Grade {grade})",
            "timestamp": random_ts(day),
            "formData": {
                "subject": subject,
                "gradeLevel": grade,
                "learningOutcomes": outcome,
                "questionTypes": ["multiple-choice", "short-answer"],
                "cognitiveLevels": ["knowledge", "comprehension", "application"],
                "timeLimitPerQuestion": "2",
                "numberOfQuestions": "10",
                "strand": strand,
                "essentialOutcomes": f"Understand {topic_name.lower()}",
                "specificOutcomes": outcome,
            },
            "generatedQuiz": f"# {topic_name} Quiz\n\n1. What is...?\n2. Explain...?\n3. Calculate...\n(10 questions total)",
            "parsedQuiz": None,
        })

        answer_keys.append({
            "id": str(uuid.uuid4()),
            "quiz_id": qid,
            "title": f"{subject} - {topic_name} Quiz (Grade {grade})",
            "subject": subject,
            "grade_level": grade,
            "total_questions": 10,
            "questions": json.dumps([
                {"number": n, "answer": f"Answer {n}", "points": 1}
                for n in range(1, 11)
            ]),
            "created_at": random_ts(day),
        })

        quiz_dates.append(day)  # for grade generation

    return quizzes, answer_keys


def generate_worksheets(school_days: List[date], year: int, rng: random.Random) -> Tuple[List[Dict], List[Dict]]:
    """Generate worksheet history entries and answer keys."""
    worksheets = []
    answer_keys = []
    terms = get_school_terms(year)

    ws_configs = [
        ("4", "Mathematics"), ("2", "Mathematics"),
        ("2", "Science"), ("1", "Science"),
    ]

    ws_dates = []
    for term_start, term_end in terms:
        step = (term_end - term_start).days // 5
        for j in range(4):
            d = term_start + timedelta(days=step * (j + 1))
            while d.weekday() >= 5:
                d += timedelta(days=1)
            ws_dates.append(d)

    for i in range(12):
        grade, subject = ws_configs[i % len(ws_configs)]
        day = ws_dates[i] if i < len(ws_dates) else school_days[-(12 - i)]
        topics = MATH_TOPICS.get(grade, SCIENCE_TOPICS.get(grade, []))
        topic_name, strand, outcome = topics[i % len(topics)]
        wid = gen_id("worksheet", day)

        worksheets.append({
            "id": wid,
            "title": f"{subject} - {topic_name} Worksheet (Grade {grade})",
            "timestamp": random_ts(day),
            "formData": {
                "subject": subject,
                "gradeLevel": grade,
                "strand": strand,
                "topic": topic_name,
                "studentCount": "25",
                "questionCount": "8",
                "questionType": "mixed",
                "selectedTemplate": "standard",
                "worksheetTitle": f"{topic_name} Practice",
                "imageMode": "none",
                "imageStyle": "",
                "imagePlacement": "",
                "essentialOutcomes": f"Understand {topic_name.lower()}",
                "specificOutcomes": outcome,
            },
            "generatedWorksheet": f"# {topic_name} Worksheet\n\nName: ___________\nDate: ___________\n\n1. ...\n2. ...\n(8 questions)",
            "parsedWorksheet": None,
        })

        answer_keys.append({
            "id": str(uuid.uuid4()),
            "worksheet_id": wid,
            "title": f"{subject} - {topic_name} Worksheet (Grade {grade})",
            "subject": subject,
            "grade_level": grade,
            "total_questions": 8,
            "questions": json.dumps([
                {"number": n, "answer": f"Answer {n}", "points": 1}
                for n in range(1, 9)
            ]),
            "created_at": random_ts(day),
        })

    return worksheets, answer_keys


def generate_rubrics(school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate rubric history entries."""
    rubric_configs = [
        ("4", "Mathematics", "Problem Solving Assessment", "number-operations",
         "Evaluate mathematical problem-solving skills"),
        ("2", "Science", "Science Project Rubric", "living-things",
         "Assess understanding of living things through project"),
        ("1", "Science", "Science Observation Journal", "living-things",
         "Evaluate observation and recording skills"),
        ("4", "Mathematics", "Data Presentation Rubric", "data-statistics",
         "Assess ability to create and interpret graphs"),
        ("2", "Mathematics", "Math Portfolio", "number-operations",
         "Evaluate overall math understanding through portfolio"),
        ("2", "Science", "Habitat Diorama Rubric", "living-things",
         "Assess understanding of habitats through creative project"),
        ("4", "Mathematics", "Fraction Operations Quiz Rubric", "number-operations",
         "Evaluate fraction computation accuracy and strategy"),
        ("1", "Science", "Weather Chart Rubric", "earth-science",
         "Assess daily weather observation recording"),
        ("2", "Mathematics", "Measurement Activity Rubric", "measurement",
         "Evaluate measurement skills using standard units"),
        ("4", "Mathematics", "Geometry Project Rubric", "geometry",
         "Assess understanding of angles and shapes"),
    ]

    rubrics = []
    step = max(1, len(school_days) // (len(rubric_configs) + 1))
    for i, (grade, subject, title, strand, objective) in enumerate(rubric_configs):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        rubrics.append({
            "id": gen_id("rubric", day),
            "title": f"{title} - {subject} (Grade {grade})",
            "timestamp": random_ts(day),
            "formData": {
                "assignmentTitle": title,
                "assignmentType": "project",
                "subject": subject,
                "gradeLevel": grade,
                "strand": strand,
                "essentialOutcomes": objective,
                "specificOutcomes": objective,
                "learningObjectives": objective,
                "specificRequirements": "",
                "performanceLevels": "4",
                "includePointValues": True,
                "focusAreas": ["content-knowledge", "critical-thinking"],
            },
            "generatedRubric": f"# {title}\n\n| Criteria | Excellent (4) | Good (3) | Developing (2) | Beginning (1) |\n|---|---|---|---|---|\n| Understanding | ... | ... | ... | ... |",
            "parsedRubric": None,
        })
    return rubrics


def generate_kindergarten_plans(school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate early childhood plan entries."""
    configs = [
        ("Animals Around Us", "Science", "living-things", "3-4"),
        ("Counting Fun", "Mathematics", "number-operations", "4-5"),
        ("My Family", "Social Studies", "community", "3-4"),
        ("Colours and Shapes", "Mathematics", "geometry", "3-4"),
        ("Healthy Eating", "Science", "living-things", "4-5"),
    ]
    plans = []
    step = max(1, len(school_days) // 6)
    for i, (topic, subject, strand, age) in enumerate(configs):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        plans.append({
            "id": gen_id("kindergarten", day),
            "title": f"{topic} - {subject} (Age {age})",
            "timestamp": random_ts(day),
            "formData": {
                "lessonTopic": topic,
                "curriculumUnit": subject,
                "week": str(i + 1),
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][day.weekday()],
                "date": day.isoformat(),
                "ageGroup": age,
                "students": "20",
                "creativityLevel": 7,
                "learningDomains": ["cognitive", "physical", "social-emotional"],
                "duration": "45",
                "additionalRequirements": "",
                "includeAssessments": True,
                "includeMaterials": True,
                "curriculumSubject": subject,
                "strand": strand,
                "essentialOutcomes": f"Explore {topic.lower()}",
                "specificOutcomes": f"Students will be able to describe {topic.lower()}",
            },
            "generatedPlan": f"# {topic}\n\nCircle Time (10 min)...\nExploration (20 min)...\nCreative Activity (15 min)...",
            "parsedPlan": None,
        })
    return plans


def generate_multigrade_plans(school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate multi-level plan entries."""
    configs = [
        ("Mathematics", "1-2", "Addition and Subtraction", "number-operations"),
        ("Science", "1-2", "Living and Non-Living Things", "living-things"),
        ("Mathematics", "2-4", "Measurement in Real Life", "measurement"),
        ("Science", "1-2", "Weather Patterns", "earth-science"),
        ("Mathematics", "2-4", "Data and Graphs", "data-statistics"),
    ]
    plans = []
    step = max(1, len(school_days) // 6)
    for i, (subject, grades, topic, strand) in enumerate(configs):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        plans.append({
            "id": gen_id("multigrade", day),
            "title": f"{subject} - {topic} (Grades {grades})",
            "timestamp": random_ts(day),
            "formData": {
                "subject": subject,
                "gradeRange": grades,
                "topic": topic,
                "essentialLearningOutcomes": f"Understand {topic.lower()}",
                "specificLearningObjectives": f"Apply knowledge of {topic.lower()} at grade-appropriate levels",
                "totalStudents": "35",
                "prerequisiteSkills": f"Basic {strand.replace('-', ' ')} concepts",
                "duration": "60",
                "materials": "Textbook, manipulatives, worksheets",
                "learningStyles": ["visual", "kinesthetic", "auditory"],
                "learningPreferences": [],
                "multipleIntelligences": ["logical-mathematical", "naturalist"],
                "customLearningStyles": "",
                "pedagogicalStrategies": ["differentiated-instruction", "cooperative-learning"],
                "multigradeStrategies": ["tiered-assignments", "flexible-grouping"],
                "specialNeeds": False,
                "specialNeedsDetails": "",
                "differentiationNotes": "Adjust complexity by grade level",
                "strand": strand,
                "essentialOutcomes": f"Understand {topic.lower()}",
                "specificOutcomes": f"Grade-appropriate mastery of {topic.lower()}",
            },
            "generatedPlan": f"# {topic} (Grades {grades})\n\nDifferentiated objectives by grade...\n\nGroup A activities...\nGroup B activities...",
            "parsedPlan": None,
        })
    return plans


def generate_cross_curricular_plans(school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate integrated lesson plan entries."""
    configs = [
        ("The Market - Math & Science", "2", "Mathematics", "Science",
         "Explore measurement and money through market simulation"),
        ("Ecosystem Models", "2", "Science", "Mathematics",
         "Use math skills to analyze ecosystem data"),
        ("Fraction Cooking", "4", "Mathematics", "Science",
         "Apply fractions through recipe measurement"),
        ("Weather Data Analysis", "4", "Science", "Mathematics",
         "Collect and graph weather data using statistics"),
        ("Garden Math", "1", "Science", "Mathematics",
         "Counting and measuring plants in the school garden"),
    ]
    plans = []
    step = max(1, len(school_days) // 6)
    for i, (title, grade, primary, supporting, idea) in enumerate(configs):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        plans.append({
            "id": gen_id("cross_curricular", day),
            "title": f"{title} (Grade {grade})",
            "timestamp": random_ts(day),
            "formData": {
                "lessonTitle": title,
                "gradeLevel": grade,
                "duration": "90",
                "bigIdea": idea,
                "integrationModel": "multidisciplinary",
                "primarySubject": primary,
                "supportingSubjects": supporting,
                "learningStandards": f"{primary} and {supporting} curriculum standards",
                "primaryObjective": idea,
                "secondaryObjectives": f"Develop {supporting.lower()} skills through integration",
                "studentsWillKnow": f"Key concepts in {primary.lower()} and {supporting.lower()}",
                "studentsWillBeSkilled": "Apply knowledge across disciplines",
                "keyVocabulary": "",
                "introduction": "Engage students with real-world connection",
                "coreActivities": "Hands-on exploration with integrated content",
                "closureActivities": "Reflection and sharing",
                "differentiationStrategies": "Tiered activities",
                "assessmentMethods": "Observation, portfolio, rubric",
                "mostChildren": "Meet core objectives",
                "someNotProgressed": "Achieve basic understanding",
                "someProgressedFurther": "Extend learning independently",
                "reflectionPrompts": "What connections did you see?",
                "teachingStrategies": ["inquiry-based", "cooperative-learning"],
                "learningStyles": ["visual", "kinesthetic"],
                "learningPreferences": [],
                "multipleIntelligences": ["logical-mathematical", "naturalist"],
                "customLearningStyles": "",
                "materials": "Various hands-on materials",
                "crossCurricularConnections": f"{primary} + {supporting}",
                "strand": "number-operations",
                "essentialOutcomes": idea,
                "specificOutcomes": idea,
            },
            "generatedPlan": f"# {title}\n\n## Big Idea\n{idea}\n\n## Integrated Activities\n...",
            "parsedPlan": None,
        })
    return plans


def generate_chats(school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate realistic PEARL AI chat conversations."""
    chat_configs = [
        ("Help with fractions lesson", [
            ("user", "I need help planning a lesson on fractions for my Grade 4 class. They're struggling with equivalent fractions."),
            ("assistant", "I'd be happy to help! Here are some strategies for teaching equivalent fractions to Grade 4 students:\n\n1. **Visual Models**: Use fraction strips or circles to show that 1/2 = 2/4 = 3/6\n2. **Hands-on Activities**: Have students fold paper to discover equivalencies\n3. **Number Line**: Plot fractions on a number line to see relationships\n\nWould you like me to generate a full lesson plan with these strategies?"),
            ("user", "Yes please, and include some differentiation for my slower learners"),
            ("assistant", "I'll create a differentiated lesson plan. For struggling learners, I recommend:\n- Starting with concrete manipulatives before moving to abstract\n- Using fraction tiles they can physically match\n- Providing visual anchor charts\n\nShall I generate this as a full lesson plan you can save?"),
        ]),
        ("Science quiz for Grade 1", [
            ("user", "Can you help me create a simple quiz about living things for my Grade 1 Science class?"),
            ("assistant", "Of course! For Grade 1, I'd suggest a mix of picture-based and simple questions. Here's what I'd include:\n\n- Identify living vs non-living things from pictures\n- Match animals to their homes\n- Yes/No questions about plant needs\n- Draw your favourite animal\n\nWould you like me to generate this as a formal quiz?"),
            ("user", "That sounds perfect, make it about 8 questions"),
            ("assistant", "I'll generate an 8-question quiz with age-appropriate questions and simple language. I'll include picture placeholders where needed. Let me create that for you now!"),
        ]),
        ("Attendance patterns", [
            ("user", "I've noticed some students in Grade 2 are frequently absent on Mondays. Any suggestions?"),
            ("assistant", "Monday absenteeism is a common pattern. Here are some strategies:\n\n1. **Monday Morning Motivation**: Start the week with a fun activity\n2. **Communication**: Send Friday reminders to parents about Monday's exciting plans\n3. **Attendance Tracking**: Use the attendance feature to identify the specific students\n4. **Incentives**: Create a weekly attendance chart with small rewards\n\nWould you like help setting up attendance tracking for your class?"),
        ]),
        ("Differentiated worksheet", [
            ("user", "I need a math worksheet on place value for Grade 2 but I have students at very different levels"),
            ("assistant", "For differentiated place value worksheets, I can create tiered versions:\n\n**Level 1 (Support)**: Identifying tens and ones with base-10 blocks pictures\n**Level 2 (On-Grade)**: Writing numbers in expanded form, comparing 2-digit numbers\n**Level 3 (Extension)**: Word problems involving place value, numbers to 200\n\nShall I generate all three levels as a worksheet?"),
            ("user", "Yes, level 2 would be great for most of my class"),
            ("assistant", "I'll generate the Level 2 worksheet focused on expanded form and comparing numbers. I'll include about 8 questions with clear instructions. Let me create that now!"),
        ]),
        ("Report card comments", [
            ("user", "It's almost report card time. Can you help me write some comments for my students?"),
            ("assistant", "I'd be happy to help with report card comments! To write personalized comments, I'd need to know:\n\n1. The student's strengths\n2. Areas for improvement\n3. Their participation level\n4. Any notable achievements\n\nYou could also use the Brain Dump feature to quickly capture your thoughts about each student, and I can help organize them into polished comments. Would you like to try that approach?"),
        ]),
        ("Curriculum mapping help", [
            ("user", "How do I map my Science topics to the OECS curriculum strands for Grade 1?"),
            ("assistant", "The OECS Science curriculum for Grade 1 is organized into these main strands:\n\n- **Living Things**: Plants, animals, human body\n- **Matter and Energy**: Materials, properties, forces\n- **Earth Science**: Weather, seasons, natural resources\n- **Scientific Process**: Observation, recording, predicting\n\nYour topics would map like this:\n- Living Things -> 'living-things' strand\n- My Five Senses -> 'living-things' strand\n- Weather -> 'earth-science' strand\n- Materials Around Us -> 'matter-energy' strand\n\nYou can use the Progress Tracker to mark your coverage of each strand!"),
        ]),
        ("Multiplication strategies", [
            ("user", "My Grade 2 students are just starting multiplication. What's the best way to introduce it?"),
            ("assistant", "Great question! For introducing multiplication to Grade 2, I recommend this progression:\n\n1. **Week 1**: Equal groups with concrete objects (3 groups of 4 apples)\n2. **Week 2**: Repeated addition (4 + 4 + 4 = 12, so 3 x 4 = 12)\n3. **Week 3**: Arrays with counters and grid paper\n4. **Week 4**: Skip counting connection (count by 2s, 5s, 10s)\n\nWould you like me to create lesson plans for each week?"),
            ("user", "Yes that would be amazing"),
            ("assistant", "I'll create a 4-week lesson plan sequence. Each plan will build on the previous one. Let me generate those for you now!"),
        ]),
        ("End of year review", [
            ("user", "School year is almost over. What's a fun way to do a math review for Grade 4?"),
            ("assistant", "Here are some engaging end-of-year math review ideas for Grade 4:\n\n1. **Math Olympics**: Station-based activities covering each topic (fractions, decimals, geometry, etc.)\n2. **Escape Room**: Puzzle-based challenges that review key concepts\n3. **Board Game Creation**: Students create their own math games\n4. **Real-World Project**: Plan a class party using budgets, measurements, and fractions\n\nThe Real-World Project is great because it integrates multiple topics naturally. Would you like me to help plan one of these?"),
        ]),
        ("Simple machines activity", [
            ("user", "I want to do a hands-on activity about simple machines for Grade 2 Science"),
            ("assistant", "Simple machines are perfect for hands-on learning! Here's an activity idea:\n\n**Simple Machine Stations** (60 min)\n- Station 1: Lever - Use a ruler and eraser to balance objects\n- Station 2: Inclined Plane - Roll cars down ramps of different heights\n- Station 3: Wheel & Axle - Explore toy cars and doorknobs\n- Station 4: Pulley - Simple string-and-spool pulley system\n\nStudents rotate through stations, recording observations in a science journal.\n\nShall I create a full lesson plan with materials list and assessment checklist?"),
        ]),
        ("Grade 4 area and perimeter", [
            ("user", "My Grade 4s keep confusing area and perimeter. How can I help them?"),
            ("assistant", "This is one of the most common confusions! Try these approaches:\n\n1. **Physical Analogy**: Perimeter = walking around a fence, Area = painting the floor inside\n2. **Colour Coding**: Use one colour to trace perimeter, another to shade area\n3. **Real Objects**: Measure the classroom - walk the perimeter, then cover the floor with tiles\n4. **Geoboard Activities**: Create shapes and count units vs boundary\n\nA memorable trick: **P**erimeter = **P**ath around the outside\n\nWant me to generate a worksheet that reinforces this distinction?"),
            ("user", "Yes and maybe a rubric for a project where they design their dream room"),
            ("assistant", "Love that idea! I'll generate:\n1. A worksheet with perimeter vs area practice problems\n2. A rubric for the 'Dream Room Design' project covering: accurate calculations, creative design, clear labelling, and presentation\n\nLet me create both for you!"),
        ]),
        ("Water cycle lesson", [
            ("user", "Need a creative way to teach the water cycle to Grade 2"),
            ("assistant", "Here are some creative water cycle activities for Grade 2:\n\n1. **Water Cycle in a Bag**: Seal water in a zip bag, tape to sunny window - students observe evaporation and condensation over days\n2. **Drama Activity**: Students act out being water molecules through each stage\n3. **Song/Chant**: Create a water cycle song to a familiar tune\n4. **Model Building**: Use cotton balls (clouds), blue paper (water), arrows\n\nThe bag experiment is wonderful because it's ongoing - students check daily and draw observations!\n\nWould you like a full lesson plan incorporating these activities?"),
        ]),
        ("Brain dump about term 2", [
            ("user", "I'm feeling overwhelmed with Term 2 planning. There's so much to cover"),
            ("assistant", "I understand the feeling! Let me help you organize. Here's what I suggest:\n\n1. **Use Brain Dump**: Write down everything on your mind - topics, deadlines, concerns\n2. **I'll help prioritize**: We can sort by urgency and importance\n3. **Batch similar work**: Create all your Math quizzes at once, then Science\n4. **Use the Calendar**: Set reminders for key dates\n\nRemember, you don't have to do everything at once. What are the most pressing items for this week?\n\nYou can also check your Progress Tracker to see which curriculum strands still need coverage."),
        ]),
    ]

    chats = []
    step = max(1, len(school_days) // (len(chat_configs) + 1))
    for i, (title, messages) in enumerate(chat_configs):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        chat_id = f"chat_{uuid.uuid4().hex[:12]}"
        chat_messages = []
        for j, (role, content) in enumerate(messages):
            msg_ts = random_ts(day, (8 + j, 8 + j + 1))
            chat_messages.append({
                "id": f"msg_{uuid.uuid4().hex[:12]}",
                "role": role,
                "content": content,
                "timestamp": msg_ts,
                "attachments": None,
            })
        chats.append({
            "id": chat_id,
            "title": title,
            "timestamp": random_ts(day),
            "messages": chat_messages,
        })
    return chats


def generate_brain_dumps(school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate brain dump entries."""
    entries_data = [
        ("Need to prepare fractions worksheets for next week. Grade 4 is struggling with equivalent fractions. Also need to order more math manipulatives from the store.", ["lesson-plan", "worksheet"]),
        ("Parent meeting notes: Jayla's mom concerned about reading. Talk to Language Arts teacher. Brandon needs extra help with subtraction.", ["class-management"]),
        ("Term 1 report cards due December 6. Start writing comments by November 25 at the latest. Check attendance records first.", ["calendar-task"]),
        ("Great idea for Science: bring in real plants for the living things unit. Ask gardener for cuttings. Need soil and small pots.", ["lesson-plan"]),
        ("Professional development day next Friday - workshop on differentiated instruction. Remember to bring laptop.", ["calendar-task"]),
        ("Grade 2 multiplication assessment results: 60% of class at mastery, 25% approaching, 15% need intervention. Plan small group sessions.", ["quiz", "class-management"]),
        ("End of term celebration ideas: Math Olympics, Science Fair display of water cycle projects, certificate ceremony.", ["lesson-plan", "presentation"]),
        ("Remember to update curriculum tracker - completed measurement unit for Grade 4, started habitats for Grade 2 Science.", ["curriculum-tracker"]),
        ("New student joining Grade 1 next week - Aniya Thomas, transferring from Vieux Fort. Need to prepare welcome packet.", ["class-management"]),
        ("Reflect on Term 2: Students responded well to hands-on activities. Continue using manipulatives. Consider more group work for Grade 4.", []),
        ("Field trip permission slips for Pigeon Island - need 25 copies. Bus arranged for March 15. Chaperones: Ms. Browne, Mr. Felix.", ["calendar-task"]),
        ("Grade 1 Science experiment worked perfectly - students loved the water cycle in a bag. Take photos for the display board.", ["lesson-plan"]),
        ("Summer reading list ideas for students: Caribbean folk tales, math puzzle books, nature journals. Prepare list by June.", []),
        ("Staff meeting notes: new assessment policy starting next term. Portfolio-based assessment for all subjects. Need training.", []),
        ("Observation from today: Keon has really improved in math this term. Went from struggling with basic addition to solving word problems. Send positive note home!", ["class-management"]),
    ]

    entries = []
    step = max(1, len(school_days) // (len(entries_data) + 1))
    for i, (text, action_types) in enumerate(entries_data):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        actions = []
        for at in action_types:
            actions.append({
                "id": str(uuid.uuid4()),
                "type": at,
                "title": f"Action from brain dump",
                "description": f"Generated from brain dump on {day.isoformat()}",
                "details": {},
                "status": rng.choice(["pending", "accepted", "accepted"]),
            })
        entries.append({
            "id": f"entry-{int(datetime(day.year, day.month, day.day, rng.randint(7,17)).timestamp() * 1000)}",
            "text": text,
            "timestamp": random_ts(day),
            "actions": actions,
            "suggestions": [],
        })
    return entries


def generate_tasks(school_days: List[date], year: int, rng: random.Random) -> List[Dict]:
    """Generate task list entries."""
    terms = get_school_terms(year)
    tasks_data = [
        ("Prepare Term 1 lesson plans", "Outline all Math and Science lessons for September-December", terms[0][0], "high", True),
        ("Order math manipulatives", "Fraction tiles, base-10 blocks, counters", terms[0][0] + timedelta(days=5), "medium", True),
        ("Grade Term 1 quizzes", "Grade all Math quizzes for Grade 4 and Grade 2", terms[0][1] - timedelta(days=10), "high", True),
        ("Write Term 1 report card comments", "Complete all 75 student comments", terms[0][1] - timedelta(days=5), "urgent", True),
        ("Parent-teacher meeting prep", "Prepare student progress reports for meetings", terms[1][0] + timedelta(days=14), "high", True),
        ("Update curriculum tracker", "Mark completed strands and plan remaining coverage", terms[1][0] + timedelta(days=20), "medium", True),
        ("Prepare Science Fair materials", "Gather supplies for Grade 2 habitat dioramas", terms[1][1] - timedelta(days=21), "medium", True),
        ("Grade Term 2 assessments", "All quizzes and worksheets for Term 2", terms[1][1] - timedelta(days=7), "high", True),
        ("Plan end-of-year activities", "Math Olympics, Science display, certificate ceremony", terms[2][0] + timedelta(days=14), "medium", False),
        ("Prepare final exams", "Create comprehensive review quizzes for all classes", terms[2][1] - timedelta(days=21), "high", False),
        ("Complete Term 3 grading", "Final grades for all students across all classes", terms[2][1] - timedelta(days=10), "urgent", False),
        ("Year-end report cards", "Final comments and recommendations for all 75 students", terms[2][1] - timedelta(days=5), "urgent", False),
        ("Organize class materials for storage", "Sort and pack teaching resources for summer", terms[2][1] - timedelta(days=3), "low", False),
        ("Submit curriculum coverage report", "Summary of strands covered per subject per grade", terms[2][1] - timedelta(days=2), "medium", False),
        ("Reflect on school year", "Note what worked, what to improve for next year", terms[2][1], "low", False),
    ]

    tasks = []
    for title, desc, due_date, priority, completed in tasks_data:
        created = due_date - timedelta(days=rng.randint(7, 21))
        tasks.append({
            "id": str(uuid.uuid4()),
            "title": title,
            "description": desc,
            "date": due_date.isoformat(),
            "priority": priority,
            "completed": completed,
            "createdAt": random_ts(created),
            "updatedAt": random_ts(due_date if completed else created),
        })
    return tasks


def generate_milestones(school_days: List[date], year: int, rng: random.Random) -> List[Dict]:
    """Generate curriculum milestone entries."""
    teacher_id = "demo_teacher_001"
    milestones = []

    # Math milestones per grade
    math_strands = {
        "1": [("number-operations", "Counting and Basic Operations"), ("geometry", "Shapes and Patterns")],
        "2": [("number-operations", "Place Value and Operations"), ("measurement", "Measurement"),
               ("data-statistics", "Data Collection")],
        "4": [("number-operations", "Fractions and Decimals"), ("number-operations", "Multiplication and Division"),
               ("measurement", "Area and Perimeter"), ("data-statistics", "Data and Statistics"),
               ("geometry", "Angles and Shapes")],
    }

    # Science milestones per grade
    science_strands = {
        "1": [("living-things", "Living Things"), ("earth-science", "Weather"),
               ("matter-energy", "Materials")],
        "2": [("living-things", "Plants and Animals"), ("living-things", "Habitats"),
               ("matter-energy", "Simple Machines"), ("earth-science", "Water Cycle")],
    }

    all_configs = []
    for grade in ["1", "2", "4"]:
        if grade in math_strands:
            for strand, title in math_strands[grade]:
                all_configs.append(("Mathematics", grade, strand, title))
    for grade in ["1", "2"]:
        if grade in science_strands:
            for strand, title in science_strands[grade]:
                all_configs.append(("Science", grade, strand, title))

    terms = get_school_terms(year)
    term_boundaries = [terms[0][1], terms[1][1], terms[2][1]]

    for i, (subject, grade, strand, title) in enumerate(all_configs):
        topic_id = f"{subject.lower()}_{grade}_{strand}_{i}"
        milestone_id = f"{teacher_id}_{topic_id}"

        # Determine status based on position in year
        if i < len(all_configs) * 0.6:
            status = "completed"
            completed_at = sqlite_ts(
                term_boundaries[min(i // (len(all_configs) // 3 + 1), 2)],
                15, rng.randint(0, 59)
            )
        elif i < len(all_configs) * 0.8:
            status = "in_progress"
            completed_at = None
        else:
            status = "not_started"
            completed_at = None

        checklist = []
        subtopics = [f"Subtopic {j+1}: {title} Part {j+1}" for j in range(rng.randint(3, 5))]
        for j, st in enumerate(subtopics):
            checked = status == "completed" or (status == "in_progress" and j < len(subtopics) // 2)
            checklist.append({
                "key": str(j),
                "text": st,
                "checked": checked,
                "checked_at": random_ts(school_days[min(i * 5 + j * 3, len(school_days) - 1)]) if checked else None,
            })

        created_day = school_days[min(i * 3, len(school_days) - 1)]
        milestones.append({
            "id": milestone_id,
            "teacher_id": teacher_id,
            "topic_id": topic_id,
            "topic_title": f"{title} - {subject} Grade {grade}",
            "grade": grade,
            "subject": subject,
            "strand": strand,
            "route": "",
            "status": status,
            "notes": None,
            "due_date": term_boundaries[min(i // (len(all_configs) // 3 + 1), 2)].isoformat() if status != "not_started" else None,
            "is_hidden": 0,
            "completed_at": completed_at,
            "created_at": sqlite_ts(created_day),
            "updated_at": sqlite_ts(school_days[min(i * 5 + 10, len(school_days) - 1)]),
            "checklist_json": json.dumps(checklist),
            "phase_id": None,
        })

    return milestones


def generate_achievements(school_days: List[date], year: int) -> Tuple[List[Dict], List[Dict]]:
    """Generate earned achievements and activity log."""
    teacher_id = "demo_teacher_001"
    terms = get_school_terms(year)

    # Achievement timeline
    achievement_timeline = [
        ("first_lesson", 2), ("first_chat", 2), ("first_analytics", 3), ("first_student", 3),
        ("quiz_creator", 8), ("worksheet_first", 9), ("rubric_first", 14),
        ("explorer", 15), ("presentation_first", 22), ("class_builder", 23),
        ("first_attendance", 28), ("kindergarten_pioneer", 32), ("first_grade", 36),
        ("resource_saver_10", 42), ("first_milestone", 47), ("attendance_week", 48),
        ("first_brain_dump", 52), ("streak_3", 57), ("multigrade_first", 62),
        ("cross_curricular", 67), ("lesson_veteran", 82), ("full_house", 83),
        ("chat_regular", 87), ("quiz_prolific", 95), ("resource_saver_25", 100),
        ("attendance_month", 105), ("grading_streak", 112), ("streak_7", 117),
        ("milestone_10", 122), ("trailblazer", 132), ("worksheet_grader", 137),
        ("brain_dump_10", 142), ("answer_key_master", 150), ("content_50", 155),
        ("century", 160), ("night_owl", 75),
    ]

    achievements = []
    for ach_id, day_index in achievement_timeline:
        day = school_days[min(day_index, len(school_days) - 1)]
        hour = 22 if ach_id == "night_owl" else random.randint(8, 16)
        achievements.append({
            "teacher_id": teacher_id,
            "achievement_id": ach_id,
            "earned_at": f"{day.isoformat()}T{hour:02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}.{random.randint(0,999999):06d}",
        })

    # Activity log - one entry per day the teacher used the app (~85% of school days)
    activity_log = []
    for day in school_days:
        if random.random() < 0.85:
            activity_log.append({
                "teacher_id": teacher_id,
                "activity_date": day.isoformat(),
            })

    return achievements, activity_log


def generate_calendar_reminders(year: int, quiz_dates: List[date], ws_dates: List[date], rng: random.Random) -> List[Dict]:
    """Generate calendar/test reminder entries."""
    terms = get_school_terms(year)
    reminders = []

    # Quiz reminders
    for i, qd in enumerate(quiz_dates[:12]):
        reminders.append({
            "id": str(uuid.uuid4()),
            "title": f"Quiz {i+1}",
            "description": f"Term {1 if qd < terms[0][1] else (2 if qd < terms[1][1] else 3)} Quiz",
            "test_date": qd.isoformat(),
            "test_time": "09:00",
            "type": "quiz",
            "reference_id": "",
            "subject": rng.choice(["Mathematics", "Science"]),
            "grade_level": rng.choice(["1", "2", "4"]),
            "created_at": random_ts(qd - timedelta(days=rng.randint(3, 7))),
        })

    # Report card days
    for ti, (_, term_end) in enumerate(terms):
        reminders.append({
            "id": str(uuid.uuid4()),
            "title": f"Term {ti+1} Report Cards Due",
            "description": f"Submit all report cards for Term {ti+1}",
            "test_date": (term_end - timedelta(days=3)).isoformat(),
            "test_time": "15:00",
            "type": "reminder",
            "reference_id": "",
            "subject": "",
            "grade_level": "",
            "created_at": random_ts(term_end - timedelta(days=14)),
        })

    # Worksheet submission days
    for i, wd in enumerate(ws_dates[:5]):
        reminders.append({
            "id": str(uuid.uuid4()),
            "title": f"Worksheet {i+1} Due",
            "description": "Collect completed worksheets",
            "test_date": (wd + timedelta(days=3)).isoformat(),
            "test_time": "14:00",
            "type": "worksheet",
            "reference_id": "",
            "subject": rng.choice(["Mathematics", "Science"]),
            "grade_level": rng.choice(["1", "2", "4"]),
            "created_at": random_ts(wd),
        })

    return reminders


def generate_presentations(school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate presentation history entries."""
    configs = [
        ("4", "Mathematics", "Fractions in Real Life", "number-operations"),
        ("2", "Science", "The Water Cycle", "earth-science"),
        ("1", "Science", "Living and Non-Living Things", "living-things"),
        ("2", "Mathematics", "Place Value Explained", "number-operations"),
        ("4", "Mathematics", "Data and Graphs", "data-statistics"),
    ]
    presentations = []
    step = max(1, len(school_days) // 6)
    for i, (grade, subject, topic, strand) in enumerate(configs):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        slides = []
        slide_titles = [f"Title: {topic}", "Learning Objectives", "Key Concepts",
                       "Examples", "Practice Activity", "Summary & Review"]
        for j, st in enumerate(slide_titles):
            slides.append({
                "id": str(uuid.uuid4()),
                "layout": "title" if j == 0 else "content",
                "content": {
                    "headline": st,
                    "body": f"Content for {st}...",
                    "bullets": [f"Point {k+1}" for k in range(3)] if j > 0 else [],
                },
            })
        presentations.append({
            "id": gen_id("pres", day),
            "title": f"{subject} - {topic} (Grade {grade})",
            "timestamp": random_ts(day),
            "type": "presentation",
            "formData": {
                "subject": subject,
                "gradeLevel": grade,
                "topic": topic,
                "strand": strand,
                "essentialOutcomes": f"Understand {topic.lower()}",
                "specificOutcomes": f"Apply knowledge of {topic.lower()}",
                "duration": "45",
                "studentCount": "25",
                "additionalInstructions": "",
            },
            "slides": slides,
            "styleId": "modern",
            "primaryColor": "#4F46E5",
            "bgColor": "#FFFFFF",
            "slideCount": len(slides),
            "presentationMode": "kids",
        })
    return presentations


def generate_storybooks(school_days: List[date], rng: random.Random) -> Dict:
    """Generate storybook metadata (text only, no images)."""
    configs = [
        ("The Mango Tree", "1", "Science", "A story about a mango tree growing in the Caribbean and all the living things that depend on it."),
        ("Splash Goes to the Sea", "1", "Science", "Follow Splash the water droplet through the water cycle around Saint Lucia."),
        ("Counting at the Market", "1", "Mathematics", "Join Aniya as she counts fruits and vegetables at the Castries market."),
    ]

    metadata = []
    step = max(1, len(school_days) // 4)
    for i, (title, grade, subject, description) in enumerate(configs):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        pages = []
        for p in range(5):
            pages.append({
                "pageNumber": p + 1,
                "text": f"Page {p+1} of '{title}': {description[:50]}...",
                "characterName": "Main Character",
            })
        metadata.append({
            "id": str(uuid.uuid4()),
            "savedAt": random_ts(day),
            "status": "completed",
            "formData": {
                "title": title,
                "gradeLevel": grade,
                "subject": subject,
                "description": description,
                "numberOfPages": 5,
                "ageGroup": "5-7",
                "theme": "educational",
            },
            "parsedBook": {
                "title": title,
                "pages": pages,
            },
            "hasImages": False,
            "hasAudio": False,
        })

    return {
        "metadata": metadata,
        "exportSettings": None,
    }


def generate_sticky_notes(school_days: List[date], rng: random.Random) -> Dict:
    """Generate sticky note entries."""
    notes_data = [
        ("Collect permission slips by Friday", "#FFE066", "Term 1 Planning"),
        ("Check on Jayla's reading progress", "#A7F3D0", "Student Notes"),
        ("Request whiteboard markers from store", "#FCA5A5", "Term 1 Planning"),
        ("Meet with Ms. Browne about gifted program", "#C4B5FD", "Student Notes"),
        ("Print fraction tiles template", "#93C5FD", "Term 2 Planning"),
        ("Call Tremaine's parents re: attendance", "#FCA5A5", "Student Notes"),
        ("Prepare materials for Science Fair", "#A7F3D0", "Term 2 Planning"),
        ("Submit curriculum coverage report", "#FFE066", "Term 2 Planning"),
    ]

    groups = [
        {"id": str(uuid.uuid4()), "name": "Term 1 Planning", "color": "#FFE066"},
        {"id": str(uuid.uuid4()), "name": "Term 2 Planning", "color": "#93C5FD"},
        {"id": str(uuid.uuid4()), "name": "Student Notes", "color": "#A7F3D0"},
    ]

    group_map = {g["name"]: g["id"] for g in groups}
    notes = []
    step = max(1, len(school_days) // (len(notes_data) + 1))
    for i, (text, color, group_name) in enumerate(notes_data):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        notes.append({
            "id": str(uuid.uuid4()),
            "text": text,
            "color": color,
            "groupId": group_map.get(group_name, ""),
            "position": {"x": 50 + (i % 4) * 220, "y": 50 + (i // 4) * 200},
            "createdAt": random_ts(day),
            "updatedAt": random_ts(day),
        })

    return {"notes": notes, "groups": groups}


def generate_lesson_drafts(school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate in-progress lesson draft entries."""
    # Drafts represent current/recent in-progress work
    recent_days = school_days[-15:]
    drafts = [
        {
            "id": gen_id("draft", recent_days[0]),
            "title": "Division with Remainders - Grade 4",
            "timestamp": random_ts(recent_days[0]),
            "plannerType": "lesson",
            "formData": {
                "subject": "Mathematics",
                "gradeLevel": "4",
                "topic": "Division with Remainders",
                "strand": "number-operations",
                "essentialOutcomes": "Understand division with remainders",
                "specificOutcomes": "Solve division problems and interpret remainders",
                "studentCount": "25",
                "duration": "60",
                "pedagogicalStrategies": ["direct-instruction"],
                "learningStyles": ["visual"],
                "learningPreferences": [],
                "multipleIntelligences": [],
                "customLearningStyles": "",
                "materials": "",
                "prerequisiteSkills": "",
                "specialNeeds": False,
                "specialNeedsDetails": "",
                "additionalInstructions": "",
                "referenceUrl": "",
            },
            "step": 2,
            "curriculumMatches": None,
        },
        {
            "id": gen_id("draft", recent_days[3]),
            "title": "Forces and Motion - Grade 2 Science",
            "timestamp": random_ts(recent_days[3]),
            "plannerType": "lesson",
            "formData": {
                "subject": "Science",
                "gradeLevel": "2",
                "topic": "Push and Pull Forces",
                "strand": "matter-energy",
                "essentialOutcomes": "Understand push and pull forces",
                "specificOutcomes": "Investigate and classify forces as push or pull",
                "studentCount": "25",
                "duration": "45",
                "pedagogicalStrategies": ["inquiry-based", "hands-on"],
                "learningStyles": ["kinesthetic"],
                "learningPreferences": [],
                "multipleIntelligences": [],
                "customLearningStyles": "",
                "materials": "Toy cars, ramps, springs, rubber bands",
                "prerequisiteSkills": "Basic understanding of movement",
                "specialNeeds": False,
                "specialNeedsDetails": "",
                "additionalInstructions": "",
                "referenceUrl": "",
            },
            "step": 1,
            "curriculumMatches": None,
        },
        {
            "id": gen_id("draft", recent_days[5]),
            "title": "Animal Habitats Review - Grade 1 Science",
            "timestamp": random_ts(recent_days[5]),
            "plannerType": "lesson",
            "formData": {
                "subject": "Science",
                "gradeLevel": "1",
                "topic": "Animal Habitats Review",
                "strand": "living-things",
                "essentialOutcomes": "Review animal habitats",
                "specificOutcomes": "Identify different habitats and the animals that live there",
                "studentCount": "25",
                "duration": "45",
                "pedagogicalStrategies": ["cooperative-learning"],
                "learningStyles": ["visual", "auditory"],
                "learningPreferences": [],
                "multipleIntelligences": [],
                "customLearningStyles": "",
                "materials": "",
                "prerequisiteSkills": "",
                "specialNeeds": False,
                "specialNeedsDetails": "",
                "additionalInstructions": "",
                "referenceUrl": "",
            },
            "step": 1,
            "curriculumMatches": None,
        },
    ]
    return drafts


def generate_images(school_days: List[date], rng: random.Random) -> List[Dict]:
    """Generate image history entries (metadata only, no actual images)."""
    configs = [
        ("Fraction Circle Diagram", "Mathematics", "4"),
        ("Water Cycle Illustration", "Science", "2"),
        ("Animal Classification Chart", "Science", "1"),
        ("Place Value Chart", "Mathematics", "2"),
        ("Simple Machines Poster", "Science", "2"),
    ]
    images = []
    step = max(1, len(school_days) // 6)
    for i, (title, subject, grade) in enumerate(configs):
        day = school_days[min((i + 1) * step, len(school_days) - 1)]
        images.append({
            "id": gen_id("img", day),
            "title": title,
            "timestamp": random_ts(day),
            "prompt": f"Educational illustration: {title} for Grade {grade} {subject}",
            "style": "educational",
            "subject": subject,
            "gradeLevel": grade,
        })
    return images


def generate_settings() -> Dict:
    """Generate app settings for the demo teacher."""
    return {
        "appSettings": {
            "teacherName": "Ms. Claudette Joseph",
            "schoolName": "Castries Combined School",
            "country": "Saint Lucia",
            "grades": ["1", "2", "4"],
            "subjects": ["Mathematics", "Science"],
            "theme": "light",
            "language": "en",
            "aiModel": "default",
            "fontSize": "medium",
        },
        "user": {
            "name": "Claudette Joseph",
            "email": "claudette.joseph@example.com",
            "role": "teacher",
            "school": "Castries Combined School",
            "country": "Saint Lucia",
        },
        "profileImage": None,
        "dashboardTabs": None,
        "dashboardActiveTab": None,
        "dashboardSplitView": None,
    }


# ---------------------------------------------------------------------------
# Main generator
# ---------------------------------------------------------------------------
def generate_demo_data(school_year: int = 2024, num_students: int = 25, seed: int = 42) -> Dict:
    """Generate complete demo backup data."""
    rng = random.Random(seed)
    random.seed(seed)  # for uuid and other global random usage

    school_days = get_school_days(school_year)
    print(f"School year {school_year}-{school_year+1}: {len(school_days)} school days")

    # Generate students for 3 classes
    print("Generating students...")
    grade1_students = generate_students(num_students, "Grade 1 Joseph", "1", rng)
    grade2_students = generate_students(num_students, "Grade 2 Joseph", "2", rng)
    grade4_students = generate_students(num_students, "Grade 4 Joseph", "4", rng)
    all_students = grade1_students + grade2_students + grade4_students
    print(f"  {len(all_students)} students across 3 classes")

    # Generate attendance
    print("Generating attendance...")
    attendance = generate_attendance(all_students, school_days, rng)
    print(f"  {len(attendance)} attendance records")

    # Generate quizzes and answer keys
    print("Generating quizzes...")
    quizzes, quiz_answer_keys = generate_quizzes(school_days, school_year, rng)
    print(f"  {len(quizzes)} quizzes, {len(quiz_answer_keys)} answer keys")

    # Generate worksheets and answer keys
    print("Generating worksheets...")
    worksheets, ws_answer_keys = generate_worksheets(school_days, school_year, rng)
    print(f"  {len(worksheets)} worksheets, {len(ws_answer_keys)} answer keys")

    # Generate quiz grades per class
    print("Generating grades...")
    # Grade 4 Math quizzes
    g4_quiz_ids = [q["id"] for q in quizzes if "Grade 4" in q["title"]]
    g4_quiz_dates = [date.fromisoformat(q["timestamp"][:10]) for q in quizzes if "Grade 4" in q["title"]]
    quiz_grades = generate_quiz_grades(grade4_students, g4_quiz_ids, g4_quiz_dates, rng)

    # Grade 2 quizzes (Math + Science)
    g2_quiz_ids = [q["id"] for q in quizzes if "Grade 2" in q["title"]]
    g2_quiz_dates = [date.fromisoformat(q["timestamp"][:10]) for q in quizzes if "Grade 2" in q["title"]]
    quiz_grades += generate_quiz_grades(grade2_students, g2_quiz_ids, g2_quiz_dates, rng)

    # Grade 1 Science quizzes
    g1_quiz_ids = [q["id"] for q in quizzes if "Grade 1" in q["title"]]
    g1_quiz_dates = [date.fromisoformat(q["timestamp"][:10]) for q in quizzes if "Grade 1" in q["title"]]
    quiz_grades += generate_quiz_grades(grade1_students, g1_quiz_ids, g1_quiz_dates, rng)
    print(f"  {len(quiz_grades)} quiz grades")

    # Worksheet grades similarly
    g4_ws_ids = [w["id"] for w in worksheets if "Grade 4" in w["title"]]
    g4_ws_dates = [date.fromisoformat(w["timestamp"][:10]) for w in worksheets if "Grade 4" in w["title"]]
    ws_grades = generate_worksheet_grades(grade4_students, g4_ws_ids, g4_ws_dates, rng)

    g2_ws_ids = [w["id"] for w in worksheets if "Grade 2" in w["title"]]
    g2_ws_dates = [date.fromisoformat(w["timestamp"][:10]) for w in worksheets if "Grade 2" in w["title"]]
    ws_grades += generate_worksheet_grades(grade2_students, g2_ws_ids, g2_ws_dates, rng)

    g1_ws_ids = [w["id"] for w in worksheets if "Grade 1" in w["title"]]
    g1_ws_dates = [date.fromisoformat(w["timestamp"][:10]) for w in worksheets if "Grade 1" in w["title"]]
    ws_grades += generate_worksheet_grades(grade1_students, g1_ws_ids, g1_ws_dates, rng)
    print(f"  {len(ws_grades)} worksheet grades")

    # Generate all other content
    print("Generating lesson plans...")
    lesson_plans = generate_lesson_plans(school_days, school_year, rng)
    print(f"  {len(lesson_plans)} lesson plans")

    print("Generating rubrics...")
    rubrics = generate_rubrics(school_days, rng)
    print(f"  {len(rubrics)} rubrics")

    print("Generating other content...")
    kindergarten = generate_kindergarten_plans(school_days, rng)
    multigrade = generate_multigrade_plans(school_days, rng)
    cross_curricular = generate_cross_curricular_plans(school_days, rng)
    chats = generate_chats(school_days, rng)
    brain_dumps = generate_brain_dumps(school_days, rng)
    tasks = generate_tasks(school_days, school_year, rng)
    milestones = generate_milestones(school_days, school_year, rng)
    presentations = generate_presentations(school_days, rng)
    images = generate_images(school_days, rng)
    storybooks = generate_storybooks(school_days, rng)
    sticky_notes = generate_sticky_notes(school_days, rng)
    lesson_drafts = generate_lesson_drafts(school_days, rng)

    print("Generating achievements...")
    achievements, activity_log = generate_achievements(school_days, school_year)
    print(f"  {len(achievements)} achievements earned, {len(activity_log)} activity log entries")

    # Calendar reminders
    quiz_dates_for_cal = [date.fromisoformat(q["timestamp"][:10]) for q in quizzes]
    ws_dates_for_cal = [date.fromisoformat(w["timestamp"][:10]) for w in worksheets]
    calendar_reminders = generate_calendar_reminders(school_year, quiz_dates_for_cal, ws_dates_for_cal, rng)

    # Assemble the final backup payload
    backup = {
        "exportDate": datetime.now().isoformat() + "Z",
        "version": "1.0.0",
        "categories": [
            "chats", "lesson_plans", "kindergarten", "multigrade", "cross_curricular",
            "quizzes", "rubrics", "worksheets", "images", "presentations",
            "brain_dumps", "tasks", "milestones", "achievements", "students",
            "calendar", "storybooks", "sticky_notes", "lesson_drafts", "settings",
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
            "achievements": {
                "all_earned": achievements,
                "activity_log": activity_log,
            },
            "students": {
                "students": all_students,
                "attendance": attendance,
                "quiz_grades": quiz_grades,
                "worksheet_grades": ws_grades,
                "quiz_answer_keys": quiz_answer_keys,
                "worksheet_answer_keys": ws_answer_keys,
                "quiz_instances": [],
                "worksheet_instances": [],
                "worksheet_packages": [],
                "answer_region_templates": [],
            },
            "calendar": {
                "reminders": calendar_reminders,
            },
            "storybooks": storybooks,
            "sticky_notes": sticky_notes,
            "lesson_drafts": lesson_drafts,
            "settings": generate_settings(),
        },
    }

    return backup


def main():
    parser = argparse.ArgumentParser(description="Generate demo data for OECS Learning Hub")
    parser.add_argument("--school-year", type=int, default=2024,
                       help="Starting year of school year (default: 2024 for 2024-2025)")
    parser.add_argument("--num-students", type=int, default=25,
                       help="Number of students per class (default: 25)")
    parser.add_argument("--output", type=str, default="demo_backup.json",
                       help="Output filename (default: demo_backup.json)")
    parser.add_argument("--seed", type=int, default=42,
                       help="Random seed for reproducibility (default: 42)")

    args = parser.parse_args()

    print(f"Generating demo data for {args.school_year}-{args.school_year + 1} school year...")
    print(f"  Students per class: {args.num_students}")
    print(f"  Random seed: {args.seed}")
    print()

    backup = generate_demo_data(
        school_year=args.school_year,
        num_students=args.num_students,
        seed=args.seed,
    )

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(backup, f, indent=2, ensure_ascii=False)

    # Print summary
    data = backup["data"]
    file_size_mb = len(json.dumps(backup)) / (1024 * 1024)
    print()
    print(f"Demo backup written to: {args.output}")
    print(f"File size: {file_size_mb:.1f} MB")
    print()
    print("Summary:")
    print(f"  Students:        {len(data['students']['students'])}")
    print(f"  Attendance:      {len(data['students']['attendance'])}")
    print(f"  Quiz grades:     {len(data['students']['quiz_grades'])}")
    print(f"  Worksheet grades:{len(data['students']['worksheet_grades'])}")
    print(f"  Lesson plans:    {len(data['lesson_plans'])}")
    print(f"  Quizzes:         {len(data['quizzes'])}")
    print(f"  Worksheets:      {len(data['worksheets'])}")
    print(f"  Rubrics:         {len(data['rubrics'])}")
    print(f"  Kindergarten:    {len(data['kindergarten'])}")
    print(f"  Multigrade:      {len(data['multigrade'])}")
    print(f"  Cross-curricular:{len(data['cross_curricular'])}")
    print(f"  Presentations:   {len(data['presentations'])}")
    print(f"  Chats:           {len(data['chats'])}")
    print(f"  Brain dumps:     {len(data['brain_dumps'])}")
    print(f"  Tasks:           {len(data['tasks'])}")
    print(f"  Milestones:      {len(data['milestones'])}")
    print(f"  Achievements:    {len(data['achievements']['all_earned'])}")
    print(f"  Calendar:        {len(data['calendar']['reminders'])}")
    print(f"  Storybooks:      {len(data['storybooks']['metadata'])}")
    print(f"  Sticky notes:    {len(data['sticky_notes']['notes'])}")
    print(f"  Lesson drafts:   {len(data['lesson_drafts'])}")
    print(f"  Images:          {len(data['images'])}")


if __name__ == "__main__":
    main()
