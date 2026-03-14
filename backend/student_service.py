import sqlite3
import uuid
import json
import os
from pathlib import Path


def _get_db_path() -> str:
    if os.name == 'nt':
        app_data = os.environ.get('APPDATA', os.path.expanduser('~'))
        data_dir = Path(app_data) / 'OECS Learning Hub' / 'data'
    else:
        data_dir = Path.home() / '.olh_ai_education' / 'data'
    data_dir.mkdir(parents=True, exist_ok=True)
    return str(data_dir / 'students.db')


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(_get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = _get_conn()
    try:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS students (
                id          TEXT PRIMARY KEY,
                full_name   TEXT NOT NULL,
                date_of_birth TEXT,
                class_name  TEXT,
                grade_level TEXT,
                gender      TEXT,
                contact_info TEXT,
                created_at  TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS quiz_grades (
                id           TEXT PRIMARY KEY,
                student_id   TEXT NOT NULL,
                quiz_title   TEXT,
                subject      TEXT,
                score        REAL,
                total_points REAL,
                percentage   REAL,
                letter_grade TEXT,
                answers      TEXT,
                graded_at    TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        ''')
        conn.commit()
    finally:
        conn.close()


def get_letter_grade(percentage: float) -> str:
    if percentage >= 90:
        return 'A'
    if percentage >= 80:
        return 'B'
    if percentage >= 70:
        return 'C'
    if percentage >= 60:
        return 'D'
    return 'F'


# ── Students ─────────────────────────────────────────────────────────────────

def list_students(class_name: str | None = None) -> list[dict]:
    conn = _get_conn()
    try:
        if class_name:
            rows = conn.execute(
                'SELECT * FROM students WHERE class_name = ? ORDER BY full_name',
                (class_name,)
            ).fetchall()
        else:
            rows = conn.execute(
                'SELECT * FROM students ORDER BY class_name, full_name'
            ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_student(student_id: str) -> dict | None:
    conn = _get_conn()
    try:
        row = conn.execute(
            'SELECT * FROM students WHERE id = ?', (student_id,)
        ).fetchone()
        if not row:
            return None
        student = dict(row)
        grades = conn.execute(
            'SELECT * FROM quiz_grades WHERE student_id = ? ORDER BY graded_at DESC',
            (student_id,)
        ).fetchall()
        student['quiz_grades'] = [dict(g) for g in grades]
        return student
    finally:
        conn.close()


def create_student(data: dict) -> dict:
    conn = _get_conn()
    try:
        student_id = str(uuid.uuid4())
        conn.execute(
            '''INSERT INTO students
               (id, full_name, date_of_birth, class_name, grade_level, gender, contact_info)
               VALUES (?, ?, ?, ?, ?, ?, ?)''',
            (
                student_id,
                data.get('full_name'),
                data.get('date_of_birth'),
                data.get('class_name'),
                data.get('grade_level'),
                data.get('gender'),
                data.get('contact_info'),
            )
        )
        conn.commit()
        row = conn.execute('SELECT * FROM students WHERE id = ?', (student_id,)).fetchone()
        student = dict(row)
        student['quiz_grades'] = []
        return student
    finally:
        conn.close()


def update_student(student_id: str, data: dict) -> dict | None:
    conn = _get_conn()
    try:
        conn.execute(
            '''UPDATE students
               SET full_name=?, date_of_birth=?, class_name=?, grade_level=?, gender=?, contact_info=?
               WHERE id=?''',
            (
                data.get('full_name'),
                data.get('date_of_birth'),
                data.get('class_name'),
                data.get('grade_level'),
                data.get('gender'),
                data.get('contact_info'),
                student_id,
            )
        )
        conn.commit()
        return get_student(student_id)
    finally:
        conn.close()


def delete_student(student_id: str):
    conn = _get_conn()
    try:
        conn.execute('DELETE FROM students WHERE id = ?', (student_id,))
        conn.commit()
    finally:
        conn.close()


def list_classes() -> list[str]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT DISTINCT class_name FROM students WHERE class_name IS NOT NULL ORDER BY class_name'
        ).fetchall()
        return [r['class_name'] for r in rows]
    finally:
        conn.close()


# ── Quiz Grades ───────────────────────────────────────────────────────────────

def save_quiz_grade(data: dict) -> dict:
    conn = _get_conn()
    try:
        grade_id = str(uuid.uuid4())
        conn.execute(
            '''INSERT INTO quiz_grades
               (id, student_id, quiz_title, subject, score, total_points, percentage, letter_grade, answers)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                grade_id,
                data.get('student_id'),
                data.get('quiz_title'),
                data.get('subject'),
                data.get('score'),
                data.get('total_points'),
                data.get('percentage'),
                data.get('letter_grade'),
                json.dumps(data.get('answers', {})),
            )
        )
        conn.commit()
        row = conn.execute('SELECT * FROM quiz_grades WHERE id = ?', (grade_id,)).fetchone()
        return dict(row)
    finally:
        conn.close()


def get_student_grades(student_id: str) -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT * FROM quiz_grades WHERE student_id = ? ORDER BY graded_at DESC',
            (student_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()
