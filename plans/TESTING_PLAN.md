# PEARL — Systematic Testing Plan (Teacher Journey Order)
*2026-04-11 | Test every feature in the order a brand-new teacher encounters it*

---

## How to Use This Plan

- **Run stages in order** — every later stage depends on earlier ones being complete
- **The multi-class scenario (Stage 5)** is the spine: 3 grades x 3 subjects x 3 sections = 27 classes. All downstream stages use these classes.
- Mark each item `[x]` as you test it
- Log failures in the **Issues Log** table at the bottom
- Priority flags: `[CRITICAL]` = blocks other features | `[HIGH]` = core functionality | `[MEDIUM]` = important | `[LOW]` = nice-to-have
- For stages marked SHIPPED (especially Stage 29) the `[x]` items are verified-in-production records — do not uncheck them

---

## Teacher Journey Map

| Stage | Title | Depends On | Scope |
|-------|-------|-----------|-------|
| 0 | Vendor Pre-Deployment: License Issuing Infrastructure | — | Supabase + Vercel + Auth0 + OAK schema |
| 1 | Teacher Unboxing: Download, Install, First Launch | 0 | Installer, startup, UI shell, offline check |
| 2 | First-Run Setup Wizard (OAK vs Manual) | 1 | SetupWizard, OAK activation, profile step |
| 3 | Settings Tour: Profile, Models, Display, Sidebar, Voice, System | 2 | All Settings panels |
| 4 | School Year & Calendar Bootstrap | 3 | SchoolYearSetupModal, terms, holidays |
| 5 | Class Build-Out: G1/2/4 x Math/LA/Science x 3 sections | 4 | 27 classes created |
| 6 | Student Rostering (Manual + Bulk Import) | 5 | Students, contact info, IEP, bulk CSV/XLSX |
| 7 | Timetable Construction (incl. multi-block periods) | 5 | All 27 classes scheduled |
| 8 | ClassConfigPanel & Class Defaults Wiring | 7 | Config per class, auto-fill, focus-loss fix |
| 9 | Curriculum Browser, Standards & Milestones Initialization | 4 | Standards, skill tree, milestone setup |
| 10 | Active Class Context, Defaults Banner, Auto-Filled Sections | 8 | ActiveClassContext, ClassDefaultsBanner |
| 11 | Ask Coworker / Chat (AI Pipeline Smoke Test) | 3 | Chat, TTS/STT, memory, context budgeting |
| 12 | Brain Dump & Sticky Notes | 11 | Brain Dump, Sticky Notes full feature |
| 13 | Lesson Planning Suite | 10 | Standard / Early Childhood / Multi-Level / Cross-Curricular |
| 14 | Quiz Builder (Generation, Editing, QR, Scheduling) | 10 | Quiz gen, edit, QR, answer keys |
| 15 | Worksheet Builder (Generation, Grid, Templates, Packages) | 10 | Worksheet gen, grid editor, templates |
| 16 | Rubric Builder | 10 | Rubric gen, edit, export |
| 17 | Visual & Media Tools (Image Studio, Slide Deck, Storybook) | 11 | Image, Slides, Storybook |
| 18 | Photo Transfer (Phone PWA, Hotspot, HTTPS, Outbox) | 5 | Session, upload, SSE, outbox |
| 19 | Manual Grading (Quiz + Worksheet) | 14, 15 | Per-student score entry |
| 20 | Scan Auto-Grading Pipeline (single + bulk + stream) | 14, 15 | OCR pipeline, bulk grader |
| 21 | Attendance Tracking | 5 | Mark, view history, percentage |
| 22 | Reminders, Notifications, ICS Export/Import | 4 | Reminders, quiet hours, ICS |
| 23 | Generation Queue, Tab Pulse, Cancellation | 11 | Phase 27 content |
| 24 | Scheduled Background Tasks | 3 | Weekly ELO, Results Review |
| 25 | Analyse Panel Across Generators | 13-17 | Analyse mode, streaming edits, undo |
| 26 | My Resources & File Management | 13-17 | Resource browser, file explorer, org |
| 27 | Analytics, Educator Insights, Performance Metrics | 19, 20 | Insights, metrics, analytics dashboard |
| 28 | Achievements & Gamification | 13-20 | Unlock, showcase, collections |
| 29 | Unified Calendar System (Phase 25 shipped record) | 4, 7 | 12 sub-phases, 113 items, 96 shipped |
| 30 | Cross-Feature Integration Tests + Closed-Loop Smoke Test | All | CC.13 + full-day rehearsal |
| 31 | Tutorials, Support Reporting, System Health | Any | Tutorials, support tickets, health |
| 32 | Data Management: Export, Import, Privacy Memory Wipe | All | Export/import archive, memory wipe |
| 33 | Destructive: Factory Reset | 32 | Run LAST -- wipes everything |
| 34 | Regression Watch (RW.1-RW.4 + CC.1-CC.12 refactor checks) | All | Generator/calendar regression |
| 35 | Open Follow-ups & make user manual | All | Deferred items, user manual TODO |

