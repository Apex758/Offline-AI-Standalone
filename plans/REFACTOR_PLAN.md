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
