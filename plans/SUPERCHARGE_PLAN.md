# Coworker Supercharge Plan: 6 Features

## Context

The goal is to add 5 features inspired by OpenClaw's architecture to the OECS Class Coworker. The features must add genuine value without slowing down the app. The primary model is Gemma 4.

---

## Feature 1: Smart Context Budgeting (Memory Improvement)

### Verdict: Existing 3-tier system IS session compaction

The current `chat_memory.py` already implements exactly what OpenClaw calls "session compaction":

- Tier 1: Sliding window (last 4 message pairs)
- Tier 2: LLM-generated summary (every 10 messages, async fire-and-forget)
- Tier 3: Full SQLite storage

This is actually **better** than OpenClaw's approach because the summary is generated asynchronously (zero latency on the generation path) and the tiers are cleanly separated.

### What to improve: Token-aware context budgeting

**Problem:** `build_context()` returns summary + 4 pairs with no size awareness. On Tier 1 models (2-4K context), a long summary + 4 pairs of long messages can overflow the context window, causing slow inference and degraded output.

**Solution:** Add `build_context_budgeted()` that fits history within a token budget.

### Flow

```
Teacher sends message
  -> build_context_budgeted(chat_id, token_budget=CONTEXT_BUDGET[tier])
  -> Get summary (cap at 150 tokens / ~525 chars)
  -> Get up to 4 recent pairs
  -> Estimate total tokens: summary + pairs + system_prompt + user_msg
  -> Over budget? Drop oldest pair, repeat. Still over? Truncate summary.
  -> Return (summary_block, recent_messages)
  -> After response: fire-and-forget maybe_update_summary() [unchanged]
```

### Files to Modify

| File                                              | Changes                                                                                                                     |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `backend/chat_memory.py`                          | Add `_estimate_tokens(text)` (len/3.5), add `build_context_budgeted(chat_id, token_budget, n_pairs_max=4, summary_cap=150)` |
| `backend/config.py`                               | Add `CONTEXT_BUDGET = {1: 1500, 2: 6000, 3: 8000, 4: 12000}`                                                                |
| `backend/main.py` `/ws/chat` handler (~line 1054) | Call `build_context_budgeted()` with tier-appropriate budget                                                                |
| `backend/consultant_memory.py`                    | Same `build_context_budgeted()` method (identical pattern)                                                                  |

### Key Implementation Detail

```python
def _estimate_tokens(text: str) -> int:
    return max(1, int(len(text) / 3.5))

def build_context_budgeted(self, chat_id, token_budget=2000, n_pairs_max=4, summary_cap_tokens=150):
    summary = self.get_summary(chat_id)
    # Cap summary
    if summary and _estimate_tokens(summary) > summary_cap_tokens:
        char_cap = int(summary_cap_tokens * 3.5)
        # Truncate at last sentence boundary
        cut = summary[:char_cap].rfind('. ')
        summary = summary[:cut+1] if cut > 0 else summary[:char_cap]

    recent = self.get_context_window(chat_id, n_pairs_max)

    # Shrink pairs until within budget
    total = _estimate_tokens(summary or "") + sum(_estimate_tokens(m["content"]) for m in recent)
    while total > token_budget and len(recent) >= 2:
        recent = recent[2:]  # Drop oldest pair (user+assistant)
        total = _estimate_tokens(summary or "") + sum(_estimate_tokens(m["content"]) for m in recent)

    summary_block = f"\n\n[Conversation context so far: {summary}]" if summary else ""
    return summary_block, recent
```

---

## Feature 2: Thinking Level Controls

### What Changes

| Area                    | Before                                                         | After                                                                         |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Settings page**       | Has thinking toggle                                            | Toggle **removed**                                                            |
| **Chat (Ask Coworker)** | Brain icon toggles `thinkingEnabled` (bool) in global settings | Brain icon opens popup with **Quick / Deep** (local to Chat, not in settings) |
| **Generation tabs**     | Use tier-aware prompts                                         | Always use Quick mode (tier1 prompts, lower max_tokens) -- unchanged behavior |
| **Analyse chat**        | N/A                                                            | Has its own Quick/Deep toggle (Feature 4)                                     |

### Quick vs Deep (Chat only)

| Parameter      | Quick                   | Deep                                                                  |
| -------------- | ----------------------- | --------------------------------------------------------------------- |
| System prompt  | `tier1_prompts["chat"]` | `tier2_prompts["chat"]` + CoT prefix for Gemma                        |
| max_tokens     | 1500                    | 3000                                                                  |
| temperature    | 0.4                     | 0.6                                                                   |
| repeat_penalty | 1.3                     | 1.1                                                                   |
| Qwen models    | `/no_think`             | `/think`                                                              |
| Gemma models   | Normal                  | Add "Think carefully step by step before answering." to system prompt |

### Flow

```
Chat.tsx:
  [Input box] .......................... [Brain icon]
                                              |
                                         click brain
                                              |
                                              v
                                    +-------------------+
                                    |  * Quick (default) |
                                    |    Deep            |
                                    +-------------------+
                                    (popup above brain icon)

  Brain icon visual state:
    Quick = dim/outline (current "off" look)
    Deep  = filled/glowing (current "on" look)

  Send message -> { thinking_mode: "quick"|"deep" } in WS payload
```

### Files to Modify

| File                                        | Changes                                                                                                                                                                                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/components/Settings.tsx`      | Remove the "Thinking Mode" card (lines ~2527-2559)                                                                                                                                                                |
| `frontend/src/contexts/SettingsContext.tsx` | Remove `thinkingEnabled` from interface + defaults. Keep backward compat (ignore key in localStorage).                                                                                                            |
| `frontend/src/components/Chat.tsx`          | Replace `settings.thinkingEnabled` with local `thinkingMode` state. Replace brain toggle with popup. Send `thinking_mode` instead of `thinking_enabled`. Remove `shouldSuggestThinking` / smart suggestion logic. |
| `backend/main.py` `/ws/chat` (~line 1026)   | Read `thinking_mode` instead of `thinking_enabled`. Add helper `get_chat_params_for_mode()` to resolve prompt/params.                                                                                             |

### Backend Helper

```python
def get_chat_params_for_mode(thinking_mode, model_config, tier_info):
    if thinking_mode == "deep":
        system_prompt = get_tier2_system_prompt("chat")
        if model_config.get("prompt_format", "").startswith("gemma"):
            system_prompt += "\n\nThink carefully step by step before answering."
        return {"system_prompt": system_prompt, "max_tokens": 3000, "temperature": 0.6, "repeat_penalty": 1.1}
    else:
        return {
            "system_prompt": get_tier1_system_prompt("chat") if tier_info["tier"] == 1 else get_tier2_system_prompt("chat"),
            "max_tokens": TIER1_MAX_TOKENS["chat"],  # 1500
            "temperature": 0.4,
            "repeat_penalty": 1.3,
        }
```

---

## Feature 3: Scheduled Tasks + Model Offloading

### 3A: Model Offloading

#### Flow

```
Teacher minimizes app to tray
  -> electron/main.js: mainWindow 'hide' event
  -> POST http://127.0.0.1:8000/api/model/unload
  -> inference_factory.unload_all_models()
     -> _local_instance.cleanup_sync() + del + None
     -> _fast_model_instance.cleanup_sync() + del + None
     -> gc.collect()
  -> ~3-6 GB RAM freed

Teacher brings app back to foreground
  -> electron/main.js: mainWindow 'show' event
  -> POST http://127.0.0.1:8000/api/model/reload
  -> inference_factory.reload_local_model() [already exists]
  -> Model loads in 5-15 seconds
  -> Frontend: show "Model loading..." indicator via engine status

Scheduled time arrives (app in background)
  -> APScheduler fires job
  -> scheduled_tasks._ensure_model_loaded() calls /api/model/reload internally
  -> Run tasks sequentially
  -> scheduled_tasks._unload_after_tasks() calls unload_all_models()
  -> RAM freed again