---

## STAGE 0 — Vendor Pre-Deployment: License Issuing Infrastructure

*Goal: Confirm all server-side infrastructure is deployed and the OAK license pipeline is operational before the teacher receives anything.*

### 0.1 GitHub & Vercel Deploy

- [ ] Code is committed and pushed to GitHub on the correct branch `[CRITICAL]`
- [ ] Vercel detects the push and starts a deploy `[CRITICAL]`
- [ ] Vercel build is green (no TS errors, no missing env vars) `[CRITICAL]`
- [ ] Production deployment promoted (not just preview) `[HIGH]`
- [ ] Supabase Project A (`lkdwldwtdzouvahvrcbe`) reachable from sso-demo at runtime `[HIGH]`
- [ ] Required env vars set on Vercel: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, Auth0 vars `[HIGH]`
- [ ] Auth0 callback URL includes the deployed Vercel domain `[HIGH]`
- [ ] A test teacher membership exists in `authz.memberships` with `status='approved'`, `school_id`, `member_state_id` `[HIGH]`
- Findings: ___

### 0.2 sso-demo Deployment Prerequisite

The sso-demo previously assumed `authz.memberships.id` (UUID PK) which does not
exist in Project A. The generate/revoke routes now derive `teacher_id` from
`sha256(auth0_sub)` and no longer insert `membership_id`. These must be deployed
before the **Generate License** button will work.

- [ ] sso-demo branch with the `membership_id` removal + sha256 `teacher_id` is merged `[CRITICAL]`
- [ ] Vercel build for that commit is green and promoted to production `[CRITICAL]`
- [ ] (Optional local check) Run `npx tsc --noEmit` in `sso-demo/` — exit 0 `[MEDIUM]`
- [ ] Hitting `POST /api/oak/generate` no longer returns 500 with `membership.id is undefined` `[HIGH]`
- Findings: ___

### 0.3 Base Tables Created

- [ ] `SELECT table_name FROM information_schema.tables WHERE table_schema = 'authz' AND table_name IN ('oak_licenses','support_reports');` returns 2 rows `[CRITICAL]`
- [ ] In the Table Editor, `authz.oak_licenses` shows `auth0_sub TEXT REFERENCES authz.memberships(auth0_sub)` — NOT a UUID `membership_id` FK `[HIGH]`
- [ ] `idx_oak_licenses_oak_license`, `idx_oak_licenses_auth0_sub`, `idx_oak_licenses_status` indexes exist `[MEDIUM]`
- Findings: ___

### 0.4 RPCs Installed

- [ ] `SELECT proname FROM pg_proc WHERE pronamespace = 'authz'::regnamespace AND proname IN ('validate_oak','submit_support_report','check_support_updates');` returns 3 rows `[CRITICAL]`
- [ ] `SELECT pg_get_functiondef('authz.validate_oak(text,text)'::regprocedure);` shows a body that references `school_name` and `territory_name` (i.e. v2 is the one in effect) `[HIGH]`
- Findings: ___

### 0.5 Generate a Real OAK for the Smoke Test

- [ ] In the sso-demo dashboard (Vercel), click **Generate License** as a teacher whose membership has `status='approved'`, a `school_id`, and a `member_state_id` (e.g. Delon Pierre -> `school_001` / `LCA`) `[HIGH]`
- [ ] Row appears in `authz.oak_licenses` with correct `auth0_sub`, `school_id`, `territory_id`, `status='active'`, `device_id IS NULL` `[HIGH]`
- Findings: ___

