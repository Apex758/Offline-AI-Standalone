# main.py Modularization Plan

## Overview

`main.py` is a ~400KB, 9500-line monolith containing 18 functional domains, 60+ REST endpoints,
11 WebSocket handlers, global process state, prompt builders, grading engines, and lifecycle
management — all in one file. This plan breaks it into a clean, maintainable module tree
without breaking anything.

---

## Target Structure

```
backend/
├── main.py                       (~150 lines — wire-up only)
│
├── core/
│   ├── __init__.py
│   ├── logging.py                # _RingBufferHandler, logger setup
│   ├── process_manager.py        # active_processes, cancel events, signal handlers
│   ├── lifecycle.py              # lifespan() startup/shutdown context manager
│   ├── prompt_builder.py         # build_prompt(), build_multi_turn_prompt()
│   └── data_store.py             # load_json_data(), save_json_data(), get_data_directory()
│
├── schemas/
│   ├── __init__.py
│   ├── auth.py                   # LoginRequest
│   ├── chat.py                   # ChatMessage, ChatHistory, TitleGenerateRequest, etc.
│   ├── lesson.py                 # LessonPlanRequest, LessonPlanHistory, LessonDraft
│   └── students.py               # StudentCreate, QuizGradeCreate, AttendanceRecord, etc.
│
├── services/
│   ├── __init__.py
│   ├── title_helpers.py          # build_title_prompt(), clean_title_text(), validate_title()
│   ├── grading_helpers.py        # _grade_objective_question(), scan helpers, extraction
│   ├── image_helpers.py          # _preprocess_phone_image(), vision/text grading prompts
│   ├── brain_dump_service.py     # BRAIN_DUMP_* constants + keyword/category helpers
│   ├── model_scanner.py          # scan_models_directory()
│   └── file_explorer_service.py  # allowed folders, path validation, ALLOWED_EXTENSIONS
│
├── routers/
│   ├── __init__.py
│   ├── auth.py                   # POST /api/login
│   ├── system.py                 # /api/health, /api/restart, /api/metrics/*, /api/logs/recent
│   ├── chat.py                   # /api/chat-history CRUD + WS /ws/chat
│   ├── lesson_plans.py           # /api/lesson-plan-history, /api/lesson-drafts, WS /ws/lesson-plan
│   ├── quiz.py                   # /api/quiz-history, /api/quiz/*, WS /ws/quiz
│   ├── worksheet.py              # /api/worksheet-history, /api/worksheet/*, WS /ws/worksheet
│   ├── rubric.py                 # /api/rubric-history, WS /ws/rubric
│   ├── assessment_plan.py        # WS /ws/kindergarten, /ws/multigrade, /ws/cross-curricular + history
│   ├── presentation.py           # /api/presentation-history, /api/analyze-presentation-images, WS /ws/presentation
│   ├── storybook.py              # WS /ws/storybook
│   ├── brain_dump.py             # WS /ws/brain-dump
│   ├── educator_insights.py      # WS /ws/educator-insights
│   ├── consultant.py             # WS /ws/consultant, /api/consultant/*
│   ├── grading.py                # scan-grade, bulk-grade, class pack export, QR, instances
│   ├── ocr.py                    # /api/ocr/*, /api/ocr-models/*
│   ├── students.py               # /api/students/*, /api/classes, grades, attendance, reminders, calendar
│   ├── images.py                 # image generation, inpaint, remove-background, diffusion, images-history
│   ├── tts.py                    # /api/tts, /api/tts/preload, /api/tts/status, /api/tts/voices
│   ├── models.py                 # LLM models, diffusion models, tier-config, vision, recommendations
│   ├── utility.py                # generate-title, autocomplete, organize-note, smart-search, cancel
│   ├── file_explorer.py          # /api/file-explorer/*
│   └── data_io.py                # /api/export, /api/export-data, /api/import-data, /api/factory-reset
│
└── (existing files — unchanged)
    ├── routes/                   # achievements, insights, milestones, teacher_metrics, etc.
    ├── config.py
    ├── inference_factory.py
    ├── llama_inference.py
    ├── student_service.py
    ├── achievement_service.py
    ├── chat_memory.py
    ├── consultant_memory.py
    ├── curriculum_matcher.py
    ├── metrics_service.py
    ├── generation_gate.py
    ├── image_service.py
    ├── ocr_service.py
    ├── tts_service.py
    └── ... (all other service files)
```

