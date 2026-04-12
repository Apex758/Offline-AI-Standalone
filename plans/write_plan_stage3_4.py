content = r"""
---

## STAGE 3 — Settings Tour: Profile, Models, Display, Sidebar, Voice, System

*Goal: Validate all configuration options before testing features that depend on them.*

### 3.1 User Profile

- [ ] Display name, school, registration date save and persist `[HIGH]`
- [ ] Grade levels (multi-select) save and persist `[HIGH]`
- [ ] Subjects per grade save and persist `[HIGH]`
- [ ] "Filter content by profile" toggle works `[MEDIUM]`
- Findings: ___

### 3.2 AI Model Selection

- [ ] App scans `/models` directory and lists available GGUF models `[CRITICAL]`
- [ ] Model size and quantization info displays correctly `[MEDIUM]`
- [ ] Selecting a model updates the active model `[CRITICAL]`
- [ ] App restart applies model change `[CRITICAL]`
- [ ] OpenRouter API key field saves correctly `[MEDIUM]`
- [ ] Gemma API key field saves correctly `[MEDIUM]`
- [ ] `cpu_info` reports CPU cores / RAM correctly `[HIGH]`
- [ ] `model_recommender` suggests a model based on hardware (RAM / cores) `[HIGH]`
- [ ] `tier_analyzer_generator` classifies each model into the correct tier `[HIGH]`
- [ ] Recommended model is highlighted visually in the model list `[MEDIUM]`
- [ ] `/api/models/open-folder` opens the models directory in OS file explorer `[MEDIUM]`
- Findings: ___

### 3.3 Diffusion Model Management

- [ ] `/api/diffusion-models/downloadable` lists remote-catalog diffusion models `[MEDIUM]`
- [ ] `/api/diffusion-models/download` starts a download with progress polling `[HIGH]`
- [ ] `/api/diffusion-models/download-progress/{key}` returns bytes/total/percentage `[MEDIUM]`
- [ ] Cancelling an in-progress diffusion model download cleanly removes partial files `[MEDIUM]`
- [ ] ESRGAN status (`/api/image-service/esrgan-status`) reflected in Image Studio `[LOW]`
- Findings: ___

### 3.4 Tier Configuration

- [ ] Tier 1-4 assigned to models saves correctly `[HIGH]`
- [ ] Dual Model Mode toggle works `[HIGH]`
- [ ] Fast model selector for lightweight tasks works `[HIGH]`
- [ ] Task routing (autocomplete / title / organize) toggles save `[MEDIUM]`
- Findings: ___

### 3.5 Generation Mode

- [ ] Switch to Queued mode — one generation at a time enforced `[HIGH]`
- [ ] Switch to Simultaneous mode — parallel allowed `[HIGH]`
- [ ] `generation_gate` blocks second generation in Queued mode until first finishes `[HIGH]`
- [ ] `generation_gate` queue drains in order when first job completes `[HIGH]`
- Findings: ___

### 3.6 Model Offloading

- [ ] Minimize app to tray — backend log shows `Model unloaded (app hidden)` `[HIGH]`
- [ ] RAM usage drops by several GB after unload `[HIGH]`
- [ ] Restore app window — `Model reload triggered (app shown)` fires `[HIGH]`
- [ ] First generation after reload works correctly (model reinitialized) `[CRITICAL]`
- [ ] `POST /api/model/unload` and `POST /api/model/reload` respond 200 `[MEDIUM]`
- [ ] `is_model_loaded()` returns correct state before and after unload `[MEDIUM]`
- Findings: ___

### 3.7 Display & Accessibility

- [ ] Font size slider (50%-200%) updates UI in real time `[HIGH]`
- [ ] Brightness slider (50-150) updates display `[HIGH]`
- [ ] Warm Tone slider (0-100) applies filter `[MEDIUM]`
- [ ] Light / Dark / System theme toggle works `[HIGH]`
- [ ] Theme persists after restart `[HIGH]`
- Findings: ___

### 3.8 Sidebar Customization

- [ ] Toggle individual features on/off (non-pinned items) `[HIGH]`
- [ ] Drag-reorder sidebar items (dnd-kit) `[HIGH]`
- [ ] Pinned items (My Overview, Metrics, Support, Settings) cannot be removed `[HIGH]`
- [ ] Tab color customization per type applies to sidebar + tab header `[MEDIUM]`
- [ ] Order and visibility persist after restart `[HIGH]`
- Findings: ___

### 3.9 Writing Assistant

- [ ] Spell check toggle saves `[MEDIUM]`
- [ ] Autocorrect toggle saves `[MEDIUM]`
- [ ] Auto-finish toggle saves `[MEDIUM]`
- [ ] Dictionary lookups toggle saves `[MEDIUM]`
- [ ] `SmartInput` applies spell check + autocorrect live when enabled `[HIGH]`
- [ ] `SmartTextArea` provides auto-finish suggestions (Tab/Enter accept) `[HIGH]`
- [ ] Dictionary lookup on double-click/selection works when enabled `[MEDIUM]`
- [ ] Disabling a toggle immediately removes the corresponding behavior `[MEDIUM]`
- Findings: ___

### 3.10 Voice (TTS Voices)

- [ ] TTS voices list (`/api/tts/voices`) populates the voice selector `[MEDIUM]`
- [ ] OCR model load/unload toggles work and free memory `[MEDIUM]`
- Findings: ___

### 3.11 System Behavior

- [ ] Minimize to system tray toggle works `[MEDIUM]`
- [ ] Start on boot toggle works `[LOW]`
- [ ] Auto-close tabs on exit toggle works `[MEDIUM]`
- [ ] File access permissions list saves correctly `[MEDIUM]`
- [ ] `/api/restart` and `/api/shutdown` from advanced settings work and the app recovers `[MEDIUM]`
- Findings: ___

### 3.12 Tutorial Preferences

- [ ] "Show floating tutorial buttons" toggle saves `[MEDIUM]`
- [ ] Disabling hides all `TutorialButton` floating buttons across tabs `[MEDIUM]`
- [ ] "Reset completed tutorials" restores tutorials to run again `[MEDIUM]`
- Findings: ___

### 3.13 OAK License Activation (Settings Panel)

- [ ] License section visible in Settings `[HIGH]`
- [ ] Enter valid key -> activated state shown `[CRITICAL]`
- [ ] Enter invalid key -> error displayed `[HIGH]`
- [ ] Activation persists and survives restart `[HIGH]`
- [ ] Deactivate / remove key returns app to unlicensed state `[HIGH]`
- [ ] License expiration date displayed when applicable `[MEDIUM]`
- Findings: ___

---

## STAGE 4 — School Year & Calendar Bootstrap

*Goal: Configure the school year, terms, and holidays before creating classes or scheduling.*

### 4.1 School Year Setup Modal

- [ ] `SchoolYearSetupModal` appears on first run if no active school year config `[HIGH]`
- [ ] Enter school year dates, term boundaries, holidays -> saves to backend `[HIGH]`
- [ ] After save, modal does not reappear `[HIGH]`
- [ ] Modal can be reopened from School Year Hub when needed `[MEDIUM]`
- Findings: ___

### 4.2 School Year Hub Navigation

- [ ] SchoolYearHub top nav shows exactly 3 tabs: **School Year**, **Curriculum Plan**, **Timetable** `[HIGH]`
- [ ] CompactCalendar widget (if surfaced somewhere) still pulls from the unified feed and shows mixed event types `[MEDIUM]`
- Findings: ___

### 4.3 Holidays in School Year Calendar

- [ ] Open School Year -> click + to create an event -> **Type** dropdown now includes "Holiday" as the first option `[HIGH]`
- [ ] Selecting type=Holiday reveals a new **"Block classes on this day"** checkbox, defaulted to checked `[HIGH]`
- [ ] Selecting any other type hides the checkbox (and clears the flag) `[MEDIUM]`
- [ ] Save a holiday with "Block classes" checked -> on the date chip, the holiday color is red `[MEDIUM]`
- [ ] Re-open a saved holiday for edit -> blocks-classes state round-trips `[HIGH]`
- [ ] Save a holiday -> existing backend EXDATE logic hides timetable slots on that date in widgets that read the unified feed `[HIGH]`
- [ ] Save a holiday with "Block classes" UNchecked -> date still appears red on the calendar, but timetable slots remain visible `[MEDIUM]`
- Findings: ___

"""

with open('C:/Users/LG/Desktop/Projects/Offline AI Standalone/plans/TESTING_PLAN.md', 'a', encoding='utf-8') as f:
    f.write(content)
print('Stages 3-4 appended OK, chars:', len(content))