### 0.6 validate_oak Happy Path

```sql
SELECT authz.validate_oak('OAK-REAL-KEY-HERE', 'smoke-test-device-001');
```

- [ ] Returns `valid: true` `[CRITICAL]`
- [ ] `teacher_name` matches the membership's `full_name` `[HIGH]`
- [ ] `school_id` is the raw code (e.g. `school_001`) `[MEDIUM]`
- [ ] `school_name` is the human-readable name from `authz.schools.name` (e.g. `Demo Primary School`) — NOT the raw ID `[HIGH]`
- [ ] `territory_id` is the raw code (e.g. `LCA`) `[MEDIUM]`
- [ ] `territory_name` is the resolved OECS name (e.g. `Saint Lucia`) `[HIGH]`
- [ ] `authz.oak_licenses.device_id` is now `'smoke-test-device-001'` and `last_validated_at` was just updated `[HIGH]`
- Findings: ___

### 0.7 validate_oak Device-Binding Enforcement

- [ ] Re-running with the SAME device_id returns `valid: true` and bumps `last_validated_at` `[HIGH]`
- [ ] Running with a DIFFERENT device_id returns `valid: false, error: "License bound to another device"` `[CRITICAL]`
- Findings: ___

### 0.8 validate_oak Error Paths

- [ ] `SELECT authz.validate_oak('OAK-DOES-NOT-EXIST', 'dev-x');` -> `valid: false, error: "License not found"` `[HIGH]`
- [ ] Manually `UPDATE authz.oak_licenses SET status='revoked' WHERE oak_license=...;` then validate -> `valid: false, error: "License is revoked"` `[HIGH]`
- [ ] Unknown territory code (e.g. `UPDATE ... SET territory_id='ZZZ'`) -> `territory_name` falls back to `'ZZZ'` (raw id), no crash `[MEDIUM]`
- [ ] Unknown `school_id` -> `school_name` falls back to the raw id, no crash `[MEDIUM]`
- Findings: ___

### 0.9 End-to-End Through the Electron App

- [ ] Paste the same OAK into Settings > License -> `LicenseSettingsBridge` writes `Demo Primary School` / `Saint Lucia` into `settings.profile` `[CRITICAL]`
- [ ] Settings > Profile shows the locked "Verified via OAK" badges with readable names (not `school_001` / `LCA`) `[HIGH]`
- [ ] Settings > License status card shows `School: Demo Primary School` and `Territory: Saint Lucia` `[MEDIUM]`
- Findings: ___

### 0.10 Cleanup After Smoke Test

- [ ] Reset `device_id` on the test license so it can be reused on a real device: `UPDATE authz.oak_licenses SET device_id=NULL WHERE oak_license='OAK-REAL-KEY-HERE';` `[MEDIUM]`
- Findings: ___


---

## STAGE 1 — Teacher Unboxing: Download, Install, First Launch

*Goal: Confirm the teacher can get the app onto their machine and it reaches the main UI without errors.*

### 1.1 Installation

- [ ] Installer (`.exe` / `.msi` / `.dmg`) downloads from the release URL `[CRITICAL]`
- [ ] Installer runs without admin-permission errors `[HIGH]`
- [ ] App icon appears in Start menu / Applications `[MEDIUM]`
- [ ] Bundled backend Python venv launches automatically on first run `[CRITICAL]`
- [ ] AppData folder created at `%APPDATA%/OECS Class Coworker/data` (Win) on first run `[HIGH]`
- [ ] Models directory exists or app prompts user to download a model `[HIGH]`
- Findings: ___

### 1.2 App Launch

- [ ] App opens without crash or console error `[CRITICAL]`
- [ ] HeartbeatLoader / loading spinner appears during startup `[MEDIUM]`
- [ ] App reaches the main UI within reasonable time (< 30s) `[HIGH]`
- Findings: ___

### 1.3 Engine Health Check