```

#### Files to Modify

| File                           | Changes                                                                                                     |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `backend/inference_factory.py` | Add `unload_all_models()`, `is_model_loaded()` functions                                                    |
| `backend/main.py`              | Add `POST /api/model/unload` and `POST /api/model/reload` endpoints                                         |
| `electron/main.js`             | Add `hide`/`show` event handlers on mainWindow to call unload/reload. Modify tray hide handler (~line 527). |

#### Key Implementation

```python
# inference_factory.py
def unload_all_models():
    global _local_instance, _fast_model_instance, _fast_model_name
    with _local_instance_lock:
        if _local_instance is not None:
            try:
                _local_instance.cleanup_sync()
            except Exception:
                pass
            _local_instance = None
    with _fast_model_lock:
        if _fast_model_instance is not None:
            try:
                _fast_model_instance.cleanup_sync()
            except Exception:
                pass
            _fast_model_instance = None
            _fast_model_name = None
    import gc
    gc.collect()

def is_model_loaded() -> bool:
    return _local_instance is not None and _local_instance.is_loaded
```

```javascript
// electron/main.js - Add after tray hide handler
mainWindow.on("hide", async () => {
  try {
    await fetch(`http://127.0.0.1:${BACKEND_PORT}/api/model/unload`, {
      method: "POST",
    });
    log.info("Model unloaded (app hidden)");
  } catch (e) {
    log.warn("Could not unload model:", e.message);
  }
});

mainWindow.on("show", async () => {
  try {
    await fetch(`http://127.0.0.1:${BACKEND_PORT}/api/model/reload`, {
      method: "POST",
    });
    log.info("Model reload triggered (app shown)");
  } catch (e) {
    log.warn("Could not reload model:", e.message);
  }
});
```

### 3B: Schedule Configuration

#### Flow

```
Settings page -> "Background Schedule" section:
  [Day picker: Sunday ▼]  [Time picker: 18:00]
  [Reminder: 1 hour before ▼]
  [x] Weekly ELO Breakdown
  [x] Attendance Summary
  [x] Progress Report
  [Save Schedule]

  -> POST /api/scheduled/config
  -> Saves to SQLite
  -> APScheduler job registered/updated
```

### 3C: Weekly ELO Breakdown (Detailed Flow)

```
                          SCHEDULED TIME ARRIVES
                                  |
                                  v
                    [APScheduler fires "run_scheduled_tasks"]
                                  |
                                  v
                    [_ensure_model_loaded()]
                    (calls reload_local_model if needed)
                                  |
                                  v
            +---------------------+---------------------+
            |                     |                     |
            v                     v                     v
    [run_elo_breakdown]   [run_attendance]   [run_progress_report]
            |              (if enabled)       (if enabled)
            v
    STEP 1: GATHER DATA
            |
            +-> school_year_service.get_active_config(teacher_id)
            +-> Determine current phase from calendar dates
            +-> milestone_db.get_milestones(teacher_id, phase_id=current_phase_id)
            |     -> Filter: status IN ('not_started', 'in_progress')
            +-> GET /api/timetable/{teacher_id} (Feature 5 -- weekly timetable)
            |     -> Returns period-level schedule:
            |        [{day: "monday", period: "08:00-08:45", grade: "3", subject: "Mathematics"}, ...]
            +-> Calculate: days in upcoming week (Mon-Fri)
            |
            v
    STEP 2: BUILD LLM PROMPT (timetable-aware)
            |
            System: "You are a curriculum scheduler for Caribbean primary
                     schools. Given the ELOs and the teacher's timetable,
                     assign ELOs to specific periods. Each ELO must match
                     the grade+subject of its assigned period. Output JSON."
            |
            User:   "PHASE: Term 2 Early (Jan 5 - Feb 14)
                     WEEK: April 13 - April 17

                     WEEKLY TIMETABLE:
                     Monday:
                       08:00-08:45: Grade 3 Mathematics
                       09:30-10:15: Grade 3 Science
                       10:30-11:15: Grade 3 English
                     Tuesday:
                       08:45-09:30: Grade 4 English
                       09:30-10:15: Grade 4 Science
                     Wednesday:
                       08:00-08:45: Grade 3 Mathematics
                       09:30-10:15: Grade 3 Science
                       10:30-11:15: Grade 3 English
                     ...

                     PENDING ELOs:
                     - [Grade 3 Math] Fractions: Number strand (in_progress)
                     - [Grade 3 Science] Plants: Life Science (not_started)
                     - [Grade 4 English] Persuasive Writing (not_started)
                     ...

                     Assign ELOs to specific periods for this week."
            |
            v
    STEP 3: LLM GENERATES (non-streaming, use generate() not generate_stream())
            |
            -> JSON output (period-level):
            {
              "week_of": "2026-04-13",
              "days": [
                {
                  "day": "Monday",
                  "date": "2026-04-13",
                  "periods": [
                    {
                      "time": "08:00-08:45",
                      "grade": "3",
                      "subject": "Mathematics",
                      "elo": {
                        "topic_id": "ms-frac-01",
                        "topic_title": "Fractions - Equivalent",
                        "rationale": "Builds on last week's denominator work"
                      }
                    },
                    {
                      "time": "09:30-10:15",
                      "grade": "3",
                      "subject": "Science",
                      "elo": {
                        "topic_id": "sc-plants-02",
                        "topic_title": "Plant Life Cycles",
                        "rationale": "Prerequisite for ecology unit"
                      }
                    }
                  ]
                },
                { "day": "Tuesday", "date": "2026-04-14", "periods": [...] },
                ...
              ],
              "notes": "No Grade 4 Math ELOs pending -- Thu 10:30 period left open."
            }
            |
            v
    STEP 4: VALIDATE & SAVE
            |
            +-> Validate JSON structure (required fields present)
            +-> INSERT into scheduled_results table
            |     {id, teacher_id, task_type: "elo_breakdown",
            |      status: "pending_review", result_json, week_of, created_at}
            |
            v
    STEP 5: NOTIFY
            |
            +-> Electron IPC: show-notification("Your weekly ELO plan is ready!")
            +-> In-app: Add HistoryItem with category="scheduled"
            |
            v
    STEP 6: UNLOAD MODEL (after all tasks complete)
            |
            +-> unload_all_models()
            +-> gc.collect()

                          ...TIME PASSES...

    TEACHER OPENS APP / CHECKS NOTIFICATIONS
            |
            v
    NotificationPanel shows scheduled result:
    +------------------------------------------------------+
    | SCHEDULED RESULTS                           [Toggle] |
    |------------------------------------------------------|
    | Weekly ELO Breakdown - Week of Apr 13      [pending] |
    |                                                      |
    | Monday Apr 13:                                       |
    |   08:00 Gr3 Math: Fractions - Equivalent            |
    |   09:30 Gr3 Sci:  Plant Life Cycles                 |
    |   10:30 Gr3 Eng:  Narrative Writing                 |
    | Tuesday Apr 14:                                      |
    |   08:45 Gr4 Eng:  Persuasive Writing                |
    |   09:30 Gr4 Sci:  Forces & Motion                   |
    | ...                                                  |
    |                                                      |
    | [Accept & Generate Plans]  [Edit]  [Dismiss]        |
    +------------------------------------------------------+

    TEACHER CLICKS "Accept & Generate Plans":
            |
            v
    For each day with ELOs:
      -> Queue a lesson plan generation job (via existing /ws/lesson-plan)
      -> Pre-fill formData from ELO metadata (grade, subject, topic, strand)
      -> Jobs run sequentially via existing queue system
            |
            v
    Teacher gets individual lesson plans for the week

    TEACHER CLICKS "Edit":
            |
            v
    Inline editor: drag-drop ELOs between days, remove/add
      -> Save edited version
      -> Then "Accept & Generate Plans" with edited version
```

### Files to Create

| File                                                | Purpose                                                                                                                                                                 |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/scheduled_tasks.py`                        | Task runner: `run_all_scheduled_tasks()`, `run_elo_breakdown()`, `run_attendance_summary()`, `run_progress_report()`, `_ensure_model_loaded()`, `_unload_after_tasks()` |
| `backend/routes/scheduled.py`                       | REST endpoints: config CRUD, results CRUD, manual trigger, model unload/reload                                                                                          |
| `frontend/src/components/ScheduledTaskSettings.tsx` | Settings UI: day/time picker, task checkboxes, reminder offset                                                                                                          |