---

## Migration Sequence

Execute steps in order. After each step: restart the server and run smoke tests before continuing.

### Phase 0 — Setup (no code changes)

- [ ] Create git branch: `refactor/modularize`
- [ ] Create empty directories: `core/`, `schemas/`, `services/`, `routers/`
- [ ] Add empty `__init__.py` to each
- [ ] Write a smoke test script that hits ~10 key endpoints to verify nothing broke

---

### Phase 1 — Core Infrastructure

These are pure extractions — no logic changes, just moving code.

| Step | File | Lines in main.py | Risk |
|------|------|-----------------|------|
| 1 | `core/logging.py` | 64–93, 386–393 | Very Low |
| 2 | `core/data_store.py` | 166–208 | Low |
| 3 | `core/process_manager.py` | 95–163 | Medium |
| 4 | `schemas/auth.py` | 398–401 | Very Low |
| 4 | `schemas/chat.py` | 403–438 | Very Low |
| 4 | `schemas/lesson.py` | 1313–1328, 1415–1424 | Very Low |
| 4 | `schemas/students.py` | 440–477 | Very Low |
| 5 | `core/prompt_builder.py` | 544–581 + inline in /ws/chat | Medium |

**Step 3 note:** `_active_cancel_events` dict must stay as a single shared object.
All future routers import the same reference — do NOT copy it.

**Step 5 note:** `build_multi_turn_prompt()` currently appears inline inside
`/ws/chat` (line ~931) AND inside `/ws/consultant` (line ~3808) with slightly
different content. Reconcile both into one canonical version here.

---

### Phase 2 — Services (pure logic, no endpoints)

| Step | File | Lines in main.py | Risk |
|------|------|-----------------|------|
| 6 | `services/title_helpers.py` | 587–670 | Very Low |
| 7 | `services/brain_dump_service.py` | 2753–2931 | Low |
| 8 | `services/image_helpers.py` | 5437–5691 | Low |
| 9 | `services/grading_helpers.py` | 4031–4089, 5040–5353 | Medium |
| 10 | `services/model_scanner.py` | 6327–6386 | Low |
| 11 | `services/file_explorer_service.py` | 6929–6961 | Low |

**Step 9 note:** `_grade_single_quiz_scan()` and `_grade_single_worksheet_scan()`
are ~80% identical (copy-paste). While extracting, unify them into a shared
`_grade_single_assessment_scan(type)` helper. This also fixes any bugs that
exist in one but not the other.

---

### Phase 3 — Lifecycle (most complex step)

| Step | File | Notes |
|------|------|-------|
| 12 | `core/lifecycle.py` | See critical risk #1 below before starting this step |

**Before touching Step 12**, add a singleton pattern to `curriculum_matcher.py`:

```python
_instance = None

def get_curriculum_matcher():
    return _instance

def set_curriculum_matcher(m):
    global _instance
    _instance = m
```

Then update all 5 WebSocket handlers that access `curriculum_matcher` as a bare
global (`/ws/chat`, `/ws/lesson-plan`, `/ws/quiz`, `/ws/rubric`, `/ws/worksheet`)
to use `get_curriculum_matcher()` instead. Only then extract `lifespan()`.

---

### Phase 4 — Routers

Migrate one at a time, simplest to most complex. Pattern for each:
1. Create router file with `router = APIRouter()`
2. Copy endpoint functions into it
3. Add `app.include_router(router)` to `main.py`
4. Run smoke tests
5. Delete the original code from `main.py`