- [ ] `EngineStatusContext` shows `online` status indicator `[CRITICAL]`
- [ ] Disconnect backend -> status switches to `offline`, toast appears `[HIGH]`
- [ ] Reconnect -> status recovers, "Engine is back online" toast `[HIGH]`
- Findings: ___

### 1.4 Login Screen (if enabled)

- [ ] `Login.tsx` renders correctly (even if bypassed) `[MEDIUM]`
- [ ] Auto-login as "admin" works as expected `[HIGH]`
- Findings: ___

### 1.5 Offline & Multi-Window

- [ ] App works fully offline (kill internet -> all local features still work) `[CRITICAL]`
- [ ] Multi-window: open a second app window does not crash backend `[MEDIUM]`
- [ ] Close All Dialog (`CloseAllDialog.tsx`) appears when closing multiple tabs at once `[MEDIUM]`
- Findings: ___

### 1.6 UI Shell — Tab Navigation

- [ ] Click each of the 23 sidebar items — correct component loads `[CRITICAL]`
- [ ] Open multiple tabs of the same type (e.g., two Lesson Planners) `[HIGH]`
- [ ] Close a tab via X button `[HIGH]`
- [ ] Draft Save Dialog appears when closing a tab with unsaved work `[HIGH]`
- [ ] Tab titles display correctly `[MEDIUM]`
- Findings: ___

### 1.7 UI Shell — Split-View Mode

- [ ] Right-click a tab -> split view option appears `[HIGH]`
- [ ] Split activates: two panes visible side by side `[HIGH]`
- [ ] Switch active pane (left <-> right) `[HIGH]`
- [ ] Close split view -> returns to single pane `[HIGH]`
- [ ] Split state persists in localStorage `[MEDIUM]`
- Findings: ___

### 1.8 UI Shell — Command Palette

- [ ] Keyboard shortcut opens Command Palette overlay `[HIGH]`
- [ ] Search for a tab name — result appears `[HIGH]`
- [ ] Navigate to result — correct tab opens `[HIGH]`
- [ ] Mic button -> STT input works `[MEDIUM]`
- [ ] Close palette without action works `[HIGH]`
- Findings: ___

### 1.9 UI Shell — Tab Busy State

- [ ] Start a generation — tab shows busy indicator `[HIGH]`
- [ ] Attempt to close busy tab — blocked or warned `[HIGH]`
- [ ] Active Generation Dialog shows current jobs across tabs `[HIGH]`
- Findings: ___

---

## STAGE 2 — First-Run Setup Wizard (OAK vs Manual)

*Goal: Walk through the full setup wizard on a clean install, testing both the OAK path and the manual path.*

### 2.1 Welcome Step — Choice View

- [ ] SetupWizard appears on fresh install / cleared localStorage `[HIGH]`
- [ ] Welcome shows two buttons: **Activate with OAK** and **Continue without OAK (manual setup)** `[HIGH]`
- [ ] Clicking **Activate with OAK** reveals inline OAK input + Activate button `[HIGH]`
- [ ] Clicking **Continue without OAK** advances directly to the profile step `[HIGH]`
- Findings: ___

### 2.2 OAK Path

- [ ] Entering an invalid OAK shows an inline error and stays on the welcome step `[HIGH]`
- [ ] Entering a valid OAK activates the license, closes the OAK view, advances to profile `[CRITICAL]`
- [ ] Profile step shows a green **"Verified via OAK"** banner with the retrieved school and territory `[HIGH]`
- [ ] Profile step only asks for **name** and **grades/subjects** (no school input) `[HIGH]`
- [ ] "Back" on OAK input view returns to the choice view without deactivating an already-activated license `[MEDIUM]`
- [ ] After Finish, localStorage `app-settings-main.profile.schoolSource === 'oak'` and `profile.school` + `profile.territory` are populated `[HIGH]`
- Findings: ___

### 2.3 Manual Path

- [ ] Profile step only asks for **name** and **grades/subjects** (no school input, no OAK banner) `[HIGH]`
- [ ] After Finish, `profile.schoolSource === null` and `profile.school`/`profile.territory` are empty `[HIGH]`
- [ ] Dashboard welcome sticky-note checklist shows "Set up your profile (name)" — without the "& school" suffix `[MEDIUM]`
- Findings: ___