### Files to Modify

| File                                            | Changes                                                                                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `backend/main.py`                               | Register `scheduled.router`. In lifespan startup: load saved schedule, register APScheduler jobs. Add model unload/reload endpoints. |
| `backend/inference_factory.py`                  | Add `unload_all_models()`, `is_model_loaded()`                                                                                       |
| `electron/main.js`                              | Add `hide`/`show` event handlers for model offloading. Wire `show-notification` for scheduled results.                               |
| `frontend/src/components/NotificationPanel.tsx` | Add "Scheduled Results" section with toggle. Render ELO breakdown as day-by-day cards. Add Accept/Edit/Dismiss buttons.              |
| `frontend/src/contexts/NotificationContext.tsx` | Add `category?: 'regular' \| 'scheduled'` to `HistoryItem`. Add `addScheduledResult()` method.                                       |
| `frontend/src/components/Settings.tsx`          | Add "Background Schedule" section embedding `ScheduledTaskSettings`                                                                  |

### Data Structures

```sql
-- In app data SQLite (new tables)
CREATE TABLE IF NOT EXISTS scheduled_task_config (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    schedule_day TEXT NOT NULL DEFAULT 'sunday',
    schedule_time TEXT NOT NULL DEFAULT '18:00',
    reminder_offset_min INTEGER DEFAULT 60,
    tasks_enabled TEXT DEFAULT '["elo_breakdown"]',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id)
);

CREATE TABLE IF NOT EXISTS scheduled_results (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    task_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending_review',
    result_json TEXT NOT NULL,
    week_of TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TEXT
);
```

```typescript
interface ScheduledResult {
  id: string;
  task_type: "elo_breakdown" | "attendance_summary" | "progress_report";
  status: "pending_review" | "accepted" | "rejected";
  result: EloBreakdownResult | object;
  created_at: string;
  week_of: string;
}

interface EloBreakdownResult {
  week_of: string;
  days: {
    day: string;
    date: string;
    periods: {
      time: string; // "08:00-08:45"
      grade: string;
      subject: string;
      elo: {
        topic_id: string;
        topic_title: string;
        rationale: string;
      } | null; // null if no ELO assigned to this period
    }[];
  }[];
  notes: string;
}
```

---

## Feature 4: Analyse Chat (Post-Generation Enhancement)

### What It Is

An enhanced version of the existing `AIAssistantPanel` that:

1. Opens after any generation (lesson, quiz, rubric, worksheet, etc.)
2. AI greets with enhancement suggestions
3. Can enhance the full output (section-by-section with progress)
4. Can edit a single section (with full output as read-only context)
5. Has its own Quick/Deep thinking toggle
6. Supports undo (previous version stack)
7. Conversations are **ephemeral** (not persisted)

### Flow

```
Teacher generates a lesson plan
  -> Result displayed in editor
  -> [Analyse] button appears (next to existing [Assistant])
  -> Teacher clicks [Analyse]
  -> AIAssistantPanel opens in "analyse" mode
  -> Connects to /ws/analyse
  -> Sends init message with full generated content
  -> AI responds with greeting:
     "I've reviewed your lesson plan. Would you like me to:
      [Create a more detailed version]
      [Expand a specific section]
      Or ask me anything about this plan."

  SCENARIO A: Teacher clicks "Create a more detailed version" or types "yes"
    -> Frontend sends { type: "enhance" }
    -> Backend iterates through sections:
       [Progress: "Expanding objectives..."]       -> streams section
       [Progress: "Expanding main activity..."]    -> streams section
       [Progress: "Expanding assessment..."]       -> streams section
    -> Each section replaces the corresponding section in parsed output
    -> Previous version pushed to undo stack

  SCENARIO B: Teacher types "expand the assessment section"
    -> Frontend sends { type: "edit_section", target_section: "assessment", instruction: "expand" }
    -> Backend builds prompt:
       System: "Edit ONLY the assessment section. Full plan for context: {full_plan}"
       User: "Expand the assessment section with more detail"
    -> Streams ONLY the replacement text for that section
    -> Frontend replaces just that section. Previous version pushed to undo stack.

  SCENARIO C: Teacher asks a question (no edit)
    -> Normal chat response, no modifications to output

  UNDO: Teacher clicks undo button
    -> Pop from undo stack, restore previous version
    -> Only the final version is saved when teacher clicks "Save"

  CLOSE: Teacher closes Analyse panel
    -> Session memory discarded (ephemeral)
```

### Section Detection

The backend needs to identify sections in the generated output. Since lessons/quizzes are generated as markdown, sections are identified by headers:

```python
SECTION_PATTERNS = {
    "lesson": [
        ("objectives", r"##?\s*(?:Learning\s+)?Objectives?"),
        ("introduction", r"##?\s*Introduction|Opening|Warm.?up"),
        ("main_activity", r"##?\s*(?:Main\s+)?Activit(?:y|ies)"),
        ("assessment", r"##?\s*Assessment|Evaluation"),
        ("differentiation", r"##?\s*Differentiation"),
        ("materials", r"##?\s*Materials|Resources"),
        ("closure", r"##?\s*Clos(?:ure|ing)"),
    ],
    "quiz": [
        ("instructions", r"##?\s*Instructions"),
        ("questions", r"##?\s*Questions?"),
        ("answer_key", r"##?\s*Answer\s+Key"),
    ],
    # ... similar for rubric, worksheet, etc.
}

def detect_sections(content: str, content_type: str) -> List[Section]:
    """Split generated content into named sections by markdown headers."""
```

### Files to Create

| File                        | Purpose                                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/analyse_memory.py` | In-memory session store. `AnalyseMemory` class with `create_session()`, `add_message()`, `get_context()`, `close_session()`. No SQLite -- pure dict. |

### Files to Modify

| File                                                 | Changes                                                                                                                                                                                                                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/main.py`                                    | Add `/ws/analyse` WebSocket handler. Handles message types: `init`, `enhance`, `edit_section`, `chat`.                                                                                                                                                                 |
| `frontend/src/components/AIAssistantPanel.tsx`       | Add `analyse` mode. Add `onSectionUpdate` callback prop. Add thinking toggle (Quick/Deep). Handle `progress`/`section_token`/`section_done`/`enhance_complete` WS messages. Add undo button. Expand `contentType` to include `worksheet`, `presentation`, `storybook`. |
| `frontend/src/components/LessonPlanner.tsx`          | Add [Analyse] button. Pass `mode="analyse"` to AIAssistantPanel. Add undo stack state: `lessonHistory: string[]`. Implement `onSectionUpdate` handler.                                                                                                                 |
| `frontend/src/components/QuizGenerator.tsx`          | Same as LessonPlanner                                                                                                                                                                                                                                                  |
| `frontend/src/components/RubricGenerator.tsx`        | Same pattern                                                                                                                                                                                                                                                           |
| `frontend/src/components/WorksheetGenerator.tsx`     | Same pattern                                                                                                                                                                                                                                                           |
| `frontend/src/components/CrossCurricularPlanner.tsx` | Same pattern                                                                                                                                                                                                                                                           |
| `frontend/src/components/MultigradePlanner.tsx`      | Same pattern                                                                                                                                                                                                                                                           |
| `frontend/src/components/KindergartenPlanner.tsx`    | Same pattern                                                                                                                                                                                                                                                           |
| `frontend/src/components/PresentationBuilder.tsx`    | Same pattern                                                                                                                                                                                                                                                           |
| `frontend/src/components/StoryBookCreator.tsx`       | Same pattern                                                                                                                                                                                                                                                           |

### Backend `/ws/analyse` Endpoint Design

