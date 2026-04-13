"""
Comprehensive Demo Data Generator for OECS Teacher Assistant
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
import argparse
import hashlib
import urllib.request
import urllib.error
from datetime import datetime, timedelta, date

random.seed(42)  # Reproducible output (overridable via --seed)

# ── LLM (OpenRouter) Integration ──────────────────────────────────────────────
# Optional. If --openrouter-key and --openrouter-model are supplied, all
# content fields (lesson plans, quizzes, worksheets, rubrics, presentations,
# storybooks, etc.) are generated via OpenRouter. Otherwise the script falls
# back to short static stubs so it still runs fully offline.
#
# Every LLM response is cached on disk keyed by sha256(model+system+user) so
# re-runs never re-spend tokens. Delete the cache dir to force regeneration.

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_TEACHER = (
    "You are a veteran OECS Eastern Caribbean primary-school teacher and "
    "curriculum designer. Produce high-quality, grade-appropriate classroom "
    "content. Reference Saint Lucia / Eastern Caribbean context naturally "
    "where relevant. Use plain ASCII only (no emoji or unicode symbols)."
)


class LLMClient:
    """OpenRouter chat client with on-disk JSON cache keyed by prompt hash."""

    def __init__(self, api_key, model, cache_dir, timeout=180):
        self.api_key = api_key
        self.model = model
        self.cache_dir = cache_dir
        self.timeout = timeout
        self.calls = 0
        self.cache_hits = 0
        self.errors = 0
        os.makedirs(cache_dir, exist_ok=True)

    def _cache_path(self, system, user, temperature, max_tokens):
        h = hashlib.sha256()
        h.update((self.model or "").encode("utf-8"))
        h.update(b"\x00")
        h.update((system or "").encode("utf-8"))
        h.update(b"\x00")
        h.update((user or "").encode("utf-8"))
        h.update(b"\x00")
        h.update(f"{temperature}|{max_tokens}".encode("utf-8"))
        return os.path.join(self.cache_dir, h.hexdigest() + ".json")

    def chat(self, user, system=None, temperature=0.7, max_tokens=2000):
        path = self._cache_path(system, user, temperature, max_tokens)
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    payload = json.load(f)
                self.cache_hits += 1
                return payload.get("content", "")
            except Exception:
                pass  # Re-fetch on corrupt cache

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": user})

        body = json.dumps({
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }).encode("utf-8")

        req = urllib.request.Request(
            OPENROUTER_URL,
            data=body,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/oecs/teacher-assistant",
                "X-Title": "OECS Teacher Assistant Demo Generator",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            err_body = ""
            try:
                err_body = e.read().decode("utf-8", errors="replace")
            except Exception:
                pass
            self.errors += 1
            raise RuntimeError(f"OpenRouter HTTP {e.code}: {err_body[:400]}")
        except Exception as e:
            self.errors += 1
            raise RuntimeError(f"OpenRouter call failed: {e}")

        try:
            content = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError):
            self.errors += 1
            raise RuntimeError(
                f"Unexpected OpenRouter response shape: {json.dumps(data)[:400]}"
            )

        self.calls += 1
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump({
                    "model": self.model,
                    "system": system,
                    "user": user,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "content": content,
                }, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"  [WARN] Could not write LLM cache {path}: {e}")
        return content

    def chat_json(self, user, system=None, temperature=0.3, max_tokens=2500):
        raw = self.chat(user, system=system, temperature=temperature, max_tokens=max_tokens)
        return _extract_json(raw)


def _extract_json(text):
    """Pull the first JSON object/array from an LLM response, tolerating code fences."""
    if not text:
        return None
    s = text.strip()
    # Strip ``` fences
    if s.startswith("```"):
        parts = s.split("```")
        if len(parts) >= 2:
            inner = parts[1]
            lower = inner.lstrip().lower()
            if lower.startswith("json"):
                inner = inner.split("\n", 1)[1] if "\n" in inner else ""
            s = inner.strip()
    # Find first { or [
    start = None
    for i, ch in enumerate(s):
        if ch in "{[":
            start = i
            break
    if start is None:
        return None
    # Shrink from the end until json.loads succeeds
    end = len(s)
    while end > start:
        try:
            return json.loads(s[start:end])
        except Exception:
            end -= 1
    return None


LLM_CLIENT = None  # Set in main() from CLI args


def _llm_or(default, prompt, system=SYSTEM_TEACHER, max_tokens=1800, temperature=0.7):
    if LLM_CLIENT is None:
        return default
    try:
        out = LLM_CLIENT.chat(prompt, system=system, temperature=temperature, max_tokens=max_tokens)
        return out.strip() if out else default
    except Exception as e:
        print(f"  [WARN] LLM text call failed, using stub: {e}")
        return default


def _llm_json_or(default, prompt, system=SYSTEM_TEACHER, max_tokens=2500, temperature=0.3):
    if LLM_CLIENT is None:
        return default
    try:
        out = LLM_CLIENT.chat_json(prompt, system=system, temperature=temperature, max_tokens=max_tokens)
        return out if out is not None else default
    except Exception as e:
        print(f"  [WARN] LLM JSON call failed, using stub: {e}")
        return default


def llm_lesson_plan(subject, grade, topic, duration, student_count):
    default = (
        f"# {topic}\n\n## Objective\nStudents will learn about {topic}.\n\n"
        f"## Introduction (10 min)\nReview prior knowledge and introduce new concepts.\n\n"
        f"## Development (30 min)\nGuided practice with examples and activities.\n\n"
        f"## Closure (10 min)\nReview key points and assign practice work."
    )
    prompt = (
        f"Write a complete {duration}-minute lesson plan for Grade {grade} "
        f"{subject} on the topic '{topic}'. Class size: {student_count} students.\n\n"
        "Include these markdown sections with clear headers and time estimates:\n"
        "- Title\n- Learning Objectives (2-4 bullets)\n- Materials\n"
        "- Prior Knowledge\n- Introduction\n- Development / Guided Practice "
        "(concrete activity descriptions)\n- Independent Practice\n"
        "- Formative Assessment\n- Closure\n- Differentiation (support + extension)\n"
        "- Homework\n\nNo generic filler. Be specific and classroom-ready."
    )
    return _llm_or(default, prompt)


def llm_kindergarten_plan(topic, subject, strand, age_group):
    default = (
        f"# {topic}\n\nCircle Time (10 min)\nIntroduce the topic with a song.\n\n"
        f"Exploration (20 min)\nHands-on activity.\n\nWrap Up (15 min)\nReview and share."
    )
    prompt = (
        f"Write a 45-minute early-childhood lesson plan for age group {age_group} "
        f"on the topic '{topic}' ({subject} / {strand}). Include: Welcome Song, "
        "Circle Time, Story, Hands-on Exploration, Creative Activity, Movement "
        "Break, Closure. Warm age-appropriate language. Markdown with time estimates."
    )
    return _llm_or(default, prompt)


def llm_multigrade_plan(subject, topic, grade_range):
    default = f"# {topic} (Multigrade)\n\nShared introduction followed by tiered group work."
    prompt = (
        f"Write a 60-minute multigrade lesson plan for Grades {grade_range} "
        f"{subject} on '{topic}'. Include: Shared Introduction, Tiered Objectives "
        "(per grade), Group A activities, Group B activities, Differentiation "
        "notes, Rotation plan, Assessment, Closure. Markdown format."
    )
    return _llm_or(default, prompt)


def llm_cross_curricular_plan(grade, primary, supporting, big_idea, title):
    default = f"# {title}\n\n{big_idea}"
    prompt = (
        f"Write a 90-minute cross-curricular lesson plan for Grade {grade} titled "
        f"'{title}', integrating {primary} (primary) with {supporting} "
        f"(supporting). Big idea: {big_idea}. Include: Learning Objectives, "
        "Materials, Hook / Introduction, Integrated Core Activities, Student "
        "Roles, Assessment, Reflection Prompts, Differentiation. Markdown."
    )
    return _llm_or(default, prompt)


def llm_quiz(subject, grade, topic, num_questions):
    """Return (markdown, parsed_dict, answer_key_list)."""
    default_md = f"# {topic}\n\n" + "\n".join(f"{i}. Question {i}" for i in range(1, num_questions + 1))
    default_parsed = {
        "title": topic,
        "questions": [
            {"number": i, "text": f"Question {i}", "type": "short-answer", "points": 1}
            for i in range(1, num_questions + 1)
        ],
    }
    default_key = [{"number": i, "answer": "Answer", "points": 1} for i in range(1, num_questions + 1)]

    if LLM_CLIENT is None:
        return default_md, default_parsed, default_key

    prompt = (
        f"Create a {num_questions}-question quiz for Grade {grade} {subject} "
        f"on '{topic}'. Return ONLY valid JSON (no prose, no markdown fence) "
        "matching this shape exactly:\n"
        "{\n"
        '  "title": "...",\n'
        '  "instructions": "...",\n'
        '  "questions": [\n'
        '    {"number": 1, "text": "...", "type": "multiple-choice", '
        '"options": ["A","B","C","D"], "correct_answer": "A", "points": 1},\n'
        '    {"number": 2, "text": "...", "type": "short-answer", '
        '"correct_answer": "...", "points": 1}\n'
        "  ]\n"
        "}\n"
        "Mix multiple-choice and short-answer. Age-appropriate wording. ASCII only."
    )
    data = _llm_json_or(None, prompt, max_tokens=3500)
    if not isinstance(data, dict) or "questions" not in data or not data["questions"]:
        return default_md, default_parsed, default_key

    qs = data["questions"]
    md_lines = [f"# {data.get('title', topic)}", ""]
    if data.get("instructions"):
        md_lines.append(f"_{data['instructions']}_")
        md_lines.append("")
    for q in qs:
        n = q.get("number", "?")
        md_lines.append(f"{n}. {q.get('text', '')}")
        if q.get("type") == "multiple-choice" and q.get("options"):
            for idx, opt in enumerate(q["options"]):
                letter = chr(ord("A") + idx)
                md_lines.append(f"   {letter}) {opt}")
        md_lines.append("")

    key_list = [
        {
            "number": q.get("number", i + 1),
            "answer": q.get("correct_answer", ""),
            "points": q.get("points", 1),
        }
        for i, q in enumerate(qs)
    ]
    return "\n".join(md_lines), data, key_list


def llm_worksheet(subject, grade, topic, num_questions):
    default_md = (
        f"# {topic}\n\nName: ___________\nDate: ___________\n\n"
        + "\n".join(f"{i}. " for i in range(1, num_questions + 1))
    )
    default_parsed = {
        "title": topic,
        "questions": [
            {"number": i, "text": f"Question {i}", "points": 1}
            for i in range(1, num_questions + 1)
        ],
    }
    default_key = [{"number": i, "answer": "Answer", "points": 1} for i in range(1, num_questions + 1)]

    if LLM_CLIENT is None:
        return default_md, default_parsed, default_key

    prompt = (
        f"Create a {num_questions}-question practice worksheet for Grade {grade} "
        f"{subject} on '{topic}'. Return ONLY JSON:\n"
        "{\n"
        '  "title": "...",\n'
        '  "instructions": "...",\n'
        '  "questions": [\n'
        '    {"number": 1, "text": "...", "answer": "...", "points": 1}\n'
        "  ]\n"
        "}\n"
        "Mix computation, word problems, and concept application. ASCII only."
    )
    data = _llm_json_or(None, prompt, max_tokens=3500)
    if not isinstance(data, dict) or "questions" not in data or not data["questions"]:
        return default_md, default_parsed, default_key

    qs = data["questions"]
    md_lines = [f"# {data.get('title', topic)}", "", "Name: ___________   Date: ___________", ""]
    if data.get("instructions"):
        md_lines.append(f"_{data['instructions']}_")
        md_lines.append("")
    for q in qs:
        md_lines.append(f"{q.get('number', '?')}. {q.get('text', '')}")
    key_list = [
        {
            "number": q.get("number", i + 1),
            "answer": q.get("answer", ""),
            "points": q.get("points", 1),
        }
        for i, q in enumerate(qs)
    ]
    return "\n".join(md_lines), data, key_list


def llm_rubric(subject, grade, assignment_title):
    default = f"# {assignment_title}\n\n| Criteria | Excellent (4) | Good (3) | Fair (2) | Needs Improvement (1) |"
    prompt = (
        f"Create a 4-level performance rubric for a Grade {grade} {subject} "
        f"project titled '{assignment_title}'. Include 4-6 criteria rows covering "
        "content knowledge, critical thinking, presentation, and effort. Return a "
        "single markdown table with columns: Criteria | Excellent (4) | Good (3) "
        "| Fair (2) | Needs Improvement (1). Concrete descriptors in each cell."
    )
    return _llm_or(default, prompt)


def llm_presentation(title, subject, grade, num_slides):
    default_md = f"# {title}\n\nSlide 1: Introduction\nSlide 2: Overview\n..."
    default_slides = [
        {"slideNumber": i + 1, "title": f"Slide {i + 1}", "bullets": [], "notes": ""}
        for i in range(num_slides)
    ]
    if LLM_CLIENT is None:
        return default_md, default_slides

    prompt = (
        f"Create a {num_slides}-slide educational presentation titled '{title}' "
        f"for Grade {grade} {subject}. Return ONLY JSON:\n"
        "{\n"
        '  "title": "...",\n'
        '  "slides": [\n'
        '    {"slideNumber": 1, "title": "...", "bullets": ["...","..."], "notes": "..."}\n'
        "  ]\n"
        "}"
    )
    data = _llm_json_or(None, prompt, max_tokens=3000)
    if not isinstance(data, dict) or "slides" not in data or not data["slides"]:
        return default_md, default_slides

    slides = data["slides"]
    md_lines = [f"# {data.get('title', title)}", ""]
    for s in slides:
        md_lines.append(f"## Slide {s.get('slideNumber', '?')}: {s.get('title', '')}")
        for b in (s.get("bullets") or []):
            md_lines.append(f"- {b}")
        md_lines.append("")
    return "\n".join(md_lines), slides


def llm_storybook_pages(title, subject, grade, description, num_pages):
    default_pages = [
        {"pageNumber": i + 1, "text": f"Page {i + 1} of {title}.", "characterName": "Main Character"}
        for i in range(num_pages)
    ]
    if LLM_CLIENT is None:
        return default_pages

    prompt = (
        f"Write a {num_pages}-page educational storybook for Grade {grade} "
        f"({subject}) titled '{title}'. Description: {description}. "
        "Set in the Eastern Caribbean. Return ONLY JSON:\n"
        "{\n"
        '  "title": "...",\n'
        '  "pages": [\n'
        '    {"pageNumber": 1, "text": "3-5 sentence page narrative", "characterName": "..."}\n'
        "  ]\n"
        "}\n"
        "Keep page text under 80 words. ASCII only."
    )
    data = _llm_json_or(None, prompt, max_tokens=3000)
    if not isinstance(data, dict) or "pages" not in data or not data["pages"]:
        return default_pages

    out = []
    for i, p in enumerate(data["pages"]):
        out.append({
            "pageNumber": p.get("pageNumber", i + 1),
            "text": p.get("text", ""),
            "characterName": p.get("characterName", "Main Character"),
        })
    return out

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
    {"grade": "1", "subject": "Language Arts"},
    {"grade": "2", "subject": "Mathematics"},
    {"grade": "2", "subject": "Science"},
    {"grade": "4", "subject": "Mathematics"},
    {"grade": "4", "subject": "Language Arts"},
    {"grade": "4", "subject": "Science"},
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


# Per-student accommodations + IEP notes (Phase 8). Keyed by (first, last)
# so the demo shows realistic IEP-style overrides layered on top of the
# class-level CLASS CONTEXT block in every generator prompt.
STUDENT_ACCOMMODATIONS = {
    ("Aaron", "Williams"): {
        "accommodations": "Preferential seating near the front of the room; extra time on written assessments.",
        "iep_notes": "Mild hearing loss in left ear. Benefits from clear articulation and visual cues when new vocabulary is introduced.",
    },
    ("Jade", "Martin"): {
        "accommodations": "Chunked instructions with visual checklists; scheduled movement breaks every 15 minutes.",
        "iep_notes": "Diagnosed with ADHD. Focuses best on hands-on tasks and when transitions are signalled in advance.",
    },
    ("Priya", "Samuel"): {
        "accommodations": "Decodable text, reduced text density, and audio support for long passages.",
        "iep_notes": "Dyslexia - strong oral comprehension but decoding lags one grade level behind. Prefers sans-serif fonts and wider line spacing.",
    },
    ("Samuel", "Victor"): {
        "accommodations": "Sentence starters for discussion; peer support during group work; bilingual glossary allowed.",
        "iep_notes": "ELL student from a French-Creole home. Building academic English vocabulary; comfortable speaking but cautious when writing.",
    },
}


def generate_students():
    students = []
    for first, last, gender, grade in STUDENT_NAMES:
        sid = f"{first[0]}{last[0]}{random.randint(10000, 99999)}"
        acc = STUDENT_ACCOMMODATIONS.get((first, last), {})
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
            "accommodations": acc.get("accommodations", ""),
            "iep_notes": acc.get("iep_notes", ""),
            "created_at": "2025-09-01 08:30:00",
        })
    return students


# ── Classes + class-level configurations (Phase 6/7/8) ──────────────────────

def generate_classes():
    """Return explicit rows for the `classes` table.

    The demo data restore pipeline uses these to populate the classes table
    directly so the dashboard / Class Manager shows the class_id + academic
    year + description on first launch (no need to wait for the implicit
    backfill to kick in).
    """
    return [
        {
            "class_id": "demo-class-grade1",
            "class_name": "Grade 1",
            "grade_level": "1",
            "academic_year": "2025-2026",
            "description": "Primary introduction cohort - emphasis on foundational literacy and numeracy through play-based learning.",
            "created_at": "2025-09-01 08:00:00",
            "updated_at": "2025-09-01 08:00:00",
        },
        {
            "class_id": "demo-class-grade2",
            "class_name": "Grade 2",
            "grade_level": "2",
            "academic_year": "2025-2026",
            "description": "Consolidation of early literacy and numeracy; building reading fluency and addition/subtraction with regrouping.",
            "created_at": "2025-09-01 08:00:00",
            "updated_at": "2025-09-01 08:00:00",
        },
        {
            "class_id": "demo-class-grade4",
            "class_name": "Grade 4",
            "grade_level": "4",
            "academic_year": "2025-2026",
            "description": "Intermediate cohort working toward multiplicative thinking, fractions, and extended informational reading.",
            "created_at": "2025-09-01 08:00:00",
            "updated_at": "2025-09-01 08:00:00",
        },
    ]


def generate_class_configs():
    """Return rows for the `class_configs` table with realistic, teacher-
    friendly settings for each demo class. These values get surfaced in the
    Class Settings tab of the Class Manager and are auto-injected into the
    system prompt of every generator when the class is selected.
    """
    return [
        {
            "class_name": "Grade 1",
            "grade_level": "1",
            "class_id": "demo-class-grade1",
            "config": {
                "subject": "Mathematics, Language Arts",
                "strand": "",
                "essentialOutcomes": "",
                "specificOutcomes": "",
                "studentCount": 8,
                "studentsWithDisabilitiesCount": 1,
                "learningStyles": ["Visual", "Kinesthetic"],
                "learningPreferences": ["Hands-on", "Small group"],
                "multipleIntelligences": ["Bodily-Kinesthetic", "Spatial", "Interpersonal"],
                "pedagogicalStrategies": ["Direct instruction", "Scaffolded", "Gamified"],
                "customLearningStyles": "Short attention spans - lessons need to alternate between quiet and active segments every 10-15 minutes.",
                "hasSpecialNeeds": True,
                "specialNeedsDetails": "1 student with mild hearing impairment - benefits from preferential seating near the teacher and clear articulation.",
                "culturallyResponsiveNotes": "Caribbean / OECS context - use local examples (mango, dasheen, sea grapes) in word problems.",
                "hasELLStudents": False,
                "hasAdvancedLearners": False,
                "behaviorSupportFocus": "Positive reinforcement; quiet signals for transitions.",
                "readingLevel": "At grade",
                "primaryLanguage": "English",
                "bilingualProgram": "",
                "preferredAssessmentFormat": "Performance-based",
                "performanceLevels": "4-point scale",
                "includePointValues": False,
                "gradingFocusAreas": ["Content accuracy", "Organization"],
                "defaultQuestionTypes": ["Multiple Choice", "True/False"],
                "defaultCognitiveLevels": ["Remember", "Understand", "Apply"],
                "defaultTimeLimitPerQuestion": 90,
                "availableMaterials": "Counting blocks, picture cards, whiteboards, chart paper, Chromebook cart (shared with Grade 2).",
                "prerequisiteSkills": "Number recognition to 10; phonemic awareness of most consonant sounds.",
                "classPeriodDuration": "45 minutes",
                "additionalInstructions": "Always include a short movement break or song transition halfway through the lesson.",
            },
            "updated_at": "2025-09-15 14:22:00",
        },
        {
            "class_name": "Grade 2",
            "grade_level": "2",
            "class_id": "demo-class-grade2",
            "config": {
                "subject": "Mathematics, Science",
                "strand": "",
                "essentialOutcomes": "",
                "specificOutcomes": "",
                "studentCount": 8,
                "studentsWithDisabilitiesCount": 1,
                "learningStyles": ["Visual", "Auditory", "Kinesthetic"],
                "learningPreferences": ["Pair", "Small group", "Discussion-based"],
                "multipleIntelligences": ["Linguistic", "Logical-Mathematical", "Interpersonal"],
                "pedagogicalStrategies": ["Collaborative", "Scaffolded", "Gamified"],
                "customLearningStyles": "Class works well in pairs; several students are emerging readers who benefit from repeated exposure to new vocabulary.",
                "hasSpecialNeeds": True,
                "specialNeedsDetails": "1 student with ADHD - benefits from chunked instructions, visual checklists, and scheduled movement breaks.",
                "culturallyResponsiveNotes": "Incorporate Saint Lucian folk stories, Caribbean geography, and local ecosystems (mangroves, coral reefs, tropical forests) in Science lessons.",
                "hasELLStudents": False,
                "hasAdvancedLearners": True,
                "behaviorSupportFocus": "Clear visual schedule posted; timer-based work blocks.",
                "readingLevel": "At grade",
                "primaryLanguage": "English",
                "bilingualProgram": "",
                "preferredAssessmentFormat": "Mixed",
                "performanceLevels": "4-point scale",
                "includePointValues": True,
                "gradingFocusAreas": ["Content accuracy", "Creativity", "Organization"],
                "defaultQuestionTypes": ["Multiple Choice", "Short Answer", "Fill-in-the-blank"],
                "defaultCognitiveLevels": ["Remember", "Understand", "Apply"],
                "defaultTimeLimitPerQuestion": 120,
                "availableMaterials": "Base-ten blocks, leveled readers, pocket chart, markers, Chromebook cart (shared with Grade 1).",
                "prerequisiteSkills": "Addition and subtraction within 20; CVC word reading; basic sentence writing.",
                "classPeriodDuration": "45 minutes",
                "additionalInstructions": "Favor partner/share activities. Keep written instructions short and pair them with an icon.",
            },
            "updated_at": "2025-09-15 14:25:00",
        },
        {
            "class_name": "Grade 4",
            "grade_level": "4",
            "class_id": "demo-class-grade4",
            "config": {
                "subject": "Mathematics, Language Arts, Science",
                "strand": "",
                "essentialOutcomes": "",
                "specificOutcomes": "",
                "studentCount": 8,
                "studentsWithDisabilitiesCount": 1,
                "learningStyles": ["Visual", "Reading/Writing", "Kinesthetic"],
                "learningPreferences": ["Individual", "Small group", "Discussion-based"],
                "multipleIntelligences": ["Linguistic", "Logical-Mathematical", "Naturalistic", "Intrapersonal"],
                "pedagogicalStrategies": ["Differentiated", "Inquiry-based", "Collaborative"],
                "customLearningStyles": "Mixed-ability class - pair differentiated tasks with scaffolds for lower readers and extension questions for advanced learners.",
                "hasSpecialNeeds": True,
                "specialNeedsDetails": "1 student with dyslexia - needs decodable / reduced-density text and audio support on long passages.",
                "culturallyResponsiveNotes": "Integrate Caribbean history (slavery, emancipation, independence) and Saint Lucia's geography when relevant.",
                "hasELLStudents": True,
                "ellPercentage": 12,
                "hasAdvancedLearners": True,
                "behaviorSupportFocus": "Collaborative norms; restorative conversations when conflicts arise.",
                "readingLevel": "Mixed",
                "primaryLanguage": "English",
                "bilingualProgram": "",
                "preferredAssessmentFormat": "Mixed",
                "performanceLevels": "4-point scale",
                "includePointValues": True,
                "gradingFocusAreas": ["Content accuracy", "Critical thinking", "Organization", "Presentation"],
                "defaultQuestionTypes": ["Multiple Choice", "Short Answer", "Essay"],
                "defaultCognitiveLevels": ["Understand", "Apply", "Analyze"],
                "defaultTimeLimitPerQuestion": 150,
                "availableMaterials": "Fraction tiles, rulers, atlases, leveled chapter books, dedicated Chromebook cart, smartboard, science lab equipment (magnifying glasses, scales, thermometers).",
                "prerequisiteSkills": "Multiplication facts to 10x10; paragraph writing; map-reading with a key.",
                "classPeriodDuration": "60 minutes",
                "additionalInstructions": "When generating text-heavy content, also supply a simplified / decodable version for the dyslexic student and a vocabulary list for the ELL student.",
            },
            "updated_at": "2025-09-15 14:28:00",
        },
    ]


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
    ("Language Arts", "1"): ["Letter Sounds", "Sight Words", "Simple Sentences", "Story Retelling", "Rhyming Words"],
    ("Mathematics", "2"): ["Place Value", "Adding Two-Digit Numbers", "Subtracting with Regrouping", "Skip Counting", "Telling Time"],
    ("Science", "2"): ["Plant Parts", "Weather Patterns", "Water Cycle Basics", "Healthy Eating", "Materials and Properties"],
    ("Mathematics", "4"): ["Fractions", "Equivalent Fractions", "Long Multiplication", "Division with Remainders", "Area and Perimeter"],
    ("Language Arts", "4"): ["Paragraph Writing", "Reading Comprehension Strategies", "Grammar and Punctuation", "Narrative Writing", "Informational Text"],
    ("Science", "4"): ["Ecosystems", "Food Chains", "Simple Machines", "States of Matter", "The Solar System"],
}

QUIZ_TOPICS = {
    ("Mathematics", "1"): ["Counting Quiz", "Addition Facts Assessment"],
    ("Language Arts", "1"): ["Letter Sounds Quiz", "Sight Words Test"],
    ("Mathematics", "2"): ["Place Value Quiz", "Addition & Subtraction Test"],
    ("Science", "2"): ["Plants Quiz", "Weather Quiz"],
    ("Mathematics", "4"): ["Fractions Quiz", "Multiplication Test", "Division Assessment"],
    ("Language Arts", "4"): ["Reading Comprehension Quiz", "Grammar Assessment", "Vocabulary Test"],
    ("Science", "4"): ["Ecosystems Quiz", "Simple Machines Test"],
}

WORKSHEET_TOPICS = {
    ("Mathematics", "1"): ["Counting Practice", "Addition Worksheet"],
    ("Language Arts", "1"): ["Letter Tracing Practice", "Sight Words Worksheet", "Sentence Building"],
    ("Mathematics", "2"): ["Place Value Practice", "Subtraction Worksheet"],
    ("Science", "2"): ["Plants Worksheet", "Weather Observation Sheet"],
    ("Mathematics", "4"): ["Fractions Worksheet", "Multiplication Practice", "Division Worksheet"],
    ("Language Arts", "4"): ["Reading Comprehension Worksheet", "Paragraph Writing Practice", "Spelling Worksheet"],
    ("Science", "4"): ["Ecosystems Worksheet", "Machines Worksheet"],
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


def generate_timetable_slots():
    """Generate a realistic weekly timetable for a multigrade teacher."""
    slots = []
    schedule = [
        # Monday
        ("Monday", "08:00", "08:45", "Mathematics", "Grade 1"),
        ("Monday", "08:45", "09:30", "Language Arts", "Grade 1"),
        ("Monday", "09:45", "10:30", "Mathematics", "Grade 2"),
        ("Monday", "10:30", "11:15", "Science", "Grade 2"),
        ("Monday", "12:00", "12:45", "Mathematics", "Grade 4"),
        ("Monday", "12:45", "13:30", "Language Arts", "Grade 4"),
        ("Monday", "13:30", "14:15", "Science", "Grade 4"),
        # Tuesday
        ("Tuesday", "08:00", "08:45", "Mathematics", "Grade 2"),
        ("Tuesday", "08:45", "09:30", "Science", "Grade 2"),
        ("Tuesday", "09:45", "10:30", "Mathematics", "Grade 4"),
        ("Tuesday", "10:30", "11:15", "Science", "Grade 4"),
        ("Tuesday", "12:00", "12:45", "Language Arts", "Grade 1"),
        ("Tuesday", "12:45", "13:30", "Mathematics", "Grade 1"),
        ("Tuesday", "13:30", "14:15", "Language Arts", "Grade 4"),
        # Wednesday
        ("Wednesday", "08:00", "08:45", "Mathematics", "Grade 4"),
        ("Wednesday", "08:45", "09:30", "Language Arts", "Grade 4"),
        ("Wednesday", "09:45", "10:30", "Mathematics", "Grade 1"),
        ("Wednesday", "10:30", "11:15", "Language Arts", "Grade 1"),
        ("Wednesday", "12:00", "12:45", "Science", "Grade 2"),
        ("Wednesday", "12:45", "13:30", "Mathematics", "Grade 2"),
        ("Wednesday", "13:30", "14:15", "Science", "Grade 4"),
        # Thursday
        ("Thursday", "08:00", "08:45", "Language Arts", "Grade 1"),
        ("Thursday", "08:45", "09:30", "Mathematics", "Grade 1"),
        ("Thursday", "09:45", "10:30", "Science", "Grade 4"),
        ("Thursday", "10:30", "11:15", "Mathematics", "Grade 4"),
        ("Thursday", "12:00", "12:45", "Mathematics", "Grade 2"),
        ("Thursday", "12:45", "13:30", "Science", "Grade 2"),
        ("Thursday", "13:30", "14:15", "Language Arts", "Grade 4"),
        # Friday
        ("Friday", "08:00", "08:45", "Science", "Grade 2"),
        ("Friday", "08:45", "09:30", "Mathematics", "Grade 2"),
        ("Friday", "09:45", "10:30", "Mathematics", "Grade 1"),
        ("Friday", "10:30", "11:15", "Language Arts", "Grade 1"),
        ("Friday", "12:00", "12:45", "Language Arts", "Grade 4"),
        ("Friday", "12:45", "13:30", "Science", "Grade 4"),
        ("Friday", "13:30", "14:15", "Mathematics", "Grade 4"),
    ]
    for day, start, end, subject, grade in schedule:
        slots.append({
            "id": uid(),
            "teacher_id": TEACHER_ID,
            "day_of_week": day,
            "start_time": start,
            "end_time": end,
            "subject": subject,
            "grade_level": grade,
            "class_name": grade,
            "notes": "",
        })
    return slots


def generate_school_year_events():
    """Generate Saint Lucia public holidays and school events for 2025-2026 academic year."""
    events = []
    base_ts = iso(YEAR_START - timedelta(days=14))

    # Public holidays (event_type='holiday', blocks_classes=1)
    holidays = [
        ("2025-10-06", "Thanksgiving Day", "Saint Lucia Thanksgiving Day"),
        ("2025-10-26", "Jounen Kweyol (Creole Day)", "Celebration of Saint Lucian Creole heritage and culture"),
        ("2025-11-01", "All Saints Day", "All Saints Day public holiday"),
        ("2025-11-02", "All Souls Day", "All Souls Day - schools closed"),
        ("2025-12-13", "National Day", "Saint Lucia National Day - celebrating national pride and heritage"),
        ("2025-12-25", "Christmas Day", "Christmas Day public holiday"),
        ("2025-12-26", "Boxing Day", "Boxing Day public holiday"),
        ("2026-01-01", "New Year's Day", "New Year's Day public holiday"),
        ("2026-01-02", "New Year Holiday", "Additional New Year holiday"),
        ("2026-02-22", "Independence Day", "Saint Lucia Independence Day - celebrating independence since 1979"),
        ("2026-04-03", "Good Friday", "Good Friday public holiday"),
        ("2026-04-06", "Easter Monday", "Easter Monday public holiday"),
        ("2026-05-01", "Labour Day", "International Workers Day / Labour Day"),
        ("2026-05-25", "Whit Monday", "Whit Monday public holiday"),
        ("2026-06-04", "Corpus Christi", "Corpus Christi public holiday"),
        ("2026-06-15", "Carnival Monday", "Saint Lucia Carnival Monday"),
        ("2026-06-16", "Carnival Tuesday", "Saint Lucia Carnival Tuesday"),
        ("2026-08-01", "Emancipation Day", "Emancipation Day - commemorating the abolition of slavery"),
    ]

    # School events (event_type='custom', blocks_classes=0)
    school_events = [
        ("2025-10-10", "Parent-Teacher Conference (Term 1)", "Term 1 parent-teacher meetings"),
        ("2025-11-14", "Report Card Day (Mid-Term 1)", "Distribution of mid-term progress reports"),
        ("2025-12-12", "End of Term 1 Awards Ceremony", "Awards ceremony and last day of Term 1"),
        ("2026-01-05", "Term 2 Orientation", "Welcome back and Term 2 orientation day"),
        ("2026-03-06", "Parent-Teacher Conference (Term 2)", "Term 2 parent-teacher meetings"),
        ("2026-03-27", "End of Term 2 Awards Ceremony", "Awards ceremony and last day of Term 2"),
        ("2026-04-13", "Term 3 Orientation", "Welcome back and Term 3 orientation day"),
        ("2026-05-22", "Sports Day", "Annual school athletics and sports day"),
        ("2026-06-05", "Science Fair", "Annual school science exhibition"),
        ("2026-06-26", "Graduation Ceremony", "End of year graduation and awards ceremony"),
    ]

    # Add holidays
    for date_str, title, desc in holidays:
        events.append({
            "id": uid(),
            "config_id": SCHOOL_YEAR_CONFIG_ID,
            "teacher_id": TEACHER_ID,
            "title": title,
            "description": desc,
            "event_date": date_str,
            "end_date": date_str,
            "event_type": "holiday",
            "color": "#DC2626",
            "subject": "",
            "grade_level": "",
            "all_day": 1,
            "reminders_enabled": 0,
            "reminder_offsets": "[]",
            "blocks_classes": 1,
            "created_at": base_ts,
        })

    # Add school events
    for date_str, title, desc in school_events:
        events.append({
            "id": uid(),
            "config_id": SCHOOL_YEAR_CONFIG_ID,
            "teacher_id": TEACHER_ID,
            "title": title,
            "description": desc,
            "event_date": date_str,
            "end_date": date_str,
            "event_type": "custom",
            "color": "#3B82F6",
            "subject": "",
            "grade_level": "",
            "all_day": 1,
            "reminders_enabled": 0,
            "reminder_offsets": "[]",
            "blocks_classes": 0,
            "created_at": base_ts,
        })

    return events


def generate_metric_snapshots(academic_phases):
    """Generate 2-3 metric snapshots per phase with realistic score progression.
    Only generates snapshots for phases that have started (start <= today)."""
    snapshots = []
    phase_id_map = {p["phase_key"]: p["id"] for p in academic_phases}
    today = date.today()

    for key, label, semester, order, start, end in PHASES:
        # Skip phases that haven't started yet -- keeps data realistic
        if start > today:
            continue
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

            # Skip snapshots in the future
            if snap_date > today:
                continue

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
    """Generate summaries for completed phases (only past phases)."""
    summaries = []
    phase_id_map = {p["phase_key"]: p for p in academic_phases}
    today = date.today()

    for key, label, semester, order, start, end in PHASES:
        # Only summarize phases that have already ended
        if end >= today or key == "summer_vacation":
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
            student_count = str(random.randint(20, 30))
            duration = str(random.choice([45, 60, 90]))
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
                    "studentCount": student_count,
                    "duration": duration,
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
                },
                "generatedPlan": llm_lesson_plan(subject, grade, topic, duration, student_count),
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
                "generatedPlan": llm_kindergarten_plan(topic_name, subj, strand, "3-4"),
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
            "generatedPlan": llm_multigrade_plan(subject, topic, "1-2"),
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
            "generatedPlan": llm_cross_curricular_plan(
                grade,
                "Mathematics",
                "Science",
                "Mathematics and science are interconnected",
                f"Exploring Connections - Grade {grade}",
            ),
            "parsedPlan": None,
        })
    return plans


def generate_quizzes():
    """Generate quizzes - heavy during midterm phases. Returns (quizzes, quiz_refs, answer_keys)."""
    quizzes = []
    quiz_refs = []  # Track for grades
    answer_keys = []
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
            quiz_md, parsed_quiz, key_questions = llm_quiz(subject, grade, topic, num_q)
            actual_total = len(parsed_quiz.get("questions", [])) or num_q
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
                    "numberOfQuestions": str(actual_total),
                    "strand": {"Mathematics": "number-operations", "Science": "living-things", "Language Arts": "reading", "Social Studies": "community"}.get(subject, "general"),
                    "essentialOutcomes": f"Assess {topic}",
                    "specificOutcomes": f"Evaluate understanding of {topic}",
                },
                "generatedQuiz": quiz_md,
                "parsedQuiz": parsed_quiz,
            })
            quiz_refs.append({
                "id": quiz_id,
                "date": quiz_date,
                "subject": subject,
                "grade": grade,
                "total": actual_total,
                "title": topic,
            })
            answer_keys.append({
                "id": uid(),
                "quiz_id": quiz_id,
                "title": f"{subject} - {topic} (Grade {grade})",
                "subject": subject,
                "grade_level": grade,
                "total_questions": actual_total,
                "questions": json.dumps(key_questions),
                "created_at": iso(quiz_date, 15, 0),
            })
    return quizzes, quiz_refs, answer_keys


def generate_worksheets():
    """Generate worksheets distributed across teaching phases. Returns (worksheets, ws_refs, answer_keys)."""
    worksheets = []
    ws_refs = []
    answer_keys = []
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
            ws_md, parsed_ws, key_questions = llm_worksheet(subject, grade, topic, num_q)
            actual_total = len(parsed_ws.get("questions", [])) or num_q
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
                    "questionCount": str(actual_total),
                    "questionType": "mixed",
                    "selectedTemplate": "standard",
                    "worksheetTitle": topic,
                    "imageMode": "none",
                    "imageStyle": "",
                    "imagePlacement": "",
                    "essentialOutcomes": f"Practice {topic}",
                    "specificOutcomes": f"Reinforce understanding of {topic}",
                },
                "generatedWorksheet": ws_md,
                "parsedWorksheet": parsed_ws,
            })
            ws_refs.append({
                "id": ws_id,
                "date": ws_date,
                "subject": subject,
                "grade": grade,
                "total": actual_total,
                "title": topic,
            })
            answer_keys.append({
                "id": uid(),
                "worksheet_id": ws_id,
                "title": f"{subject} - {topic} (Grade {grade})",
                "subject": subject,
                "grade_level": grade,
                "total_questions": actual_total,
                "questions": json.dumps(key_questions),
                "created_at": iso(ws_date, 15, 0),
            })
    return worksheets, ws_refs, answer_keys


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
            "generatedRubric": llm_rubric(subject, grade, f"{term} Project"),
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


def _extract_key_and_text(outcome, index):
    """Replicate MilestoneDB._extract_key_and_text() so checklist keys match
    what the backend produces during sync. This is critical for _merge_checklists()
    to preserve checked state."""
    import re
    if isinstance(outcome, dict):
        return outcome.get('id', str(index)), outcome.get('text', '').strip()
    text = outcome.strip()
    if not text:
        return str(index), text
    m = re.match(r'^(\d+\.\d+)\s+(.+)', text)
    if m:
        return m.group(1), m.group(2).strip()
    m = re.match(r'^([KSV]\d*):\s+(.+)', text)
    if m:
        return m.group(1), m.group(2).strip()
    m = re.match(r'^([\d]+-\w+-[KSV]-?\d+):?\s+(.+)', text)
    if m:
        return m.group(1), m.group(2).strip()
    return str(index), text


def generate_milestones(academic_phases):
    """Generate curriculum milestones using REAL curriculum data including specific outcomes.
    Uses the actual CurriculumMatcher to get real SCOs so checklist keys match
    what the backend produces during sync."""
    milestones = []
    teaching_phases = [(k, l, s, o, st, en) for k, l, s, o, st, en in PHASES if is_teaching_phase(k)]
    phase_key_to_id = {p["phase_key"]: p["id"] for p in academic_phases}
    today = date.today()

    # Load real curriculum data for the teacher's grades
    try:
        from curriculum_matcher import CurriculumMatcher
        cm = CurriculumMatcher()
        all_pages = cm.all_pages()
    except Exception as e:
        print(f"  Warning: Could not load curriculum: {e}")
        all_pages = []

    # Build topic list from ALL curriculum pages.
    # Only the teacher's actual grade+subject assignments get progressive
    # completion; everything else is hidden (is_hidden=1).
    taught_pairs = {(c["grade"], c["subject"]) for c in CLASSES}
    taught_topics = []
    other_topics = []
    for page in all_pages:
        grade_num = page['grade'].replace('Grade ', '').replace('Kindergarten', 'K')
        entry = {
            "topic_id": page['id'],
            "display_name": page.get('displayName', ''),
            "subject": page.get('subject', ''),
            "strand": page.get('strand', ''),
            "grade": grade_num,
            "route": page.get('route', ''),
            "specific_outcomes": page.get('specificOutcomes', []),
        }
        if (grade_num, page.get('subject', '')) in taught_pairs:
            taught_topics.append(entry)
        else:
            other_topics.append(entry)

    # ── Curriculum-aware strand sequencing ────────────────────────────
    # Define the natural teaching order per subject: foundational strands
    # first, more complex / applied strands later in the year.
    STRAND_ORDER = {
        "Mathematics": [
            "Number Sense",
            "Operations with Numbers",
            "Patterns and Relationships",
            "Measurement",
            "Geometrical Thinking",
            "Data Handling and Probability",
        ],
        "Language Arts": [
            "Listening and Speaking",
            "Reading and Viewing",
            "Writing and Representing",
        ],
        "Science": [
            # Grade 1
            "Waves",
            "Structure, Function, and Information Processing",
            "Space Systems: Patterns and Cycles",
            # Grade 2
            "Structure and Properties of Matter",
            "Interdependent Relationships in Ecosystems",
            "Earth Systems",
            "Engineering Design",
            # Grade 4
            "Energy",
            # "Waves" already listed (Grade 1 reuse is fine)
            # "Earth Systems" already listed (Grade 2 reuse is fine)
        ],
        "Social Studies": [
            "Historical and Cultural Thinking",
            "Civic Participation",
            "Spatial Thinking",
            "Economic Decision Making",
        ],
    }

    def _strand_sort_key(topic):
        """Return (fractional_position, grade, subject) for global ordering.
        Fractional position = strand_index / total_strands_for_this_subject,
        so foundational strands from ALL grade/subject combos cluster early."""
        seq = STRAND_ORDER.get(topic["subject"], [])
        try:
            idx = seq.index(topic["strand"])
        except ValueError:
            idx = len(seq)  # unknown strands go last
        total = max(len(seq), 1)
        frac = idx / total  # 0.0 = first strand, ~1.0 = last strand
        return (frac, topic["grade"], topic["subject"])

    # Sort taught topics by curriculum sequence (not random)
    taught_topics.sort(key=_strand_sort_key)

    n_total = len(taught_topics)
    n_completed = int(n_total * 0.65)
    n_in_progress = int(n_total * 0.15)

    # Only use teaching phases that have started (no future phases)
    active_teaching_phases = [(k, l, s, o, st, en) for k, l, s, o, st, en in teaching_phases if st <= today]
    if not active_teaching_phases:
        active_teaching_phases = teaching_phases[:1]

    # Map each topic to a phase based on its position in the curriculum
    # sequence rather than random assignment.
    for i, topic in enumerate(taught_topics):
        topic_id = topic["topic_id"]
        display_name = topic["display_name"]
        subject = topic["subject"]
        strand = topic["strand"]
        grade = topic["grade"]
        outcomes = topic["specific_outcomes"]

        if i < n_completed:
            status = "completed"
            # Spread completed topics across active phases proportionally
            phase_idx = min(int(i / n_completed * len(active_teaching_phases)), len(active_teaching_phases) - 1)
            phase_key, _, _, _, phase_start, phase_end = active_teaching_phases[phase_idx]
            effective_end = min(phase_end, today)
            completed_at = random_date_in_range(phase_start, effective_end)
            completed_str = f"{completed_at.isoformat()} {random.randint(10,16)}:{random.randint(0,59):02d}:00"
            due_date = phase_end.isoformat()
            milestone_phase_id = phase_key_to_id.get(phase_key)
        elif i < n_completed + n_in_progress:
            status = "in-progress"
            completed_str = None
            # In-progress topics land in the most recent active phases
            phase_idx = min(len(active_teaching_phases) - 1, max(0, len(active_teaching_phases) - 2 + (i - n_completed) % 2))
            phase_key, _, _, _, phase_start, phase_end = active_teaching_phases[phase_idx]
            due_date = phase_end.isoformat()
            milestone_phase_id = phase_key_to_id.get(phase_key)
        else:
            status = "not_started"
            completed_str = None
            # Not-started topics go to the next upcoming phase if available
            future_phases = [(k, l, s, o, st, en) for k, l, s, o, st, en in teaching_phases if st > today]
            if future_phases:
                fp_idx = min((i - n_completed - n_in_progress) % len(future_phases), len(future_phases) - 1)
                phase_key, _, _, _, phase_start, phase_end = future_phases[fp_idx]
                due_date = phase_end.isoformat()
                milestone_phase_id = phase_key_to_id.get(phase_key)
            else:
                phase_start = YEAR_START
                phase_end = YEAR_END
                due_date = None
                milestone_phase_id = None

        # Build checklist from REAL specific outcomes using the same key extraction
        # as MilestoneDB._extract_key_and_text() so keys match during sync merge
        checklist = []
        for ci, outcome in enumerate(outcomes):
            if isinstance(outcome, dict):
                if not outcome.get('text', '').strip():
                    continue
            elif isinstance(outcome, str) and not outcome.strip():
                continue
            key, text = _extract_key_and_text(outcome, ci)
            if status == "completed":
                checked = True
            elif status == "in-progress":
                # Check roughly 60% of items for in-progress milestones
                checked = ci < int(len(outcomes) * 0.6)
            else:
                checked = False
            effective_start = phase_start if status != "not_started" else YEAR_START
            effective_end_for_date = min(phase_end, today) if status != "not_started" else YEAR_END
            checklist.append({
                "key": key,
                "text": text,
                "checked": checked,
                "checked_at": iso(random_date_in_range(effective_start, effective_end_for_date)) if checked else None,
            })

        milestones.append({
            "id": f"{TEACHER_ID}_{topic_id}",
            "teacher_id": TEACHER_ID,
            "topic_id": topic_id,
            "topic_title": display_name,
            "grade": grade,
            "subject": subject,
            "strand": strand,
            "route": topic.get("route", ""),
            "status": status,
            "notes": None,
            "due_date": due_date,
            "is_hidden": 0,
            "completed_at": completed_str,
            "created_at": f"{YEAR_START.isoformat()} 09:00:00",
            "updated_at": f"{random_date_in_range(phase_start if status != 'not_started' else YEAR_START, min(phase_end if status != 'not_started' else YEAR_END, today)).isoformat()} 09:00:00",
            "checklist_json": json.dumps(checklist),
            "phase_id": milestone_phase_id,
        })

    # Add milestones for non-taught grades as hidden (excluded from stats)
    for topic in other_topics:
        outcomes = topic["specific_outcomes"]
        checklist = []
        for ci, outcome in enumerate(outcomes):
            if isinstance(outcome, dict):
                if not outcome.get('text', '').strip():
                    continue
            elif isinstance(outcome, str) and not outcome.strip():
                continue
            key, text = _extract_key_and_text(outcome, ci)
            checklist.append({"key": key, "text": text, "checked": False, "checked_at": None})
        milestones.append({
            "id": f"{TEACHER_ID}_{topic['topic_id']}",
            "teacher_id": TEACHER_ID,
            "topic_id": topic["topic_id"],
            "topic_title": topic["display_name"],
            "grade": topic["grade"],
            "subject": topic["subject"],
            "strand": topic["strand"],
            "route": topic.get("route", ""),
            "status": "not_started",
            "notes": None,
            "due_date": None,
            "is_hidden": 1,
            "completed_at": None,
            "created_at": f"{YEAR_START.isoformat()} 09:00:00",
            "updated_at": f"{YEAR_START.isoformat()} 09:00:00",
            "checklist_json": json.dumps(checklist),
            "phase_id": None,
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
    """Generate rich brain dump entries with parsed actions and suggestions across phases."""
    dumps = []

    dump_entries = [
        # (text, actions, suggestions)
        (
            "Grade 4 students are struggling with equivalent fractions. Need to create a visual worksheet using fraction tiles and number lines. Also quiz them on Friday to see where they stand.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "worksheet",
                    "title": "Equivalent Fractions Visual Worksheet",
                    "description": "Create a worksheet using fraction tiles and number lines for Grade 4 students struggling with equivalent fractions",
                    "details": {"subject": "Mathematics", "gradeLevel": "4", "topic": "Equivalent Fractions", "strand": "number-sense"},
                    "status": "accepted",
                    "priority": "high"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "quiz",
                    "title": "Equivalent Fractions Assessment",
                    "description": "Friday quiz to assess Grade 4 understanding of equivalent fractions",
                    "details": {"subject": "Mathematics", "gradeLevel": "4", "topic": "Equivalent Fractions"},
                    "status": "accepted",
                    "priority": "high"
                }
            ],
            []
        ),
        (
            "Monday morning assembly ran long so Grade 1 Language Arts got cut short. Need to double up on sight words tomorrow. Aaron is making progress with his hearing support - the visual cue cards are working well. Should note that in his file.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "lesson-plan",
                    "title": "Extended Sight Words Lesson",
                    "description": "Double lesson on sight words for Grade 1 to make up for Monday's shortened class",
                    "details": {"subject": "Language Arts", "gradeLevel": "1", "topic": "Sight Words", "duration": "60"},
                    "status": "accepted",
                    "priority": "high"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "class-management",
                    "title": "Update Aaron Williams IEP Notes",
                    "description": "Record progress with visual cue cards for hearing support accommodation",
                    "details": {"studentName": "Aaron Williams", "gradeLevel": "1"},
                    "status": "accepted",
                    "priority": "normal"
                }
            ],
            []
        ),
        (
            "Science fair is coming up in June. Grade 4 students need to start brainstorming project ideas around energy and simple machines. Maybe a cross-curricular project linking Science and Mathematics? Also should update the curriculum tracker - we covered energy transfer last week.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "cross-curricular-plan",
                    "title": "Science Fair Prep: Energy and Simple Machines",
                    "description": "Cross-curricular project linking Grade 4 Science (energy/machines) with Mathematics for the science fair",
                    "details": {"primarySubject": "Science", "supportingSubjects": "Mathematics", "gradeLevel": "4"},
                    "status": "accepted",
                    "priority": "normal"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "curriculum-tracker",
                    "title": "Mark Energy Transfer as Completed",
                    "description": "Update curriculum tracker - energy transfer topic covered last week in Grade 4 Science",
                    "details": {"subject": "Science", "gradeLevel": "4", "strand": "energy"},
                    "status": "accepted",
                    "priority": "normal"
                }
            ],
            []
        ),
        (
            "Term 2 midterms next week. Need a Grade 2 Math quiz on place value and addition with regrouping. Also need to prep a review worksheet for Grade 4 multiplication. Attendance has been low this week - check with parents of absent students.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "quiz",
                    "title": "Grade 2 Place Value and Addition Quiz",
                    "description": "Midterm quiz covering place value and addition with regrouping for Grade 2",
                    "details": {"subject": "Mathematics", "gradeLevel": "2", "topic": "Place Value and Addition"},
                    "status": "accepted",
                    "priority": "urgent"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "worksheet",
                    "title": "Grade 4 Multiplication Review",
                    "description": "Review worksheet for long multiplication before midterm exams",
                    "details": {"subject": "Mathematics", "gradeLevel": "4", "topic": "Long Multiplication"},
                    "status": "accepted",
                    "priority": "urgent"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "attendance",
                    "title": "Follow Up on Absent Students",
                    "description": "Check with parents about student absences this week",
                    "details": {},
                    "status": "pending",
                    "priority": "high"
                }
            ],
            []
        ),
        (
            "Great class today! Grade 1 students loved the counting song for addition facts. Need to plan more musical activities. Jade in Grade 2 had a rough day - her ADHD was really affecting her focus. The movement breaks helped but we might need to adjust the schedule for her.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "lesson-plan",
                    "title": "Musical Addition Activities for Grade 1",
                    "description": "Plan more musical and song-based activities for teaching addition facts to Grade 1",
                    "details": {"subject": "Mathematics", "gradeLevel": "1", "topic": "Addition Facts"},
                    "status": "accepted",
                    "priority": "normal"
                }
            ],
            [
                {
                    "id": f"sug-{uid()[:12]}",
                    "text": "Jade in Grade 2 had a rough day - her ADHD was really affecting her focus. The movement breaks helped but we might need to adjust the schedule for her.",
                    "suggestedTypes": ["class-management"],
                    "confidence": "medium",
                    "selectedType": None,
                    "status": "pending"
                }
            ]
        ),
        (
            "Need to create a rubric for the Grade 4 narrative writing assignment due next week. Students should be assessed on story structure, character development, grammar, and creativity. Also the Reading Comprehension unit is almost done - time to move to informational text.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "rubric",
                    "title": "Narrative Writing Rubric - Grade 4",
                    "description": "Rubric for Grade 4 narrative writing covering story structure, character development, grammar, and creativity",
                    "details": {"subject": "Language Arts", "gradeLevel": "4"},
                    "status": "accepted",
                    "priority": "high"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "curriculum-tracker",
                    "title": "Complete Reading Comprehension Unit",
                    "description": "Mark Reading Comprehension Strategies as completed and begin Informational Text unit",
                    "details": {"subject": "Language Arts", "gradeLevel": "4"},
                    "status": "accepted",
                    "priority": "normal"
                }
            ],
            []
        ),
        (
            "Parent of Samuel Victor called - wants to know how he is doing in English since he is an ELL student. Should prepare a progress summary. Also thinking about creating a presentation for the Term 1 parent night showing class progress across all three grades.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "class-management",
                    "title": "Samuel Victor Progress Summary",
                    "description": "Prepare ELL progress summary for Samuel Victor's parent",
                    "details": {"studentName": "Samuel Victor", "gradeLevel": "4"},
                    "status": "accepted",
                    "priority": "high"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "presentation",
                    "title": "Term 1 Parent Night Presentation",
                    "description": "Create presentation showing class progress across Grade 1, 2, and 4 for parent night",
                    "details": {},
                    "status": "accepted",
                    "priority": "normal"
                }
            ],
            []
        ),
        (
            "Grade 2 Science experiment on plant growth went really well. Students measured their bean plants and recorded data. Should create a follow-up worksheet connecting the measurements to the math we did on standard units. Priya needs the simplified text version as usual.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "worksheet",
                    "title": "Plant Growth Measurement Worksheet",
                    "description": "Follow-up worksheet connecting Grade 2 Science plant measurement data to Mathematics standard units",
                    "details": {"subject": "Science", "gradeLevel": "2", "topic": "Plant Growth and Measurement"},
                    "status": "accepted",
                    "priority": "normal"
                }
            ],
            [
                {
                    "id": f"sug-{uid()[:12]}",
                    "text": "Priya needs the simplified text version as usual.",
                    "suggestedTypes": ["class-management", "worksheet"],
                    "confidence": "low",
                    "selectedType": None,
                    "status": "pending"
                }
            ]
        ),
        (
            "Independence Day is coming up on Feb 22. Want to do something special with all three grades - maybe a multigrade lesson on Saint Lucia's history and national symbols. Could tie in Language Arts with writing about what independence means to them.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "multigrade-plan",
                    "title": "Independence Day Multigrade Lesson",
                    "description": "Multigrade lesson for Grades 1, 2, and 4 on Saint Lucia's history, national symbols, and independence",
                    "details": {"subject": "Social Studies", "gradeRange": "1-4", "topic": "Saint Lucia Independence Day"},
                    "status": "accepted",
                    "priority": "high"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "calendar-task",
                    "title": "Plan Independence Day Activities",
                    "description": "Coordinate Independence Day celebration activities across all grades",
                    "details": {"date": "2026-02-20", "priority": "high"},
                    "status": "accepted",
                    "priority": "high"
                }
            ],
            []
        ),
        (
            "End of term coming up. Need to grade the last batch of Grade 4 Science quizzes on ecosystems. Also should create a fun review game for Grade 1 Math - maybe a counting competition. The storybook project for Grade 1 Language Arts turned out great, students love The Mango Tree.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "grade-quiz",
                    "title": "Grade Ecosystems Quizzes",
                    "description": "Grade the final batch of Grade 4 Science quizzes on ecosystems",
                    "details": {"subject": "Science", "gradeLevel": "4"},
                    "status": "accepted",
                    "priority": "urgent"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "lesson-plan",
                    "title": "Grade 1 Math Review Game",
                    "description": "Fun counting competition review game for Grade 1 Mathematics end of term",
                    "details": {"subject": "Mathematics", "gradeLevel": "1", "topic": "End of Term Review"},
                    "status": "accepted",
                    "priority": "normal"
                }
            ],
            []
        ),
        (
            "Jounen Kweyol next week! Should incorporate Creole heritage into lessons. Grade 2 Science could study local plants and traditional uses. Grade 4 can write about Creole food culture in Language Arts. Need to check which students are performing in the cultural show.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "lesson-plan",
                    "title": "Local Plants and Traditional Uses",
                    "description": "Grade 2 Science lesson on local Saint Lucian plants and their traditional Creole uses for Jounen Kweyol",
                    "details": {"subject": "Science", "gradeLevel": "2", "topic": "Local Plants"},
                    "status": "accepted",
                    "priority": "high"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "lesson-plan",
                    "title": "Creole Food Culture Writing",
                    "description": "Grade 4 Language Arts lesson on writing about Creole food culture for Jounen Kweyol",
                    "details": {"subject": "Language Arts", "gradeLevel": "4", "topic": "Cultural Writing"},
                    "status": "accepted",
                    "priority": "high"
                }
            ],
            [
                {
                    "id": f"sug-{uid()[:12]}",
                    "text": "Need to check which students are performing in the cultural show.",
                    "suggestedTypes": ["calendar-task", "class-management"],
                    "confidence": "low",
                    "selectedType": None,
                    "status": "pending"
                }
            ]
        ),
        (
            "Final exams approaching. Grade 4 Math needs a comprehensive review covering fractions, multiplication, and division. Grade 2 needs a Science review on all topics covered. Should also prepare image resources for the exam study guides - diagrams for plant parts and the water cycle.",
            [
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "worksheet",
                    "title": "Grade 4 Math Comprehensive Review",
                    "description": "End of year review worksheet covering fractions, multiplication, and division for Grade 4",
                    "details": {"subject": "Mathematics", "gradeLevel": "4", "topic": "Comprehensive Review"},
                    "status": "accepted",
                    "priority": "urgent"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "quiz",
                    "title": "Grade 2 Science Review Quiz",
                    "description": "Comprehensive review quiz covering all Grade 2 Science topics for end of year",
                    "details": {"subject": "Science", "gradeLevel": "2", "topic": "Year Review"},
                    "status": "accepted",
                    "priority": "urgent"
                },
                {
                    "id": f"action-{uid()[:12]}",
                    "type": "image-studio",
                    "title": "Study Guide Diagrams",
                    "description": "Create plant parts and water cycle diagrams for Grade 2 Science exam study guides",
                    "details": {"subject": "Science", "gradeLevel": "2"},
                    "status": "accepted",
                    "priority": "high"
                }
            ],
            []
        ),
    ]

    for i, (text, actions, suggestions) in enumerate(dump_entries):
        phase_idx = i % len(PHASES)
        key, label, semester, order, start, end = PHASES[phase_idx]
        dump_date = random_date_in_range(start, end)
        ts = unique_ts(dump_date)
        dumps.append({
            "id": f"entry-{ts}",
            "text": text,
            "timestamp": iso(dump_date),
            "actions": actions,
            "suggestions": suggestions,
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
        subject = random.choice(SUBJECTS)
        num_slides = random.randint(8, 15)
        pres_md, slides = llm_presentation(title, subject, grade, num_slides)
        presentations.append({
            "id": f"presentation_{ts}",
            "title": title,
            "timestamp": iso(pdate),
            "formData": {
                "topic": title,
                "gradeLevel": grade,
                "subject": subject,
                "slideCount": str(len(slides) or num_slides),
            },
            "generatedPresentation": pres_md,
            "slides": slides,
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
                "pages": llm_storybook_pages(title, subject, grade, desc, 5),
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
                    "1": ["Mathematics", "Language Arts"],
                    "2": ["Mathematics", "Science"],
                    "4": ["Mathematics", "Language Arts", "Science"],
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
    global LLM_CLIENT

    parser = argparse.ArgumentParser(
        description="Generate comprehensive demo data for OECS Teacher Assistant. "
                    "Supply --openrouter-key + --openrouter-model to LLM-generate "
                    "all lesson/quiz/worksheet/rubric/presentation/storybook content; "
                    "otherwise the script runs fully offline with short stub content."
    )
    parser.add_argument("--openrouter-key", default=os.environ.get("OPENROUTER_API_KEY"),
                        help="OpenRouter API key (or set OPENROUTER_API_KEY env var)")
    parser.add_argument("--openrouter-model", default=os.environ.get("OPENROUTER_MODEL"),
                        help="OpenRouter model slug, e.g. 'anthropic/claude-3.5-sonnet' or 'openai/gpt-4o-mini'")
    parser.add_argument("--cache-dir",
                        default=os.path.join(os.path.dirname(__file__), "demo_llm_cache"),
                        help="Directory for on-disk LLM response cache (default: backend/demo_llm_cache)")
    parser.add_argument("--seed", type=int, default=42,
                        help="Random seed for reproducible demo output (default: 42)")
    parser.add_argument("--output", default=None,
                        help="Output JSON path (default: <repo>/demo_year_data.json)")
    args = parser.parse_args()

    random.seed(args.seed)

    if args.openrouter_key and args.openrouter_model:
        LLM_CLIENT = LLMClient(
            api_key=args.openrouter_key,
            model=args.openrouter_model,
            cache_dir=args.cache_dir,
        )
        print(f"[LLM] OpenRouter enabled: model={args.openrouter_model}")
        print(f"[LLM] Cache dir: {args.cache_dir}")
    else:
        print("[LLM] OpenRouter not configured -- using static stub content.")
        print("      Pass --openrouter-key and --openrouter-model to generate full content.")

    print("Generating comprehensive demo data...")

    # Core data
    students = generate_students()
    classes = generate_classes()
    class_configs = generate_class_configs()
    academic_phases = generate_academic_phases()
    snapshots = generate_metric_snapshots(academic_phases)
    phase_summaries = generate_phase_summaries(academic_phases, snapshots)

    lesson_plans = generate_lesson_plans()
    kindergarten = generate_kindergarten_plans()
    multigrade = generate_multigrade_plans()
    cross_curricular = generate_cross_curricular_plans()
    quizzes, quiz_refs, quiz_answer_keys = generate_quizzes()
    worksheets, ws_refs, worksheet_answer_keys = generate_worksheets()
    rubrics = generate_rubrics()

    attendance = generate_attendance(students)
    quiz_grades = generate_quiz_grades(students, quiz_refs)
    worksheet_grades = generate_worksheet_grades(students, ws_refs)
    milestones = generate_milestones(academic_phases)
    timetable_slots = generate_timetable_slots()
    achievements = generate_achievements()
    tasks = generate_tasks()
    chats = generate_chats()
    brain_dumps = generate_brain_dumps()
    calendar = generate_calendar(quiz_refs, ws_refs)
    school_year_events = generate_school_year_events()
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
                "classes": classes,
                "class_configs": class_configs,
                "attendance": attendance,
                "quiz_grades": quiz_grades,
                "worksheet_grades": worksheet_grades,
                "quiz_answer_keys": quiz_answer_keys,
                "worksheet_answer_keys": worksheet_answer_keys,
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
                "school_year_events": school_year_events,
                "timetable_slots": timetable_slots,
            },
        },
    }

    # Write output
    output_path = args.output or os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "demo_year_data.json"
    )
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(backup, f, indent=2, ensure_ascii=True)

    # Print summary
    print(f"\nDemo data generated: {output_path}")
    print(f"  Students: {len(students)} ({sum(1 for s in students if s.get('accommodations') or s.get('iep_notes'))} with IEP/accommodations)")
    print(f"  Classes: {len(classes)}")
    print(f"  Class configs: {len(class_configs)}")
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
    print(f"  Timetable slots: {len(timetable_slots)}")
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
    print(f"  Quiz answer keys: {len(quiz_answer_keys)}")
    print(f"  Worksheet answer keys: {len(worksheet_answer_keys)}")

    if LLM_CLIENT is not None:
        print()
        print("[LLM] Stats:")
        print(f"  API calls:  {LLM_CLIENT.calls}")
        print(f"  Cache hits: {LLM_CLIENT.cache_hits}")
        print(f"  Errors:     {LLM_CLIENT.errors}")


if __name__ == "__main__":
    main()


# Example usage:
#
# cd backend
# .\venv\Scripts\Activate
# python generate_demo_data.py \
#   --openrouter-key sk-or-v1-xxxx \
#   --openrouter-model anthropic/claude-3.5-sonnet