### 2.4 Feature Picker + Completion

- [ ] Step 3 — Feature Picker: toggle features on/off `[HIGH]`
- [ ] Step 4 — Completion: confirm and launch `[HIGH]`
- [ ] After completion, wizard does not reappear on restart `[HIGH]`
- Findings: ___

### 2.5 Welcome Modal

- [ ] WelcomeModal appears on first visit `[MEDIUM]`
- [ ] Dismiss works, does not reappear `[MEDIUM]`
- Findings: ___

### 2.6 OAK License Gate

- [ ] `LicenseGate` wraps the app and triggers `checkForUpdates` when license is valid `[HIGH]`
- [ ] App does not block access if license missing (gate is passive, not blocking) `[HIGH]`
- [ ] Entering valid OAK key in Settings unlocks licensed state `[CRITICAL]`
- [ ] Invalid/expired key displays correct error message `[HIGH]`
- [ ] License state persists across restart `[HIGH]`
- [ ] `validate_oak` RPC returns `school_name` and `territory_name` (new in v2 migration) `[HIGH]`
- [ ] `LicenseSettingsBridge` writes `profile.school`, `profile.territory`, `profile.schoolSource = 'oak'` into settings after activation `[CRITICAL]`
- [ ] Deactivating OAK clears `profile.school` / `profile.territory` and resets `schoolSource` to `null` `[HIGH]`
- [ ] Settings > Profile shows **locked** School + Country/Territory fields with a "Verified via OAK" badge when `schoolSource === 'oak'` `[HIGH]`
- [ ] Settings > Profile hides the School field entirely for manual users (no editable input) `[HIGH]`
- [ ] Manual-setup user -> Settings > License -> activate OAK -> Settings > Profile now shows locked School + Territory without a reload `[HIGH]`
- [ ] Settings > License status card shows `schoolName` / `territoryName` (human-readable) instead of raw IDs `[MEDIUM]`
- Findings: ___


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


---

## STAGE 5 — Class Build-Out: Grade 1/2/4 x Math/Language Arts/Science x 3 sections (1A/1B/1C)

*Goal: Build the full multi-class scenario: 3 grades x 3 subjects x 3 sections = 27 classes. This is the spine of all downstream testing.*

### 5.1 Grade 1 Classes (9 classes)

- [ ] Create class **Grade 1 Math 1A**, **1B**, **1C** `[CRITICAL]`
- [ ] Create class **Grade 1 Language Arts 1A**, **1B**, **1C** `[CRITICAL]`
- [ ] Create class **Grade 1 Science 1A**, **1B**, **1C** `[CRITICAL]`
- Findings: ___

### 5.2 Grade 2 Classes (9 classes)

- [ ] Repeat the 9-class set for **Grade 2** (2A/2B/2C x Math/LA/Science) `[CRITICAL]`
- Findings: ___

### 5.3 Grade 4 Classes (9 classes)

- [ ] Repeat the 9-class set for **Grade 4** (4A/4B/4C x Math/LA/Science) `[CRITICAL]`
- Findings: ___

### 5.4 Class Roster Verification

