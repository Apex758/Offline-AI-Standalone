import sqlite3
import uuid
import json
import os
import random
import string
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


def _generate_student_id(conn: sqlite3.Connection,
                          first_name: str = '', last_name: str = '',
                          full_name: str = '') -> str:
    first = first_name[0].upper() if first_name.strip() else (full_name.strip().split() or ['X'])[0][0].upper()
    parts = full_name.strip().split()
    last = last_name[0].upper() if last_name.strip() else (parts[-1][0].upper() if len(parts) > 1 else first)
    for _ in range(100):
        digits = ''.join(random.choices(string.digits, k=5))
        sid = f"{first}{last}{digits}"
        if not conn.execute('SELECT 1 FROM students WHERE id = ?', (sid,)).fetchone():
            return sid
    return str(uuid.uuid4())


def init_db():
    conn = _get_conn()
    try:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS students (
                id          TEXT PRIMARY KEY,
                full_name   TEXT NOT NULL,
                first_name  TEXT,
                middle_name TEXT,
                last_name   TEXT,
                date_of_birth TEXT,
                class_name  TEXT,
                grade_level TEXT,
                gender      TEXT,
                contact_info TEXT,
                created_at  TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Migrate existing tables that lack the new name columns
        for col in ('first_name', 'middle_name', 'last_name'):
            try:
                conn.execute(f'ALTER TABLE students ADD COLUMN {col} TEXT')
            except Exception:
                pass
        conn.execute('''
            CREATE TABLE IF NOT EXISTS attendance (
                id               TEXT PRIMARY KEY,
                student_id       TEXT NOT NULL,
                class_name       TEXT NOT NULL,
                date             TEXT NOT NULL,
                status           TEXT NOT NULL DEFAULT 'Present',
                engagement_level TEXT DEFAULT 'Engaged',
                notes            TEXT DEFAULT '',
                recorded_at      TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        ''')
        conn.execute('''
            CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_student_date
            ON attendance(student_id, date)
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
        conn.execute('''
            CREATE TABLE IF NOT EXISTS worksheet_grades (
                id           TEXT PRIMARY KEY,
                student_id   TEXT NOT NULL,
                worksheet_title TEXT,
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
        ws_grades = conn.execute(
            'SELECT * FROM worksheet_grades WHERE student_id = ? ORDER BY graded_at DESC',
            (student_id,)
        ).fetchall()
        student['worksheet_grades'] = [dict(g) for g in ws_grades]
        return student
    finally:
        conn.close()


def create_student(data: dict) -> dict:
    conn = _get_conn()
    try:
        first_name = (data.get('first_name') or '').strip()
        middle_name = (data.get('middle_name') or '').strip()
        last_name = (data.get('last_name') or '').strip()
        full_name = ' '.join(filter(None, [first_name, middle_name, last_name])) or data.get('full_name', '')
        student_id = _generate_student_id(conn, first_name=first_name, last_name=last_name, full_name=full_name)
        conn.execute(
            '''INSERT INTO students
               (id, full_name, first_name, middle_name, last_name,
                date_of_birth, class_name, grade_level, gender, contact_info)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                student_id, full_name, first_name, middle_name, last_name,
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
        first_name = (data.get('first_name') or '').strip()
        middle_name = (data.get('middle_name') or '').strip()
        last_name = (data.get('last_name') or '').strip()
        full_name = ' '.join(filter(None, [first_name, middle_name, last_name])) or data.get('full_name', '')
        conn.execute(
            '''UPDATE students
               SET full_name=?, first_name=?, middle_name=?, last_name=?,
                   date_of_birth=?, class_name=?, grade_level=?, gender=?, contact_info=?
               WHERE id=?''',
            (
                full_name, first_name, middle_name, last_name,
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


def list_classes(grade_level: str | None = None) -> list[dict]:
    conn = _get_conn()
    try:
        if grade_level:
            rows = conn.execute(
                'SELECT DISTINCT class_name, grade_level FROM students WHERE class_name IS NOT NULL AND grade_level = ? ORDER BY class_name',
                (grade_level,)
            ).fetchall()
        else:
            rows = conn.execute(
                'SELECT DISTINCT class_name, grade_level FROM students WHERE class_name IS NOT NULL ORDER BY grade_level, class_name'
            ).fetchall()
        return [{'class_name': r['class_name'], 'grade_level': r['grade_level']} for r in rows]
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


# ── Bulk Import ──────────────────────────────────────────────────────────────

def bulk_import_students(rows: list[dict]) -> dict:
    """Import students from parsed spreadsheet rows.
    Each row should have keys matching student fields.
    Returns summary of created/updated/skipped counts.
    """
    conn = _get_conn()
    created = 0
    updated = 0
    skipped = 0
    errors = []
    try:
        for i, row in enumerate(rows, start=2):  # row 2 = first data row in Excel
            name = (row.get('full_name') or row.get('Full Name') or '').strip()
            if not name:
                skipped += 1
                continue

            # Normalise field names (accept Title Case or snake_case)
            data = {
                'full_name': name,
                'date_of_birth': str(row.get('date_of_birth') or row.get('Date of Birth') or '').strip(),
                'class_name': str(row.get('class_name') or row.get('Class') or '').strip(),
                'grade_level': str(row.get('grade_level') or row.get('Grade Level') or '').strip(),
                'gender': str(row.get('gender') or row.get('Gender') or '').strip(),
                'contact_info': str(row.get('contact_info') or row.get('Contact Info') or '').strip(),
            }

            # Check if student already exists by name + class
            existing = conn.execute(
                'SELECT id FROM students WHERE full_name = ? AND class_name = ?',
                (data['full_name'], data['class_name'])
            ).fetchone()

            if existing:
                conn.execute(
                    '''UPDATE students
                       SET date_of_birth=?, grade_level=?, gender=?, contact_info=?
                       WHERE id=?''',
                    (data['date_of_birth'], data['grade_level'],
                     data['gender'], data['contact_info'], existing['id'])
                )
                updated += 1
            else:
                student_id = _generate_student_id(data['full_name'], conn)
                conn.execute(
                    '''INSERT INTO students
                       (id, full_name, date_of_birth, class_name, grade_level, gender, contact_info)
                       VALUES (?, ?, ?, ?, ?, ?, ?)''',
                    (student_id, data['full_name'], data['date_of_birth'],
                     data['class_name'], data['grade_level'],
                     data['gender'], data['contact_info'])
                )
                created += 1

        conn.commit()
    except Exception as e:
        errors.append(str(e))
    finally:
        conn.close()

    return {
        'created': created,
        'updated': updated,
        'skipped': skipped,
        'errors': errors,
    }


# ── Attendance ───────────────────────────────────────────────────────────────

def get_attendance(class_name: str, date: str) -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            '''SELECT a.*, s.full_name
               FROM attendance a
               JOIN students s ON s.id = a.student_id
               WHERE a.class_name = ? AND a.date = ?
               ORDER BY s.full_name''',
            (class_name, date)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


# ── Worksheet Grades ─────────────────────────────────────────────────────────

def save_worksheet_grade(data: dict) -> dict:
    conn = _get_conn()
    try:
        grade_id = str(uuid.uuid4())
        conn.execute(
            '''INSERT INTO worksheet_grades
               (id, student_id, worksheet_title, subject, score, total_points, percentage, letter_grade, answers)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                grade_id,
                data.get('student_id'),
                data.get('worksheet_title'),
                data.get('subject'),
                data.get('score'),
                data.get('total_points'),
                data.get('percentage'),
                data.get('letter_grade'),
                json.dumps(data.get('answers', {})),
            )
        )
        conn.commit()
        row = conn.execute('SELECT * FROM worksheet_grades WHERE id = ?', (grade_id,)).fetchone()
        return dict(row)
    finally:
        conn.close()


def get_worksheet_grades(student_id: str) -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT * FROM worksheet_grades WHERE student_id = ? ORDER BY graded_at DESC',
            (student_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def save_attendance(records: list[dict]) -> dict:
    conn = _get_conn()
    saved = 0
    try:
        for rec in records:
            record_id = str(uuid.uuid4())
            conn.execute(
                '''INSERT INTO attendance
                   (id, student_id, class_name, date, status, engagement_level, notes)
                   VALUES (?, ?, ?, ?, ?, ?, ?)
                   ON CONFLICT(student_id, date) DO UPDATE SET
                       status = excluded.status,
                       engagement_level = excluded.engagement_level,
                       notes = excluded.notes,
                       recorded_at = CURRENT_TIMESTAMP''',
                (
                    record_id,
                    rec.get('student_id'),
                    rec.get('class_name'),
                    rec.get('date'),
                    rec.get('status', 'Present'),
                    rec.get('engagement_level', 'Engaged'),
                    rec.get('notes', ''),
                )
            )
            saved += 1
        conn.commit()
    finally:
        conn.close()
    return {'saved': saved}
