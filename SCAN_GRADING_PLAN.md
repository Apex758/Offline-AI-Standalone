# Offline Worksheet & Quiz Scan Grading — Comprehensive Implementation Plan

> **Version:** 2.0 — QR-Linked Auto-Matching Architecture
> **Last Updated:** 2026-04-03
> **App:** OECS Learning Hub (Electron + React + FastAPI)

---

## Table of Contents

1. [Objective](#1-objective)
2. [System Overview](#2-system-overview)
3. [Architecture Diagram](#3-architecture-diagram)
4. [QR Code System Design](#4-qr-code-system-design)
5. [Database Schema Changes](#5-database-schema-changes)
6. [Worksheet & Quiz Generation Changes](#6-worksheet--quiz-generation-changes)
7. [Phone Capture Workflow](#7-phone-capture-workflow)
8. [Laptop Processing Pipeline](#8-laptop-processing-pipeline)
9. [Grading Engine Integration](#9-grading-engine-integration)
10. [Frontend UI Changes](#10-frontend-ui-changes)
11. [Fallback & Error Handling](#11-fallback--error-handling)
12. [Implementation Tasks](#12-implementation-tasks)
13. [File-by-File Change Map](#13-file-by-file-change-map)
14. [Data Flow Diagrams](#14-data-flow-diagrams)
15. [Advantages](#15-advantages)

---

## 1. Objective

Enable a teacher to:

1. **Generate** worksheets/quizzes with unique per-student QR codes embedded on every printed page
2. **Capture** completed worksheets using their phone camera (via existing photo transfer PWA)
3. **Auto-match** each scanned page to the correct quiz/worksheet AND the correct student — no manual tagging required
4. **Auto-grade** using a hybrid pipeline: pixel-density detection for MC/TF (no OCR), targeted OCR only for open-ended text regions
5. **Store results** linked in the database to the exact quiz/worksheet instance the student received (including randomized question order)

All of this works **fully offline** with no internet dependency.

---

## 2. System Overview

| Component | Status | What It Does |
|-----------|--------|-------------|
| **Teacher Laptop** | Exists | Runs Electron + React + FastAPI. All processing happens here. |
| **Teacher Phone** | Exists | Camera + upload only. Connects via local WiFi, no computation. |
| **Photo Transfer** | Exists | QR scan → phone PWA → upload photos over local network with SSE updates. |
| **OCR Engine** | Exists | PaddleOCR-VL 1.5 (0.9B GGUF). Used only for open-answer text regions. |
| **Grading Engine** | Exists | Direct comparison for MC/TF + LLM for open-ended. Saves to SQLite. |
| **Answer Key System** | Exists | Per-quiz/worksheet keys in SQLite (`quiz_answer_keys`, `worksheet_answer_keys`). |
| **Student Versioning** | Exists | `worksheet_packages` table stores per-student randomized versions. Quiz class mode has Fisher-Yates shuffle. |
| **Per-Page QR Codes** | **NEW** | Each printed page gets a QR encoding `{type, id, student_id, version_hash}`. |
| **QR Scanner Module** | **NEW** | Detects and decodes QR from scanned images before any other processing. |
| **Answer Region Templates** | **NEW** | Coordinate-based JSON defining where answers appear on printed pages. |
| **Pixel-Density Detector** | **NEW** | OpenCV bubble/checkbox fill detection — replaces OCR for MC/TF. |
| **Auto-Grade Pipeline** | **NEW** | Photo upload → QR decode → match → preprocess → detect → grade → save. |

---

## 3. Architecture Diagram

```
┌──────────────────┐        Local WiFi (HTTP)        ┌──────────────────────────────────────────┐
│   PHONE (PWA)    │                                  │          LAPTOP (Electron App)            │
│                  │    POST /api/photo-transfer/      │                                          │
│  Camera Capture  │ ─────── upload ─────────────────→ │  ┌──────────────────────────────────┐    │
│  (one per page)  │                                  │  │  1. QR DECODE                     │    │
│                  │ ←────── SSE updates ──────────── │  │     Scan for QR in image           │    │
│  "Grade Mode"    │                                  │  │     Extract: type, quiz/ws ID,     │    │
│  toggle ON       │                                  │  │     student_id, version_hash       │    │
│                  │                                  │  ├──────────────────────────────────┤    │
│  No computation  │                                  │  │  2. AUTO-MATCH                    │    │
│  on phone        │                                  │  │     Look up answer key by ID       │    │
└──────────────────┘                                  │  │     Look up student by student_id  │    │
                                                      │  │     Look up question order from    │    │
                                                      │  │     student_versions / classQuiz   │    │
                                                      │  ├──────────────────────────────────┤    │
                                                      │  │  3. IMAGE PREPROCESSING           │    │
                                                      │  │     Grayscale → Threshold →        │    │
                                                      │  │     Alignment marker detection →   │    │
                                                      │  │     Deskew / perspective warp      │    │
                                                      │  ├──────────────────────────────────┤    │
                                                      │  │  4. REGION CROPPING               │    │
                                                      │  │     Use template JSON to crop      │    │
                                                      │  │     each answer region             │    │
                                                      │  ├──────────────────────────────────┤    │
                                                      │  │  5. ANSWER DETECTION              │    │
                                                      │  │     MC/TF → Pixel density (no OCR) │    │
                                                      │  │     Open → OCR on cropped region   │    │
                                                      │  ├──────────────────────────────────┤    │
                                                      │  │  6. GRADING                       │    │
                                                      │  │     MC/TF → Direct comparison      │    │
                                                      │  │     Open → LLM partial credit      │    │
                                                      │  ├──────────────────────────────────┤    │
                                                      │  │  7. SAVE & DISPLAY                │    │
                                                      │  │     Save grade to SQLite           │    │
                                                      │  │     Link to quiz/ws instance       │    │
                                                      │  │     SSE → React updates live       │    │
                                                      │  └──────────────────────────────────┘    │
                                                      └──────────────────────────────────────────┘
```

---

## 4. QR Code System Design

### 4.1 What the QR Encodes

Each printed worksheet/quiz page contains a **single QR code** in a fixed position (top-right corner) that encodes a compact JSON payload:

```json
{
  "t": "q",
  "id": "quiz_1712150400000",
  "sid": "JD12345",
  "v": "a3f8"
}
```

| Field | Full Name | Purpose |
|-------|-----------|---------|
| `t` | type | `"q"` for quiz, `"w"` for worksheet |
| `id` | quiz_id / worksheet_id | Links to `quiz_answer_keys` or `worksheet_answer_keys` table |
| `sid` | student_id | Links to `students` table — identifies which student this page belongs to |
| `v` | version_hash | Short hash (4 chars) of the student's question order — used to look up their specific randomized version |

**QR Size:** ~2cm x 2cm (enough for ~100 bytes of data, well within capacity)

**Why compact keys?** QR capacity at small print sizes is limited. Single-letter keys keep the payload under 80 bytes, ensuring reliable scanning even from phone cameras at an angle.

### 4.2 Version Hash Explained

When questions are randomized per student, the system needs to know which order THIS student received. The `version_hash` solves this:

```python
import hashlib

def compute_version_hash(student_id: str, question_order: list[int]) -> str:
    """Generate a 4-char hash that uniquely identifies this student's question arrangement."""
    raw = f"{student_id}:{','.join(map(str, question_order))}"
    return hashlib.md5(raw.encode()).hexdigest()[:4]
```

**Example:**
- Student "JD12345" gets questions in order `[3, 1, 5, 2, 4]`
- Hash: `md5("JD12345:3,1,5,2,4")[:4]` → `"a3f8"`
- This hash is stored in the `student_versions` / `classQuizData` alongside the question order
- When the QR is scanned, the system looks up which version has hash `"a3f8"` and retrieves the correct question mapping

**If questions are NOT randomized:** `v` is set to `"0000"` (all students share the same order), and the system uses the base answer key directly.

### 4.3 QR Placement on Page

```
┌─────────────────────────────────────────────┐
│  ■                                    ┌───┐ │  ← Alignment marker (top-left)
│                                       │QR │ │  ← QR code (top-right, 2cm x 2cm)
│  Math Quiz - Grade 5                  └───┘ │
│  Student: John Doe                          │
│                                             │
│  1. What is 7 × 8?                          │
│     ○ A) 54   ○ B) 56   ○ C) 58   ○ D) 63  │
│                                             │
│  2. True or False: 15 + 27 = 42            │
│     ○ True    ○ False                       │
│                                             │
│  3. Explain how you solve 234 ÷ 6:         │
│     ┌─────────────────────────────────┐     │
│     │                                 │     │
│     │  (open answer box)              │     │
│     │                                 │     │
│     └─────────────────────────────────┘     │
│                                             │
│  ■                                       ■  │  ← Alignment markers (bottom corners)
└─────────────────────────────────────────────┘
```

### 4.4 QR Generation (Python)

```python
import qrcode
import json
import io

def generate_page_qr(
    doc_type: str,          # "q" or "w"
    doc_id: str,            # quiz_id or worksheet_id
    student_id: str,        # from students table
    version_hash: str       # "0000" if not randomized
) -> bytes:
    """Generate a QR code PNG as bytes for embedding in DOCX/PDF."""
    payload = json.dumps({
        "t": doc_type,
        "id": doc_id,
        "sid": student_id,
        "v": version_hash
    }, separators=(',', ':'))  # compact JSON

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(payload)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
```

### 4.5 QR Decoding from Scanned Image

```python
import cv2
from pyzbar.pyzbar import decode as decode_qr
import json

def extract_qr_from_scan(image_bytes: bytes) -> dict | None:
    """Detect and decode the QR code from a scanned worksheet/quiz image.
    
    Returns parsed payload dict or None if no QR found.
    """
    import numpy as np
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Try original image first
    results = decode_qr(img)

    if not results:
        # Try with preprocessing for better detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Sharpen
        sharp = cv2.filter2D(gray, -1, np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]]))
        results = decode_qr(sharp)

    if not results:
        # Try adaptive threshold
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        results = decode_qr(thresh)

    if not results:
        return None

    # Find the QR that matches our payload format
    for r in results:
        try:
            data = json.loads(r.data.decode('utf-8'))
            if 't' in data and 'id' in data and 'sid' in data:
                return {
                    "type": "quiz" if data["t"] == "q" else "worksheet",
                    "doc_id": data["id"],
                    "student_id": data["sid"],
                    "version_hash": data.get("v", "0000"),
                    "qr_bounds": {
                        "x": r.rect.left,
                        "y": r.rect.top,
                        "w": r.rect.width,
                        "h": r.rect.height
                    }
                }
        except (json.JSONDecodeError, UnicodeDecodeError):
            continue

    return None
```

---

## 5. Database Schema Changes

### 5.1 New Table: `quiz_instances`

Tracks per-student quiz versions (currently only `classQuizData` in frontend state — not persisted properly).

```sql
CREATE TABLE IF NOT EXISTS quiz_instances (
    id               TEXT PRIMARY KEY,        -- UUID
    quiz_id          TEXT NOT NULL,            -- FK → quiz_answer_keys.quiz_id
    student_id       TEXT NOT NULL,            -- FK → students.id
    question_order   TEXT NOT NULL,            -- JSON array of original question indices, e.g. [3,1,5,2,4]
    version_hash     TEXT NOT NULL,            -- 4-char hash for QR matching
    class_name       TEXT,
    created_at       TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quiz_answer_keys(quiz_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE (quiz_id, student_id)              -- One version per student per quiz
);
```

### 5.2 New Table: `worksheet_instances`

Same concept for worksheets. Replaces the JSON blob in `worksheet_packages.student_versions`.

```sql
CREATE TABLE IF NOT EXISTS worksheet_instances (
    id               TEXT PRIMARY KEY,        -- UUID
    worksheet_id     TEXT NOT NULL,            -- FK → worksheet_answer_keys.worksheet_id
    package_id       TEXT,                     -- FK → worksheet_packages.id (optional)
    student_id       TEXT NOT NULL,            -- FK → students.id
    question_order   TEXT NOT NULL,            -- JSON array of original question indices
    option_maps      TEXT,                     -- JSON: per-question option shuffle maps (for MC)
    shuffled_column_b TEXT,                    -- JSON: shuffled matching column
    shuffled_word_bank TEXT,                   -- JSON: shuffled word bank
    version_hash     TEXT NOT NULL,            -- 4-char hash for QR matching
    class_name       TEXT,
    created_at       TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worksheet_id) REFERENCES worksheet_answer_keys(worksheet_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE (worksheet_id, student_id)         -- One version per student per worksheet
);
```

### 5.3 New Table: `answer_region_templates`

Stores the coordinate layout for each generated document so the system knows where to crop answers.

```sql
CREATE TABLE IF NOT EXISTS answer_region_templates (
    id              TEXT PRIMARY KEY,          -- Same as quiz_id or worksheet_id
    doc_type        TEXT NOT NULL,             -- "quiz" or "worksheet"
    page_size       TEXT DEFAULT 'letter',     -- "letter" or "a4"
    regions         TEXT NOT NULL,             -- JSON array of region definitions (see below)
    alignment_markers TEXT,                    -- JSON array of marker positions
    qr_position     TEXT,                      -- JSON {x, y, w, h} of QR code location
    created_at      TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Region JSON structure:**
```json
[
  {
    "question_index": 0,
    "type": "multiple-choice",
    "page": 1,
    "options": ["A", "B", "C", "D"],
    "bubbles": [
      {"label": "A", "x": 120, "y": 305, "w": 20, "h": 20},
      {"label": "B", "x": 155, "y": 305, "w": 20, "h": 20},
      {"label": "C", "x": 190, "y": 305, "w": 20, "h": 20},
      {"label": "D", "x": 225, "y": 305, "w": 20, "h": 20}
    ]
  },
  {
    "question_index": 1,
    "type": "true-false",
    "page": 1,
    "checkboxes": [
      {"label": "True",  "x": 120, "y": 420, "w": 20, "h": 20},
      {"label": "False", "x": 200, "y": 420, "w": 20, "h": 20}
    ]
  },
  {
    "question_index": 2,
    "type": "open-answer",
    "page": 1,
    "text_box": {"x": 80, "y": 540, "w": 450, "h": 120}
  }
]
```

### 5.4 Modify Existing Tables

**`quiz_grades` — add `quiz_id` and `instance_id` columns:**
```sql
ALTER TABLE quiz_grades ADD COLUMN quiz_id TEXT;
ALTER TABLE quiz_grades ADD COLUMN instance_id TEXT;
-- quiz_id links to quiz_answer_keys.quiz_id
-- instance_id links to quiz_instances.id
```

**`worksheet_grades` — add `worksheet_id` and `instance_id` columns:**
```sql
ALTER TABLE worksheet_grades ADD COLUMN worksheet_id TEXT;
ALTER TABLE worksheet_grades ADD COLUMN instance_id TEXT;
-- worksheet_id links to worksheet_answer_keys.worksheet_id
-- instance_id links to worksheet_instances.id
```

These columns allow grades to be traced back to the exact document and the exact student version.

---

## 6. Worksheet & Quiz Generation Changes

### 6.1 Current Flow (What Exists)

```
Teacher fills form → LLM generates content → Frontend parses to structured JSON
→ Optional: Class Mode generates per-student versions (randomized)
→ Export to DOCX/PDF via /api/export
→ Answer key saved to SQLite
```

### 6.2 Updated Flow (What Changes)

```
Teacher fills form → LLM generates content → Frontend parses to structured JSON
→ Class Mode: generate per-student versions (randomized) → save to quiz_instances / worksheet_instances
→ Generate answer region template → save to answer_region_templates
→ Export to DOCX/PDF with:
    • Per-student QR code on each page
    • Alignment markers (3 corner squares)
    • Structured answer bubbles/boxes (consistent layout)
→ Answer key saved to SQLite
```

### 6.3 Per-Student Version Persistence

**Currently:** Student versions exist only in frontend state (`classQuizData` for quizzes, `studentVersions` for worksheets). They're lost when the tab closes unless saved to `worksheet_packages`.

**New:** When the teacher generates class versions and exports, the system MUST persist each student's version to the database:

**Backend function (new in `student_service.py`):**

```python
def save_quiz_instance(quiz_id: str, student_id: str, question_order: list[int],
                       version_hash: str, class_name: str = '') -> dict:
    """Persist a student's specific quiz version for QR-based auto-matching."""
    conn = _get_conn()
    instance_id = str(uuid.uuid4())
    try:
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
    instance_id = str(uuid.uuid4())
    try:
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
```

**Lookup function for grading:**

```python
def get_instance_by_qr(doc_type: str, doc_id: str, student_id: str,
                       version_hash: str) -> dict | None:
    """Look up a student's specific version using data from the scanned QR code."""
    conn = _get_conn()
    try:
        table = 'quiz_instances' if doc_type == 'quiz' else 'worksheet_instances'
        row = conn.execute(
            f'SELECT * FROM {table} WHERE '
            f'{"quiz_id" if doc_type == "quiz" else "worksheet_id"} = ? '
            f'AND student_id = ? AND version_hash = ?',
            (doc_id, student_id, version_hash)
        ).fetchone()
        if row:
            result = dict(row)
            result['question_order'] = json.loads(result['question_order'])
            if doc_type == 'worksheet':
                for field in ['option_maps', 'shuffled_column_b', 'shuffled_word_bank']:
                    if result.get(field):
                        result[field] = json.loads(result[field])
            return result
        return None
    finally:
        conn.close()
```

### 6.4 Answer Region Template Generation

When a worksheet or quiz is exported to DOCX/PDF, the system must calculate and save the answer region coordinates. This happens in the export pipeline.

**The key insight:** Since WE generate the DOCX, we control the exact layout. We know where every question, bubble, and text box is placed because we're the ones placing them.

**Approach:**

1. During DOCX generation, track the Y-position of each answer element as it's placed
2. Use fixed X-positions for bubbles (consistent column layout)
3. Save the coordinate map to `answer_region_templates` table
4. Coordinates are in **points** (1/72 inch) relative to the page origin

```python
class AnswerRegionTracker:
    """Tracks answer region positions during DOCX generation."""

    def __init__(self, page_width_pt=612, page_height_pt=792):
        self.page_width = page_width_pt
        self.page_height = page_height_pt
        self.regions = []
        self.current_y = 0
        self.current_page = 1

    def add_mc_region(self, question_index: int, num_options: int, y_pos: float, x_start: float = 120):
        """Record bubble positions for a multiple-choice question."""
        labels = ['A', 'B', 'C', 'D', 'E'][:num_options]
        bubbles = []
        spacing = 45  # points between bubble centers
        for i, label in enumerate(labels):
            bubbles.append({
                "label": label,
                "x": x_start + i * spacing,
                "y": y_pos,
                "w": 18,
                "h": 18
            })
        self.regions.append({
            "question_index": question_index,
            "type": "multiple-choice",
            "page": self.current_page,
            "options": labels,
            "bubbles": bubbles
        })

    def add_tf_region(self, question_index: int, y_pos: float, x_start: float = 120):
        """Record checkbox positions for a true/false question."""
        self.regions.append({
            "question_index": question_index,
            "type": "true-false",
            "page": self.current_page,
            "checkboxes": [
                {"label": "True",  "x": x_start,       "y": y_pos, "w": 18, "h": 18},
                {"label": "False", "x": x_start + 80,   "y": y_pos, "w": 18, "h": 18}
            ]
        })

    def add_open_region(self, question_index: int, y_pos: float, height: float = 100,
                        x_start: float = 72, width: float = 468):
        """Record text box position for an open-answer question."""
        self.regions.append({
            "question_index": question_index,
            "type": "open-answer",
            "page": self.current_page,
            "text_box": {"x": x_start, "y": y_pos, "w": width, "h": height}
        })

    def add_fill_blank_region(self, question_index: int, y_pos: float,
                              x_start: float = 200, width: float = 250):
        """Record the blank line region for fill-in-the-blank."""
        self.regions.append({
            "question_index": question_index,
            "type": "fill-blank",
            "page": self.current_page,
            "text_box": {"x": x_start, "y": y_pos, "w": width, "h": 24}
        })

    def to_json(self) -> list[dict]:
        return self.regions
```

### 6.5 DOCX Layout Changes

The generated DOCX needs three new visual elements:

#### A) QR Code (top-right corner)

```python
from docx.shared import Cm, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_qr_to_docx(doc, qr_bytes: bytes):
    """Add QR code image to the header area of the DOCX."""
    # Add to document header for consistent placement on every page
    section = doc.sections[0]
    header = section.header
    header.is_linked_to_previous = False

    # Create a table in header: left cell = title area, right cell = QR
    table = header.add_table(rows=1, cols=2, width=Cm(19))
    table.columns[0].width = Cm(14)
    table.columns[1].width = Cm(5)

    # Right cell: QR code
    qr_cell = table.cell(0, 1)
    qr_paragraph = qr_cell.paragraphs[0]
    qr_paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = qr_paragraph.add_run()
    run.add_picture(io.BytesIO(qr_bytes), width=Cm(2), height=Cm(2))
```

#### B) Alignment Markers (3 corners)

Three small filled squares (5mm x 5mm) at top-left, bottom-left, and bottom-right corners. These enable perspective correction during scan processing.

```python
def add_alignment_markers(doc):
    """Add corner alignment markers for scan perspective correction."""
    # Implemented as small black-filled shapes at fixed positions
    # Top-left, bottom-left, bottom-right corners
    # Using docx shapes or as part of header/footer
    pass  # Implementation uses python-docx drawing shapes
```

#### C) Structured Answer Bubbles

Instead of the current text-based answer display, MC/TF questions get **printable bubble circles** that students fill in with pencil:

```
1. What is 7 × 8?

   ○ A) 54      ○ B) 56      ○ C) 58      ○ D) 63
```

The bubbles are rendered as unfilled circles at known positions. Students fill them in. The pixel-density detector checks which circle has the most dark pixels.

### 6.6 Export Endpoint Changes

**Modified endpoint:** `POST /api/export`

When `data.class_mode` is true and `data.student_versions` is provided:

1. For EACH student version:
   a. Compute `version_hash` from student_id + question_order
   b. Generate QR code bytes with `{t, id, sid, v}`
   c. Save instance to `quiz_instances` or `worksheet_instances`
   d. Generate DOCX/PDF page with QR embedded
   e. Track answer region coordinates
2. Save answer region template to `answer_region_templates`
3. Return a **combined PDF** (all students) or **ZIP of individual DOCXs**

**New endpoint:** `POST /api/export-class-pack`

```python
@app.post("/api/export-class-pack")
async def export_class_pack(request: Request):
    """Export a complete class set: one DOCX/PDF per student with QR codes.
    
    Returns a ZIP file containing:
    - Individual student worksheets/quizzes (each with unique QR)
    - One teacher answer key
    - answer_regions.json (for the grading pipeline)
    """
    body = await request.json()
    doc_type = body["doc_type"]           # "quiz" or "worksheet"
    doc_id = body["doc_id"]               # quiz_id or worksheet_id
    student_versions = body["student_versions"]  # array of per-student data
    format = body.get("format", "pdf")    # "pdf" or "docx"
    # ... generate and return ZIP
```

---

## 7. Phone Capture Workflow

### 7.1 Current Flow (What Exists)

```
Phone opens PWA → Teacher creates session (class name + date) →
Takes photos → Optionally tags student name → Uploads → Done
```

### 7.2 Updated Flow (What Changes)

```
Phone opens PWA → Teacher creates session (class name + date) →
Teacher enables "Grade Mode" toggle →
Takes photos (one per worksheet page) → Uploads → 
Backend auto-decodes QR → auto-matches student + quiz/worksheet →
Auto-queues for grading → SSE updates show grading progress live
```

**Key change:** In Grade Mode, the teacher does NOT need to manually tag student names. The QR code handles identification automatically.

### 7.3 Phone Page Changes (`phone.html`)

Minimal changes needed — the phone remains a dumb camera:

1. **Add "Grade Mode" toggle** at the top of the capture screen (simple checkbox)
2. When Grade Mode is ON:
   - Hide the student name input (QR handles this)
   - Show a status line: "QR auto-detect enabled — just capture and send"
   - Upload request includes `grade_mode: true` in form data
3. When Grade Mode is OFF:
   - Behaves exactly as current (manual student name tagging, no auto-grading)

### 7.4 Upload Endpoint Changes

**Modified endpoint:** `POST /api/photo-transfer/upload`

When `grade_mode` form field is `"true"`:

1. Save the photo (same as current)
2. Immediately attempt QR decode on the uploaded image
3. If QR found:
   - Attach decoded metadata to the photo entry: `qr_data: {type, doc_id, student_id, version_hash}`
   - Broadcast SSE event `photo_matched` with the match info
   - Queue the photo for auto-grading (add to grading queue)
4. If QR NOT found:
   - Mark photo as `qr_status: "not_found"`
   - Broadcast SSE event `photo_unmatched` — frontend shows it for manual review
   - Teacher can manually assign from the desktop UI

---

## 8. Laptop Processing Pipeline

### 8.1 Pipeline Overview

```
Photo received
    │
    ├─── Step 1: QR Decode ──────────────────────────────────┐
    │    Extract type, doc_id, student_id, version_hash      │
    │    If QR not found → fallback to manual matching        │
    │                                                         │
    ├─── Step 2: Fetch Context ──────────────────────────────┤
    │    answer_key = get_quiz_answer_key(doc_id)            │
    │    instance = get_instance_by_qr(type, doc_id, sid, v) │
    │    template = get_answer_region_template(doc_id)        │
    │    question_order = instance.question_order             │
    │                                                         │
    ├─── Step 3: Image Preprocessing ────────────────────────┤
    │    Grayscale → Adaptive threshold                       │
    │    Detect alignment markers (3 corners)                 │
    │    Compute perspective transform (homography)           │
    │    Warp image to normalized coordinate space            │
    │    Scale to match template dimensions                   │
    │                                                         │
    ├─── Step 4: Region Cropping ────────────────────────────┤
    │    For each region in template:                         │
    │      Crop the image at (x, y, w, h)                    │
    │      Tag with question_index and type                   │
    │                                                         │
    ├─── Step 5: Answer Detection ───────────────────────────┤
    │    MC / TF:                                             │
    │      For each bubble/checkbox in region:                │
    │        Calculate dark pixel ratio                       │
    │        Selected = highest ratio > threshold             │
    │      → Returns: "B" or "True" etc.                     │
    │                                                         │
    │    Fill-blank / Open-answer:                            │
    │      OCR on cropped text region only                    │
    │      → Returns: extracted text string                   │
    │                                                         │
    ├─── Step 6: Re-Map Answers to Original Order ───────────┤
    │    If questions were randomized:                        │
    │      Use question_order to map detected answer          │
    │      at position [i] back to original question [j]     │
    │    If MC options were also shuffled:                    │
    │      Use option_maps to convert shuffled letter         │
    │      back to the original letter                        │
    │                                                         │
    ├─── Step 7: Grade ──────────────────────────────────────┤
    │    Use existing grading logic (direct compare + LLM)   │
    │    All comparisons against ORIGINAL answer key          │
    │                                                         │
    └─── Step 8: Save & Broadcast ───────────────────────────┘
         Save to quiz_grades / worksheet_grades
         Include quiz_id/worksheet_id and instance_id
         SSE broadcast: grade_complete event
```

### 8.2 Answer Re-Mapping (Critical for Randomized Quizzes)

When a student received questions in randomized order, the detected answers must be mapped back to the original question numbers before grading.

**Example:**

```
Original quiz order:  [Q1, Q2, Q3, Q4, Q5]
Student's order:      [Q3, Q1, Q5, Q2, Q4]   (question_order = [2, 0, 4, 1, 3])

Student's scanned answers (in their printed order):
  Position 1 → "B"     (this is actually Q3)
  Position 2 → "True"  (this is actually Q1)
  Position 3 → "C"     (this is actually Q5)
  Position 4 → "A"     (this is actually Q2)
  Position 5 → "False" (this is actually Q4)

Re-mapped to original order:
  Q1 → "True"   (from position 2)
  Q2 → "A"      (from position 4)
  Q3 → "B"      (from position 1)
  Q4 → "False"  (from position 5)
  Q5 → "C"      (from position 3)
```

```python
def remap_answers(detected_answers: list[str], question_order: list[int]) -> dict[int, str]:
    """Map answers from randomized printed order back to original question indices.
    
    Args:
        detected_answers: Answers in the order they appear on the printed page
        question_order: The mapping — question_order[i] = original question index at position i
    
    Returns:
        Dict mapping original question index → student's answer
    """
    remapped = {}
    for printed_position, original_index in enumerate(question_order):
        if printed_position < len(detected_answers):
            remapped[original_index] = detected_answers[printed_position]
    return remapped


def remap_mc_option(selected_label: str, option_map: list[int]) -> str:
    """Convert a shuffled MC option back to the original option letter.
    
    Args:
        selected_label: The letter the student filled (e.g., "C")
        option_map: Shuffle map — option_map[i] = original index of option now at position i
                    e.g., [2, 0, 3, 1] means position A was originally C, etc.
    
    Returns:
        The original option letter (e.g., "A")
    """
    labels = ['A', 'B', 'C', 'D', 'E']
    selected_index = labels.index(selected_label.upper())
    if selected_index < len(option_map):
        original_index = option_map[selected_index]
        return labels[original_index]
    return selected_label
```

### 8.3 Pixel-Density Bubble Detection

For MC and TF questions — **no OCR needed**.

```python
import cv2
import numpy as np

def detect_selected_bubble(
    image: np.ndarray,
    bubbles: list[dict],
    threshold: float = 0.30,
    min_confidence_gap: float = 0.10
) -> tuple[str | None, float, list[dict]]:
    """Detect which bubble is filled in a multiple-choice question.
    
    Args:
        image: The full (aligned) page image
        bubbles: List of bubble defs from template: [{label, x, y, w, h}, ...]
        threshold: Minimum fill ratio to consider a bubble "filled"
        min_confidence_gap: Minimum gap between top two bubbles for confident detection
    
    Returns:
        (selected_label, confidence, debug_info)
        selected_label is None if no bubble clearly filled
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    fill_ratios = []
    for bubble in bubbles:
        x, y, w, h = bubble["x"], bubble["y"], bubble["w"], bubble["h"]
        # Add small padding to avoid edge artifacts
        pad = 2
        region = binary[y+pad:y+h-pad, x+pad:x+w-pad]
        if region.size == 0:
            fill_ratios.append({"label": bubble["label"], "ratio": 0.0})
            continue
        ratio = np.count_nonzero(region) / region.size
        fill_ratios.append({"label": bubble["label"], "ratio": round(ratio, 3)})

    # Sort by fill ratio descending
    fill_ratios.sort(key=lambda r: r["ratio"], reverse=True)

    top = fill_ratios[0]
    second = fill_ratios[1] if len(fill_ratios) > 1 else {"ratio": 0.0}

    # Confidence = gap between top and second
    confidence = top["ratio"] - second["ratio"]

    if top["ratio"] >= threshold and confidence >= min_confidence_gap:
        return top["label"], confidence, fill_ratios
    elif top["ratio"] >= threshold:
        # Filled but ambiguous (two bubbles close in fill ratio)
        return top["label"], confidence, fill_ratios  # Mark as low-confidence
    else:
        return None, 0.0, fill_ratios  # No bubble clearly filled


def detect_tf_selection(
    image: np.ndarray,
    checkboxes: list[dict],
    threshold: float = 0.25
) -> tuple[str | None, float, list[dict]]:
    """Detect True/False selection. Same logic as bubble detection."""
    return detect_selected_bubble(image, checkboxes, threshold)
```

### 8.4 Image Alignment via Markers

```python
def detect_alignment_markers(image: np.ndarray) -> list[tuple[int, int]] | None:
    """Find the 3 corner alignment markers (filled black squares).
    
    Returns list of (x, y) centers for [top-left, bottom-left, bottom-right]
    or None if markers not found.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 80, 255, cv2.THRESH_BINARY_INV)

    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter for square-ish contours of the right size
    candidates = []
    img_area = image.shape[0] * image.shape[1]
    for cnt in contours:
        area = cv2.contourArea(cnt)
        # Markers should be ~0.01-0.1% of page area
        if area < img_area * 0.0001 or area > img_area * 0.005:
            continue
        # Check squareness
        x, y, w, h = cv2.boundingRect(cnt)
        aspect = w / h if h > 0 else 0
        if 0.7 < aspect < 1.3:  # roughly square
            cx, cy = x + w // 2, y + h // 2
            candidates.append((cx, cy, area))

    if len(candidates) < 3:
        return None

    # Identify corners by position
    h, w = image.shape[:2]
    top_left = min(candidates, key=lambda c: c[0] + c[1])         # smallest x+y
    bottom_left = min(candidates, key=lambda c: c[0] - c[1] + h)  # small x, large y
    bottom_right = min(candidates, key=lambda c: -c[0] - c[1])    # largest x+y

    return [
        (top_left[0], top_left[1]),
        (bottom_left[0], bottom_left[1]),
        (bottom_right[0], bottom_right[1])
    ]


def align_scanned_image(
    image: np.ndarray,
    detected_markers: list[tuple[int, int]],
    expected_markers: list[dict],
    page_width: int = 612,
    page_height: int = 792
) -> np.ndarray:
    """Warp the scanned image to match the expected template coordinates.
    
    Uses a perspective transform based on 3 marker positions.
    """
    src_points = np.float32(detected_markers)

    dst_points = np.float32([
        [expected_markers[0]["x"], expected_markers[0]["y"]],
        [expected_markers[1]["x"], expected_markers[1]["y"]],
        [expected_markers[2]["x"], expected_markers[2]["y"]],
    ])

    # Add 4th point (top-right) inferred from the other three
    src_tr = np.float32([[
        detected_markers[2][0],  # same x as bottom-right
        detected_markers[0][1]   # same y as top-left
    ]])
    dst_tr = np.float32([[page_width - expected_markers[2]["x"], expected_markers[0]["y"]]])

    src_all = np.vstack([src_points, src_tr])
    dst_all = np.vstack([dst_points, dst_tr])

    M = cv2.getPerspectiveTransform(src_all, dst_all)
    aligned = cv2.warpPerspective(image, M, (page_width, page_height))
    return aligned
```

---

## 9. Grading Engine Integration

### 9.1 How It Connects to Existing Grading

The existing grading system in `main.py` already handles:
- Direct comparison for MC/TF/fill-blank
- LLM-based grading for open-ended
- Score calculation and letter grades
- Saving to `quiz_grades` / `worksheet_grades` tables

**The new pipeline replaces only the INPUT stage.** Instead of:
- Current: Full OCR on entire page → LLM parses all answers from raw text
- New: QR decode → region crop → pixel detection (MC/TF) + targeted OCR (open only)

The OUTPUT and GRADING LOGIC remain the same.

### 9.2 New Grading Endpoint

```python
@app.post("/api/scan-grade-auto")
async def scan_grade_auto(request: Request):
    """Auto-grade a scanned worksheet/quiz using QR-based matching.
    
    This is the main entry point for the new pipeline.
    Expects multipart form with one or more image files.
    """
    form = await request.form()
    files = form.getlist("files")
    session_id = form.get("session_id", "")
    
    results = []
    for file in files:
        image_bytes = await file.read()
        
        # Step 1: QR decode
        qr_data = extract_qr_from_scan(image_bytes)
        if not qr_data:
            results.append({
                "file_name": file.filename,
                "error": "No QR code detected — manual matching required",
                "qr_status": "not_found"
            })
            continue
        
        # Step 2: Fetch context
        doc_type = qr_data["type"]
        doc_id = qr_data["doc_id"]
        student_id = qr_data["student_id"]
        version_hash = qr_data["version_hash"]
        
        answer_key = (get_quiz_answer_key(doc_id) if doc_type == "quiz"
                      else get_worksheet_answer_key(doc_id))
        if not answer_key:
            results.append({
                "file_name": file.filename,
                "error": f"Answer key not found for {doc_id}",
                "qr_data": qr_data
            })
            continue
        
        instance = get_instance_by_qr(doc_type, doc_id, student_id, version_hash)
        template = get_answer_region_template(doc_id)
        question_order = instance["question_order"] if instance else None
        
        # Step 3-5: Process image and detect answers
        if template:
            # Use region-based detection (fast path)
            detected = process_with_regions(image_bytes, template, question_order)
        else:
            # Fallback: full OCR (existing path)
            detected = process_with_full_ocr(image_bytes, answer_key)
        
        # Step 6: Re-map if randomized
        if question_order and detected.get("answers"):
            detected["answers"] = remap_answers(
                detected["answers"], question_order
            )
            if instance and instance.get("option_maps"):
                for q_idx, answer in detected["answers"].items():
                    if q_idx in instance["option_maps"]:
                        detected["answers"][q_idx] = remap_mc_option(
                            answer, instance["option_maps"][q_idx]
                        )
        
        # Step 7: Grade using existing logic
        grade_result = grade_against_answer_key(
            detected["answers"],
            answer_key["questions"],
            doc_type
        )
        
        # Step 8: Save
        student = get_student(student_id)
        save_result = save_grade(
            doc_type=doc_type,
            student_id=student_id,
            doc_id=doc_id,
            instance_id=instance["id"] if instance else None,
            title=answer_key.get("quiz_title") or answer_key.get("worksheet_title"),
            subject=answer_key.get("subject", ""),
            grade_result=grade_result
        )
        
        results.append({
            "file_name": file.filename,
            "student_name": student["full_name"] if student else None,
            "student_id": student_id,
            "doc_type": doc_type,
            "doc_id": doc_id,
            "qr_status": "matched",
            **grade_result,
            "saved": True
        })
    
    return {"results": results}
```

### 9.3 Streaming Version

```python
@app.post("/api/scan-grade-auto-stream")
async def scan_grade_auto_stream(request: Request):
    """Same as scan_grade_auto but with SSE streaming for progress updates.
    
    Streams events:
    - processing: {file_name, step, message}
    - qr_decoded: {file_name, student_name, doc_type, doc_id}
    - graded: {file_name, student_name, score, percentage, letter_grade}
    - error: {file_name, error}
    - complete: {total, graded, failed, class_average}
    """
    # ... same logic but wrapped in SSE generator
```

---

## 10. Frontend UI Changes

### 10.1 PhotoReceiver.tsx — Grade Mode

**Add to the existing component:**

1. **"Grade Mode" toggle** in the session header area
2. When Grade Mode is active:
   - Show a dedicated grading panel alongside the photo grid
   - As photos arrive with QR matches, show:
     - Student name (auto-detected from QR)
     - Quiz/worksheet title (auto-detected from QR)
     - Grading status: "Processing..." → "Graded: 85% (B)"
   - Photos without QR matches get flagged with a warning icon
3. **Batch grade button** — "Grade All Ungraded" triggers grading for all uploaded photos in the session
4. **Results summary** — class average, grade distribution chart, per-student breakdown

### 10.2 WorksheetScanGrader.tsx / QuizScanGrader.tsx — Enhanced

**Current flow:**
1. Teacher enters worksheet/quiz ID manually (or uploads teacher version for ID extraction)
2. Teacher uploads student scans
3. Grading happens

**New flow with QR:**
1. Teacher uploads student scans (no ID entry needed)
2. System reads QR from each scan → auto-detects which quiz/worksheet + which student
3. If different quizzes/worksheets are mixed in, system groups them automatically
4. Grading happens with proper per-student version matching

### 10.3 WorksheetGenerator.tsx / QuizGenerator.tsx — Class Export

**Add to Class Mode export flow:**

1. When exporting class set:
   - Generate per-student QR codes
   - Save instances to database
   - Include QR on every exported page
2. Show preview of QR placement before export
3. New "Export Class Pack" button that generates:
   - ZIP with individual student files
   - Or combined PDF with page breaks
   - Teacher answer key (separate, no QR needed)

### 10.4 New Component: `ScanGradeResults.tsx`

Dedicated results view for the auto-grading pipeline:

```
┌─────────────────────────────────────────────────────────┐
│  Auto-Grade Results — Math Quiz Grade 5                 │
│  Class: 5A  |  Date: 2026-04-03  |  28/30 graded       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Class Average: 78%  |  Highest: 95%  | Low: 42% │    │
│  │ [■■■■■■■░░░] A: 8  B: 12  C: 5  D: 2  F: 1     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Student          Score    Grade   Status                │
│  ─────────────────────────────────────────               │
│  Alice Brown      19/20   95%  A   ✓ Graded             │
│  Bob Chen         17/20   85%  B   ✓ Graded             │
│  Carol Davis      16/20   80%  B   ✓ Graded             │
│  David Evans       8/20   40%  F   ✓ Graded             │
│  Eve Foster         —      —   —   ⚠ QR not detected    │
│  Frank Green      14/20   70%  C   ✓ Graded             │
│  ...                                                    │
│                                                         │
│  [Export Results CSV]  [Save All to Student Records]    │
└─────────────────────────────────────────────────────────┘
```

---

## 11. Fallback & Error Handling

### 11.1 QR Not Detected

**Causes:** Poor photo quality, QR obscured by writing, page folded over QR area, non-generated worksheet.

**Fallback chain:**
1. Try multiple preprocessing passes (sharpen, threshold, rotate 90/180/270)
2. If still not found → mark as `qr_status: "not_found"`
3. Frontend shows the photo with a warning: "Could not read QR code"
4. Teacher can manually select the quiz/worksheet and student from dropdowns
5. Proceed with existing full-page OCR grading pipeline

### 11.2 QR Decoded but Answer Key Not Found

**Cause:** Quiz/worksheet was deleted, or ID mismatch.

**Fallback:**
1. Show the decoded ID to the teacher
2. Offer a search: "Did you mean one of these?" (fuzzy match on title/subject)
3. Teacher can manually select the correct answer key

### 11.3 Student Not Found

**Cause:** Student was removed from the class, or ID mismatch.

**Fallback:**
1. Show the decoded student_id
2. Teacher can reassign to an existing student or create a new entry
3. Grade is saved with whatever student mapping the teacher chooses

### 11.4 Alignment Markers Not Detected

**Cause:** Markers cut off during printing, or low-quality scan.

**Fallback:**
1. Skip alignment/perspective correction
2. Use the raw (preprocessed) image for region cropping
3. Widen the crop margins by 20% to account for misalignment
4. If detection confidence drops below threshold → fall back to full OCR for that question

### 11.5 Ambiguous Bubble Detection

**Cause:** Student lightly filled a bubble, or filled two bubbles.

**Handling:**
1. If top two bubbles are within `min_confidence_gap`:
   - Mark as `"unclear"` in results
   - Show both candidates to teacher: "Q3: B or C? (fill ratios: B=0.42, C=0.38)"
   - Teacher resolves manually
2. If no bubble exceeds `threshold`:
   - Mark as `"unanswered"`
   - Score as 0 points

### 11.6 Non-Generated Worksheet

If a teacher uses a worksheet they didn't generate with the app (no QR, no template):

1. System detects: no QR found
2. Falls back to the **existing** full-page OCR + LLM grading pipeline
3. Teacher manually provides the answer key (or selects from existing keys)
4. Works exactly as the current system — no regression

---

## 12. Implementation Tasks

### Phase 1: Foundation (QR + Database)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 1.1 | Create `quiz_instances` and `worksheet_instances` tables | `student_service.py` | High |
| 1.2 | Create `answer_region_templates` table | `student_service.py` | High |
| 1.3 | Add `quiz_id` and `instance_id` columns to `quiz_grades` and `worksheet_grades` | `student_service.py` | High |
| 1.4 | Implement `save_quiz_instance`, `save_worksheet_instance`, `get_instance_by_qr` | `student_service.py` | High |
| 1.5 | Implement QR generation function (`generate_page_qr`) | New: `backend/qr_service.py` | High |
| 1.6 | Implement QR decoding function (`extract_qr_from_scan`) | `backend/qr_service.py` | High |
| 1.7 | Implement version hash computation | `backend/qr_service.py` | High |
| 1.8 | Add `qrcode` and `pyzbar` to requirements.txt | `requirements.txt` | High |

### Phase 2: Generation & Export (QR on Printed Pages)

| # | Task | Files | Priority |
|---|------|-------|----------|
| 2.1 | Modify DOCX export to embed QR code in header | `export_utils.py` | High |
| 2.2 | Add alignment markers to generated DOCX | `export_utils.py` | High |
| 2.3 | Redesign MC answer display as fillable bubbles | `worksheetHtmlRenderer.ts`, `quizHtmlRenderer.ts` | High |
| 2.4 | Redesign TF answer display as fillable checkboxes | `worksheetHtmlRenderer.ts`, `quizHtmlRenderer.ts` | High |
| 2.5 | Implement `AnswerRegionTracker` to compute coordinates during export | New: `backend/region_tracker.py` | Medium |
| 2.6 | Save answer region template to DB during export | `main.py` (export endpoint) | Medium |
| 2.7 | Create `POST /api/export-class-pack` endpoint | `main.py` | High |
| 2.8 | Wire up QuizGenerator class mode to save `quiz_instances` on export | `QuizGenerator.tsx`, `main.py` | High |
| 2.9 | Wire up WorksheetGenerator class mode to save `worksheet_instances` on export | `WorksheetGenerator.tsx`, `main.py` | High |

### Phase 3: Scan Processing Pipeline

| # | Task | Files | Priority |
|---|------|-------|----------|
| 3.1 | Implement alignment marker detection | New: `backend/image_alignment.py` | Medium |
| 3.2 | Implement perspective correction / deskew | `backend/image_alignment.py` | Medium |
| 3.3 | Implement region cropping from template | `backend/image_alignment.py` | Medium |
| 3.4 | Implement pixel-density bubble detector | New: `backend/bubble_detector.py` | Medium |
| 3.5 | Implement TF checkbox detector | `backend/bubble_detector.py` | Medium |
| 3.6 | Implement answer re-mapping (randomized → original) | `backend/qr_service.py` or `main.py` | Medium |
| 3.7 | Create `POST /api/scan-grade-auto` endpoint | `main.py` | High |
| 3.8 | Create `POST /api/scan-grade-auto-stream` SSE endpoint | `main.py` | Medium |

### Phase 4: Phone & Frontend Integration

| # | Task | Files | Priority |
|---|------|-------|----------|
| 4.1 | Add "Grade Mode" toggle to phone.html | `backend/static/phone.html` | Medium |
| 4.2 | Modify upload endpoint to support `grade_mode` flag | `backend/routes/photo_transfer.py` | Medium |
| 4.3 | Add QR decode on upload when grade_mode is true | `backend/routes/photo_transfer.py` | Medium |
| 4.4 | Add SSE events: `photo_matched`, `photo_unmatched`, `grade_complete` | `backend/routes/photo_transfer.py` | Medium |
| 4.5 | Update PhotoReceiver.tsx with grade mode panel | `PhotoReceiver.tsx` | Medium |
| 4.6 | Create ScanGradeResults.tsx component | New: `ScanGradeResults.tsx` | Medium |
| 4.7 | Update WorksheetScanGrader with QR auto-detect flow | `WorksheetScanGrader.tsx` | Low |
| 4.8 | Update QuizScanGrader with QR auto-detect flow | `QuizScanGrader.tsx` | Low |
| 4.9 | Add class export UI with QR preview | `QuizGenerator.tsx`, `WorksheetGenerator.tsx` | Medium |

### Phase 5: Polish & Edge Cases

| # | Task | Files | Priority |
|---|------|-------|----------|
| 5.1 | Implement all fallback chains (Section 11) | Multiple | Medium |
| 5.2 | Add manual QR/student assignment UI for unmatched photos | `PhotoReceiver.tsx` | Low |
| 5.3 | Add confidence indicators for bubble detection | `ScanGradeResults.tsx` | Low |
| 5.4 | Add cropped region preview alongside grades | `ScanGradeResults.tsx` | Low |
| 5.5 | Batch processing with progress bar | `main.py`, frontend | Low |
| 5.6 | CSV export of grading results | `main.py` | Low |

---

## 13. File-by-File Change Map

### Backend — Modified Files

| File | Changes |
|------|---------|
| `backend/student_service.py` | New tables (`quiz_instances`, `worksheet_instances`, `answer_region_templates`). New columns on `quiz_grades` and `worksheet_grades`. New functions: `save_quiz_instance`, `save_worksheet_instance`, `get_instance_by_qr`, `save_answer_region_template`, `get_answer_region_template`. |
| `backend/main.py` | New endpoints: `/api/scan-grade-auto`, `/api/scan-grade-auto-stream`, `/api/export-class-pack`. Modified: `/api/export` (support QR embedding). |
| `backend/routes/photo_transfer.py` | Modified: `/upload` (handle `grade_mode`, trigger QR decode). New SSE events. |
| `backend/export_utils.py` | Modified: DOCX generation to include QR images, alignment markers, structured bubble layouts. |
| `backend/static/phone.html` | Add Grade Mode toggle, hide student name input when active. |
| `backend/requirements.txt` | Add: `qrcode`, `pyzbar`, `opencv-python-headless` (if not already present). |

### Backend — New Files

| File | Purpose |
|------|---------|
| `backend/qr_service.py` | QR generation, QR decoding, version hash computation, answer re-mapping. |
| `backend/image_alignment.py` | Alignment marker detection, perspective correction, region cropping. |
| `backend/bubble_detector.py` | Pixel-density bubble/checkbox detection for MC/TF questions. |
| `backend/region_tracker.py` | `AnswerRegionTracker` class for computing coordinates during DOCX generation. |

### Frontend — Modified Files

| File | Changes |
|------|---------|
| `frontend/src/components/PhotoReceiver.tsx` | Grade Mode toggle, grading status panel, batch grade button, results summary. |
| `frontend/src/components/WorksheetScanGrader.tsx` | QR auto-detect flow, skip manual ID entry when QR provides it. |
| `frontend/src/components/QuizScanGrader.tsx` | Same QR auto-detect enhancement. |
| `frontend/src/components/QuizGenerator.tsx` | Save quiz_instances on class export, QR preview. |
| `frontend/src/components/WorksheetGenerator.tsx` | Save worksheet_instances on class export, QR preview. |
| `frontend/src/utils/worksheetHtmlRenderer.ts` | Render fillable bubbles for MC, checkboxes for TF, answer boxes for open. |
| `frontend/src/utils/quizHtmlRenderer.ts` | Same bubble/checkbox rendering. |

### Frontend — New Files

| File | Purpose |
|------|---------|
| `frontend/src/components/ScanGradeResults.tsx` | Dedicated auto-grade results view with class summary, per-student breakdown, confidence indicators. |

---

## 14. Data Flow Diagrams

### 14.1 Generation → Print → Scan → Grade (Happy Path)

```
GENERATION:
┌─────────────────────────────────────────────────────────────┐
│ Teacher creates quiz in QuizGenerator                       │
│ ↓                                                           │
│ Selects "Class Mode" → loads 30 students                    │
│ ↓                                                           │
│ Enables "Randomize Questions"                               │
│ ↓                                                           │
│ System generates 30 versions (Fisher-Yates shuffle)         │
│ Each version: {student_id, question_order, version_hash}    │
│ ↓                                                           │
│ Teacher clicks "Export Class Pack"                           │
│ ↓                                                           │
│ Backend:                                                    │
│   1. Saves answer key → quiz_answer_keys                    │
│   2. Saves 30 instances → quiz_instances                    │
│   3. Generates 30 PDFs, each with:                          │
│      • Unique QR (quiz_id + student_id + version_hash)      │
│      • Alignment markers (3 corners)                        │
│      • Fillable bubbles for MC/TF                           │
│   4. Saves answer region template → answer_region_templates │
│   5. Returns ZIP of 30 PDFs + 1 answer key                  │
│ ↓                                                           │
│ Teacher prints all 30 copies                                │
│ Teacher distributes to students                             │
└─────────────────────────────────────────────────────────────┘

CAPTURE:
┌─────────────────────────────────────────────────────────────┐
│ Students complete quizzes (fill bubbles, write answers)     │
│ ↓                                                           │
│ Teacher collects all papers                                 │
│ ↓                                                           │
│ Teacher opens OECS app → Photo Transfer tab                 │
│ ↓                                                           │
│ Scans QR code with phone → opens camera PWA                 │
│ ↓                                                           │
│ Enables "Grade Mode" on phone                               │
│ ↓                                                           │
│ Takes one photo per page, captures all 30 worksheets        │
│ (No need to enter student names — QR handles it)            │
│ ↓                                                           │
│ Each photo uploads to laptop automatically                  │
└─────────────────────────────────────────────────────────────┘

GRADING:
┌─────────────────────────────────────────────────────────────┐
│ For each uploaded photo:                                    │
│                                                             │
│ 1. QR Decode:                                               │
│    → type="quiz", id="quiz_171...", sid="JD12345", v="a3f8" │
│                                                             │
│ 2. Database Lookup:                                         │
│    → answer_key: 20 questions with correct answers          │
│    → instance: question_order=[3,1,5,2,4,...], v="a3f8"     │
│    → template: 20 answer regions with coordinates           │
│                                                             │
│ 3. Image Processing:                                        │
│    → Find alignment markers → perspective correct           │
│    → Crop 20 answer regions                                 │
│                                                             │
│ 4. Detection:                                               │
│    → Q1-Q15 (MC): pixel density → "B", "A", "C", ...       │
│    → Q16-Q18 (TF): pixel density → "True", "False", ...    │
│    → Q19-Q20 (Open): OCR on text box → "Plants use..."     │
│                                                             │
│ 5. Re-map:                                                  │
│    → Printed Q1 was actually original Q3                    │
│    → Map all answers back to original question numbers      │
│                                                             │
│ 6. Grade:                                                   │
│    → MC/TF: direct compare → instant                        │
│    → Open: LLM partial credit → ~2 seconds                  │
│    → Total: 17/20 = 85% = B                                 │
│                                                             │
│ 7. Save:                                                    │
│    → quiz_grades: student_id, quiz_id, instance_id, score   │
│    → SSE broadcast: "Alice Brown — 85% (B)"                 │
│    → React UI updates live                                  │
└─────────────────────────────────────────────────────────────┘
```

### 14.2 Mixed-Worksheet Batch (Advanced)

When the teacher photographs a stack of mixed quizzes/worksheets from different assignments:

```
Upload 50 photos (mixed from 2 quizzes + 1 worksheet)
    │
    ├── Photo 1:  QR → quiz_A, student_01  → group into Quiz A batch
    ├── Photo 2:  QR → quiz_B, student_15  → group into Quiz B batch
    ├── Photo 3:  QR → ws_C,   student_03  → group into Worksheet C batch
    ├── Photo 4:  QR → quiz_A, student_02  → group into Quiz A batch
    ├── Photo 5:  No QR detected           → "Unmatched" pile
    ├── ...
    │
    ├── Quiz A batch (22 photos):  grade with quiz_A answer key
    ├── Quiz B batch (18 photos):  grade with quiz_B answer key
    ├── Worksheet C batch (8 photos): grade with ws_C answer key
    └── Unmatched (2 photos): show to teacher for manual assignment
```

This is a major usability improvement — the teacher can photograph a messy stack without sorting first.

---

## 15. Advantages

| Aspect | Current System | With QR + Region Detection |
|--------|---------------|---------------------------|
| **Student identification** | Manual name entry on phone | Automatic via QR code |
| **Quiz/worksheet matching** | Manual ID entry or OCR extraction | Automatic via QR code |
| **Randomized quiz support** | Versions exist in memory only, lost on restart | Persisted in DB, matched via version_hash |
| **MC/TF detection** | Full page OCR → LLM parsing | Pixel density — no OCR, instant, more accurate |
| **Open answer detection** | Full page OCR | Targeted OCR on small cropped regions only |
| **Processing speed** | ~5-10s per page (full OCR + LLM) | ~1-2s for MC/TF-only pages |
| **AI/OCR usage** | Every page, every question | Only open-ended text boxes |
| **Mixed document batches** | Not supported — must grade one quiz at a time | Auto-groups by document type via QR |
| **Grading traceability** | Grades linked to title only | Grades linked to exact quiz_id + student version |
| **Phone complexity** | Camera + manual tagging | Camera only — QR handles everything |
| **Offline capability** | Fully offline | Still fully offline — QR libs are local |
| **Error handling** | Manual retry | Multi-level fallback chain with manual override |

---

## Dependencies to Add

| Package | Purpose | Size |
|---------|---------|------|
| `qrcode` (Python) | Generate QR code PNGs | ~50 KB |
| `pyzbar` (Python) | Decode QR codes from images | ~1 MB (wraps zbar C library) |
| `opencv-python-headless` (Python) | Image alignment, region cropping, pixel detection | ~30 MB (may already be available) |
| No new frontend dependencies | QR display uses existing image rendering | — |

**Note:** `pyzbar` requires the `zbar` shared library. On Windows, install via `pip install pyzbar` which bundles the DLL. Alternatively, OpenCV's `QRCodeDetector` can be used as a pure-OpenCV fallback without `pyzbar`.

---

## Summary

This plan builds on the existing OECS Learning Hub infrastructure. The key innovation is the **per-student QR code** on every printed page, which eliminates manual matching and enables automatic identification of both the document and the student. Combined with **pixel-density detection** for MC/TF questions and **targeted OCR** for open-ended answers, this creates a fast, accurate, and fully offline grading pipeline.

The implementation is broken into 5 phases, with Phase 1 (QR + database) and Phase 2 (generation + export) being the highest priority — everything else builds on those foundations.