```python
@app.websocket("/ws/analyse")
async def analyse_ws(websocket: WebSocket):
    await websocket.accept()
    analyse_mem = get_analyse_memory()  # singleton

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")
            session_id = data.get("session_id")

            if msg_type == "init":
                # Store content in memory, send greeting
                analyse_mem.create_session(
                    session_id,
                    content=data["content"],
                    content_type=data["content_type"]
                )
                greeting = build_analyse_greeting(data["content_type"])
                await websocket.send_json({"type": "greeting", "content": greeting})

            elif msg_type == "enhance":
                # Section-by-section enhancement with progress
                session = analyse_mem.get_session(session_id)
                sections = detect_sections(session.content, session.content_type)
                thinking_mode = data.get("thinking_mode", "deep")

                for section in sections:
                    await websocket.send_json({
                        "type": "progress",
                        "section": section.id,
                        "label": f"Expanding {section.name}..."
                    })

                    prompt = build_section_enhance_prompt(
                        full_content=session.content,
                        section=section,
                        content_type=session.content_type,
                        thinking_mode=thinking_mode,
                    )

                    inference = resolve_inference_for_task("analyse")
                    accumulated = ""
                    async for chunk in inference.generate_stream(
                        tool_name="analyse",
                        input_data=section.name,
                        prompt_template=prompt,
                        max_tokens=1500 if thinking_mode == "quick" else 3000,
                        temperature=0.5,
                    ):
                        if chunk.get("token"):
                            accumulated += chunk["token"]
                            await websocket.send_json({
                                "type": "section_token",
                                "section": section.id,
                                "content": chunk["token"]
                            })
                        if chunk.get("finished"):
                            break

                    await websocket.send_json({
                        "type": "section_done",
                        "section": section.id,
                        "content": accumulated
                    })

                await websocket.send_json({"type": "enhance_complete"})

            elif msg_type == "edit_section":
                # Edit a single section with full context
                session = analyse_mem.get_session(session_id)
                target = data["target_section"]
                instruction = data.get("instruction", "Make this section more detailed")
                thinking_mode = data.get("thinking_mode", "quick")

                prompt = build_section_edit_prompt(
                    full_content=session.content,
                    target_section=target,
                    instruction=instruction,
                    content_type=session.content_type,
                )

                inference = resolve_inference_for_task("analyse")
                accumulated = ""
                async for chunk in inference.generate_stream(...):
                    if chunk.get("token"):
                        accumulated += chunk["token"]
                        await websocket.send_json({
                            "type": "section_token",
                            "section": target,
                            "content": chunk["token"]
                        })
                    if chunk.get("finished"):
                        break

                # Update session content with the edit
                analyse_mem.update_section(session_id, target, accumulated)
                await websocket.send_json({
                    "type": "section_done",
                    "section": target,
                    "content": accumulated
                })

            elif msg_type == "chat":
                # Normal chat about the content (no modification)
                session = analyse_mem.get_session(session_id)
                # ... standard streaming chat with content as context

            elif msg_type == "close":
                analyse_mem.close_session(session_id)

    except WebSocketDisconnect:
        if session_id:
            analyse_mem.close_session(session_id)
```

### Section Edit Prompt Pattern

```python
def build_section_edit_prompt(full_content, target_section, instruction, content_type):
    """AI receives full context but outputs ONLY the target section."""
    return f"""You are editing a {content_type} for a Caribbean primary school teacher.

FULL {content_type.upper()} (read-only context -- do NOT reproduce the entire document):
---
{full_content}
---

TASK: Rewrite ONLY the "{target_section}" section based on this instruction:
{instruction}

RULES:
- Output ONLY the replacement text for the {target_section} section
- Do NOT include headers or content from other sections
- Maintain the same formatting style (markdown)
- Keep it coherent with the rest of the document
- Be more detailed and thorough than the original"""
```

---

## Feature 5: Unified Calendar Hub + Weekly Timetable

### What It Is

Merge the currently separate **School Year Calendar** (sidebar tab) and **Curriculum Plan** (sidebar tab) into a single unified tab, and add a **Weekly Timetable** as a third view. Teachers flip between the three views using a `NeuroSegment` toggle (same pattern as SupportReporting).

**Currently:**

- `school-year-calendar` tab: Calendar with events (quizzes, assignments, deadlines)
- `curriculum-plan` tab: Assign ELOs to phases

**After:**

- Single `planning-hub` tab with 3 views flipped via NeuroSegment:
  1. **School Year** -- the existing SchoolYearCalendar
  2. **Curriculum Plan** -- the existing CurriculumPlan (ELO-to-phase assignment)
  3. **Weekly Timetable** -- NEW: teacher's class schedule (which classes on which days/periods)

The Weekly Timetable is critical because it feeds into the scheduled ELO breakdown (Feature 3C). Without knowing when the teacher teaches Grade 3 Math vs Grade 4 English, the AI can't propose a realistic day-by-day plan.

### Flow

```
Dashboard sidebar:
  "Planning Hub" (single tab, replaces two separate tabs)
      |
      v
  +-------------------------------------------------------+
  | Planning Hub                                          |
  |                                                       |
  | [School Year]  [Curriculum Plan]  [Weekly Timetable]  |  <-- NeuroSegment
  |                                                       |
  |  (active view renders below)                          |
  +-------------------------------------------------------+

SCHOOL YEAR VIEW (existing SchoolYearCalendar):
  - Monthly calendar with events
  - Phase definitions (Term 1 Early, Midterm, etc.)
  - No changes to functionality

CURRICULUM PLAN VIEW (existing CurriculumPlan):
  - ELOs assigned to phases
  - Phase progress tracking
  - No changes to functionality

WEEKLY TIMETABLE VIEW (NEW):
  +-------------------------------------------------------+
  |         Mon      Tue      Wed      Thu      Fri       |
  | 8:00  [Gr3 Math] [      ] [Gr3 Math] [      ] [Gr3 Math]
  | 8:45  [        ] [Gr4 En] [        ] [Gr4 En] [      ]
  | 9:30  [Gr3 Sci ] [Gr4 Sc] [Gr3 Sci ] [      ] [Gr3 Sci]
  | 10:15 --- Break ---                                    |
  | 10:30 [Gr3 En  ] [      ] [Gr3 En  ] [Gr4 Ma] [      ]
  | ...                                                    |
  +-------------------------------------------------------+

  Teacher fills in their timetable:
    - Click a cell -> dropdown: pick class (Grade 3), subject (Math)
    - Set period times (configurable start/end, duration)
    - Periods can be color-coded by subject
    - Saved to SQLite (teacher_timetable table)
```

### How Timetable Feeds Into ELO Breakdown (Feature 3C)

When the scheduled ELO breakdown runs, it now has the timetable:

```
STEP 1 (GATHER DATA) now includes:
  +-> GET /api/timetable/{teacher_id}
  |   Returns: [
  |     {day: "monday", period: "08:00-08:45", grade: "3", subject: "Mathematics"},
  |     {day: "monday", period: "09:30-10:15", grade: "3", subject: "Science"},
  |     {day: "tuesday", period: "08:45-09:30", grade: "4", subject: "English"},
  |     ...
  |   ]

STEP 2 (LLM PROMPT) now includes timetable:
  "WEEKLY TIMETABLE:
   Monday:
     08:00-08:45: Grade 3 Mathematics
     09:30-10:15: Grade 3 Science
     10:30-11:15: Grade 3 English
   Tuesday:
     08:45-09:30: Grade 4 English
     09:30-10:15: Grade 4 Science
   ...

   PENDING ELOs:
   - [Grade 3 Math] Fractions: Number strand (in_progress)
   ...

   Assign ELOs to specific periods. Each ELO must match
   the correct grade+subject for that period."

STEP 3 (LLM OUTPUT) now includes period times:
  {
    "week_of": "2026-04-13",
    "days": [
      {
        "day": "Monday",
        "date": "2026-04-13",
        "periods": [
          {
            "time": "08:00-08:45",
            "grade": "3",
            "subject": "Mathematics",
            "elo": {
              "topic_id": "ms-frac-01",
              "topic_title": "Fractions - Equivalent",
              "rationale": "Builds on last week's denominator work"
            }
          },
          {
            "time": "09:30-10:15",
            "grade": "3",
            "subject": "Science",
            "elo": {
              "topic_id": "sc-plants-02",
              "topic_title": "Plant Life Cycles",
              "rationale": "Prerequisite for next week's ecology unit"
            }
          }
        ]
      },
      ...
    ],
    "notes": "No Grade 4 Math ELOs pending -- period on Thursday left open."
  }
```

### Files to Create

