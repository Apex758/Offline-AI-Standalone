# How the Grading System Works

## Overview

The grading system is an Excel-based workflow that lets teachers manage class rosters, generate grading templates, and import completed grades back into the database. It is accessible from the **Grading System** page in the UI.

---

## Workflow

### 1. Upload Student List

The teacher uploads an Excel file (`.xlsx`/`.xls`) containing student records.

**Required columns** (matched flexibly, case-insensitive):
- `Student Full Name` or separate `First Name` / `Last Name` columns
- `Date of Birth`
- `Class` (e.g. `Grade6A`)

Optional columns: `Gender`, `Contact Info`, `Student ID`, `Grade Level`

The backend (`ExcelService.read_student_list`) uses regex pattern matching to find the right columns regardless of exact header names. Students with no name data are skipped. Each valid row is inserted into the `students` table in PostgreSQL.

**Endpoint:** `POST /upload-student-list`

---

### 2. Select a Class

The page fetches all classes from `/api/grade-class-groups`, which queries the database for distinct class values and groups them by grade number and section (e.g. `{ 6: ["A", "B"], 7: ["A"] }`). The dropdown shows these as `Grade6A`, `Grade6B`, etc.

---

### 3. Download a Grading Template

Selecting a class and clicking **Download Template** generates an Excel file for that class.

**Endpoint:** `GET /download-template/{class_name}`

The file has three sheets:

#### Grading Sheet
| Column | Description |
|--------|-------------|
| Student ID | DB row ID |
| Student Name | Full name |
| Assessment columns | One column per assessment (filled by teacher) |
| Total | `=SUM(...)` of all assessment columns |
| Average | Total ÷ count of assessments |
| Grade | Letter grade via formula |

**Grade scale:**
| Score | Grade |
|-------|-------|
| 90+ | A |
| 80–89 | B |
| 70–79 | C |
| 60–69 | D |
| 0–59 | F |

#### Attendance Sheet
Columns for each class day of the current month. Teacher enters:
- `P` = Present
- `A` = Absent
- `L` = Late

Auto-calculated summary columns: Present count, Absent count, Late count, Attendance %.

#### Info Sheet
Instructions for filling out the other two sheets.

---

### 4. Upload Completed Grading File

After the teacher fills in scores and attendance, they upload the file back.

**Endpoint:** `POST /upload-grading-file`

`ExcelService.read_grading_file` extracts:
- **Assessments** — column headers from row 3 (skipping Student ID, Name, Total, Average, Grade)
- **Scores** — numeric values per student per assessment column
- **Attendance** — status values per student per date column

---

### 5. Class Overview

The right panel shows a summary card for each class pulled from `/class-summary/{class_name}`:
- Total students
- Total assessments
- Attendance rate (%)

---

## Printable Class Lists Tab

A separate tab provides downloadable Excel templates for offline tracking:

| Template Type | Contents |
|--------------|----------|
| `attendance` | Student list with day columns (P/A/L/E), auto-summary |
| `participation` | Participation (1–5) and Engagement (1–5) columns |
| `grades` | Score column, comments, total points possible field |

**Export endpoint:** `GET /class-list-export/{grade}/{class_name}/{template_type}`
**Import endpoint:** `POST /process-class-list` — reads a completed template and saves records back to the database.

---

## Database Tables

| Table | What it stores |
|-------|----------------|
| `students` | Core student info (name, DOB, class, grade level) |
| `performance` | Subject scores: quiz, homework, test, project, final exam |
| `attendance` | Total days, days present, late arrivals, absences |
| `behavior` | Participation score, disciplinary notes, commendations |
| `mental_evaluation` | Stress level, emotional status, mood check-ins |
| `parent_guardian` | Guardian name, relationship, contact info |
| `health_records` | Vaccinations, allergies, conditions, medications |
| `learning_behaviors` | Learning style, task time, participation scores |

---

## Calculated Metrics (StudentService)

These are computed on-the-fly and not stored:

- **Average Score** — mean across all subject scores
- **Attendance Rate** — `(days_present / total_days) × 100`
- **Behavior Score** — `100 - (incident_count × 10)`, capped at 0
- **Behavior Rating** — Excellent (90+), Good (80+), Satisfactory (70+), Needs Improvement (60+), Concerning (<60)
- **Participation Average** — mean of participation score list
- **Mood Trend** — Positive / Neutral / Concerning based on mood check-in labels