- [ ] All 27 classes appear in `My Classes` and the global class picker `[HIGH]`
- [ ] Backend `/api/classes` returns all 27 with correct grade_level + subject `[HIGH]`
- [ ] No duplicate-class warning falsely fires across different subjects with same section name `[MEDIUM]`
- [ ] Sidebar/global active-class picker can switch between any of the 27 without UI lag `[MEDIUM]`
- [ ] ClassConfig saved per class is independent (changing 1A Math doesn't bleed into 1A Language Arts) `[HIGH]`
- Findings: ___

### 5.5 Class CRUD

- [ ] Create a class `[HIGH]`
- [ ] Rename a class `[MEDIUM]`
- [ ] Delete a class `[HIGH]`
- [ ] View class roster `[HIGH]`
- Findings: ___

---

## STAGE 6 — Student Rostering (Manual + Bulk Import)

*Goal: Populate students into the 27 classes with full demographic and IEP data.*

### 6.1 Manual Student Entry

- [ ] Add a new student (all fields) `[CRITICAL]`
- [ ] Edit student details `[HIGH]`
- [ ] Delete a student `[HIGH]`
- [ ] Student ID auto-generated `[MEDIUM]`
- [ ] Filter students by class `[HIGH]`
- [ ] Filter students by grade `[HIGH]`
- Findings: ___

### 6.2 Full-Field Rostering

- [ ] Roster sample students into Grade 1A across all three subjects (verify they are scoped per class) `[HIGH]`
- [ ] For each student capture: full name, DOB, gender, parent contact (phone + email), learning style, IEP/accommodations `[HIGH]`
- Findings: ___

### 6.3 Bulk Import

- [ ] Download sample Excel template `[HIGH]`
- [ ] Fill template and upload `[HIGH]`
- [ ] Students imported correctly to database `[CRITICAL]`
- [ ] Validation errors shown for bad data `[HIGH]`
- [ ] Bulk-import a CSV of 25 students into Grade 2B Math `[HIGH]`
- [ ] Bulk-import an XLSX of 25 students into Grade 4C Science `[HIGH]`
- [ ] Validation errors surface clear messages on bad rows (missing required field, malformed DOB) `[HIGH]`
- Findings: ___

### 6.4 Cross-Class Student Handling

- [ ] Same student in multiple classes (e.g. a G2B kid takes Math + Science with same teacher) is supported without duplication `[MEDIUM]`
- [ ] Deleting a student detaches them from all classes (no orphaned grades) `[HIGH]`
- [ ] Student count badge per class matches actual roster size `[MEDIUM]`
- Findings: ___

---

## STAGE 7 — Timetable Construction (incl. multi-block periods)

*Goal: Schedule all 27 classes across a realistic 5-day week using the timetable, including double-block Science labs.*

### 7.1 Schedule All 27 Classes

- [ ] Schedule all 27 classes across a realistic 5-day week without overlap conflicts `[HIGH]`
- [ ] Use a mix of single-block and double-block periods (e.g. Science labs as 2 blocks) `[HIGH]`
- Findings: ___

### 7.2 Modal Length Selector

- [ ] Click an empty cell -> new "Length" dropdown appears below the Class field with options "1 block (single period)", "2 blocks (double period)", "3 blocks", ... capped by how many blocks remain in the day `[HIGH]`
- [ ] Modal header live-updates "Monday 9:00 AM - 11:00 AM (2 blocks)" when Length changes `[MEDIUM]`
- [ ] Saving with Length=2 creates a slot whose `end_time` matches the second block's end `[HIGH]`
- [ ] Editing an existing 2-block slot -> the Length dropdown pre-selects "2 blocks" `[HIGH]`
- Findings: ___

### 7.3 Rendering

- [ ] Multi-block slot renders as a single taller cell spanning N rows in the grid `[HIGH]`
- [ ] Cells inside a multi-block slot are not rendered separately (no duplicate clickable area) `[HIGH]`
- [ ] Clicking anywhere on a multi-block slot opens the edit modal `[MEDIUM]`
- Findings: ___

### 7.4 Overlap Validation

- [ ] Try to create a 3-block slot that would overlap an existing slot on the same day -> error: "That span overlaps another slot on this day." `[HIGH]`
- [ ] Try to create a slot near end-of-day whose span exceeds remaining blocks -> error: "Span of N blocks would run past the end of the day." `[MEDIUM]`
- [ ] Editing an existing double period to span=1 frees up the second block (no overlap false positive because the edit ignores its own ID) `[HIGH]`
- [ ] Conflict detector blocks creating two slots in the same room/time `[HIGH]`
- [ ] A timetable slot deleted in the UI cleanly removes the unified-calendar projection `[HIGH]`
- Findings: ___

### 7.5 Weekly Load Summary

- [ ] Below the legend, a "Weekly Load" strip shows one chip per `(grade, class, subject)` combination `[MEDIUM]`
- [ ] Each chip shows weekly total time (e.g. "Grade 1 - Blue - Mathematics 3h/week") `[MEDIUM]`
- [ ] Weekly Load summary shows weekly hours per class accurately `[MEDIUM]`
- [ ] Tooltip shows the session count ("3 sessions per week") `[LOW]`
- [ ] Hides entirely when no slots exist `[LOW]`
- Findings: ___

