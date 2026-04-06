import sqlite3
import uuid
import json
import hashlib
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
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")
    conn.execute("PRAGMA cache_size = 10000")
    conn.execute("PRAGMA mmap_size = 30000000")
    conn.execute("PRAGMA temp_store = MEMORY")
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
        conn.execute('''
            CREATE TABLE IF NOT EXISTS quiz_answer_keys (
                quiz_id      TEXT PRIMARY KEY,
                quiz_title   TEXT,
                subject      TEXT,
                grade_level  TEXT,
                questions    TEXT,
                created_at   TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS worksheet_answer_keys (
                worksheet_id TEXT PRIMARY KEY,
                worksheet_title TEXT,
                subject      TEXT,
                grade_level  TEXT,
                questions    TEXT,
                passage      TEXT,
                matching_items TEXT,
                word_bank    TEXT,
                created_at   TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS test_reminders (
                id            TEXT PRIMARY KEY,
                title         TEXT NOT NULL,
                description   TEXT,
                test_date     TEXT NOT NULL,
                test_time     TEXT,
                type          TEXT NOT NULL DEFAULT 'quiz',
                reference_id  TEXT,
                subject       TEXT,
                grade_level   TEXT,
                created_at    TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS worksheet_packages (
                id               TEXT PRIMARY KEY,
                worksheet_title  TEXT,
                subject          TEXT,
                grade_level      TEXT,
                class_name       TEXT,
                base_worksheet   TEXT,
                student_versions TEXT,
                form_data        TEXT,
                randomized       INTEGER DEFAULT 0,
                created_at       TEXT DEFAULT CURRENT_TIMESTAMP,
                graded           INTEGER DEFAULT 0
            )
        ''')
        # ── Scan-Grading Tables ─────────────────────────────────────────
        conn.execute('''
            CREATE TABLE IF NOT EXISTS quiz_instances (
                id               TEXT PRIMARY KEY,
                quiz_id          TEXT NOT NULL,
                student_id       TEXT NOT NULL,
                question_order   TEXT NOT NULL,
                version_hash     TEXT NOT NULL,
                class_name       TEXT,
                created_at       TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (quiz_id) REFERENCES quiz_answer_keys(quiz_id),
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                UNIQUE (quiz_id, student_id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS worksheet_instances (
                id               TEXT PRIMARY KEY,
                worksheet_id     TEXT NOT NULL,
                package_id       TEXT,
                student_id       TEXT NOT NULL,
                question_order   TEXT NOT NULL,
                option_maps      TEXT,
                shuffled_column_b TEXT,
                shuffled_word_bank TEXT,
                version_hash     TEXT NOT NULL,
                class_name       TEXT,
                created_at       TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (worksheet_id) REFERENCES worksheet_answer_keys(worksheet_id),
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                UNIQUE (worksheet_id, student_id)
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS answer_region_templates (
                id              TEXT PRIMARY KEY,
                doc_type        TEXT NOT NULL,
                page_size       TEXT DEFAULT 'letter',
                regions         TEXT NOT NULL,
                alignment_markers TEXT,
                qr_position     TEXT,
                created_at      TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # ── Migrate: add quiz_id / instance_id to grade tables ──────────
        for col in ('quiz_id', 'instance_id'):
            try:
                conn.execute(f'ALTER TABLE quiz_grades ADD COLUMN {col} TEXT')
            except Exception:
                pass
        for col in ('worksheet_id', 'instance_id'):
            try:
                conn.execute(f'ALTER TABLE worksheet_grades ADD COLUMN {col} TEXT')
            except Exception:
                pass
        conn.execute('CREATE INDEX IF NOT EXISTS idx_quiz_grades_student ON quiz_grades(student_id)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_worksheet_grades_student ON worksheet_grades(student_id)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_quiz_instances_student ON quiz_instances(student_id)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_worksheet_instances_student ON worksheet_instances(student_id)')
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


# ── Quiz Answer Keys ─────────────────────────────────────────────────────────

def save_quiz_answer_key(quiz_id: str, quiz_title: str, subject: str,
                         grade_level: str, questions: list) -> dict:
    """Save the answer key for a generated quiz."""
    conn = _get_conn()
    try:
        conn.execute(
            '''INSERT OR REPLACE INTO quiz_answer_keys
               (quiz_id, quiz_title, subject, grade_level, questions)
               VALUES (?, ?, ?, ?, ?)''',
            (quiz_id, quiz_title, subject, grade_level, json.dumps(questions))
        )
        conn.commit()
        row = conn.execute(
            'SELECT * FROM quiz_answer_keys WHERE quiz_id = ?', (quiz_id,)
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


def get_quiz_answer_key(quiz_id: str) -> dict | None:
    """Fetch answer key by quiz_id."""
    conn = _get_conn()
    try:
        row = conn.execute(
            'SELECT * FROM quiz_answer_keys WHERE quiz_id = ?', (quiz_id,)
        ).fetchone()
        if row:
            result = dict(row)
            result['questions'] = json.loads(result['questions'])
            return result
        return None
    finally:
        conn.close()


def list_quiz_answer_keys() -> list[dict]:
    """List all saved quiz answer keys (without full question data)."""
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT quiz_id, quiz_title, subject, grade_level, created_at '
            'FROM quiz_answer_keys ORDER BY created_at DESC'
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


# ── Worksheet Answer Keys ────────────────────────────────────────────────────

def save_worksheet_answer_key(worksheet_id: str, worksheet_title: str, subject: str,
                               grade_level: str, questions: list,
                               passage: str = '', matching_items: dict = None,
                               word_bank: list = None) -> dict:
    """Save the answer key for a generated worksheet."""
    conn = _get_conn()
    try:
        conn.execute(
            '''INSERT OR REPLACE INTO worksheet_answer_keys
               (worksheet_id, worksheet_title, subject, grade_level, questions, passage, matching_items, word_bank)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
            (worksheet_id, worksheet_title, subject, grade_level,
             json.dumps(questions), passage or '',
             json.dumps(matching_items or {}), json.dumps(word_bank or []))
        )
        conn.commit()
        row = conn.execute(
            'SELECT * FROM worksheet_answer_keys WHERE worksheet_id = ?', (worksheet_id,)
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


def get_worksheet_answer_key(worksheet_id: str) -> dict | None:
    """Fetch worksheet answer key by worksheet_id."""
    conn = _get_conn()
    try:
        row = conn.execute(
            'SELECT * FROM worksheet_answer_keys WHERE worksheet_id = ?', (worksheet_id,)
        ).fetchone()
        if row:
            result = dict(row)
            result['questions'] = json.loads(result['questions'])
            result['matching_items'] = json.loads(result['matching_items']) if result['matching_items'] else {}
            result['word_bank'] = json.loads(result['word_bank']) if result['word_bank'] else []
            return result
        return None
    finally:
        conn.close()


def list_worksheet_answer_keys() -> list[dict]:
    """List all saved worksheet answer keys (without full question data)."""
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT worksheet_id, worksheet_title, subject, grade_level, created_at '
            'FROM worksheet_answer_keys ORDER BY created_at DESC'
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


# ── Test Reminders ─────────────────────────────────────────────────────────────

def save_test_reminder(data: dict) -> dict:
    conn = _get_conn()
    try:
        reminder_id = data.get('id') or str(uuid.uuid4())
        conn.execute(
            '''INSERT OR REPLACE INTO test_reminders
               (id, title, description, test_date, test_time, type, reference_id, subject, grade_level)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                reminder_id,
                data.get('title', ''),
                data.get('description', ''),
                data.get('test_date'),
                data.get('test_time'),
                data.get('type', 'quiz'),
                data.get('reference_id'),
                data.get('subject'),
                data.get('grade_level'),
            )
        )
        conn.commit()
        row = conn.execute('SELECT * FROM test_reminders WHERE id = ?', (reminder_id,)).fetchone()
        return dict(row)
    finally:
        conn.close()


def list_test_reminders() -> list[dict]:
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT * FROM test_reminders ORDER BY test_date ASC, test_time ASC'
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_test_reminder(reminder_id: str) -> dict | None:
    conn = _get_conn()
    try:
        row = conn.execute('SELECT * FROM test_reminders WHERE id = ?', (reminder_id,)).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def delete_test_reminder(reminder_id: str) -> bool:
    conn = _get_conn()
    try:
        cur = conn.execute('DELETE FROM test_reminders WHERE id = ?', (reminder_id,))
        conn.commit()
        return cur.rowcount > 0
    finally:
        conn.close()


# ── Quiz Grades ───────────────────────────────────────────────────────────────

def save_quiz_grade(data: dict) -> dict:
    conn = _get_conn()
    try:
        student_id = data.get('student_id')
        quiz_id = data.get('quiz_id')

        # Check for existing grade for same student + quiz (duplicate protection)
        existing = None
        if student_id and quiz_id:
            existing = conn.execute(
                'SELECT id FROM quiz_grades WHERE student_id = ? AND quiz_id = ?',
                (student_id, quiz_id)
            ).fetchone()

        if existing:
            # Update existing grade
            grade_id = existing['id']
            conn.execute(
                '''UPDATE quiz_grades SET quiz_title=?, subject=?, score=?, total_points=?,
                   percentage=?, letter_grade=?, answers=?, instance_id=?, graded_at=CURRENT_TIMESTAMP
                   WHERE id=?''',
                (
                    data.get('quiz_title'), data.get('subject'),
                    data.get('score'), data.get('total_points'),
                    data.get('percentage'), data.get('letter_grade'),
                    json.dumps(data.get('answers', {})), data.get('instance_id'),
                    grade_id,
                )
            )
        else:
            # Insert new grade
            grade_id = str(uuid.uuid4())
            conn.execute(
                '''INSERT INTO quiz_grades
                   (id, student_id, quiz_title, subject, score, total_points,
                    percentage, letter_grade, answers, quiz_id, instance_id)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (
                    grade_id, student_id,
                    data.get('quiz_title'), data.get('subject'),
                    data.get('score'), data.get('total_points'),
                    data.get('percentage'), data.get('letter_grade'),
                    json.dumps(data.get('answers', {})),
                    quiz_id, data.get('instance_id'),
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
                student_id = _generate_student_id(conn, full_name=data['full_name'])
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
        student_id = data.get('student_id')
        worksheet_id = data.get('worksheet_id')

        # Check for existing grade for same student + worksheet (duplicate protection)
        existing = None
        if student_id and worksheet_id:
            existing = conn.execute(
                'SELECT id FROM worksheet_grades WHERE student_id = ? AND worksheet_id = ?',
                (student_id, worksheet_id)
            ).fetchone()

        if existing:
            grade_id = existing['id']
            conn.execute(
                '''UPDATE worksheet_grades SET worksheet_title=?, subject=?, score=?, total_points=?,
                   percentage=?, letter_grade=?, answers=?, instance_id=?, graded_at=CURRENT_TIMESTAMP
                   WHERE id=?''',
                (
                    data.get('worksheet_title'), data.get('subject'),
                    data.get('score'), data.get('total_points'),
                    data.get('percentage'), data.get('letter_grade'),
                    json.dumps(data.get('answers', {})), data.get('instance_id'),
                    grade_id,
                )
            )
        else:
            grade_id = str(uuid.uuid4())
            conn.execute(
                '''INSERT INTO worksheet_grades
                   (id, student_id, worksheet_title, subject, score, total_points,
                    percentage, letter_grade, answers, worksheet_id, instance_id)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (
                    grade_id, student_id,
                    data.get('worksheet_title'), data.get('subject'),
                    data.get('score'), data.get('total_points'),
                    data.get('percentage'), data.get('letter_grade'),
                    json.dumps(data.get('answers', {})),
                    worksheet_id, data.get('instance_id'),
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


# ── Worksheet Packages ────────────────────────────────────────────────────────

def save_worksheet_package(data: dict) -> dict:
    conn = _get_conn()
    try:
        pkg_id = data.get('id') or str(uuid.uuid4())
        conn.execute(
            '''INSERT OR REPLACE INTO worksheet_packages
               (id, worksheet_title, subject, grade_level, class_name,
                base_worksheet, student_versions, form_data, randomized)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                pkg_id,
                data.get('worksheet_title'),
                data.get('subject'),
                data.get('grade_level'),
                data.get('class_name'),
                json.dumps(data.get('base_worksheet', {})),
                json.dumps(data.get('student_versions', [])),
                json.dumps(data.get('form_data', {})),
                1 if data.get('randomized') else 0,
            )
        )
        conn.commit()
        row = conn.execute('SELECT * FROM worksheet_packages WHERE id = ?', (pkg_id,)).fetchone()
        return dict(row)
    finally:
        conn.close()


def get_worksheet_package(package_id: str) -> dict | None:
    conn = _get_conn()
    try:
        row = conn.execute(
            'SELECT * FROM worksheet_packages WHERE id = ?', (package_id,)
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def list_worksheet_packages(class_name: str | None = None) -> list[dict]:
    conn = _get_conn()
    try:
        if class_name:
            rows = conn.execute(
                'SELECT id, worksheet_title, subject, grade_level, class_name, randomized, created_at, graded FROM worksheet_packages WHERE class_name = ? ORDER BY created_at DESC',
                (class_name,)
            ).fetchall()
        else:
            rows = conn.execute(
                'SELECT id, worksheet_title, subject, grade_level, class_name, randomized, created_at, graded FROM worksheet_packages ORDER BY created_at DESC'
            ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def mark_package_graded(package_id: str) -> None:
    conn = _get_conn()
    try:
        conn.execute('UPDATE worksheet_packages SET graded = 1 WHERE id = ?', (package_id,))
        conn.commit()
    finally:
        conn.close()


# ── Quiz Instances (per-student randomized versions) ────────────────────────

def compute_version_hash(student_id: str, question_order: list[int]) -> str:
    """Generate a 4-char hash that uniquely identifies this student's question arrangement."""
    raw = f"{student_id}:{','.join(map(str, question_order))}"
    return hashlib.md5(raw.encode()).hexdigest()[:4]


def save_quiz_instance(quiz_id: str, student_id: str, question_order: list[int],
                       version_hash: str, class_name: str = '') -> dict:
    """Persist a student's specific quiz version for QR-based auto-matching."""
    conn = _get_conn()
    try:
        # Preserve existing instance_id to avoid orphaning grade references
        existing = conn.execute(
            'SELECT id FROM quiz_instances WHERE quiz_id = ? AND student_id = ?',
            (quiz_id, student_id)
        ).fetchone()
        instance_id = existing['id'] if existing else str(uuid.uuid4())
        conn.execute('''
            INSERT OR REPLACE INTO quiz_instances
            (id, quiz_id, student_id, question_order, version_hash, class_name)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (instance_id, quiz_id, student_id,
              json.dumps(question_order), version_hash, class_name))
        conn.commit()
        return {"id": instance_id, "version_hash": version_hash}
    finally:
        conn.close()


def save_worksheet_instance(worksheet_id: str, student_id: str,
                            question_order: list[int], version_hash: str,
                            option_maps: dict = None,
                            shuffled_column_b: list = None,
                            shuffled_word_bank: list = None,
                            package_id: str = None,
                            class_name: str = '') -> dict:
    """Persist a student's specific worksheet version for QR-based auto-matching."""
    conn = _get_conn()
    try:
        # Preserve existing instance_id to avoid orphaning grade references
        existing = conn.execute(
            'SELECT id FROM worksheet_instances WHERE worksheet_id = ? AND student_id = ?',
            (worksheet_id, student_id)
        ).fetchone()
        instance_id = existing['id'] if existing else str(uuid.uuid4())
        conn.execute('''
            INSERT OR REPLACE INTO worksheet_instances
            (id, worksheet_id, package_id, student_id, question_order,
             option_maps, shuffled_column_b, shuffled_word_bank,
             version_hash, class_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (instance_id, worksheet_id, package_id, student_id,
              json.dumps(question_order),
              json.dumps(option_maps) if option_maps else None,
              json.dumps(shuffled_column_b) if shuffled_column_b else None,
              json.dumps(shuffled_word_bank) if shuffled_word_bank else None,
              version_hash, class_name))
        conn.commit()
        return {"id": instance_id, "version_hash": version_hash}
    finally:
        conn.close()


def get_instance_by_qr(doc_type: str, doc_id: str, student_id: str,
                       version_hash: str) -> dict | None:
    """Look up a quiz/worksheet instance by QR payload fields."""
    conn = _get_conn()
    try:
        table = 'quiz_instances' if doc_type == 'quiz' else 'worksheet_instances'
        id_col = 'quiz_id' if doc_type == 'quiz' else 'worksheet_id'
        row = conn.execute(
            f'SELECT * FROM {table} WHERE {id_col} = ? AND student_id = ? AND version_hash = ?',
            (doc_id, student_id, version_hash)
        ).fetchone()
        # Fallback: if version_hash didn't match, try without it (handles "0000" from legacy exports)
        if not row and version_hash:
            row = conn.execute(
                f'SELECT * FROM {table} WHERE {id_col} = ? AND student_id = ?',
                (doc_id, student_id)
            ).fetchone()
        if row:
            result = dict(row)
            result['question_order'] = json.loads(result['question_order'])
            if doc_type == 'worksheet':
                result['option_maps'] = json.loads(result['option_maps']) if result.get('option_maps') else None
                result['shuffled_column_b'] = json.loads(result['shuffled_column_b']) if result.get('shuffled_column_b') else None
                result['shuffled_word_bank'] = json.loads(result['shuffled_word_bank']) if result.get('shuffled_word_bank') else None
            return result
        return None
    finally:
        conn.close()


def list_quiz_instances(quiz_id: str) -> list[dict]:
    """List all student instances for a given quiz."""
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT qi.*, s.full_name FROM quiz_instances qi '
            'JOIN students s ON s.id = qi.student_id '
            'WHERE qi.quiz_id = ? ORDER BY s.full_name',
            (quiz_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def list_worksheet_instances(worksheet_id: str) -> list[dict]:
    """List all student instances for a given worksheet."""
    conn = _get_conn()
    try:
        rows = conn.execute(
            'SELECT wi.*, s.full_name FROM worksheet_instances wi '
            'JOIN students s ON s.id = wi.student_id '
            'WHERE wi.worksheet_id = ? ORDER BY s.full_name',
            (worksheet_id,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


# ── Answer Region Templates ─────────────────────────────────────────────────

def save_answer_region_template(doc_id: str, doc_type: str, regions: list,
                                 alignment_markers: list = None,
                                 qr_position: dict = None,
                                 page_size: str = 'letter') -> dict:
    """Save the coordinate layout for a generated document."""
    conn = _get_conn()
    try:
        conn.execute('''
            INSERT OR REPLACE INTO answer_region_templates
            (id, doc_type, page_size, regions, alignment_markers, qr_position)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (doc_id, doc_type, page_size,
              json.dumps(regions),
              json.dumps(alignment_markers) if alignment_markers else None,
              json.dumps(qr_position) if qr_position else None))
        conn.commit()
        row = conn.execute(
            'SELECT * FROM answer_region_templates WHERE id = ?', (doc_id,)
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


def get_answer_region_template(doc_id: str) -> dict | None:
    """Fetch the answer region template for a document."""
    conn = _get_conn()
    try:
        row = conn.execute(
            'SELECT * FROM answer_region_templates WHERE id = ?', (doc_id,)
        ).fetchone()
        if row:
            result = dict(row)
            result['regions'] = json.loads(result['regions'])
            result['alignment_markers'] = json.loads(result['alignment_markers']) if result['alignment_markers'] else None
            result['qr_position'] = json.loads(result['qr_position']) if result['qr_position'] else None
            return result
        return None
    finally:
        conn.close()


# ── Attendance ───────────────────────────────────────────────────────────────

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