| Step | Router | What it contains |
|------|--------|-----------------|
| 13a | `auth.py` | POST /api/login (1 endpoint) |
| 13b | `system.py` | /api/health, /api/restart, /api/shutdown, /api/metrics/*, /api/logs/recent, GET /phone |
| 13c | `tts.py` | /api/tts, /api/tts/preload, /api/tts/status, /api/tts/voices |
| 13d | `ocr.py` | /api/ocr/*, /api/ocr-models/* |
| 13e | `students.py` | /api/students/*, /api/classes, quiz-grades, worksheet-grades, packages, attendance, reminders, calendar |
| 13f | `file_explorer.py` | /api/file-explorer/* |
| 13g | `models.py` | /api/models/*, /api/capabilities, /api/tier-config/*, /api/model/preload, /api/vision/*, /api/diffusion-models/*, /api/recommendations |
| 13h | `utility.py` | /api/generate-title, /api/autocomplete, /api/organize-note, /api/smart-search, /api/cancel/{job_id}, /api/generate-image-prompt, /api/generate-comic-prompts |
| 13i | `images.py` | /api/generate-image*, /api/inpaint*, /api/remove-background-base64, /api/image-service/*, /api/images-history |
| 13j | `data_io.py` | /api/export, /api/export-data, /api/import-data, /api/factory-reset |
| 13k | `chat.py` | /api/chat-history CRUD + WS /ws/chat |
| 13l | `lesson_plans.py` | /api/lesson-plan-history, /api/lesson-drafts, POST /api/generate-lesson-plan, WS /ws/lesson-plan |
| 13m | `quiz.py` | /api/quiz-history, /api/quiz/answer-keys, /api/quiz/*, WS /ws/quiz |
| 13n | `worksheet.py` | /api/worksheet-history, /api/worksheet/*, WS /ws/worksheet |
| 13o | `rubric.py` | /api/rubric-history, WS /ws/rubric |
| 13p | `assessment_plan.py` | WS /ws/kindergarten, /ws/multigrade, /ws/cross-curricular + their history endpoints |
| 13q | `presentation.py` | /api/presentation-history, /api/analyze-presentation-images, WS /ws/presentation |
| 13r | `storybook.py` | WS /ws/storybook |
| 13s | `brain_dump.py` | WS /ws/brain-dump |
| 13t | `grading.py` | /api/quiz/grade-scans*, /api/worksheet/grade-scans*, /api/scan-grade-auto*, /api/save-quiz-instances, /api/save-worksheet-instances, /api/export-class-pack, /api/generate-qr |
| 13u | `consultant.py` | WS /ws/consultant, /api/consultant/conversations, /api/consultant/conversation/{id} |
| 13v | `educator_insights.py` | WS /ws/educator-insights (largest single handler — ~540 lines) |

---

## Critical Risks

### Risk 1 — `curriculum_matcher` global (CRITICAL)
**Problem:** Set as a bare Python global in `lifespan()`, accessed by name in 5 WS handlers.
When handlers move to separate router files, the reference breaks.

**Fix:** Add `get_curriculum_matcher()` / `set_curriculum_matcher()` to `curriculum_matcher.py`
(see Phase 3 above). Update all 5 call sites before extracting the lifespan.

---

### Risk 2 — `_active_cancel_events` dict (HIGH)
**Problem:** Shared mutable dict used by every WS handler for job cancellation.
After extraction, each router importing its own copy would break cancel functionality.

**Fix:** Define once in `core/process_manager.py`. All routers import the same dict object.
Python's import system ensures it is the same reference, not a copy. Verify with a
concurrent cancel test after migration.

---

### Risk 3 — `build_multi_turn_prompt()` is duplicated (MEDIUM)
**Problem:** Exists inline in `/ws/chat` (~line 931) and `/ws/consultant` (~line 3808)
with different content — the consultant version is missing the `gemma`/`gemma4` format branches.

**Fix in Step 5:** Create one canonical version in `core/prompt_builder.py`. Add the missing
gemma branches. Update both callers to import from there.

---

### Risk 4 — `LESSON_PLAN_HISTORY_FILE` shared across two routers (LOW)
**Problem:** Defined in `main.py` (~line 1317), referenced by both `lesson_plans.py`
and `data_io.py` after migration.

**Fix:** Define the constant in `routers/lesson_plans.py`, import it in `routers/data_io.py`:
```python
from routers.lesson_plans import LESSON_PLAN_HISTORY_FILE, LESSON_DRAFTS_FILE
```

---

### Risk 5 — `routes/` vs `routers/` naming confusion (LOW)
**Problem:** The existing `routes/` directory (achievements, insights, etc.) and the new
`routers/` directory could be confused.

**Fix:** Consider renaming the new directory to `api/` to make the distinction clear.
Either way, document it clearly at the top of `main.py`.

---

### Risk 6 — `_preload_lock` lazy async lock (LOW)
**Problem:** Declared as `None` at module level (~line 6559), assigned inside the route handler.

**Fix:** In `routers/models.py`, declare `_preload_lock: asyncio.Lock | None = None` at module top.
It only lives in that one router file.

---

## Shared Dependencies Map

These are used by multiple routers — they must live in `core/` or `services/`, not in any single router.

| Dependency | Where it moves | Consumed by |
|---|---|---|
| `build_prompt()` | `core/prompt_builder.py` | lesson_plans, quiz, rubric, assessment_plan, presentation, storybook, brain_dump, educator_insights, consultant, utility |
| `build_multi_turn_prompt()` | `core/prompt_builder.py` | chat, consultant |
| `load_json_data()` / `save_json_data()` | `core/data_store.py` | quiz, rubric, kindergarten, multigrade, cross-curricular, worksheet, images, presentation, data_io |
| `_active_cancel_events` | `core/process_manager.py` | lesson_plans, quiz, rubric, assessment_plan, presentation, educator_insights |
| `get_curriculum_matcher()` | `curriculum_matcher.py` (add getter) | chat, lesson_plans, quiz, rubric, worksheet |
| `_grade_objective_question()` | `services/grading_helpers.py` | grading (quiz scan + worksheet scan) |
| `_preprocess_phone_image()` | `services/image_helpers.py` | grading (quiz), grading (worksheet), grading (scan-auto) |
| `scan_models_directory()` | `services/model_scanner.py` | models, data_io |
| `_log_ring` | `core/logging.py` (export it) | system (for /api/logs/recent) |

---

## What `main.py` Looks Like After

```python
# backend/main.py — ~150 lines, wire-up only
import os, sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ["PYTHONIOENCODING"] = "utf-8"
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, ORJSONResponse
from starlette.middleware.gzip import GZipMiddleware

from core.logging import setup_logging
from core.lifecycle import lifespan

setup_logging()

app = FastAPI(lifespan=lifespan, default_response_class=ORJSONResponse)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000",
                   "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.exception_handler(Exception)
async def _global_exception_handler(request: Request, exc: Exception):
    import logging
    logging.getLogger(__name__).error(
        f"Unhandled error on {request.method} {request.url.path}: {exc}", exc_info=True
    )
    return JSONResponse(status_code=500, content={"detail": "An internal error occurred"})

# Existing routes (unchanged)
from routes.photo_transfer import router as photo_transfer_router
from routes.school_year import router as school_year_router
from routes import milestones, achievements, insights, teacher_metrics
from scene_api_endpoints import router as scene_router

# New routers
from routers.auth import router as auth_router
from routers.system import router as system_router
from routers.chat import router as chat_router
from routers.lesson_plans import router as lesson_plans_router
from routers.quiz import router as quiz_router
from routers.worksheet import router as worksheet_router
from routers.rubric import router as rubric_router
from routers.assessment_plan import router as assessment_plan_router
from routers.presentation import router as presentation_router
from routers.storybook import router as storybook_router
from routers.brain_dump import router as brain_dump_router
from routers.educator_insights import router as educator_insights_router
from routers.consultant import router as consultant_router
from routers.grading import router as grading_router
from routers.ocr import router as ocr_router
from routers.students import router as students_router
from routers.images import router as images_router
from routers.tts import router as tts_router
from routers.models import router as models_router
from routers.utility import router as utility_router
from routers.file_explorer import router as file_explorer_router
from routers.data_io import router as data_io_router

for r in [
    photo_transfer_router, school_year_router,
    milestones.router, achievements.router, insights.router,
    teacher_metrics.router, scene_router,
    auth_router, system_router, chat_router, lesson_plans_router,
    quiz_router, worksheet_router, rubric_router, assessment_plan_router,
    presentation_router, storybook_router, brain_dump_router,
    educator_insights_router, consultant_router, grading_router,
    ocr_router, students_router, images_router, tts_router,
    models_router, utility_router, file_explorer_router, data_io_router,
]:
    app.include_router(r)
```

---

## Progress Tracker

Use this to track execution. Check off each step as it is completed and smoke-tested.

### Phase 0 — Setup
- [ ] Create branch `refactor/modularize`
- [ ] Create directory skeleton + `__init__.py` files
- [ ] Write smoke test script

### Phase 1 — Core Infrastructure
- [ ] Step 1: `core/logging.py`
- [ ] Step 2: `core/data_store.py`
- [ ] Step 3: `core/process_manager.py`
- [ ] Step 4: `schemas/` (all 4 files)
- [ ] Step 5: `core/prompt_builder.py`

### Phase 2 — Services
- [ ] Step 6: `services/title_helpers.py`
- [ ] Step 7: `services/brain_dump_service.py`
- [ ] Step 8: `services/image_helpers.py`
- [ ] Step 9: `services/grading_helpers.py`
- [ ] Step 10: `services/model_scanner.py`
- [ ] Step 11: `services/file_explorer_service.py`

### Phase 3 — Lifecycle
- [ ] Pre-step: Add `get/set_curriculum_matcher()` to `curriculum_matcher.py`
- [ ] Pre-step: Update all 5 WS handlers to use `get_curriculum_matcher()`
- [ ] Step 12: `core/lifecycle.py`

### Phase 4 — Routers
- [ ] 13a: `routers/auth.py`
- [ ] 13b: `routers/system.py`
- [ ] 13c: `routers/tts.py`
- [ ] 13d: `routers/ocr.py`
- [ ] 13e: `routers/students.py`
- [ ] 13f: `routers/file_explorer.py`
- [ ] 13g: `routers/models.py`
- [ ] 13h: `routers/utility.py`
- [ ] 13i: `routers/images.py`
- [ ] 13j: `routers/data_io.py`
- [ ] 13k: `routers/chat.py`
- [ ] 13l: `routers/lesson_plans.py`
- [ ] 13m: `routers/quiz.py`
- [ ] 13n: `routers/worksheet.py`
- [ ] 13o: `routers/rubric.py`
- [ ] 13p: `routers/assessment_plan.py`
- [ ] 13q: `routers/presentation.py`
- [ ] 13r: `routers/storybook.py`
- [ ] 13s: `routers/brain_dump.py`
- [ ] 13t: `routers/grading.py`
- [ ] 13u: `routers/consultant.py`
- [ ] 13v: `routers/educator_insights.py`

### Final
- [ ] Slim `main.py` down to ~150 lines
- [ ] Full regression test
- [ ] Merge to main

---

## Related Frontend Refactors

This plan covers the backend `main.py` split. Parallel frontend refactor work
is tracked in `plans/GENERATOR_OPTIMISATION_PLAN.md`. Recently completed from
that plan (2026-04-11):

- [x] New data module `frontend/src/data/generatorPresets.ts` — single source of
      truth for quiz presets, rubric presets, duration chips, and last-used
      quiz settings persistence (localStorage).
- [x] New shared component `frontend/src/components/ui/DurationPicker.tsx` —
      one-click chip row (30/40/45/60/80) with free-text fallback.
- [x] DurationPicker wired into `LessonPlanner`, `KindergartenPlanner`,
      `MultigradePlanner`, and `CrossCurricularPlanner` (replaced free-typed
      number inputs).
- [x] `QuizGenerator` — added Quick Preset chip row (Quick Check / Full Test /
      Mixed Assessment / Short Answer Only) and persists last-used
      `questionTypes` / `cognitiveLevels` / `numberOfQuestions` /
      `timeLimitPerQuestion` to localStorage after each successful generation.
      `getDefaultFormData()` now hydrates new tabs from those saved values.
- [x] `RubricGenerator` — selecting an assignment type (Essay, Presentation,
      Project, Lab Report, Group Work, Creative Writing, Portfolio) now
      auto-fills `focusAreas` and `performanceLevels` with sensible soft
      defaults. Teacher can still tweak afterwards.

Still pending in the generator plan (not started):
- Import Lesson Plan into RubricGenerator (mirroring QuizGenerator's
  `lockedLessonPlan`).
- Teaching Style preset / persist Step 2 defaults in `LessonPlanner`.
- "Send to Quiz / Send to Rubric" buttons on the lesson plan output.
- Collapsing rarely-used fields into advanced-options accordions.

---

# Class-Level Configuration System

**Goal:** Eliminate repetitive re-entry of class-wide settings (subject,
learning styles, special needs, reading level, assessment prefs, etc.) across
every generator. Configure a class once in the Class Manager; every generator
auto-fills and the backend also injects a "CLASS CONTEXT" block into the LLM
system prompt so hidden fields still reach the model.

## Architecture

```
Class Manager (UI)
  -> ClassConfigPanel.tsx  (8 sections, 33 fields)
     -> PUT /api/classes/config        { class_name, grade_level, config }
        -> student_service.save_class_config
           -> class_configs table (SQLite, JSON blob per class+grade)

Generator (UI)
  -> Class picker dropdown (top of form)
     -> GET /api/classes/config?class_name=X&grade_level=Y
        -> student_service.get_class_config
     -> applyClassConfig() merges into local formData (non-destructive)
  -> On generate, sends { formData: { ...formData, className, gradeLevel } }
     -> WS /ws/{lesson-plan|quiz|worksheet|rubric}
        -> build_class_context_block(form_data)
           -> looks up stored config, appends block to system_prompt
```

## Backend surface

**New table** — `backend/student_service.py`:
```
CREATE TABLE class_configs (
    class_name   TEXT NOT NULL,
    grade_level  TEXT NOT NULL DEFAULT '',
    config       TEXT NOT NULL DEFAULT '{}',   -- JSON
    updated_at   TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_name, grade_level)
)
```

**New functions** — `backend/student_service.py`:
- `get_class_config(class_name, grade_level=None) -> dict`
- `save_class_config(class_name, grade_level, config) -> dict`
- `delete_class_config(class_name, grade_level=None) -> bool`
- `list_classes(...)` — now merges `config` and `student_count` into each row.

**New endpoints** — `backend/main.py`:
- `GET    /api/classes/config?class_name=&grade_level=`
- `PUT    /api/classes/config`  body: `{ class_name, grade_level, config }`
- `DELETE /api/classes/config?class_name=&grade_level=`

**New helper** — `backend/main.py`:
- `build_class_context_block(form_data) -> str` — reads `className` +
  `gradeLevel` from `form_data`, looks up stored config, and returns a
  fully-formatted "CLASS CONTEXT" block listing 30+ class-level attributes.
  Returns empty string when no class is selected or no config is stored.

**Injection points** — appended to `system_prompt` right before
`build_prompt(system_prompt, prompt)`:
- `@app.websocket("/ws/lesson-plan")`
- `@app.websocket("/ws/quiz")`
- `@app.websocket("/ws/rubric")`
- `@app.websocket("/ws/worksheet")`

## Frontend surface

**New lib** — `frontend/src/lib/classConfig.ts`:
- `ClassConfig` interface (33 optional fields covering curriculum,
  composition, learner profile, special needs, reading/language, assessment,
  materials, pacing, policies).
- `ClassSummary` (class_name, grade_level, student_count, config).
- `fetchClasses()`, `fetchClassConfig()`, `saveClassConfig()`.
- `mergeClassConfig()` helper — overrides only win when non-empty.

**New hook** — `frontend/src/hooks/useClassContext.ts`:
- `useClassContext(className, gradeLevel)` — reusable loader for any future
  generator that needs to pull class config.

**New component** — `frontend/src/components/ClassConfigPanel.tsx`:
- 8 sections (Curriculum, Composition, Learner profile, Special needs,
  Reading & language, Assessment preferences, Materials, Pacing & general).
- Chip-based multi-select UIs, autosave button with saved-indicator.
- Lives inside the Class Manager's existing class view as a third tab.

**ClassManagement.tsx changes:**
- Added `'settings'` to the `classViewTab` union.
- Added a "Class Settings" tab button next to Students / Attendance.
- Renders `<ClassConfigPanel className={cls} gradeLevel={grade} />` when
  the settings tab is active.

**Generator wiring (all 4):**
Each generator has:
1. `availableClasses` / picker state vars (names differ per file to avoid
   collisions — e.g. `configClassName` in Quiz/Worksheet/Rubric,
   `selectedClassName` in LessonPlanner).
2. A `fetchClasses()` effect populating the dropdown.
3. An `applyClassConfig(cfg, label)` merger that never overwrites
   already-populated fields (preserves per-generation overrides).
4. A `handleSelectClass(value)` that splits the `"${grade}::${class}"` key,
   sets `gradeLevel` if empty, and applies config.
5. A dashed-border class picker UI at the top of the form, with
   "[configured]" / "[no settings]" hints and an "Auto-filled from X"
   confirmation message.
6. Outgoing payload merges `className` and `gradeLevel` into `formData`
   before the WS `send` / queue enqueue call, so the backend can look up
   the full config and build its `CLASS CONTEXT` block.

## Fields wired per generator

| Generator | Direct field auto-fills |
|---|---|
| LessonPlanner | subject, strand, outcomes, studentCount, duration, pedagogicalStrategies, learningStyles, learningPreferences, multipleIntelligences, customLearningStyles, materials, prerequisiteSkills, specialNeeds, specialNeedsDetails, additionalInstructions (16 fields) |
| QuizGenerator | subject, strand, outcomes, defaultQuestionTypes, defaultCognitiveLevels, defaultTimeLimitPerQuestion (7 fields) |
| WorksheetGenerator | subject, strand, outcomes, studentCount (5 fields — form lacks learning-style / materials / special-needs fields) |
| RubricGenerator | subject, strand, outcomes, performanceLevels, includePointValues, focusAreas, specificRequirements (8 fields) |

All other class config fields (ELL%, cultural notes, behavior support,
bilingual program, reading level, preferred assessment format, etc.) still
reach the LLM via the backend-injected `CLASS CONTEXT` block even though
they have no visible form field.

## Status

Phase 1 — class table, Class Manager UI, auto-fill in Lesson/Quiz/Worksheet/Rubric generators — **shipped.**
Phase 2 — backend `CLASS CONTEXT` prompt injection for Lesson/Quiz/Worksheet/Rubric — **shipped.**
Phase 3 — extend coverage to `KindergartenPlanner`, `MultigradePlanner`, `CrossCurricularPlanner` (backend WS endpoints updated to extract `form_data` and append `build_class_context_block`; frontend class picker + `formDataWithClass` payload merge added to all three) — **shipped.**
Phase 4 — `ImageStudio` integration: class picker UI above the prompt field, `buildClassImageHint()` helper that distills the class config into image-relevant hints (age/reading level, primary language for text overlays, cultural context, accessibility cues, ELL visual clarity), appended inside `buildStyledPrompt()` so every generation path (generator, worksheet images, retries) picks it up automatically — **shipped.**
Phase 5 — visible override fields added to `WorksheetGenerator`, `QuizGenerator`, `KindergartenPlanner` so teachers can tweak class-level attributes per-generation without touching the Class Manager. `applyClassConfig()` in each file now merges the new fields too, preserving the non-destructive rule (existing user values win over class defaults) — **shipped.**
Phase 6 — dedicated `classes` table with stable `class_id` (UUID) introduced. `init_db` auto-backfills from existing `DISTINCT (class_name, grade_level)` pairs in `students` so no data is lost. `class_configs` now has a nullable `class_id` column for future migration. `list_classes()` reads from the `classes` table and returns `class_id`, `academic_year`, `description`, and `student_count` alongside the existing `class_name` / `grade_level` shape. New CRUD helpers (`get_class`, `create_class`, `update_class`, `delete_class`) cascade renames to the `students` and `class_configs` tables. New REST endpoints added — `GET/POST /api/classes`, `GET/PUT/DELETE /api/classes/{class_id}` — with specific `/api/classes/config*` routes declared before the `{class_id}` param routes so FastAPI path matching works correctly. All existing `class_name`-based lookups still work; no breaking change to generators — **shipped.**
Phase 7 — Class Manager UI for explicit class lifecycle. `ClassManagement.tsx` now fetches from `/api/classes` alongside `/api/students` (new `allClasses` state) and merges empty classes into the sidebar tree so a newly-created class shows up even with zero students. A "+ Class" button lives in the sidebar header next to the existing "Add Student" button. The class view hero gained "Rename" and "Delete Class" buttons. Three new modals (Create / Rename / Delete) wrap the corresponding `POST`, `PUT`, `DELETE /api/classes/{id}` calls. Renames cascade on the backend so student rows and class configs follow. Deleting a class unassigns its students (student rows preserved) and shows a warning with the student count. Create and Rename modals expose `academic_year` and `description` fields so teachers can attach year tags and notes to each class — **shipped.**

Phase 8 — Per-student IEP overrides + import/export + full i18n. Three capabilities landed at once:

1. **Per-student accommodations (IEP overrides).** New nullable columns `accommodations` and `iep_notes` on the `students` table. `create_student` / `update_student` now persist them. New helper `student_service.get_student_accommodations_for_class(class_name, grade_level)` returns a list of students who have any non-empty accommodation. `build_class_context_block()` was extended to append a "STUDENT-SPECIFIC ACCOMMODATIONS" section listing each student's accommodations and IEP notes, layered on top of the class-level CLASS CONTEXT. This means every generator (all 8) now receives per-student context automatically when those students belong to the selected class. New fields surfaced in the student Add/Edit form in Class Manager, grouped under "Individual accommodations".

2. **Class config import/export.** `ClassConfigPanel` gained **Export JSON** and **Import JSON** buttons. Export downloads a JSON file with a `_meta` block (exported-at timestamp, source class, source grade, format version) + the raw `config` payload. Import accepts either the wrapped `{ _meta, config }` shape or a raw `ClassConfig` object, loads it into the panel (non-destructive — the user reviews and hits Save), and shows a confirmation notice including the source class when present. Hidden `<input type="file">` + `FileReader`, no extra dependencies.

3. **Full i18n for Phase 6/7/8 UI.** New `classConfig` namespace added to `en.json`, `es.json`, and `fr.json` covering 73+ strings: ClassConfigPanel (8 sections, 28 field labels, 5 placeholders, 4 button labels, loading/saved/imported messages, apply-policy banner), all three class modals (New / Rename / Delete), sidebar "+ Class" button, class view hero Rename/Delete buttons, and the new student form Accommodations / IEP notes fields. The Delete Class modal uses i18next plurals (`studentWarning_one` / `studentWarning_other`) for the student count warning. Chip-group option values (learning styles, cognitive levels, etc.) were intentionally kept in English because they're persisted values in the backend — translating display without a mapping layer would corrupt data. Spanish and French translations done inline — **shipped.**

### Phase 5 field expansion details

| Generator | Fields added | Section label |
|---|---|---|
| WorksheetGenerator | learningStyles, materials, prerequisiteSkills, specialNeeds, specialNeedsDetails, additionalInstructions | "Differentiation & Accommodations" |
| QuizGenerator | specialNeeds, specialNeedsDetails, additionalInstructions, preferredAssessmentFormat | "Accommodations & Format" |
| KindergartenPlanner | learningStyles, pedagogicalStrategies, materials, prerequisiteSkills, specialNeeds, specialNeedsDetails | "Class Context & Accommodations" |

### Generators covered (8 / 8)

| Generator | Direct auto-fill | Backend CLASS CONTEXT |
|---|---|---|
| LessonPlanner | [x] 16 fields | [x] |
| QuizGenerator | [x] 11 fields (Phase 5: +4 override fields) | [x] |
| WorksheetGenerator | [x] 11 fields (Phase 5: +6 override fields) | [x] |
| RubricGenerator | [x] 8 fields | [x] |
| KindergartenPlanner | [x] 13 fields (Phase 5: +6 override fields) | [x] |
| MultigradePlanner | [x] 15 fields | [x] |
| CrossCurricularPlanner | [x] 9 fields | [x] |
| ImageStudio | [x] reading level, language, cultural, accessibility | N/A (diffusion, prompt-suffix only) |

## Still pending

- **Class config import/export:** allow exporting a class config as JSON
  and importing it into another class (teacher-to-teacher sharing).
- **Per-student overrides:** individual accommodations (IEP-style) stored
  on the `students` row should further augment the CLASS CONTEXT block when
  a specific student is named in a prompt (e.g. differentiated worksheet
  packages).
- **i18n:** ClassConfigPanel strings are hardcoded English — wire through
  `useTranslation()` like the rest of Class Manager.