| File                                          | Purpose                                                                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `frontend/src/components/PlanningHub.tsx`     | Wrapper component with NeuroSegment toggle, renders SchoolYearCalendar / CurriculumPlan / WeeklyTimetable based on active view |
| `frontend/src/components/WeeklyTimetable.tsx` | New timetable grid component. Interactive cells, period config, class/subject assignment.                                      |
| `backend/routes/timetable.py`                 | REST endpoints: `GET/POST /api/timetable/{teacher_id}`, `GET /api/timetable/{teacher_id}/periods`                              |

### Files to Modify

| File                                    | Changes                                                                                                                                                                                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/components/Dashboard.tsx` | Replace `school-year-calendar` and `curriculum-plan` sidebar entries with single `planning-hub` entry. Update `SINGLE_INSTANCE_TABS`, `HIDE_TAB_COUNTER`, tab rendering switch-case. Remove old imports, add `PlanningHub` lazy import. |
| `backend/main.py`                       | Register `timetable.router`                                                                                                                                                                                                             |
| `backend/scheduled_tasks.py`            | `run_elo_breakdown()` now fetches timetable data and includes it in the LLM prompt                                                                                                                                                      |

### Data Structures

```sql
-- New table in app data SQLite
CREATE TABLE IF NOT EXISTS teacher_timetable (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    day_of_week TEXT NOT NULL,         -- monday, tuesday, ...
    period_start TEXT NOT NULL,         -- HH:MM (e.g., "08:00")
    period_end TEXT NOT NULL,           -- HH:MM (e.g., "08:45")
    grade TEXT,                         -- "3", "4", etc.
    subject TEXT,                       -- "Mathematics", "English", etc.
    class_name TEXT,                    -- optional: "Grade 3A"
    room TEXT,                          -- optional
    color TEXT,                         -- hex color for UI
    is_break INTEGER DEFAULT 0,        -- 1 if this is a break period
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS timetable_period_config (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    period_index INTEGER NOT NULL,      -- 0, 1, 2, ... (order)
    start_time TEXT NOT NULL,           -- HH:MM
    end_time TEXT NOT NULL,             -- HH:MM
    label TEXT,                         -- "Period 1", "Break", etc.
    is_break INTEGER DEFAULT 0,
    UNIQUE(teacher_id, period_index)
);
```

```typescript
interface TimetableSlot {
  id: string;
  day_of_week: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
  period_start: string; // "08:00"
  period_end: string; // "08:45"
  grade: string;
  subject: string;
  class_name?: string;
  room?: string;
  color?: string;
  is_break: boolean;
}

interface PeriodConfig {
  period_index: number;
  start_time: string;
  end_time: string;
  label: string;
  is_break: boolean;
}

// Updated ELO breakdown result (Feature 3C)
interface EloBreakdownResult {
  week_of: string;
  days: {
    day: string;
    date: string;
    periods: {
      time: string; // "08:00-08:45"
      grade: string;
      subject: string;
      elo: {
        topic_id: string;
        topic_title: string;
        rationale: string;
      } | null; // null if no ELO assigned to this period
    }[];
  }[];
  notes: string;
}
```

### WeeklyTimetable.tsx Component Design

```
+-------------------------------------------------------------------+
| Weekly Timetable                           [Configure Periods]     |
|-------------------------------------------------------------------|
|         | Monday    | Tuesday   | Wednesday | Thursday  | Friday  |
|---------|-----------|-----------|-----------|-----------|---------|
| 8:00    | [Gr3 Math]| [       ] | [Gr3 Math]| [       ] | [Gr3 M]|
|         |  #3b82f6  |           |  #3b82f6  |           | #3b82f6|
|---------|-----------|-----------|-----------|-----------|---------|
| 8:45    | [       ] | [Gr4 Eng] | [       ] | [Gr4 Eng] | [     ]|
|         |           |  #22c55e  |           |  #22c55e  |        |
|---------|-----------|-----------|-----------|-----------|---------|
| 9:30    | [Gr3 Sci] | [Gr4 Sci] | [Gr3 Sci] | [       ] | [Gr3 S]|
|---------|-----------|-----------|-----------|-----------|---------|
| 10:15   |  ~~~~~~~~ B R E A K ~~~~~~~~                            |
|---------|-----------|-----------|-----------|-----------|---------|
| 10:30   | [Gr3 Eng] | [       ] | [Gr3 Eng] | [Gr4 Mat] | [     ]|
+-------------------------------------------------------------------+

Click empty cell -> Popover:
  [Grade: ▼ Grade 3 ]  [Subject: ▼ Mathematics ]  [Class: Gr3A (opt)]
  [Color: #3b82f6]
  [Save]

[Configure Periods] -> Modal:
  Period 1: 08:00 - 08:45
  Period 2: 08:45 - 09:30
  Period 3: 09:30 - 10:15
  Break:    10:15 - 10:30
  Period 4: 10:30 - 11:15
  ...
  [+ Add Period]  [Save]
```

### Implementation Approach

1. **Phase 1 -- PlanningHub wrapper**:
   - Create `PlanningHub.tsx` with NeuroSegment (3 options: School Year, Curriculum Plan, Weekly Timetable)
   - Renders existing `SchoolYearCalendar` and `CurriculumPlan` unchanged
   - Renders placeholder for `WeeklyTimetable`
   - Update `Dashboard.tsx`: merge two sidebar entries into one `planning-hub`

2. **Phase 2 -- Timetable backend**:
   - Create `routes/timetable.py` with CRUD endpoints
   - Create SQLite tables in school_year_service or a new timetable_service
   - Wire into `main.py`

3. **Phase 3 -- WeeklyTimetable component**:
   - Grid layout (CSS Grid: rows = periods, cols = days)
   - Click-to-edit cells with popover
   - Period configuration modal
   - Color-coded by subject
   - Persist via REST endpoints

4. **Phase 4 -- Wire to ELO breakdown**:
   - Update `scheduled_tasks.run_elo_breakdown()` to fetch timetable
   - Update LLM prompt to include period-specific scheduling
   - Update `EloBreakdownResult` type to include periods

---

## Feature 6: Coworker Long-Term Memory (Cross-Conversation Recall)

### What It Is

Ask Coworker currently remembers within a single conversation (via the 3-tier summary system) but starts every new conversation blank. This feature adds a **teacher memory layer** that persists key facts across conversations, so Coworker recalls preferences, patterns, and context over time.

### Key Design Decisions

- **No extra LLM call**: Memory extraction piggybacks on the existing `maybe_update_summary()` call that already fires every ~10 messages. The summary prompt is expanded to also extract key facts. Zero additional overhead.
- **TF-IDF similarity search**: Uses scikit-learn's `TfidfVectorizer` for fuzzy matching (e.g., "collaborative" matches "group activities"). ~5ms per search, ~10-20ms first load (done in background on startup).
- **New pip dependency**: `scikit-learn` (add to `requirements.txt`)

### Flow

```
MEMORY EXTRACTION (piggybacks on existing summary generation):

Teacher chats with Coworker (10+ messages)
  -> maybe_update_summary() fires (already exists)
  -> Expanded prompt: "Summarize AND extract 2-3 key facts about
     the teacher's preferences, struggles, or teaching context."
  -> LLM returns:
     {
       "summary": "Teacher discussed fraction strategies for Grade 3...",
       "key_facts": [
         "Teacher prefers group activities over individual worksheets",
         "Grade 3 class is behind on fractions - needs extra practice",
         "Teacher uses storytelling approach for engagement"
       ]
     }
  -> Summary saved as before (existing flow, unchanged)
  -> Key facts saved to teacher_memories table (NEW)
     - Deduplicated: if a similar fact already exists (TF-IDF similarity > 0.85), skip it
     - Contradictions: LLM detects if new fact contradicts an existing one -> replaces it
       (e.g., "struggling with math" replaced by "now confident in math")
     - Up to 10 existing memories passed into the prompt for contradiction checking

MEMORY RECALL (every new chat message):

Teacher sends message in a new (or existing) conversation
  -> Before building the prompt:
     1. TF-IDF vectorizer searches teacher_memories for relevance
     2. Top 3-5 memories (similarity > threshold) selected
     3. Injected into system prompt as a [Teacher Context] block
  -> System prompt now includes:
     "[Known about this teacher:
       - Prefers group activities over individual worksheets
       - Grade 3 class behind on fractions
       - Uses storytelling for engagement]"
  -> Coworker's response is informed by long-term context

MEMORY LIFECYCLE:
  - Memories accumulate over time (max ~200 per teacher)
  - If over limit, oldest memories with lowest access count are pruned
  - Teacher can view/delete memories in Settings (optional, future)
```

### Files to Create

| File                        | Purpose                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `backend/teacher_memory.py` | `TeacherMemory` class: SQLite storage, TF-IDF search, deduplication, extraction prompt builder. Singleton. |

### Files to Modify

| File                         | Changes                                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `backend/chat_memory.py`     | Modify `maybe_update_summary()` to use expanded prompt that also extracts key facts. After summary is saved, pass key facts to `TeacherMemory.save_facts()`. |
| `backend/main.py` `/ws/chat` | Before building prompt: call `TeacherMemory.recall(teacher_id, user_message)` to get relevant memories. Inject into system prompt.                           |
| `backend/requirements.txt`   | Add `scikit-learn`                                                                                                                                           |

### Data Structures

```sql
CREATE TABLE IF NOT EXISTS teacher_memories (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL,
    fact TEXT NOT NULL,                  -- "Prefers group activities"
    source_chat_id TEXT,                -- which conversation extracted this
    access_count INTEGER DEFAULT 0,     -- how many times recalled
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_accessed TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teacher_memories_teacher
    ON teacher_memories(teacher_id);
```

```python
class TeacherMemory:
    def __init__(self, db_path=None):
        self.db_path = db_path or str(_get_db_path())
        self._init_db()
        self._vectorizer = None  # lazy-loaded TfidfVectorizer
        self._memory_vectors = {}  # teacher_id -> (matrix, fact_ids)

    def save_facts(self, teacher_id: str, facts: List[str], source_chat_id: str,
                   replacements: List[Dict] = None):
        """Save extracted facts, deduplicating and applying contradiction replacements."""
        existing = self._get_all_facts(teacher_id)

        # Apply replacements first (contradicted facts)
        if replacements:
            for r in replacements:
                old_id = r.get("old_id")
                new_fact = r.get("new_fact")
                if old_id and new_fact:
                    self._replace_fact(old_id, new_fact, source_chat_id)

        # Then save genuinely new facts (skip duplicates via TF-IDF > 0.85)
        for fact in facts:
            if self._is_duplicate(fact, existing):
                continue
            self._insert_fact(teacher_id, fact, source_chat_id)
        self._invalidate_vectors(teacher_id)

    def recall(self, teacher_id: str, query: str, top_k: int = 5, threshold: float = 0.15) -> List[str]:
        """Find memories relevant to the query using TF-IDF similarity."""
        self._ensure_vectors(teacher_id)
        # cosine similarity between query vector and all memory vectors
        # return top_k facts above threshold

    def _ensure_vectors(self, teacher_id: str):
        """Build/rebuild TF-IDF vectors for a teacher's memories. ~10-20ms."""
        if teacher_id in self._memory_vectors:
            return
        facts = self._get_all_facts(teacher_id)
        if not facts:
            return
        from sklearn.feature_extraction.text import TfidfVectorizer
        self._vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
        # ... fit and transform
```

### Memory Contradiction Handling (Hybrid: TF-IDF pre-filter + LLM judge)

When extracting new facts, the system also checks for contradictions with existing memories — all inside the **same background LLM call** that generates the summary. Zero extra calls, zero latency impact.

```
FLOW (all inside fire-and-forget background task):

1. maybe_update_summary() fires (every ~10 messages)
2. Extract conversation text (existing step)
3. TF-IDF search: find top 10 existing memories similar to conversation topics
4. Build prompt that includes:
   - Conversation text (for summary + fact extraction)
   - Top 10 existing memories (for contradiction detection)
5. Single LLM call returns:
   - summary (as before)
   - new_facts: ["Now confident teaching math"]
   - replace: [{"old_id": "mem_abc", "reason": "contradicted", "new": "Now excelling at Grade 3 Math"}]
6. Apply: save new facts, replace contradicted facts, leave non-contradicted alone
```

### Expanded Summary Prompt (modified `maybe_update_summary`)

```python
# In chat_memory.py, modify the summary_instruction:
system_text = (
    "You are a conversation analyzer. Do THREE things:\n"
    "1. Write a concise 2-4 sentence SUMMARY of this conversation.\n"
    "2. Extract 1-3 KEY FACTS about the teacher that would be useful to "
    "remember for future conversations (preferences, struggles, teaching "
    "style, classroom context). Only specific, actionable facts.\n"
    "3. Check if any new facts CONTRADICT or UPDATE the existing memories "
    "listed below. If so, mark the old memory for replacement.\n\n"
    "EXISTING MEMORIES (may be empty if new teacher):\n"
    "{existing_memories_block}\n\n"
    "Output as JSON:\n"
    '{"summary": "...", '
    '"new_facts": ["fact 1", "fact 2"], '
    '"replace": [{"old_id": "...", "new_fact": "updated fact"}]}\n'
    "If no new facts, return empty arrays. "
    "If no contradictions, return empty replace array."
)
```

### Memory Injection in Chat

```python
# In main.py /ws/chat, after building system_prompt and before building the full prompt:
from teacher_memory import get_teacher_memory
teacher_mem = get_teacher_memory()
teacher_id = message_data.get("teacher_id", "default_teacher")
recalled = teacher_mem.recall(teacher_id, user_message, top_k=5)
if recalled:
    memory_block = "\n\n[Known about this teacher:\n"
    for fact in recalled:
        memory_block += f"  - {fact}\n"
    memory_block += "]"
    system_prompt += memory_block
```

### Performance Budget

| Operation               | When                                                | Latency   | Impact                              |
| ----------------------- | --------------------------------------------------- | --------- | ----------------------------------- |
| TF-IDF vectorizer build | First message of session (or after new facts saved) | ~10-20ms  | Background, one-time                |
| Memory recall (search)  | Every chat message                                  | ~5ms      | Negligible                          |
| Fact extraction         | Every ~10 messages (piggybacks on summary)          | 0ms extra | Same LLM call, just expanded prompt |
| Memory injection        | Every chat message                                  | <1ms      | ~50-150 extra tokens in prompt      |

---

## Feature 6 Tightening (applied before ship)

The following refinements apply to Feature 6 and must be implemented as part of the same phase — they are not optional polish.

### 1. Token-cap the recalled memory block

The `[Known about this teacher:]` block must be hard-capped at **~200 tokens** and counted against `build_context_budgeted()` (Feature 1). Otherwise F6 silently eats the context budget on Tier 1 models.

- Cap enforced in `teacher_memory.recall()` by trimming facts from the end until `_estimate_tokens(block) <= 200`.
- `build_context_budgeted()` is passed the recalled block length so it can shrink recent pairs accordingly.

### 2. Raise the similarity threshold

The plan's default of `threshold=0.15` is too permissive for TF-IDF cosine similarity — it injects weakly related noise. New defaults:

- `threshold = 0.28` for normal queries
- **Short-query fallback**: if `len(user_message.split()) < 5`, bypass similarity and return the 2 most-recently-accessed facts instead (TF-IDF is unreliable on 1-4 word queries).

### 3. Privacy kill-switch (MANDATORY before ship)

Teachers must be able to disable and wipe long-term memory.

- Settings: add `memoryEnabled: boolean` (default `true`) under a new "Personalization" section.
- Settings: add "Forget everything Coworker remembers about me" button -> calls `DELETE /api/teacher-memory/all`.
- Backend: if `memoryEnabled` is false in the incoming WS payload, skip `teacher_mem.recall()` AND skip `save_facts()` extraction entirely (the expanded summary prompt falls back to its original summary-only form).

### 4. Add a `source` column to `teacher_memories`

Required so Feature 7 can also write facts into the same table without ambiguity.

```sql
ALTER TABLE teacher_memories ADD COLUMN source TEXT NOT NULL DEFAULT 'chat';
-- values: 'chat' | 'profile' | 'manual'
```

Recall can then filter or weight by source. Settings-synced facts (`source='profile'`) are refreshed whenever Settings change, not accumulated.

### 5. Feature-context signal in recall

`recall()` must accept a `feature_context` parameter (`"chat" | "lesson_planner" | "grading" | "insights" | ...`) and bias results toward facts tagged with that context. Implementation:

- Add optional `contexts` column (TEXT, comma-separated tags) to `teacher_memories`.
- At recall time, facts matching `feature_context` get a +0.1 similarity bonus before top-k selection.
- Facts with no tags are treated as universally relevant (no bonus, no penalty).

### 6. Contradiction flagging (not silent override)

When F6 (dynamic) disagrees with F7 (static profile) — e.g., profile says Grade 3 but chat extracted "now teaching Grade 4" — the system must **flag**, not silently replace:

- Dynamic fact is stored with `source='chat'` as normal.
- A `conflicts_with` column (nullable TEXT, references a profile field name) records the conflict.
- On next chat injection, both are injected with a marker: `"[Teacher profile says Grade 3, but recent conversations suggest Grade 4 — ask for clarification if relevant.]"`
- Teacher can resolve in Settings (future: conflict review UI).

---

## Feature 7: Static Profile Context (Adaptive Coworker)

### Goal

Make the coworker feel personalized from the very first message of a brand-new install — before Feature 6 has had any chance to accumulate conversation-derived facts. Feature 7 injects a **feature-aware block of deterministic profile facts** into the system prompt, drawn only from an explicit allowlist of Settings fields.

This is prompt-level only. No sampling-parameter tuning (no temperature slider, no top_p, no max_tokens adjustment per user). The same inference call — only the system prompt changes.

### How it differs from Feature 6

|                  | Feature 6 (Long-Term Memory)      | Feature 7 (Static Profile Context)     |
| ---------------- | --------------------------------- | -------------------------------------- |
| Source           | Extracted from conversations      | Read from Settings / SetupWizard       |
| Storage          | `teacher_memories` table (TF-IDF) | In-memory, rebuilt on Settings change  |
| Lifecycle        | Accumulates, deduplicates, decays | Deterministic, always current          |
| Needed on day 1? | No (empty until ~10 messages)     | **Yes** — works on first message       |
| Retrieval        | Similarity search                 | Direct field lookup by feature context |

They are complementary. F7 gives Coworker the "who are you" baseline; F6 gives Coworker the "what have we talked about" layer on top.

### Allowlist (ONLY these fields ever reach the model)

From `SettingsContext.Settings`:

| Field                            | Why it's safe                             | Used in context blocks                                            |
| -------------------------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `profile.displayName`            | Public-facing name teacher set themselves | chat, all                                                         |
| `profile.coworkerName`           | The AI's own name                         | all (for self-reference)                                          |
| `profile.gradeSubjects`          | Core teaching context                     | lesson_planner, curriculum, grading, chat                         |
| `profile.filterContentByProfile` | Signal for scope strictness               | lesson_planner, curriculum                                        |
| `language` (`en`/`fr`/`es`)      | Response language                         | all                                                               |
| `tutorials.enabledModules`       | What features they actually use           | chat (light touch — "they don't use Storybook, don't suggest it") |

### Explicit denylist (NEVER injected)

These are either PII, secrets, OS/UI settings, or irrelevant to the model:

- `oakKey` (license secret)
- `profile.school` (institutional PII — excluded by default; can be enabled per-teacher in future)
- `profile.registrationDate`
- `aiModel`, `theme`, `sidebarColor`, `tabColors`, `fontSize`, `brightness`, `warmTone`, `warmToneEnabled`
- `minimizeToTray`, `startOnBoot`, `fileAccessEnabled`, `autoCloseTabsOnExit`
- `spellCheckEnabled`, `autocorrectEnabled`, `autoFinishEnabled`, `dictionaryEnabled`
- `thinkingEnabled` (removed by Feature 2)
- `notifications.*`, `nudgeState.*`, `discoveredFeatures`, `workflowProgress.*`
- `sidebarOrder.*` (UI arrangement)
- `showTrophiesByDefault`
- `generationMode`
- Legacy fields: `teacherSubjects`, `teacherGradeLevels`, `profile.gradeLevels`, `profile.subjects`

The allowlist is maintained as a constant in backend code — **any field not on the allowlist is never forwarded to the model**, even if the frontend accidentally includes it in the payload.

### Feature-aware scoping

Different tools need different slices of the profile. The frontend sends a `feature_context` string with every inference request; the backend selects which allowlisted fields to inject.

| `feature_context`                                                                          | Fields injected                                                     |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `chat`                                                                                     | displayName, coworkerName, gradeSubjects (summary), language        |
| `lesson_planner`, `kindergarten_planner`, `multigrade_planner`, `cross_curricular_planner` | displayName, gradeSubjects (full), filterContentByProfile, language |
| `curriculum`, `curriculum_tracker`                                                         | gradeSubjects (full), filterContentByProfile, language              |
| `quiz_generator`, `rubric_generator`, `worksheet_generator`                                | gradeSubjects (relevant grade only, from tool state), language      |
| `grading`, `analyse`                                                                       | displayName, gradeSubjects (relevant grade), language               |
| `insights`, `performance_metrics`                                                          | displayName, language                                               |
| `image_studio`, `presentation_builder`, `brain_dump`                                       | language only                                                       |
| `support`, `settings`                                                                      | none (never personalize these)                                      |

"Relevant grade only" means: if the user is in Grade 3 Quiz Generator, only the Grade 3 subjects are injected — not the entire `gradeSubjects` map. This keeps the block small and on-topic.

### Flow

```
Frontend sends WS payload:
  { message, feature_context: "lesson_planner", grade_hint: "grade3", ... }

Backend /ws/chat (and other inference endpoints):
  1. profile_context.build_block(settings_snapshot, feature_context, grade_hint)
       -> returns e.g.:
          "[Teacher Profile:
            - Name: Sarah
            - Teaching: Grade 3 (Mathematics, Language Arts, Science)
            - Response language: English
            - Strict curriculum scope: yes]"
  2. system_prompt = base_prompt + profile_block + (F6 memory block if any)
  3. Count tokens of combined blocks; pass to build_context_budgeted()
  4. Inference proceeds unchanged
```

### Files to Create

| File                         | Purpose                                                                                                                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `backend/profile_context.py` | `ProfileContextBuilder` class. Holds allowlist + denylist constants, `build_block(settings, feature_context, grade_hint)` returning `(block_text, token_estimate)`. Pure function — no DB, no state. |

### Files to Modify

| File                                                                                 | Changes                                                                                                                                                           |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/components/Chat.tsx`                                                   | Include `feature_context: "chat"` in WS payload                                                                                                                   |
| `frontend/src/components/LessonPlanner.tsx` (and sibling planners)                   | Include `feature_context: "lesson_planner"` + `grade_hint` in generation requests                                                                                 |
| `frontend/src/components/WorksheetGenerator.tsx`, `QuizGenerator`, `RubricGenerator` | Include relevant `feature_context` + `grade_hint`                                                                                                                 |
| `frontend/src/contexts/SettingsContext.tsx`                                          | Expose a `getProfileSnapshot()` helper that returns ONLY the allowlisted fields (frontend-side first filter — defense in depth)                                   |
| `backend/main.py` — all inference endpoints                                          | Call `profile_context.build_block()`, concatenate into system prompt after base prompt, before F6 memory. Pass combined block size to `build_context_budgeted()`. |
| `backend/profile_context.py`                                                         | New file (see above)                                                                                                                                              |

### Allowlist enforcement (defense in depth)

```python
# backend/profile_context.py
PROFILE_ALLOWLIST = frozenset([
    "profile.displayName",
    "profile.coworkerName",
    "profile.gradeSubjects",
    "profile.filterContentByProfile",
    "language",
    "tutorials.enabledModules",
])

def _sanitize(settings: dict) -> dict:
    """Drop every field not on the allowlist. Run at the boundary."""
    out = {}
    for path in PROFILE_ALLOWLIST:
        node = settings
        for part in path.split("."):
            if not isinstance(node, dict) or part not in node:
                node = None
                break
            node = node[part]
        if node is not None:
            _set_nested(out, path, node)
    return out
```

The backend **never** trusts the frontend to filter. Even if Chat.tsx sends the entire Settings object, only allowlisted keys reach the prompt builder.

### Token budget for Feature 7

| Context                                | Expected block size                                  |
| -------------------------------------- | ---------------------------------------------------- |
| Minimum (image_studio — language only) | ~8 tokens                                            |
| Chat / light                           | ~40-60 tokens                                        |
| Lesson planner / full profile          | ~80-120 tokens                                       |
| Hard cap                               | 150 tokens (truncate gradeSubjects list if exceeded) |

Counted against `build_context_budgeted()` alongside F6 (which is capped at ~200 tokens). Combined personalization overhead: **max ~350 tokens**.

### Interaction with Feature 6

- F7 block is injected **first** (before F6). Coworker sees the static ground truth before the dynamic recall layer.
- F6 skips extracting facts that are already covered by F7 (e.g., don't re-extract "teaches Grade 3" if `gradeSubjects` already has it). Implemented by passing the F7 block into the expanded summary prompt as a "known facts — do not re-extract" list.
- Contradictions between F7 (profile says Grade 3) and F6 (chat extracted Grade 4) are flagged per Feature 6 Tightening item 6, not silently resolved.

### Non-goals (explicitly out of scope)

- **No temperature / sampling slider.** Per decision: prompt-level only.
- **No learning from profile edits.** F7 is stateless — edits take effect on next inference with no migration.
- **No cloud sync.** Allowlist filtering happens server-side in the local backend; nothing leaves the machine.
- **No per-user analytics on what got injected.** No telemetry on profile block contents.

---

## Implementation Order

| Phase | Feature                                                           | Est. Effort | Risk                                                                                         |
| ----- | ----------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| 1     | Feature 1: Context Budgeting                                      | 0.5 day     | Low -- additive, backward compatible                                                         |
| 2     | Feature 6: Coworker Long-Term Memory (incl. tightening items 1-6) | 2 days      | Medium -- expanded summary prompt + TF-IDF search + privacy toggle + source/contexts columns |
| 3     | Feature 7: Static Profile Context                                 | 0.5 day     | Low -- pure prompt injection with allowlist                                                  |
| 4     | Feature 2: Thinking Controls                                      | 1 day       | Low -- mostly frontend + prompt routing                                                      |
| 5     | Feature 5A: PlanningHub wrapper (merge 2 tabs + shell)            | 0.5 day     | Low -- wrapping existing components                                                          |
| 6     | Feature 5B: Timetable backend + WeeklyTimetable component         | 2 days      | Medium -- new CRUD + interactive grid UI                                                     |
| 7     | Feature 3A: Model Offloading                                      | 1 day       | Medium -- GC behavior, reload timing                                                         |
| 8     | Feature 4: Analyse Chat                                           | 2-3 days    | Medium -- new WS endpoint + panel enhancement                                                |
| 9     | Feature 3B: Schedule Config                                       | 1 day       | Low -- APScheduler already exists                                                            |
| 10    | Feature 3C: ELO Breakdown Task (uses timetable)                   | 2 days      | Medium -- LLM prompt engineering + review UI                                                 |
| 11    | Feature 3D: Attendance + Progress Tasks                           | 1 day       | Low -- follow ELO pattern                                                                    |
| 12    | Feature 3E: Notification Panel Update                             | 1 day       | Low -- extend existing components                                                            |

**Rationale for order:** Features 1, 6, and 7 form the personalization stack and must ship together — context budgeting (1) enforces the token caps that Features 6 and 7 both rely on; Feature 6 adds dynamic memory; Feature 7 adds static profile context on top. Feature 7 comes after 6 because it depends on the `source` column added by F6 tightening. Feature 2 (thinking controls) is a quick frontend win. Feature 5 (PlanningHub + Timetable) must come before ELO breakdown (3C) because timetable is a required input. Model offloading (3A) is a prerequisite for background scheduling. Feature 4 (Analyse) is the biggest UX change. Schedule infrastructure (3B-3E) layers on top last.

**Total estimated effort: ~15 days**

---

## Verification Plan

### Feature 1

- Open Ask Coworker, send 20+ messages in a conversation
- Verify with Tier 1 model: prompt length stays under 2K tokens
- Verify summary is still generated after every 10 messages
- Check no regression in chat quality

### Feature 2

- Open Chat, verify brain icon shows Quick/Deep popup
- Quick mode: responses are concise, fast
- Deep mode (Gemma): responses include step-by-step reasoning
- Verify Settings page no longer has thinking toggle
- Verify generation tabs (lesson, quiz) are unaffected

### Feature 3

- Test model offloading: minimize to tray, check Task Manager for RAM drop
- Bring app back: verify model reloads, generation works
- Set schedule: verify APScheduler job is registered
- Manually trigger ELO breakdown: verify JSON result saved
- Check NotificationPanel shows scheduled result with Accept/Edit/Dismiss
- Accept -> verify lesson plan generation jobs are queued

### Feature 4

- Generate a lesson plan, click Analyse
- Verify AI greeting appears
- Type "make it more detailed" -> verify section-by-section progress
- Type "expand the assessment" -> verify only assessment section updates
- Click undo -> verify previous version restored
- Close panel -> reopen -> verify conversation is gone (ephemeral)
- Test on quiz, rubric, worksheet generators too

### Feature 6

- Chat with Coworker about fractions for 10+ messages -> verify summary fires AND key_facts extracted
- Check SQLite `teacher_memories` table -> verify facts stored with `source='chat'`
- Start a NEW conversation -> mention "math" -> verify Coworker's response reflects recalled memory ("I remember you mentioned your Grade 3 class is behind on fractions")
- Send 5+ conversations over time -> verify memories accumulate (not duplicate)
- Verify TF-IDF fuzzy matching: store "prefers group activities", then ask about "collaborative work" -> should recall the memory
- **Tightening checks:**
  - Recalled block never exceeds ~200 tokens even with 50+ stored facts
  - Short query ("hi", "thanks") returns 2 most-recent facts, not similarity-based
  - Settings toggle "memoryEnabled = off" -> verify no recall AND no extraction on next chat
  - "Forget everything" button -> verify `teacher_memories` table emptied for that teacher_id
  - Feature_context boost: with LessonPlanner open, facts tagged `lesson_planner` should rank above untagged equivalents

### Feature 7

- Fresh install (no chat history yet): open Chat, ask a generic question -> verify Coworker addresses teacher by `displayName` and references their grade/subjects from Settings
- Switch to LessonPlanner with Grade 3 selected -> verify generated prompt includes full `gradeSubjects` block but only the Grade 3 slice
- Open Image Studio -> verify only `language` is injected (no grade/subject leakage into unrelated tool)
- Change `profile.displayName` in Settings -> next chat message reflects new name immediately (no restart)
- **Allowlist enforcement (critical):** temporarily add a non-allowlisted field like `oakKey` to the frontend payload -> verify it does NOT appear in the rendered system prompt (check backend debug log of the final prompt)
- **Interaction with F6:** chat long enough for F6 to extract "teaches Grade 3" -> verify F6 does NOT re-extract a fact already covered by F7's gradeSubjects
- **Contradiction flag:** manually insert a `teacher_memories` row saying "now teaches Grade 4" while Settings says Grade 3 -> verify next chat injection contains the contradiction marker, not silent override
- **Token cap:** set gradeSubjects to contain 8 grades x 6 subjects -> verify F7 block is truncated to ≤150 tokens

### Feature 5

- Open Planning Hub from sidebar -> verify NeuroSegment with 3 options
- Flip to School Year -> verify existing calendar works unchanged
- Flip to Curriculum Plan -> verify ELO assignment works unchanged
- Flip to Weekly Timetable -> verify empty grid renders with period rows + day columns
- Configure periods (set start/end times) -> verify they save and persist on reload
- Click empty cell -> assign Grade 3 Mathematics -> verify it appears color-coded
- Fill out a full week -> reload app -> verify timetable persists
- Trigger ELO breakdown (Feature 3C) -> verify prompt includes timetable periods
- Verify ELO breakdown result assigns ELOs to specific periods, not just days
- Verify old `school-year-calendar` and `curriculum-plan` sidebar entries are gone, replaced by single `planning-hub`
