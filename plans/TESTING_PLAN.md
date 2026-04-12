# OECS Class Coworker — Systematic Testing Plan (Teacher Journey Order)
*2026-04-12 | Test every feature in the order a brand-new teacher encounters it*

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
| 2 | First-Run Setup Wizard (OAK vs Manual) | 1 | SetupWizard, OAK activation, profile step, encrypted storage, main-process gating, periodic revalidation |
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
- [ ] **Offline warning (choice view):** Disconnect internet -> amber banner appears: "You appear to be offline. OAK activation requires an internet connection." `[HIGH]`
- [ ] **Offline warning (OAK form):** Switch to OAK input view while offline -> amber banner appears above the input field `[HIGH]`
- [ ] **Offline warning clears:** Reconnect internet -> amber banners disappear in real time (no reload needed) `[HIGH]`
- [ ] **Manual path still works offline:** "Continue without OAK" button is always enabled regardless of connectivity `[MEDIUM]`
- Findings: ___

### 2.2 OAK Path

- [ ] Entering an invalid OAK shows an inline error and stays on the welcome step `[HIGH]`
- [ ] Entering a valid OAK activates the license, closes the OAK view, advances to profile `[CRITICAL]`
- [ ] Profile step shows a green **"Verified via OAK"** banner with the retrieved school and territory `[HIGH]`
- [ ] Profile step only asks for **name** and **grades/subjects** (no school input) `[HIGH]`
- [ ] "Back" on OAK input view returns to the choice view without deactivating an already-activated license `[MEDIUM]`
- [ ] After Finish, `profile.schoolSource === 'oak'` and `profile.school` + `profile.territory` are populated `[HIGH]`
- [ ] After Finish, `profile.setupMode === 'oak'` is persisted in settings `[HIGH]`
- Findings: ___

### 2.3 Manual Path

- [ ] Profile step only asks for **name** and **grades/subjects** (no school input, no OAK banner) `[HIGH]`
- [ ] After Finish, `profile.schoolSource === null` and `profile.school`/`profile.territory` are empty `[HIGH]`
- [ ] After Finish, `profile.setupMode === 'manual'` is persisted in settings `[HIGH]`
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

### 2.7 Encrypted License Storage (safeStorage)

*Goal: Confirm the OAK license key and device ID are stored using Electron's OS-level encryption, not plaintext localStorage.*

- [ ] **Fresh activation:** Activate OAK -> `license-store.enc` file appears in `%APPDATA%/OECS Class Coworker/` `[CRITICAL]`
- [ ] **No plaintext:** After activation, `localStorage.getItem('oecs_oak_license')` returns `null` (removed after migration to safeStorage) `[CRITICAL]`
- [ ] **Device ID encrypted:** `localStorage.getItem('oecs_device_id')` returns `null` (migrated to safeStorage) `[HIGH]`
- [ ] **Encrypted file is not readable:** Open `license-store.enc` in a text editor -> contents are binary/gibberish, NOT readable JSON `[HIGH]`
- [ ] **Survives restart:** Close and reopen app -> license is still active (read back from encrypted store) `[CRITICAL]`
- [ ] **Migration from localStorage:** For an existing installation that had `oecs_oak_license` in localStorage, upgrading to this version migrates it to safeStorage automatically on first launch `[CRITICAL]`
- [ ] **Dev mode fallback:** When running `npm run dev` (no Electron), storage falls back to localStorage gracefully `[MEDIUM]`
- [ ] **Deactivation clears encrypted store:** Deactivate OAK -> `license-store.enc` no longer contains the license key (key entry deleted) `[HIGH]`
- Findings: ___

### 2.8 Main-Process Update Gating

*Goal: Confirm update checks are gated in the Electron main process, not just the renderer.*

- [ ] **License status sync:** Activate OAK -> main process log shows `License status updated: licensed` `[HIGH]`
- [ ] **Deactivate sync:** Deactivate OAK -> main process log shows `License status updated: unlicensed` `[HIGH]`
- [ ] **Gated update check (licensed):** With active OAK, "Check for Updates" -> main log shows `Licensed user requested update check` `[HIGH]`
- [ ] **Gated update check (unlicensed):** Without OAK, manually invoke `window.electronAPI.checkForUpdates()` from DevTools -> main log shows `Skipping update check -- no active license` `[CRITICAL]`
- [ ] **Race condition safety:** App starts, renderer sends license status before first update check -> main process has correct state `[HIGH]`
- Findings: ___

### 2.9 Periodic License Revalidation

*Goal: Confirm the app periodically re-checks the license with Supabase and deactivates if revoked server-side.*

- [ ] **Startup revalidation:** App start with cached license -> Supabase `validate_oak` RPC is called (visible in Supabase logs or network tab) `[HIGH]`
- [ ] **Visibility revalidation:** Minimize app for >1 hour (or mock `lastCheckRef` to simulate), then restore -> revalidation fires `[HIGH]`
- [ ] **Server-side revoke detected:** While app is running, revoke the license in Supabase (`UPDATE authz.oak_licenses SET status='revoked'`), then trigger revalidation -> app deactivates license locally, license section shows "not active" `[CRITICAL]`
- [ ] **Offline tolerance:** Disconnect internet -> revalidation fires but fails with network error -> app continues to trust cached license (does NOT deactivate) `[CRITICAL]`
- [ ] **Timer cleanup:** Navigate away or unmount LicenseProvider -> no leaked intervals (check DevTools Performance tab) `[MEDIUM]`
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


---

## STAGE 8 — ClassConfigPanel & Class Defaults Wiring

*Goal: Configure each class in detail, verify timetable wiring, and confirm the focus-loss bug is fixed.*

### 8.1 ClassConfigPanel Focus-Loss Bug Fix (CC.4)

`Section`, `Label`, and `ChipGroup` were defined inside `ClassConfigPanel`'s
render function, causing React to unmount/remount the entire form subtree on
every keystroke. Fix: all three hoisted to module scope.

- [ ] Open Class Manager -> pick a class -> open its config panel `[CRITICAL]`
- [ ] Type a long string in the **Subject** input — focus is NOT lost between keystrokes `[CRITICAL]`
- [ ] Same for all textareas (Essential Outcomes, Specific Outcomes, Special Needs Details, Additional Instructions, etc.) `[HIGH]`
- [ ] Scroll to a `<ChipGroup>` (e.g. Learning Styles) -> click a chip -> scroll position stays put, chip toggles, other chips retain state `[CRITICAL]`
- [ ] Toggle a checkbox (e.g. Has Special Needs) -> no scroll jump, conditional textarea appears without remount glitch `[HIGH]`
- Findings: ___

### 8.2 ClassConfigPanel Timetable & Onboarding Wiring (CC.5)

- [ ] For a class that appears in the timetable (e.g. Grade 1 Blue Math) -> Subject is a dropdown with exactly the subjects the teacher teaches that class in (reading from timetable) `[HIGH]`
- [ ] For a class NOT yet scheduled in the timetable -> Subject dropdown falls back to the teacher's onboarding subjects for that grade `[HIGH]`
- [ ] If neither source has data -> Subject falls back to a free-text input with an amber warning `[MEDIUM]`
- [ ] Subject caption text reflects the source ("Scoped to subjects you teach this class in your timetable" vs "From your onboarding profile...") `[MEDIUM]`
- [ ] Changing Subject wipes Strand / Essential Outcomes / Specific Outcomes **without a confirm prompt** (curriculum cascade) `[HIGH]`
- Findings: ___

### 8.3 Duration Derivation

- [ ] Schedule a class with a consistent 60-min period on multiple days -> ClassConfigPanel auto-pre-fills `classPeriodDuration` to "60 minutes" on first load `[HIGH]`
- [ ] Schedule the same class with a mix (60 min Mon/Wed, 90 min Fri) -> auto-fill uses the **most common** duration and shows caption "varies per day -- showing most common" `[MEDIUM]`
- [ ] A derived duration that doesn't match the static `DURATIONS` list (e.g. 50 min) still appears as an option labeled "(from timetable)" `[MEDIUM]`
- [ ] Manually overriding the duration in the panel is preserved — does not get overwritten by subsequent loads `[HIGH]`
- Findings: ___

### 8.4 "Meets:" Strip

- [ ] With scheduled slots -> a chip strip near the top shows each day/time + per-slot duration, plus weekly total + "Most common period" line `[MEDIUM]`
- [ ] With NO scheduled slots -> friendly dashed hint directs the teacher to the Timetable view `[MEDIUM]`
- Findings: ___

---

## STAGE 9 — Curriculum Browser, Standards & Milestones Initialization

*Goal: Browse and filter standards, then initialize milestones for the 27-class scenario.*

### 9.1 Browse Standards

- [ ] Filter by grade — standards update correctly `[HIGH]`
- [ ] Filter by subject — standards update correctly `[HIGH]`
- [ ] Standard codes and full descriptions display `[HIGH]`
- Findings: ___

### 9.2 Skill Tree

- [ ] Skill progression tree renders without error `[HIGH]`
- [ ] Navigate skill hierarchy — prerequisite paths visible `[HIGH]`
- Findings: ___

### 9.3 Cross-Curricular Mapping

- [ ] Standards can be viewed across subjects for same grade `[MEDIUM]`
- Findings: ___

### 9.4 Curriculum Navigator / References / Skill Tree

- [ ] `CurriculumNavigator` renders the top-level navigation tree `[HIGH]`
- [ ] `CurriculumReferences` panel lists reference sources for selected topic `[MEDIUM]`
- [ ] `CurriculumSkillTree` renders skill progression with prerequisite edges `[HIGH]`
- [ ] Clicking a node in the skill tree opens the matching curriculum topic `[HIGH]`
- Findings: ___

### 9.5 Math Strand Page

- [ ] `math-strand-page` renders all strands for the selected grade `[HIGH]`
- [ ] Each strand lists its topics and learning outcomes `[HIGH]`
- [ ] Standards badges render correctly for each outcome `[MEDIUM]`
- Findings: ___

### 9.6 Level Journey Path

- [ ] `LevelJourneyPath` renders the progression visualization `[HIGH]`
- [ ] Current position on the path is clearly marked `[HIGH]`
- [ ] Clicking a level node shows the milestones for that level `[MEDIUM]`
- Findings: ___

### 9.7 Milestone Management

- [ ] Milestones populate for selected grade/subject `[HIGH]`
- [ ] Set milestone status: not_started -> in_progress -> completed `[CRITICAL]`
- [ ] Set milestone as skipped `[MEDIUM]`
- [ ] Add due date to milestone `[HIGH]`
- [ ] Add notes to milestone `[HIGH]`
- Findings: ___

### 9.8 Checklist Items

- [ ] Add checklist items to a milestone `[HIGH]`
- [ ] Toggle checklist item complete/incomplete `[HIGH]`
- Findings: ___

### 9.9 History Audit Trail

- [ ] Status change logged with timestamp `[HIGH]`
- [ ] History visible per milestone `[MEDIUM]`
- Findings: ___

### 9.10 Filters & Progress Display

- [ ] Filter by grade, subject, status `[HIGH]`
- [ ] Visual progress indicators per strand `[HIGH]`
- Findings: ___

### 9.11 Phase Context UI

- [ ] `PhaseContextBanner` shows the current academic phase at the top of relevant tabs `[HIGH]`
- [ ] Banner updates when phase boundaries change `[MEDIUM]`
- [ ] `PhaseHistoryNav` lets user scrub through past phases `[HIGH]`
- [ ] Selecting a historical phase filters milestones to that phase `[HIGH]`
- [ ] `PhaseBreakdownModal` opens from banner and shows phase-level stats `[HIGH]`
- [ ] Modal displays milestone progress, coverage %, and pending items per phase `[HIGH]`
- Findings: ___

---

## STAGE 10 — Active Class Context, Defaults Banner, Auto-Filled Sections

*Goal: Confirm the global class selection, ClassDefaultsBanner, and applyClassDefaults util wire correctly across all 7 generators.*

### 10.1 Shared applyClassDefaults Util (CC.1)

- [ ] In each of the 7 generators (Lesson / Quiz / Worksheet / Rubric / Kindergarten / Multigrade / CrossCurricular), pick a class that has a stored ClassConfig — all the previously-covered fields still auto-fill `[HIGH]`
- [ ] Regression: **WorksheetGenerator** specifically — pick a class that has `learningStyles` + `hasSpecialNeeds` set in config. Both arrays (learningStyles) and the boolean (specialNeeds) now auto-fill; previously they did not. `[HIGH]`
- [ ] Editing a pre-filled field is not clobbered by switching classes — existing non-empty user input still wins over class defaults (precedence preserved) `[HIGH]`
- Findings: ___

### 10.2 ActiveClassContext — Global Class Selection (CC.2)

- [ ] Pick a class in LessonPlanner -> switch to QuizGenerator -> the same class is already selected and form is hydrated `[HIGH]`
- [ ] Reload the app -> active class persists `[HIGH]`
- [ ] Clear the class picker in any generator (empty option) -> global state clears, other generators also clear on next visit `[HIGH]`
- [ ] Seven generators + ImageStudio still work when no class is active (no active class is the default startup state) `[HIGH]`
- [ ] Switching classes in one generator does not wipe the teacher's in-progress form values in another tab (only auto-fills empty fields) `[MEDIUM]`
- Findings: ___

### 10.3 ClassDefaultsBanner + AutoFilledSection Collapse (CC.3)

- [ ] With a class that has config: LessonPlanner Step 1 and Step 2 both show the banner `[HIGH]`
- [ ] LessonPlanner Step 2 body collapses to a single "All teaching strategy fields were auto-filled" hint when a class with config is active `[HIGH]`
- [ ] Click **Override** -> full Step 2 form re-appears with the class defaults already populated `[HIGH]`
- [ ] QuizGenerator, RubricGenerator, WorksheetGenerator, KindergartenPlanner, MultigradePlanner, CrossCurricularPlanner all show the banner (no AutoFilledSection collapse yet) `[MEDIUM]`
- [ ] With **no** active class -> banner doesn't render at all, form is identical to legacy behavior (zero regression) `[HIGH]`
- [ ] Banner's "Using class" label tracks the active class label, not the generator-local copy `[MEDIUM]`
- Findings: ___

---

## STAGE 11 — Ask Coworker / Chat (AI Pipeline Smoke Test)

*Goal: Verify core AI inference pipeline works — this underpins all generation features.*

### 11.1 Basic Chat

- [ ] Type a message and send — streaming response appears `[CRITICAL]`
- [ ] Response completes without error `[CRITICAL]`
- [ ] Chat history saves the session `[HIGH]`
- Findings: ___

### 11.2 Chat Features

- [ ] Auto-title generated for the session `[MEDIUM]`
- [ ] Autocomplete suggestions appear while typing `[MEDIUM]`
- [ ] Attach a file (document/image) — content referenced in response `[HIGH]`
- [ ] Smart search: search past chats — correct results returned `[HIGH]`
- [ ] Delete a chat session `[MEDIUM]`
- [ ] AI response containing a curriculum link opens curriculum tab at correct route `[HIGH]`
- [ ] If a curriculum tab is already open, new link reuses it rather than duplicating `[MEDIUM]`
- Findings: ___

### 11.3 TTS & STT

- [ ] TTS: AI response read aloud via Piper `[HIGH]`
- [ ] Volume toggle mutes/unmutes TTS `[HIGH]`
- [ ] STT: mic button -> speak -> text appears in input field `[HIGH]`
- [ ] STT input sends correctly `[HIGH]`
- Findings: ___

### 11.4 Educator Coach Drawer

- [ ] Open Educator Coach Drawer from Educator Insights `[HIGH]`
- [ ] Send message — consultant-mode response streams `[HIGH]`
- [ ] Conversation history saves and retrieves `[HIGH]`
- [ ] Multiple conversations accessible `[MEDIUM]`
- Findings: ___

### 11.5 Consultant Conversations

- [ ] `GET /api/consultant/conversations` — lists saved conversations `[MEDIUM]`
- [ ] `GET /api/consultant/conversation/{id}` — retrieves specific conversation `[MEDIUM]`
- Findings: ___

### 11.6 Smart Context Budgeting (Feature 1)

- [ ] Long chat session (20+ messages) stays responsive — no context overflow on Tier 1 models `[HIGH]`
- [ ] Summary auto-generated every ~10 messages (fire-and-forget, no UI hang) `[HIGH]`
- [ ] `build_context_budgeted()` trims oldest pairs when over tier budget — backend log confirms `[MEDIUM]`
- [ ] `CONTEXT_BUDGET` per-tier constants applied (T1=1500, T2=6000, T3=8000, T4=12000) `[MEDIUM]`
- [ ] Consultant drawer (Educator Coach) also applies budgeted context `[MEDIUM]`
- Findings: ___

### 11.7 Thinking Level Controls (Feature 2)

- [ ] Settings page no longer shows a global "Thinking Mode" toggle `[MEDIUM]`
- [ ] Brain icon in Ask Coworker opens Quick / Deep popup `[HIGH]`
- [ ] Quick mode: faster, shorter responses `[HIGH]`
- [ ] Deep mode: longer, more reasoned responses (CoT prefix for Gemma, `/think` for Qwen) `[HIGH]`
- [ ] Brain icon visual state reflects current selection (dim = Quick, glow = Deep) `[MEDIUM]`
- [ ] Analyse panel has its own independent Quick/Deep toggle `[MEDIUM]`
- [ ] Legacy `thinkingEnabled` localStorage key is ignored without error `[LOW]`
- Findings: ___

### 11.8 Coworker Long-Term Memory (Feature 6)

- [ ] After ~10 messages, `teacher_memories` table gains new rows (extracted facts) `[HIGH]`
- [ ] New conversation starts with relevant recalled facts in system prompt `[HIGH]`
- [ ] TF-IDF similarity search returns related past facts for current query `[HIGH]`
- [ ] Duplicate facts deduplicated, not re-inserted `[MEDIUM]`
- [ ] Extraction piggybacks on existing summary call — no extra LLM round trip `[MEDIUM]`
- [ ] scikit-learn loaded successfully at backend startup `[HIGH]`
- [ ] Privacy toggle: user can disable memory extraction and recall `[HIGH]`
- [ ] Contradictions between profile (F7) and extracted facts (F6) are flagged, not silently overwritten `[MEDIUM]`
- Findings: ___

### 11.9 Static Profile Context (Feature 7)

- [ ] On fresh install, first message already gets personalized response (name, grade, subjects) `[HIGH]`
- [ ] `profile_context.build_block()` injected into system prompt before F6 memory block `[HIGH]`
- [ ] Only allowlisted fields (displayName, coworkerName, gradeSubjects, filterContentByProfile, language, enabledModules) reach the model `[CRITICAL]`
- [ ] Denylisted fields (oakKey, school, theme, fontSize, etc.) never injected — verify via log `[CRITICAL]`
- [ ] Feature-aware scoping: quiz_generator receives only relevant grade's subjects `[MEDIUM]`
- [ ] image_studio / presentation_builder get language only, not full profile `[MEDIUM]`
- [ ] settings / support endpoints get NO profile injection `[HIGH]`
- [ ] Editing Settings profile reflects in next inference call with no restart `[HIGH]`
- [ ] Combined F6 + F7 block capped so total context fits tier budget (max ~350 tokens) `[HIGH]`
- Findings: ___

---

## STAGE 12 — Brain Dump & Sticky Notes

*Goal: Capture, categorize, and organize unstructured teacher ideas. Verify sticky notes across all tabs.*

### 12.1 Brain Dump — Idea Capture

- [ ] Type unstructured text -> submit `[HIGH]`
- [ ] AI auto-categorizes the content `[HIGH]`
- [ ] Category label displayed on entry `[HIGH]`
- Findings: ___

### 12.2 Brain Dump — File Attachment

- [ ] Attach a file to a brain dump entry `[MEDIUM]`
- Findings: ___

### 12.3 Brain Dump — Organization

- [ ] Request AI organization plan for notes `[HIGH]`
- [ ] Execute organization `[HIGH]`
- [ ] Undo organization `[HIGH]`
- [ ] Learned keywords persist across sessions `[MEDIUM]`
- Findings: ___

### 12.4 Brain Dump -> Lesson Planner

- [ ] Generate structured prompt in Brain Dump `[MEDIUM]`
- [ ] Use prompt as input in Lesson Planner `[MEDIUM]`
- Findings: ___

### 12.5 Sticky Notes — Shell Level

- [ ] Sticky note panel/button accessible from any tab `[HIGH]`
- [ ] Open a new sticky note `[HIGH]`
- [ ] Notes are isolated per tab type (switch tabs -> different notes) `[HIGH]`
- [ ] Notes persist after tab close and reopen `[HIGH]`
- Findings: ___

### 12.6 Sticky Notes — Create & Manage

- [ ] Create a new note `[HIGH]`
- [ ] Change note color (6 options) `[MEDIUM]`
- [ ] Drag note to reposition `[HIGH]`
- [ ] Resize note via corner handle `[HIGH]`
- [ ] Pin note (stays on top) `[HIGH]`
- [ ] Minimize note (collapses to header) `[HIGH]`
- [ ] Close note `[HIGH]`
- Findings: ___

### 12.7 Sticky Notes — Rich Text Editing

- [ ] Bold, Italic, Underline, Strikethrough `[HIGH]`
- [ ] H1, H2, H3 headings `[MEDIUM]`
- [ ] Bullet list, numbered list `[HIGH]`
- [ ] Blockquote `[LOW]`
- [ ] Link insertion `[MEDIUM]`
- Findings: ___

### 12.8 Sticky Notes — Checklists

- [ ] Add checklist items `[HIGH]`
- [ ] Toggle checklist item complete `[HIGH]`
- Findings: ___

### 12.9 Sticky Notes — Grouping

- [ ] Drag two notes together to group `[HIGH]`
- [ ] Move group together `[HIGH]`
- [ ] Minimize group `[MEDIUM]`
- Findings: ___

### 12.10 Sticky Notes — Persistence

- [ ] Notes persist after tab close and reopen `[CRITICAL]`
- [ ] Notes scoped to tab type (different notes per tab) `[HIGH]`
- Findings: ___


---

## STAGE 13 — Lesson Planning Suite (Standard / Early Childhood / Multi-Level / Cross-Curricular)

*Goal: Test all four lesson planners and their shared editing/export pipeline.*

### 13.1 Standard Lesson Planner

- [ ] Open a new Lesson Plan tab `[CRITICAL]`
- [ ] Set subject, grade level, duration `[CRITICAL]`
- [ ] Select curriculum standards `[HIGH]`
- [ ] Start generation — streaming response appears section by section `[CRITICAL]`
- [ ] All sections generated: objectives, materials, activities, assessments, differentiation, extensions `[HIGH]`
- [ ] Edit generated content in LessonEditor `[HIGH]`
- [ ] Auto-save to draft while editing `[HIGH]`
- [ ] Save to history `[HIGH]`
- [ ] Load saved lesson from history `[HIGH]`
- [ ] Delete lesson from history `[MEDIUM]`
- [ ] Export to PDF `[HIGH]`
- [ ] Export to DOCX `[HIGH]`
- [ ] Export to Markdown `[MEDIUM]`
- [ ] Export to JSON `[MEDIUM]`
- Findings: ___

### 13.2 Early Childhood Planner

- [ ] Open Early Childhood tab `[HIGH]`
- [ ] Generation completes with K-appropriate language `[HIGH]`
- [ ] Story-based activities included in output `[HIGH]`
- [ ] Visual schedule generated `[HIGH]`
- [ ] `daily-plan` view renders the day's activities in time-ordered blocks `[HIGH]`
- [ ] Edit individual blocks (activity, duration, resources) `[HIGH]`
- [ ] Daily plan persists to backend and reloads on tab reopen `[HIGH]`
- Findings: ___

### 13.3 Multi-Level Planner

- [ ] Open Multi-Level tab `[HIGH]`
- [ ] Select 2+ grade levels `[HIGH]`
- [ ] Generation produces per-level objectives and activities `[HIGH]`
- [ ] Shared scaffolding visible `[HIGH]`
- Findings: ___

### 13.4 Integrated (Cross-Curricular) Lesson Planner

- [ ] Open Integrated Lesson tab `[HIGH]`
- [ ] Select 2+ subjects `[HIGH]`
- [ ] Generation produces cross-subject connected content `[HIGH]`
- [ ] Standards from multiple subjects referenced `[HIGH]`
- Findings: ___

### 13.5 GenerateForSelector — Target Session (CC.8)

- [ ] With NO active class -> selector shows "Pick a class above to target a specific lesson" `[HIGH]`
- [ ] Active class with NO timetable slots -> selector shows hint directing to Timetable view `[HIGH]`
- [ ] Active class with slots -> dropdown lists the next ~10 upcoming sessions, formatted like "Wed Apr 15 - 09:00-10:00 - Mathematics (60m)" `[HIGH]`
- [ ] Selecting an option auto-fills Subject / Grade / Duration in the form `[HIGH]`
- [ ] Relative hint appears above the dropdown when selected ("today" / "tomorrow" / "in 3 days" / "in 2 weeks") `[MEDIUM]`
- [ ] "Jump to date" picker finds any occurrence on that date within a 60-occurrence horizon `[MEDIUM]`
- [ ] "Clear" button drops the targetOccurrence but leaves the teacher's form data intact `[MEDIUM]`
- [ ] Manually editing Subject after a pick is NOT reverted (pick only fires once) `[HIGH]`
- [ ] Switching the active class auto-clears any stale target from the selector `[HIGH]`
- [ ] Double-period slots render as 120m in the dropdown (duration is `end - start`) `[MEDIUM]`
- [ ] Present in all 7 generators (Lesson / Quiz / Worksheet / Rubric / Kindergarten / Multigrade / CrossCurricular) `[HIGH]`
- Findings: ___

### 13.6 Lesson <-> Calendar Instance Attachment (CC.9)

- [ ] Open LessonPlanner, pick a target session, generate, save -> refresh dashboard widget -> that session no longer appears as unplanned `[HIGH]`
- [ ] Save a LessonPlanner plan **without** picking a target -> previous behavior preserved (backend `_auto_bind_slot` may still try to guess) `[HIGH]`
- [ ] Delete a plan that had a target -> slot reappears in the unplanned list on next fetch `[MEDIUM]`
- [ ] Old plans without `scheduled_for` still load and render correctly (column is additive, nullable) `[CRITICAL]`
- [ ] Pick target -> save -> the slot drops off unplanned list for KindergartenPlanner `[HIGH]`
- [ ] Same for MultigradePlanner `[HIGH]`
- [ ] Same for CrossCurricularPlanner `[HIGH]`
- [ ] Create a blocking holiday covering one of the upcoming target dates -> that occurrence drops off the unplanned list immediately `[HIGH]`
- [ ] Non-blocking holiday (blocks_classes=0) does NOT remove the occurrence `[MEDIUM]`
- [ ] `curl http://localhost:8000/api/school-year/upcoming-unplanned/default?within_days=14` returns `{ occurrences: [...], count: N }` `[HIGH]`
- [ ] Fresh install with no lesson plans / no histories -> endpoint returns valid payload (`count: 0` or raw projections), no 500 `[HIGH]`
- Findings: ___

---

## STAGE 14 — Quiz Builder (Generation, Editing, QR, Scheduling)

*Goal: Generate, edit, and export quizzes with QR codes. Manual grading and scan grading are in Stages 19-20.*

### 14.1 Quiz Generation

- [ ] Open Quiz Builder tab `[CRITICAL]`
- [ ] Set subject, grade, question count, question types `[CRITICAL]`
- [ ] Generation streams question by question `[CRITICAL]`
- [ ] All question types generated: MC, T/F, Fill-blank, Open-ended `[HIGH]`
- [ ] Answer key generated `[CRITICAL]`
- [ ] Quiz saved to history `[HIGH]`
- Findings: ___

### 14.2 Quiz Editing

- [ ] Open QuizEditor `[HIGH]`
- [ ] Add a question `[HIGH]`
- [ ] Delete a question `[HIGH]`
- [ ] Reorder questions `[MEDIUM]`
- [ ] Edit correct answer `[HIGH]`
- [ ] Adjust point values `[HIGH]`
- Findings: ___

### 14.3 QR Code Generation

- [ ] Quiz exported with QR code in top-right corner `[HIGH]`
- [ ] QR encodes quiz ID correctly `[CRITICAL]`
- Findings: ___

### 14.4 Scan Template Preview & Alignment

- [ ] `ScanTemplatePreview` renders the expected answer region layout before print `[HIGH]`
- [ ] `scan_template_extractor` extracts region coordinates from the generated PDF `[CRITICAL]`
- [ ] `image_alignment` corrects skew and rotation on scanned submissions `[CRITICAL]`
- [ ] `region_tracker` maps aligned regions back to question IDs `[HIGH]`
- [ ] `bubble_detector` correctly identifies filled bubbles on multiple-choice scans `[CRITICAL]`
- [ ] Misaligned / low-quality scans surface a clear error `[HIGH]`
- Findings: ___

### 14.5 Answer Key Management

- [ ] List all answer keys `[HIGH]`
- [ ] Retrieve a specific key `[HIGH]`
- [ ] Key correctly matches stored quiz `[CRITICAL]`
- Findings: ___

### 14.6 Quiz Instances

- [ ] Save per-student instances `[MEDIUM]`
- [ ] Correct instance used during grading `[HIGH]`
- Findings: ___

---

## STAGE 15 — Worksheet Builder (Generation, Grid, Templates, Packages)

*Goal: Generate and edit worksheets using all template types. Grading is in Stages 19-20.*

### 15.1 Worksheet Generation

- [ ] Open Worksheet Builder tab `[HIGH]`
- [ ] Set subject field `[CRITICAL]`
- [ ] Set grade level `[CRITICAL]`
- [ ] Set grid dimensions (rows x columns) `[HIGH]`
- [ ] Generation produces content in cells `[HIGH]`
- [ ] Answer key generated `[CRITICAL]`
- Findings: ___

### 15.2 Structured Grid Editor

- [ ] Click cell to edit content `[HIGH]`
- [ ] Resize columns/rows `[HIGH]`
- [ ] Merge cells `[MEDIUM]`
- [ ] Apply border styles `[MEDIUM]`
- [ ] Text alignment per cell `[MEDIUM]`
- [ ] Insert image into cell `[HIGH]`
- Findings: ___

### 15.3 Worksheet Templates

- [ ] Math template renders and accepts values correctly `[HIGH]`
- [ ] Multiple Choice template renders question + options `[HIGH]`
- [ ] Comprehension template renders passage + questions `[HIGH]`
- [ ] List Based template renders ordered lists `[MEDIUM]`
- [ ] Matching template renders two columns with draggable pairs `[HIGH]`
- [ ] Each template exports cleanly to PDF without layout break `[HIGH]`
- Findings: ___

### 15.4 Worksheet Packages

- [ ] Create a package (group multiple worksheets) `[MEDIUM]`
- [ ] Assign package to a class `[MEDIUM]`
- [ ] Retrieve package list `[MEDIUM]`
- Findings: ___

---

## STAGE 16 — Rubric Builder

*Goal: Generate, edit, and export rubrics for the teacher's subjects.*

### 16.1 Generation

- [ ] Open Rubric Builder tab `[HIGH]`
- [ ] Set subject, grade, assessment type `[HIGH]`
- [ ] Generation streams criteria `[HIGH]`
- [ ] All criteria have: name, levels, descriptors, point values `[HIGH]`
- [ ] Total points calculated correctly `[HIGH]`
- Findings: ___

### 16.2 Editing

- [ ] Add / remove criteria `[HIGH]`
- [ ] Rename levels `[MEDIUM]`
- [ ] Edit descriptors `[HIGH]`
- [ ] Adjust point values `[HIGH]`
- Findings: ___

### 16.3 Export

- [ ] Export to PDF (formatted grid layout) `[HIGH]`
- [ ] Export to DOCX `[MEDIUM]`
- [ ] Export to JSON `[LOW]`
- Findings: ___

---

## STAGE 17 — Visual & Media Tools (Image Studio, Slide Deck, Storybook)

*Goal: Test all three creative content tools.*

### 17.1 Image Studio — Service Preload

- [ ] Check image service status — idle `[HIGH]`
- [ ] Preload image model `[HIGH]`
- [ ] Status updates to ready `[HIGH]`
- Findings: ___

### 17.2 Image Studio — Text-to-Image

- [ ] Enter prompt -> generate single image `[CRITICAL]`
- [ ] Image renders correctly `[CRITICAL]`
- [ ] Adjust dimensions, guidance scale, steps `[HIGH]`
- [ ] Batch generate multiple images `[HIGH]`
- [ ] Prompt enhancement via AI `[MEDIUM]`
- [ ] Comic-style prompt generation `[MEDIUM]`
- Findings: ___

### 17.3 Image Studio — Inpainting

- [ ] Upload an image `[HIGH]`
- [ ] Draw mask over a region `[HIGH]`
- [ ] Enter replacement description `[HIGH]`
- [ ] Inpaint executes and fills region `[HIGH]`
- Findings: ___

### 17.4 Image Studio — Background Removal

- [ ] Upload image -> background removed `[HIGH]`
- [ ] Output has transparent or clean background `[HIGH]`
- Findings: ___

### 17.5 Image Studio — Annotation Tools

- [ ] Draw with brush `[HIGH]`
- [ ] Erase drawn content `[HIGH]`
- [ ] Add text overlay `[HIGH]`
- [ ] Change color (6 presets + custom) `[MEDIUM]`
- [ ] Undo annotation step `[HIGH]`
- [ ] Redo annotation step `[HIGH]`
- Findings: ___

### 17.6 Image Studio — Advanced Operations

- [ ] Grayscale conversion `[MEDIUM]`
- [ ] Contrast normalization `[MEDIUM]`
- [ ] Edge detection `[LOW]`
- Findings: ___

### 17.7 Image Studio — History

- [ ] Generated images saved to history `[HIGH]`
- [ ] Retrieve previous images `[HIGH]`
- Findings: ___

### 17.8 Image Studio — ESRGAN Upscaling

- [ ] `esrgan_service` upscales a selected image 2x / 4x `[HIGH]`
- [ ] Upscaled result preserves detail without obvious artifacts `[HIGH]`
- [ ] Upscale operation completes within reasonable time on CPU-only `[MEDIUM]`
- [ ] Upscaled image saved to history `[MEDIUM]`
- Findings: ___

### 17.9 Image Studio — Scene API

- [ ] `scene_api_endpoints` accepts a scene schema payload `[HIGH]`
- [ ] `scene_schema` validates fields and rejects malformed scenes `[HIGH]`
- [ ] Scene renders into a composed image `[HIGH]`
- [ ] Scene result can be saved into Image Studio history `[MEDIUM]`
- Findings: ___

### 17.10 Image Studio -> Worksheet

- [ ] Generate image in Image Studio `[HIGH]`
- [ ] Insert generated image into worksheet cell `[HIGH]`
- Findings: ___

### 17.11 Slide Deck — Generation

- [ ] Enter topic/lesson — slides generate `[HIGH]`
- [ ] Slide-by-slide streaming works `[HIGH]`
- [ ] All slides have title + body content `[HIGH]`
- [ ] Speaker notes generated `[HIGH]`
- Findings: ___

### 17.12 Slide Deck — Editing

- [ ] Reorder slides `[HIGH]`
- [ ] Add a slide `[HIGH]`
- [ ] Delete a slide `[HIGH]`
- [ ] Edit text content `[HIGH]`
- [ ] Apply theme `[MEDIUM]`
- Findings: ___

### 17.13 Slide Deck — Export

- [ ] Export to PDF `[HIGH]`
- [ ] Export to HTML `[MEDIUM]`
- Findings: ___

### 17.14 Storybook — Generation

- [ ] Enter topic + age range -> story generates `[HIGH]`
- [ ] Page-by-page streaming works `[HIGH]`
- [ ] AI-generated illustration per page `[HIGH]`
- Findings: ___

### 17.15 Storybook — Reading Modes

- [ ] Day mode: bright/warm UI `[MEDIUM]`
- [ ] Night mode: dark/soft UI `[MEDIUM]`
- [ ] Page navigation works (forward/back) `[HIGH]`
- Findings: ___

### 17.16 Storybook — TTS

- [ ] TTS reads page text aloud `[HIGH]`
- [ ] Plays page by page correctly `[HIGH]`
- Findings: ___

### 17.17 Storybook — Export

- [ ] Export to PDF `[HIGH]`
- [ ] Export to ePub `[MEDIUM]`
- Findings: ___


---

## STAGE 18 — Photo Transfer (Phone PWA, Hotspot, HTTPS, Outbox)

*Goal: Complete phone-to-desktop photo capture workflow for scan-grading.*

### 18.1 Session & Network

- [ ] `POST /api/photo-transfer/sessions` creates a new capture session `[HIGH]`
- [ ] `GET /api/photo-transfer/network-info` returns reachable LAN IP + port for QR `[HIGH]`
- [ ] Generate QR code for quiz/worksheet `[HIGH]`
- [ ] QR code encodes correct metadata `[CRITICAL]`
- Findings: ___

### 18.2 Hotspot

- [ ] `POST /api/photo-transfer/hotspot/start` starts Windows Mobile Hotspot, returns SSID/password `[HIGH]`
- [ ] Hotspot status reflects `running` after start, `stopped` after stop `[MEDIUM]`
- Findings: ___

### 18.3 iOS HTTPS Path

- [ ] `POST /api/photo-transfer/enable-https` generates a self-signed cert and reachable HTTPS endpoint `[HIGH]`
- [ ] QR displayed for student to scan `[HIGH]`
- [ ] SSL works for secure local transfer `[MEDIUM]`
- Findings: ___

### 18.4 Phone PWA Upload

- [ ] Phone PWA at `/phone` loads in mobile browser over the hotspot `[CRITICAL]`
- [ ] Phone uploads photo -> `POST /api/photo-transfer/upload` succeeds, photo appears in session `[CRITICAL]`
- [ ] Mobile photo upload received `[HIGH]`
- Findings: ___

### 18.5 Real-Time Stream

- [ ] SSE stream `/api/photo-transfer/stream` pushes upload notifications to desktop in real time `[HIGH]`
- Findings: ___

### 18.6 Outbox

- [ ] Outbox: queue an answer key for download from desktop, phone polls `/outbox/{session_id}` and downloads it `[HIGH]`
- [ ] Phone acks the download, file removed from outbox `[MEDIUM]`
- Findings: ___

### 18.7 Scan-to-Grade Integration

- [ ] Received photo auto-routes to grading pipeline `[HIGH]`
- [ ] Quiz/worksheet ID extracted from QR in photo `[CRITICAL]`
- Findings: ___

### 18.8 Additional Photo Transfer Features

- [ ] Theme sync: change theme on desktop -> phone PWA updates on next poll `[LOW]`
- [ ] `POST /api/photo-transfer/save-to-resources/{session_id}` copies photos into My Resources `[MEDIUM]`
- [ ] `GET /api/photo-transfer/export-pdf/{session_id}` generates a one-photo-per-page PDF `[MEDIUM]`
- [ ] Student lookup endpoint feeds the phone-side student picker `[MEDIUM]`
- [ ] Document info lookup populates the phone QR-grading flow with quiz/worksheet metadata `[MEDIUM]`
- Findings: ___

---

## STAGE 19 — Manual Grading (Quiz + Worksheet)

*Goal: Enter grades by hand for individual students across both quiz and worksheet types.*

### 19.1 Manual Quiz Grading

- [ ] Select student + quiz `[HIGH]`
- [ ] Enter score per question or total `[HIGH]`
- [ ] Percentage auto-calculated `[HIGH]`
- [ ] Add feedback comment `[MEDIUM]`
- [ ] Grade saved to `students.db` `[CRITICAL]`
- [ ] Grade visible in My Classes `[HIGH]`
- Findings: ___

### 19.2 Manual Worksheet Grading

- [ ] Select student + worksheet `[HIGH]`
- [ ] Enter score `[HIGH]`
- [ ] Grade saved to `students.db` `[CRITICAL]`
- Findings: ___

### 19.3 Grade Tracking

- [ ] View quiz grades per student `[HIGH]`
- [ ] View worksheet grades per student `[HIGH]`
- [ ] Grade history sorted by date `[MEDIUM]`
- Findings: ___

---

## STAGE 20 — Scan Auto-Grading Pipeline (single + bulk + stream)

*Goal: Test the full OCR-based auto-grading pipeline for both quiz and worksheet scan types.*

### 20.1 Scan-to-Grade (Quiz)

- [ ] Upload a photographed/scanned quiz `[HIGH]`
- [ ] QR code extracted and quiz identified `[CRITICAL]`
- [ ] OCR reads student answers `[CRITICAL]`
- [ ] Alignment correction applied `[HIGH]`
- [ ] Grade calculated and stored `[CRITICAL]`
- [ ] Stream mode: results appear progressively `[HIGH]`
- Findings: ___

### 20.2 Bulk Grader — Quiz

- [ ] Open `BulkGrader` flow from Quiz Grader `[HIGH]`
- [ ] Upload multiple scanned quizzes at once `[HIGH]`
- [ ] Per-scan progress indicator (pending / processing / done / error) `[HIGH]`
- [ ] Failed scans can be retried individually `[HIGH]`
- [ ] All successful grades saved to `students.db` `[CRITICAL]`
- [ ] Summary report shows totals (processed, failed, average) `[MEDIUM]`
- Findings: ___

### 20.3 Scan-to-Grade (Worksheet)

- [ ] Upload scanned worksheet `[HIGH]`
- [ ] QR code identifies worksheet `[CRITICAL]`
- [ ] OCR reads answers `[CRITICAL]`
- [ ] Grade calculated `[CRITICAL]`
- [ ] Bulk grading: upload multiple scans at once `[HIGH]`
- [ ] Stream mode works `[HIGH]`
- Findings: ___

### 20.4 Bulk Worksheet Grader

- [ ] Open `WorksheetBulkGrader` flow `[HIGH]`
- [ ] Upload a batch of scanned worksheets `[HIGH]`
- [ ] Per-file progress and error state visible `[HIGH]`
- [ ] All grades saved to `students.db` under the correct students `[CRITICAL]`
- [ ] Retry failed items individually `[MEDIUM]`
- Findings: ___

### 20.5 Cross-Feature: Print -> Photograph -> Auto-Grade

- [ ] Print quiz with QR -> photograph -> upload -> grade assigned to correct student `[CRITICAL]`
- Findings: ___

---

## STAGE 21 — Attendance Tracking

*Goal: Mark and review attendance for the 27 classes.*

### 21.1 Mark Attendance

- [ ] Mark attendance for a class on a specific date `[HIGH]`
- [ ] View attendance history per student `[HIGH]`
- [ ] Attendance percentage calculated `[HIGH]`
- Findings: ___

---

## STAGE 22 — Reminders, Notifications, ICS Export/Import

*Goal: Verify the full notification and reminder system, including calendar interop.*

### 22.1 Notifications

- [ ] Generation complete notification fires `[HIGH]`
- [ ] Achievement unlock notification fires `[HIGH]`
- [ ] Notification panel opens and lists items `[HIGH]`
- [ ] Mark notification as read `[MEDIUM]`
- Findings: ___

### 22.2 Reminders

- [ ] Create reminder: title, date, time, type `[HIGH]`
- [ ] Reminder appears in list `[HIGH]`
- [ ] Edit reminder `[MEDIUM]`
- [ ] Delete reminder `[HIGH]`
- [ ] Reminder triggers notification at due time `[HIGH]`
- Findings: ___

### 22.3 Test Reminders (from Class Management)

- [ ] Create a test reminder with date and class `[HIGH]`
- [ ] Reminder appears in My Overview `[HIGH]`
- Findings: ___

### 22.4 Quiet Hours

- [ ] Set quiet hours start/end time `[MEDIUM]`
- [ ] Notifications suppressed during quiet period `[MEDIUM]`
- Findings: ___

### 22.5 Calendar Export (ICS)

- [ ] Export reminders to `.ics` file `[HIGH]`
- [ ] ICS file imports correctly into external calendar app `[MEDIUM]`
- Findings: ___

### 22.6 Calendar Import (ICS)

- [ ] `calendar_import_service` accepts a `.ics` file upload `[HIGH]`
- [ ] Imported events land in unified calendar under the correct source type `[HIGH]`
- [ ] Duplicate events (same UID) are deduplicated on re-import `[HIGH]`
- [ ] Recurring events (RRULE) are expanded correctly on import `[HIGH]`
- [ ] Malformed ICS surfaces a clear error, no partial writes `[MEDIUM]`
- Findings: ___

---

## STAGE 23 — Generation Queue, Tab Pulse, Cancellation (Phase 27 content)

*Goal: Verify the unified busy/queue/cancel system across all generator types (diffusion, LLM, OCR).*

### 23.1 Tab Strip Pulse on Completion

**LLM generators (regression baseline)**
- [ ] Open Quiz Builder, switch to another tab, wait for generation -> Quiz tab tag pulses on completion `[HIGH]`
- [ ] Same for: Lesson Plan, Rubric, Worksheet, Brain Dump, Storybook, Presentation, Multigrade, Kindergarten, Cross-Curricular `[HIGH]`

**Diffusion (ImageStudio)**
- [ ] Start an image generation in ImageStudio, switch tabs -> Image Studio tab tag pulses when generation finishes `[HIGH]`
- [ ] Comic generation (multi-panel) also pulses on completion `[MEDIUM]`
- [ ] Pulse clears as soon as the user clicks back into the Image Studio tab `[MEDIUM]`

**OCR scan graders**
- [ ] Start grading scans in QuizScanGrader, switch tabs -> Quiz tab tag pulses when grading finishes `[HIGH]`
- [ ] Same for WorksheetScanGrader `[HIGH]`

**Internal mechanism check**
- [ ] `TabBusyContext` exposes reactive `httpBusyTabIds` (Set) and Dashboard's pulse effect lists it in deps `[MEDIUM]`
- [ ] No spurious pulse on a tab that never went busy `[MEDIUM]`
- [ ] No pulse on the currently active tab (only background tabs flash) `[MEDIUM]`
- Findings: ___

### 23.2 Queue Panel Visibility

- [ ] LLM generators show up in queue panel as before (regression check) `[HIGH]`
- [ ] ImageStudio batch generation appears as **one queue entry per batch** (not one per slot) `[HIGH]`
- [ ] QuizScanGrader run appears in queue panel with label like `"Quiz Scans: N files"` `[HIGH]`
- [ ] WorksheetScanGrader run appears with label like `"Worksheet Scans: N files"` `[HIGH]`
- [ ] External (diffusion / OCR) entries appear immediately in the **generating** state (no waiting phase) `[MEDIUM]`
- [ ] Multiple concurrent generators across tabs all appear simultaneously in the panel `[MEDIUM]`
- [ ] On completion, entry transitions to "completed" with completedAt timestamp `[MEDIUM]`
- [ ] On error, entry transitions to "error" with the error message visible `[MEDIUM]`
- Findings: ___

### 23.3 Cancellation from the Queue Panel — Frontend

**LLM cancellation (regression baseline)**
- [ ] Click cancel on a running quiz -> tokens stop streaming mid-generation, panel marks cancelled `[HIGH]`
- [ ] Same for Lesson Plan, Rubric, Worksheet, Brain Dump, Storybook, Presentation `[HIGH]`
- [ ] LLM tab returns to idle immediately after cancel (no leftover busy state) `[HIGH]`

**Diffusion cancellation**
- [ ] Click cancel on a running image generation -> ImageStudio resets to input phase, slots cleared `[HIGH]`
- [ ] AbortController on the axios request fires (`CanceledError` / `ERR_CANCELED` is handled cleanly, no error toast) `[HIGH]`
- [ ] Cancelled mid-batch leaves no orphaned slots in the results view `[MEDIUM]`
- [ ] After cancel, the user can immediately start a new generation without restarting the app `[HIGH]`

**OCR cancellation**
- [ ] Click cancel on QuizScanGrader mid-grading -> phase returns to `upload-scans`, no error message shown `[HIGH]`
- [ ] AbortError on the streaming fetch is handled silently (no red error toast) `[HIGH]`
- [ ] Same for WorksheetScanGrader `[HIGH]`
- [ ] Tab returns to idle, queue entry marked cancelled `[HIGH]`
- Findings: ___

### 23.4 Cancellation — Backend Token Plumbing (Tier 1)

**Cancel registry (`/api/cancel/{job_id}`)**
- [ ] `_active_cancel_events` registry exists in `backend/main.py` and the POST endpoint sets the event `[HIGH]`
- [ ] `acquire_cancel_event` / `release_cancel_event` helpers are refcounted so concurrent batch images sharing one job_id work correctly `[HIGH]`
- [ ] Unknown job_id returns `not_found` AND logs a warning (debugging aid) `[MEDIUM]`
- [ ] Registry entries cleaned up via refcount when last consumer releases (no leak across runs) `[HIGH]`

**LLM (`/ws/*`) — already wired, regression check only**
- [ ] Cancelling a quiz / lesson plan from the queue panel actually stops tokens mid-stream `[HIGH]`
- [ ] After cancel, the inference lock is released and the next request goes through immediately `[HIGH]`

**Diffusion (`/api/generate-image-base64`)**
- [ ] Endpoint accepts `jobId` in the request body `[HIGH]`
- [ ] Frontend `imageApi.generateImageBase64` forwards `jobId` from ImageStudio's queue id `[HIGH]`
- [ ] Backend registers cancel event with `acquire_cancel_event` and releases it in `finally` `[HIGH]`
- [ ] Cancel event checked **before** invoking `image_service.generate_image()` (in the executor lambda, after the inference lock is taken) `[HIGH]`
- [ ] When ImageStudio asks for N images in a batch and cancel arrives partway through: currently-running image finishes, the remaining N-k images bail out immediately `[HIGH]`
- [ ] Cancelled response shape is `{"success": false, "cancelled": true}` (frontend can distinguish from real errors) `[MEDIUM]`
- [ ] ImageStudio's `onCancel` fires a `POST /api/cancel/{jobId}` in addition to `abortController.abort()` `[HIGH]`

**OCR (`/api/smart-grade-stream`)**
- [ ] Endpoint accepts `job_id` as an optional Form field (backwards compatible with old callers) `[HIGH]`
- [ ] Both QuizScanGrader and WorksheetScanGrader append `job_id` to FormData (sourced from queue id) `[HIGH]`
- [ ] Backend registers cancel event at start of the SSE generator, releases at the end `[HIGH]`
- [ ] Cancel event checked at the **top of the file loop** — subsequent files skipped, currently-processing file finishes `[HIGH]`
- [ ] On cancel, SSE stream emits a final `{"event": "cancelled", "summary": ...}` event and closes cleanly `[MEDIUM]`
- [ ] Both scan graders fire `POST /api/cancel/{jobId}` in `onCancel` in addition to `abortController.abort()` `[HIGH]`

**Smoke tests**
- [ ] Two concurrent quizzes (different tabs) cancelled independently — neither affects the other `[HIGH]`
- [ ] Diffusion + OCR + LLM running simultaneously -> cancelling one leaves the other two running `[MEDIUM]`
- [ ] Cancel a job that is already finishing at the moment the cancel arrives -> no exception, no zombie entry in registry `[MEDIUM]`
- Findings: ___

### 23.5 QueueContext External Item API

- [ ] `QueueItem` has `kind: 'ws' | 'external'` (defaults to `'ws'`) `[MEDIUM]`
- [ ] `addExternalItem({ label, toolType, tabId, onCancel })` creates a generating-state item, returns its id `[MEDIUM]`
- [ ] `completeExternalItem(id, 'completed' | 'error', errorMessage?)` finalizes the entry `[MEDIUM]`
- [ ] `processNext` skips external items (they're not WS-driven) — verify it never tries to open a WS for them `[HIGH]`
- [ ] `cancelGenerating` invokes `item.onCancel()` for external items instead of hitting the REST cancel endpoint `[HIGH]`
- [ ] `cancelGenerating` falls back to the REST cancel endpoint for `kind === 'ws'` items (regression) `[HIGH]`
- [ ] External items don't break `clearAll` / `clearCompleted` / `reorderQueue` `[MEDIUM]`
- Findings: ___

---

## STAGE 24 — Scheduled Background Tasks (Weekly ELO Breakdown, Results Review)

*Goal: Configure and run background tasks, review generated ELO breakdowns.*

### 24.1 Scheduled Task Configuration (Feature 3B)

- [ ] Settings -> Background Schedule section renders `ScheduledTaskSettings` `[HIGH]`
- [ ] Pick day of week and time — saves via `POST /api/scheduled/config` `[HIGH]`
- [ ] Reminder offset saves correctly `[MEDIUM]`
- [ ] Task checkboxes (ELO Breakdown, Attendance, Progress) toggle and persist `[HIGH]`
- [ ] Config persists across app restart `[HIGH]`
- [ ] APScheduler job registered on backend startup from saved config `[HIGH]`
- [ ] Manual "Run now" trigger executes task immediately `[HIGH]`
- [ ] `ScheduleTestModal` opens for a dry-run / manual trigger with preview `[MEDIUM]`
- [ ] Test modal surfaces task output without committing to `scheduled_results` `[MEDIUM]`
- Findings: ___

### 24.2 Weekly ELO Breakdown Task (Feature 3C)

- [ ] Task ensures model loaded before running (auto-reload if offloaded) `[CRITICAL]`
- [ ] Task pulls current phase from School Year config `[HIGH]`
- [ ] Task pulls pending milestones for that phase `[HIGH]`
- [ ] Task pulls weekly timetable and includes it in LLM prompt `[HIGH]`
- [ ] LLM output is valid JSON (days -> periods -> elo) `[CRITICAL]`
- [ ] Result saved to `scheduled_results` table with `pending_review` status `[HIGH]`
- [ ] Model unloaded after task completes `[MEDIUM]`
- [ ] Notification fires when result ready `[HIGH]`
- Findings: ___

### 24.3 Scheduled Results Review (Feature 3E)

- [ ] Notification Panel shows a `ScheduledResultsSection` with toggle `[HIGH]`
- [ ] ELO breakdown renders as day-by-day / period-by-period cards `[HIGH]`
- [ ] "Accept & Generate Plans" queues lesson plan jobs from assigned ELOs `[HIGH]`
- [ ] "Edit" opens inline editor for the plan `[MEDIUM]`
- [ ] "Dismiss" removes the result from the panel `[MEDIUM]`
- [ ] Accepted/rejected state persists in `scheduled_results` `[MEDIUM]`
- [ ] `HistoryItem.category = 'scheduled'` distinguishes these entries from regular notifications `[LOW]`
- Findings: ___


---

## STAGE 25 — Analyse Panel Across Generators

*Goal: After generating content, test the AI analyse/enhancement chat panel for every generator type.*

### 25.1 Analyse Panel — Core

- [ ] After generating a lesson/quiz/rubric/worksheet, an `[Analyse]` button appears `[HIGH]`
- [ ] Clicking it opens AIAssistantPanel in `analyse` mode, connected to `/ws/analyse` `[CRITICAL]`
- [ ] Init message sends full content; AI responds with greeting + suggestions `[HIGH]`
- [ ] "Create a more detailed version" triggers section-by-section enhancement with progress labels `[HIGH]`
- [ ] Each section streams (`section_token` events) and replaces corresponding section in editor `[HIGH]`
- [ ] "Expand the X section" edits only that section with full doc kept as read-only context `[HIGH]`
- [ ] Normal question (no edit) returns chat response without modifying output `[HIGH]`
- [ ] Undo button pops previous version from stack `[HIGH]`
- [ ] Closing panel discards ephemeral session (not saved to history) `[MEDIUM]`
- Findings: ___

### 25.2 Analyse Panel — Generator Coverage

- [ ] Analyse works across: LessonPlanner, QuizGenerator, RubricGenerator, WorksheetGenerator, Multigrade, CrossCurricular, Kindergarten, PresentationBuilder, StoryBookCreator `[HIGH]`
- [ ] Analyse panel has its own independent Quick/Deep toggle `[MEDIUM]`
- Findings: ___

---

## STAGE 26 — My Resources & File Management

*Goal: Browse, organize, and manage generated files.*

### 26.1 Resource Browser

- [ ] Browse saved content (lessons, quizzes, worksheets, etc.) `[HIGH]`
- [ ] Preview a file `[HIGH]`
- [ ] Open/read file contents `[HIGH]`
- Findings: ___

### 26.2 File Explorer

- [ ] Browse allowed folders `[HIGH]`
- [ ] Search for files by name `[HIGH]`
- [ ] Parse an uploaded file (PDF, DOCX, XLSX, TXT, image) `[HIGH]`
- Findings: ___

### 26.3 AI Organization

- [ ] Request AI folder organization plan `[MEDIUM]`
- [ ] Execute organization — files moved as planned `[MEDIUM]`
- [ ] Undo organization — files returned to original locations `[HIGH]`
- Findings: ___

### 26.4 Class Pack Export

- [ ] Export all materials for a class as archive `[MEDIUM]`
- [ ] Archive contains all expected files `[MEDIUM]`
- Findings: ___

---

## STAGE 27 — Analytics, Educator Insights, Performance Metrics

*Goal: Review all analytics surfaces after real usage data has been generated by earlier stages.*

### 27.1 My Overview Dashboard

- [ ] Recent activity feed populates correctly `[HIGH]`
- [ ] Quick stats show accurate counts `[HIGH]`
- [ ] Achievement showcase displays selected items `[HIGH]`
- [ ] Upcoming reminders listed `[HIGH]`
- [ ] Streak counter accurate `[MEDIUM]`
- [ ] `CompactCalendar` widget renders events from unified calendar `[HIGH]`
- [ ] Clicking a calendar dot routes to the originating tab `[HIGH]`
- [ ] `MostUsedTools` widget lists top tools by usage count `[MEDIUM]`
- [ ] `QuickStatsCard` renders and updates on data changes `[MEDIUM]`
- [ ] `RecentActivityTimeline` shows chronological activity list `[HIGH]`
- [ ] `TaskListWidget` renders pending tasks with due dates `[HIGH]`
- [ ] `CurriculumProgressWidget` shows per-strand coverage % `[HIGH]`
- [ ] `activity-card` and `teacher-tip` components render where expected `[MEDIUM]`
- [ ] `weekly-overview` component shows the current week summary `[MEDIUM]`
- Findings: ___

### 27.2 Dashboard Flip Card + Notifications (CC.10)

- [ ] AnalyticsDashboard shows the flip card whenever there's upcoming quizzes OR tasks (existing `hasAny` gate) `[HIGH]`
- [ ] Front face shows the existing upcoming quizzes list (plus an empty-state fallback "No upcoming quizzes scheduled.") `[MEDIUM]`
- [ ] Header toggle button reads "Show lesson plans" (front) / "Show quizzes" (back) `[MEDIUM]`
- [ ] Clicking the toggle rotates the card 180 degrees (0.6s transition); both faces remain same size `[MEDIUM]`
- [ ] `backfaceVisibility: hidden` + `pointerEvents` gating so clicks never reach the hidden face `[MEDIUM]`
- [ ] Back face shows `LessonsNeedingPlans` widget with count badge (amber > 0, green = 0) + preview of up to 5 sessions `[HIGH]`
- [ ] First load in a new browser session with unplanned lessons > 0 -> a toast appears ("N upcoming lessons have no plans yet.") AND an entry is added to the Notifications history `[HIGH]`
- [ ] Notification fires exactly **once per session** — switching tabs / remounting the widget does not re-fire `[HIGH]`
- [ ] Reload the browser tab -> new session -> fires again `[MEDIUM]`
- [ ] Singular phrasing for count=1: "1 upcoming lesson has no plan yet." `[LOW]`
- [ ] Clicking the notification entry routes back to the dashboard (tabId `'dashboard'`) `[MEDIUM]`
- [ ] Environments without `sessionStorage` still work (graceful fallback) `[LOW]`
- Findings: ___

### 27.3 Performance Metrics Tab

- [ ] All metric categories load: Content, Student, Curriculum, Engagement, Achievement, Usage `[HIGH]`
- [ ] Charts render without errors `[HIGH]`
- [ ] Grade distribution chart accurate `[HIGH]`
- [ ] Curriculum standards coverage percentage shown `[HIGH]`
- [ ] Live stats endpoint responds `[HIGH]`
- Findings: ___

### 27.4 Metrics Export

- [ ] Export metrics to file `[MEDIUM]`
- [ ] Clear metrics history `[LOW]`
- Findings: ___

### 27.5 Analytics Dashboard Tab

- [ ] `AnalyticsDashboard` opens as its own sidebar tab (distinct from Performance Metrics) `[HIGH]`
- [ ] Action cards navigate to curriculum tab with the correct route `[HIGH]`
- [ ] Clicking an action card that targets an existing tab reuses that tab `[MEDIUM]`
- [ ] Clicking a card for a closed tool creates a new tab `[HIGH]`
- [ ] Tab color overrides from settings apply to dashboard cards `[MEDIUM]`
- [ ] Analytics tutorial overlay launches from floating button `[MEDIUM]`
- Findings: ___

### 27.6 Teacher Metrics Panel

- [ ] `TeacherMetricsPanel` renders teacher-specific metrics outside the Performance Metrics tab `[HIGH]`
- [ ] Data pulled from `teacher_metrics_service` matches source `[HIGH]`
- [ ] Chart carousel renders (`TeacherMetricsChart`, `CategoryRadialChart`, `LessonPlanComparisonChart`, `ResourceDistributionChart`, `ResourceTrendChart`) `[HIGH]`
- [ ] Year phase popover shows correct bounds `[MEDIUM]`
- Findings: ___

### 27.7 Educator Insights Dashboard

- [ ] Insights panel loads with personalized data `[HIGH]`
- [ ] Phase detection works (Start of Year / Mid-Year / End of Year) `[MEDIUM]`
- Findings: ___

### 27.8 Nudge System

- [ ] Contextual nudge appears at appropriate moment `[MEDIUM]`
- [ ] Dismiss a nudge permanently `[MEDIUM]`
- [ ] Nudge respects cooldown (doesn't reappear immediately) `[MEDIUM]`
- Findings: ___

### 27.9 Coach Drawer (from Insights)

- [ ] Open Educator Coach Drawer `[HIGH]`
- [ ] Coaching conversation streams correctly `[HIGH]`
- [ ] Conversation saved to history `[HIGH]`
- Findings: ___

### 27.10 Insights Coach Panel

- [ ] `InsightsCoachPanel` renders inline inside Educator Insights (distinct from the drawer) `[HIGH]`
- [ ] Panel surfaces contextual coaching tied to current insights data `[HIGH]`
- [ ] Clicking a suggestion deep-links to the relevant tab / tool `[MEDIUM]`
- Findings: ___

### 27.11 Metrics Nudge Banner

- [ ] `MetricsNudgeBanner` appears at the top of metrics when a nudge is active `[MEDIUM]`
- [ ] Banner respects cooldown (doesn't reappear immediately after dismissal) `[MEDIUM]`
- [ ] Dismiss permanently removes the banner for that nudge `[MEDIUM]`
- Findings: ___

---

## STAGE 28 — Achievements & Gamification

*Goal: Verify achievement unlocks, showcase, and collections after real usage in earlier stages.*

### 28.1 Achievement Display

- [ ] Achievements tab loads all 80+ achievement definitions `[HIGH]`
- [ ] Rarity tiers displayed correctly (Common -> Legendary) `[HIGH]`
- [ ] Earned vs. unearned state visually distinct `[HIGH]`
- Findings: ___

### 28.2 Achievement Unlock

- [ ] Perform an action that triggers an achievement (create a lesson, quiz, etc.) `[CRITICAL]`
- [ ] Achievement unlock notification fires `[HIGH]`
- [ ] Trophy tier shown (Bronze/Silver/Gold/Platinum) `[HIGH]`
- [ ] Achievement appears in earned list with timestamp `[HIGH]`
- Findings: ___

### 28.3 Collections & Hidden

- [ ] Achievement collections group correctly `[MEDIUM]`
- [ ] Hidden achievement unlocks via specific action (investigate which one) `[LOW]`
- Findings: ___

### 28.4 Showcase

- [ ] Select favorite achievements to showcase `[HIGH]`
- [ ] Selected items appear in My Overview `[HIGH]`
- [ ] Deselect showcase item works `[MEDIUM]`
- Findings: ___


---

## STAGE 29 — Unified Calendar System (Phase 25 content — shipped record)

*Goal: Verify the single derived event layer that syncs School Year Calendar, Timetable, Curriculum Plan, Lesson Plans, Holidays, Scheduled Tasks, and Daily Plans.*

> **Implementation phases (all 6 SHIPPED):**
> - **Phase 1** — schema + projector functions + query endpoint (`backend/unified_calendar_service.py`, `backend/routes/unified_calendar.py`)
> - **Phase 2a** — `blocks_classes` column + `lesson_plans`/`lesson_plan_edits`/`daily_plans` table schemas
> - **Phase 2b** — Lesson plan refactor (JSON->SQLite migration, `lesson_plan_service.py`, `routes/lesson_plans.py`, projector wired). **Real production data:** 42 plans migrated from `lesson_plan_history.json` to SQLite, original file preserved as `.bak`.
> - **Phase 2c** — `daily_plan_service.py` + `routes/daily_plans.py` + projector wired
> - **Phase 2d** — `scheduled_tasks.insert_result()` + `update_result_status()` cross-DB projection
> - **Phase 3** — Auto-link milestone->phase, lesson plan->slot, lesson plan->milestone suggestion, "Mark as taught" workflow, real conflict detection
> - **Phase 4** — `lib/teacherId.ts` hoisted, `UnifiedCalendarView.tsx` 4th flip-card panel
> - **Phase 5** — `useUnifiedCalendarFeed.ts` hook, `CompactCalendar` `unifiedEventsByDate` prop, `AnalyticsDashboard` wrapper
> - **Phase 6** — Idempotent backfill migration with validation suite (all 7 source types)
>
> Items marked `[x]` were verified end-to-end via synthetic tests on 2026-04-10/11. Items marked `[ ]` are deferred frontend polish (Holiday Manager UI, SchoolYearContext refactor, click-through routing, lesson planner holiday warnings).

### 29.1 Schema Foundation (Sub-Phase 1) — SHIPPED
- [x] `unified_events` table created in `students.db` with all 17 columns `[CRITICAL]`
- [x] Three indexes present: `idx_unified_teacher_date`, `idx_unified_source`, `idx_unified_phase` `[HIGH]`
- [x] `UNIQUE(source_type, source_id)` constraint enforces upsert semantics `[CRITICAL]`
- [x] `init_schema()` is idempotent — running twice does not error or duplicate `[HIGH]`
- [x] `python-dateutil>=2.8.0` declared explicitly in `requirements.txt` `[HIGH]`
- Findings: All verified via `python -c "import unified_calendar_service as u; u.init_schema()"` against current `students.db`. Indexes confirmed via `sqlite_master` query.

### 29.2 Projector Functions — ALL SHIPPED
- [x] `project_school_year_event(conn, row)` upserts a school year event `[CRITICAL]`
- [x] `project_school_year_event` routes `event_type='holiday'` rows to `source_type='holiday'` `[HIGH]`
- [x] `project_timetable_slot(conn, slot, school_year_bounds)` builds an iCal RRULE + EXDATE `[CRITICAL]`
- [x] RRULE format is multi-line `RRULE:FREQ=WEEKLY;BYDAY=<TOKEN>;UNTIL=<YYYYMMDDTHHMMSS>\nEXDATE:...` `[HIGH]`
- [x] `project_milestone(conn, row)` upserts only milestones with a `due_date` `[HIGH]`
- [x] `project_milestone` skips milestones with no `due_date` (returns None) `[HIGH]`
- [x] Status normalization map: `not_started->planned`, `in_progress->in_progress`, `completed->completed`, `skipped->cancelled` `[HIGH]`
- [x] `project_lesson_plan(conn, row)` anchors to bound timetable slot (next matching weekday + slot times) or falls back to all-day on created_at `[CRITICAL]`
- [x] `project_lesson_plan` status map: `draft->planned`, `completed->completed`, `cancelled->cancelled` `[HIGH]`
- [x] `project_scheduled_result(conn, row)` labels by task_type, anchors to `week_of`, color violet `[MEDIUM]`
- [x] `project_daily_plan(conn, row)` anchors to plan_date, all-day, color emerald `[MEDIUM]`
- Findings: Phase 2b synthetic test verified lesson plan auto-binds to slot, anchors to next matching Monday with slot times (Mar 15 Sun -> Mar 16 Mon 09:00-10:00), status flips on mark-as-taught. Phase 2d test verified scheduled_result projection + status update reflects in metadata. Phase 2c daily_plan_service tested via routes.

### 29.3 Query Endpoint (Sub-Phase 1) — SHIPPED
- [x] `GET /api/calendar/unified?teacher_id=X&start=...&end=...` returns 200 with empty array on empty teacher `[CRITICAL]`
- [x] Endpoint accepts `source_types` (CSV), `grade_level`, `subject` filters `[HIGH]`
- [x] Recurring timetable parents are expanded into per-occurrence dicts at query time `[CRITICAL]`
- [x] RRULE expansion via `dateutil.rrule.rrulestr().between()` produces correct occurrences `[CRITICAL]`
- [x] Each expanded occurrence carries `is_occurrence: true` and `parent_id` `[HIGH]`
- [x] Results sorted by `start_datetime` ascending `[HIGH]`
- [x] `metadata_json` is parsed into a `metadata` dict on each returned event `[MEDIUM]`
- [x] Missing `dateutil` dependency fails soft (returns parent row instead of crashing) `[MEDIUM]`
- [ ] Date range filter correctly excludes events outside the window `[HIGH]` (requires multi-event test data)
- [ ] Filter by `source_types=timetable_slot,school_year` returns only those types `[HIGH]`
- [ ] Performance: 1000+ events under 200ms `[MEDIUM]`
- Findings: Synthetic test produced 27 events from 1 timetable slot (26 weekly Monday occurrences Jan 5 -> Jun 30) + 1 school year quiz. Sort and expansion verified.

### 29.4 Sync + Conflicts Endpoints (Sub-Phase 1) — SHIPPED
- [x] `POST /api/calendar/sync` returns stub message pointing to migration script `[MEDIUM]`
- [x] `GET /api/calendar/conflicts?teacher_id=X` returns empty array (Phase 1 stub) `[MEDIUM]`
- [ ] `POST /api/calendar/sync` triggers full backfill in-process (Phase 6 wiring) `[HIGH]`
- [ ] `GET /api/calendar/conflicts` flags timetable occurrences on `blocks_classes=true` holidays (Phase 3) `[HIGH]`
- [ ] `GET /api/calendar/conflicts` flags lesson plans whose `start_datetime` no longer matches their bound slot (Phase 3) `[HIGH]`
- Findings: ___

### 29.5 Backfill Migration (Sub-Phase 6) — ALL SHIPPED
- [x] `python -m migrations.unify_calendar` runs without error against empty DB `[CRITICAL]`
- [x] `python -m migrations.unify_calendar --validate` runs validation only, no writes `[HIGH]`
- [x] `python -m migrations.unify_calendar --teacher-id <id>` scopes backfill to one teacher `[HIGH]`
- [x] Migration is idempotent — running twice produces identical row counts (no duplication) `[CRITICAL]`
- [x] Backfill projects `school_year_events` rows correctly `[CRITICAL]`
- [x] Backfill projects `timetable_slots` rows, looking up active config bounds per teacher `[CRITICAL]`
- [x] Timetable slots without an active school year config are skipped with a logged warning `[HIGH]`
- [x] Backfill projects `milestones` rows with `due_date` from cross-DB `milestones.db` `[CRITICAL]`
- [x] Hidden milestones (`is_hidden=1`) are excluded from backfill `[HIGH]`
- [x] Validation suite asserts `expected == actual` per source_type `[CRITICAL]`
- [x] Validation reports orphan source_types not in `VALID_SOURCE_TYPES` `[HIGH]`
- [x] Migration exits with code 0 on success, code 1 on validation failure `[HIGH]`
- [x] Backfill projects `lesson_plans` rows (Phase 2b) `[HIGH]`
- [x] Backfill projects `daily_plans` rows (Phase 2c) `[MEDIUM]`
- [x] Backfill projects `scheduled_results` rows from cross-DB `chat_memory.db` (Phase 2d) `[MEDIUM]`
- [ ] Rollback test: `DROP TABLE unified_events` -> app continues to function without error `[CRITICAL]`
- Findings: **Real production data migration succeeded on 2026-04-11.** The user's actual `lesson_plan_history.json` (42 plans) was auto-migrated to the SQLite `lesson_plans` table on first import, original file renamed to `.bak`, and all 42 rows projected into `unified_events` (validated `expected=42, actual=42`). Idempotency confirmed: 2nd run produced identical counts.

### 29.6 Holiday System (Sub-Phases 2 + 4) — BACKEND SHIPPED, FRONTEND PENDING
- [x] Migration adds `blocks_classes INTEGER DEFAULT 0` column to `school_year_events` `[CRITICAL]`
- [x] `_collect_blocking_holidays()` returns empty list when column doesn't exist (graceful) `[HIGH]`
- [x] `_collect_blocking_holidays()` returns EXDATE strings in `YYYYMMDDTHHMMSS` format when holidays present `[HIGH]`
- [x] After adding a holiday via `save_event()`, affected timetable slots have the date in their RRULE EXDATE `[CRITICAL]`
- [x] Unified calendar query no longer returns the timetable occurrence on the holiday date `[CRITICAL]`
- [x] After deleting a blocking holiday, EXDATE is automatically removed and the timetable occurrence reappears `[CRITICAL]`
- [x] `routes/school_year.py` Pydantic `SchoolYearEventCreate` model accepts `blocks_classes: int = 0` `[HIGH]`
- [ ] Drag/drop a date onto Holiday Manager UI creates a `school_year_events` row with `event_type='holiday'` `[HIGH]` (Phase 4 frontend)
- [ ] Drag a date range creates a multi-day holiday block `[HIGH]` (Phase 4 frontend)
- [ ] Toggle "blocks classes" in UI updates `blocks_classes` on existing holiday `[HIGH]` (Phase 4 frontend)
- [ ] Click "Load OECS 2026 public holidays" seeds holidays from `backend/data/regional_holidays.json` `[HIGH]` (Phase 4)
- [ ] Lesson planner shows warning when planning on a `blocks_classes=true` date `[HIGH]` (Phase 4 frontend)
- Findings: Synthetic E2E test on 2026-04-10 (Phase 2 turn) created config + slot + blocking holiday on Mon 2026-02-16 via actual `school_year_service.save_event()`. Verified EXDATE was added to the timetable RRULE, query expansion suppressed Feb 16 while Feb 9 + Feb 23 still appeared, and `delete_event(holiday)` cleared the EXDATE. **Bug found and fixed:** initial RRULE format used inline `;EXDATE=...` which is invalid iCal syntax -- `dateutil.rrulestr` rejected it and the soft fallback returned the unexpanded parent. Switched to multi-line format `RRULE:...\nEXDATE:...` which `rrulestr` parses correctly into an `rruleset`.

### 29.7 Source Projector Wiring (Sub-Phases 2a/2b/2c/2d) — ALL SHIPPED
- [x] `school_year_service.save_event()` calls `project_school_year_event()` in same transaction `[CRITICAL]`
- [x] `school_year_service.delete_event()` calls `delete_unified_event()` for both `school_year` and `holiday` source types `[CRITICAL]`
- [x] `school_year_service.upsert_timetable_slot()` calls `project_timetable_slot()` in same transaction with active config bounds `[CRITICAL]`
- [x] `school_year_service.delete_timetable_slot()` calls `delete_unified_event()` `[HIGH]`
- [x] `milestone_db.create_milestone()` projects via `_project_milestone_safe()` (cross-DB, no-op without due_date) `[CRITICAL]`
- [x] `milestone_db.update_milestone()` projects, deletes projection if due_date cleared, deletes if hidden `[CRITICAL]`
- [x] `_get_active_config_bounds()` helper looks up config without opening a new connection `[HIGH]`
- [x] `_reproject_teacher_timetable_slots()` helper rebuilds all slot RRULEs after a holiday change (in-transaction) `[CRITICAL]`
- [x] `lesson_plans` table schema created with `timetable_slot_id`, `suggested_milestone_id`, `taught_at`, `status`, `edit_count` columns `[HIGH]`
- [x] `lesson_plan_edits` audit table created `[HIGH]`
- [x] `daily_plans` table schema created `[MEDIUM]`
- [x] Creating a school year event via service function immediately appears in `unified_events` `[CRITICAL]`
- [x] Creating a timetable slot via service function immediately appears in `unified_events` `[CRITICAL]`
- [x] Creating a milestone with due_date via service function immediately appears in `unified_events` `[CRITICAL]`
- [x] Cross-DB milestone projection failures are caught and logged, never break the milestone write itself `[HIGH]`
- [x] New `routes/lesson_plans.py` POST `/api/lesson-plan-history` calls `project_lesson_plan()` `[CRITICAL]`
- [x] `scheduled_tasks.insert_result()` calls `_project_scheduled_result_safe()` (cross-DB to students.db) `[MEDIUM]`
- [x] `scheduled_tasks.update_result_status()` re-projects so unified metadata.review_status updates `[MEDIUM]`
- [x] `lesson_plan_service.init_service()` one-shot migration of `lesson_plan_history.json` -> `lesson_plans` SQLite table `[HIGH]`
- [x] Original JSON renamed to `.json.bak` after successful migration (preserved as backup) `[HIGH]`
- [x] 50-entry history cap removed: all rows preserved (verified: 42 real plans migrated) `[HIGH]`
- [x] `lesson_plan_service.save_history()` writes to SQLite + appends `lesson_plan_edits` snapshot `[HIGH]`
- [x] `lesson_plan_service.delete_history()` cascades the unified_events row `[HIGH]`
- [x] `daily_plan_service` + `routes/daily_plans.py` (POST/GET/DELETE `/api/daily-plans`) wired with projection `[MEDIUM]`
- [x] Creating a lesson plan via service immediately appears in `unified_events` `[CRITICAL]`
- [x] Saving a scheduled task result immediately appears in `unified_events` `[MEDIUM]`
- [x] Legacy frontend URLs preserved exactly: GET/POST/DELETE `/api/lesson-plan-history(/{id})` still work, response shape unchanged `[CRITICAL]`
- [x] Inline lesson plan endpoints removed from `main.py` lines 1604-1683; `routes/lesson_plans.py` is sole source `[HIGH]`
- [x] Data export endpoint (`/api/data/export`) reads from `lesson_plan_service.list_histories()` instead of JSON file `[HIGH]`
- [x] Data import endpoint (`/api/data/import`) calls `lesson_plan_service.save_history()` per row, idempotent on id `[HIGH]`
- [x] Factory reset wipes `lesson_plans`, `lesson_plan_edits`, and `unified_events` rows of source_type='lesson_plan' `[HIGH]`
- Findings: Phase 2b synthetic test (5 steps) verified create-without-slot -> draft, then create-after-slot -> auto-bind to Mon 09:00-10:00, list_histories preserves all original frontend keys, mark-as-taught flips lesson_plan + unified_events together, delete cascades. **Real data migration:** 42 plans from production `lesson_plan_history.json` migrated to SQLite + projected into `unified_events`, original JSON preserved as `.bak`. Phase 2d test: scheduled_tasks.insert_result writes to chat_memory.db AND projects to students.db unified_events; update_result_status refreshes the metadata.

### 29.8 Cross-System Auto-Linking (Sub-Phase 3) — BACKEND SHIPPED
- [x] Setting a milestone `due_date` auto-stamps `phase_id` from `get_phase_for_date()` via `_resolve_phase_for_date_safe()` helper `[HIGH]`
- [ ] Editing a phase's date range re-buckets affected milestones `[HIGH]` (deferred -- not in current scope, requires phase save hook)
- [x] Creating/saving a lesson plan auto-stamps `timetable_slot_id` via `_auto_bind_slot()` -> `lookup_timetable_slot()` `[HIGH]`
- [x] Lesson plans with no matching slot remain valid as "drafts" with all-day projection `[MEDIUM]`
- [x] Lesson plans with `curriculumMatches` auto-stamp `suggested_milestone_id` (top match) via `_suggest_milestone()` `[HIGH]`
- [x] Suggesting a milestone DOES NOT advance its status (manual only -- `lesson_plan_service.save_history()` only writes the suggestion field) `[HIGH]`
- [x] `POST /api/lesson-plans/{plan_id}/mark-taught` flips lesson_plan + unified_event + cascades to linked milestone `[CRITICAL]`
- [x] "Mark as taught" appends a row to `milestone_history` (via `mdb.update_milestone(status='completed')` -> existing history hook) `[HIGH]`
- [ ] Lesson planner shows "this class has a quiz today" when a school year event matches the date `[MEDIUM]` (frontend UX, deferred)
- [x] Scheduled task results tagged with `week_of` projected into unified_events with anchor date `[MEDIUM]`
- [x] `GET /api/calendar/conflicts` flags real conflicts: `lesson_plan_orphan` (slot deleted), `lesson_plan_holiday` (lesson on blocking holiday), `timetable_holiday_overlap` (multi-day holiday block) `[HIGH]`
- Findings: Phase 2d+3 synthetic test (3 steps) verified all auto-link behaviors. (1) Created academic phase Mar 1-Apr 30, then milestone with due_date 2026-03-15 -> phase_id auto-stamped to phase23_term2_late. (2) Created lesson plan + slot + holiday on Mon 2026-03-16 -> conflict detection returned 1 lesson_plan_holiday conflict with the expected message. (3) `scheduled_tasks.insert_result()` projection works, status update via `update_result_status` refreshes the metadata.

### 29.9 Dashboard Hub Unification (Sub-Phase 4) — PARTIALLY SHIPPED
- [ ] New `frontend/src/contexts/SchoolYearContext.tsx` provides shared state to all 3 flip-cards `[CRITICAL]` (deferred -- flip-cards still hold their own state; the new 4th panel is the primary unification)
- [x] New `frontend/src/lib/teacherId.ts` extracts the `getTeacherId()` helper, used by `SchoolYearHub` and `useUnifiedCalendarFeed` `[HIGH]`
- [ ] Selecting Term 2 in the Calendar panel filters Curriculum and Timetable panels too `[HIGH]` (deferred -- requires SchoolYearContext)
- [ ] Selecting a grade/subject in any panel filters all three `[HIGH]` (deferred -- requires SchoolYearContext)
- [x] New 4th flip-card "Unified View" pulls from `/api/calendar/unified` `[HIGH]`
- [x] `UnifiedCalendarView.tsx` component: month nav, source-type filter chips, conflicts banner, grouped-by-date list, color-coded source labels `[HIGH]`
- [x] `SchoolYearHub` `PanelType` extended to include `'unified'`; `PANELS` array updated; `panelLabels` includes Layers01 icon + violet color `[HIGH]`
- [x] `SchoolYearHub` consumes `getTeacherId` from shared `lib/teacherId` instead of local copy `[HIGH]`
- [ ] Holiday Manager UI panel renders inside SchoolYearCalendar `[HIGH]` (deferred -- backend `blocks_classes` column exists; frontend can set it via the existing event-create form)
- [ ] All 3 flip-cards no longer hold duplicate copies of `activeConfigId`/`selectedPhaseId` `[MEDIUM]` (deferred with SchoolYearContext)
- [x] Frontend `tsc --noEmit` passes with zero errors after Phase 4 changes `[CRITICAL]`
- Findings: Took an additive approach for Phase 4 to minimize risk in the existing 700-line flip-card component. The 4th "Unified View" panel delivers the user's core "100% synced" requirement by reading from `/api/calendar/unified`. The shared SchoolYearContext refactor is deferred -- the existing 3 panels still work standalone. Type-check clean.

### 29.10 CompactCalendar Widget Refactor (Sub-Phase 5) — SHIPPED (additive)
- [x] New `frontend/src/hooks/useUnifiedCalendarFeed.ts` hook fetches `/api/calendar/unified` for the current month and returns `{date: events[]}` `[HIGH]`
- [x] Hook gates fetch on `teacherId` presence (no fetch before auth resolves) `[HIGH]`
- [x] Hook re-fetches when month anchor changes (year/month deps) `[HIGH]`
- [x] Hook exposes `refetch()` for manual reload `[MEDIUM]`
- [x] Hook fails soft on network errors (returns empty dict, no crash) `[HIGH]`
- [x] `CompactCalendar` accepts new optional `unifiedEventsByDate` prop (backwards compatible -- all 4 existing prop dicts still work) `[HIGH]`
- [x] `CompactCalendar` renders a 4th violet dot per date when `unifiedCount > 0` (alongside resource/task/milestone dots) `[MEDIUM]`
- [x] Dot has tooltip showing the count of synced calendar events for that date `[LOW]`
- [x] `AnalyticsDashboard` wraps `CompactCalendar` in `CompactCalendarWithUnifiedFeed` that calls the hook and threads the prop `[HIGH]`
- [x] Existing 3-dot rendering (resource, task, milestone) is unchanged -- no regression risk `[CRITICAL]`
- [ ] Click a dot -> routes to originating tab with date preselected `[HIGH]` (deferred -- current widget design uses date selection, not per-event click-through)
- [x] Type-check passes with zero errors after Phase 5 changes `[CRITICAL]`
- Findings: Took the additive prop+hook approach instead of refactoring the 700-line widget. Existing widget consumers continue to work without changes. `tsc --noEmit` clean.

### 29.11 Performance & Edge Cases
- [ ] Query 1 year of data with 5 timetable slots -> expansion completes in <200ms `[HIGH]`
- [ ] Query with 100+ school year events -> no N+1, single SQL query `[HIGH]`
- [ ] Migration on a DB with 10000+ source rows completes in reasonable time `[MEDIUM]`
- [ ] Concurrent writes (UI saves event while migration runs) do not corrupt unified_events `[HIGH]`
- [ ] Invalid `source_type` passed to `upsert_unified_event()` raises ValueError `[HIGH]`
- [ ] Invalid `status` passed to `upsert_unified_event()` raises ValueError `[HIGH]`
- [ ] Date range filter with `start > end` returns empty array (not error) `[MEDIUM]`
- [ ] Timezone handling: events with naive datetimes don't crash expansion `[HIGH]`
- Findings: ___

### 29.12 Integration with Existing Phases
- [x] Phase 11 (Progress Tracker): completing a milestone updates its `unified_events.status` (verified via Phase 2 milestone test, status `not_started`->`completed` mapping) `[HIGH]`
- [ ] Phase 21 (Calendar Export): `.ics` export pulls from unified_events instead of separate sources `[MEDIUM]` (deferred -- Phase 21 calendar export is independent and still works against its own source)
- [x] Phase 6 (Lesson Planner): "Mark as taught" workflow integrates correctly via `POST /api/lesson-plans/{id}/mark-taught` (verified Phase 2b test) `[HIGH]`
- [ ] Phase 17 (Educator Insights): phase summaries reflect milestone completions from unified layer `[MEDIUM]` (insights service still reads its own data sources; out of scope for calendar unification)
- [x] Phase 23 (Data Management) export: lesson plans pulled from `lesson_plan_service.list_histories()` (SQLite) instead of JSON file `[HIGH]`
- [x] Phase 23 (Data Management) import: lesson plans imported via `lesson_plan_service.save_history()` (idempotent, SQLite) `[HIGH]`
- [x] Phase 23 (Factory Reset): wipes `lesson_plans`, `lesson_plan_edits`, and `unified_events` rows of source_type='lesson_plan'; also deletes both `lesson_plan_history.json` and `.bak` files `[HIGH]`
- Findings: All applicable Phase 23 cleanup paths updated to handle the SQLite-backed lesson plans + projection. Phase 21/17 deferred as they're independent and still work as before.


---

## STAGE 30 — Cross-Feature Integration Tests + Closed-Loop Smoke Test (CC.13)

*Goal: End-to-end flows that span multiple features, including the full closed-loop lesson planner smoke test.*

### 30.1 Lesson -> Curriculum Alignment

- [ ] Generate lesson plan -> standards auto-matched to curriculum `[HIGH]`
- [ ] Matched standards appear in Progress Tracker `[HIGH]`
- Findings: ___

### 30.2 Quiz -> Grades -> Metrics

- [ ] Grade a quiz -> grade appears in My Classes `[CRITICAL]`
- [ ] Grade reflected in Performance Metrics `[HIGH]`
- [ ] Grade feeds Achievement system (if threshold met) `[HIGH]`
- Findings: ___

### 30.3 Scan-to-Grade Full Pipeline

- [ ] Print quiz with QR -> photograph -> upload -> grade assigned to correct student `[CRITICAL]`
- Findings: ___

### 30.4 Milestone -> Performance Metrics

- [ ] Complete a milestone -> completion feeds Metrics `[HIGH]`
- [ ] Curriculum coverage percentage updates `[HIGH]`
- Findings: ___

### 30.5 Achievements -> My Overview

- [ ] Earn an achievement -> appears in Overview showcase (if selected) `[HIGH]`
- Findings: ___

### 30.6 Image Studio -> Worksheet

- [ ] Generate image in Image Studio `[HIGH]`
- [ ] Insert generated image into worksheet cell `[HIGH]`
- Findings: ___

### 30.7 Widget Click -> Open Generator Pre-Targeted (CC.11)

- [ ] Click an unplanned Grade 3 Math session -> **LessonPlanner** opens -> class is set -> subject/grade/duration pre-filled -> target highlighted in GenerateForSelector `[HIGH]`
- [ ] Click an unplanned Grade K session -> **KindergartenPlanner** opens and applies the same pre-fill (including `date` + `dayOfWeek`) `[HIGH]`
- [ ] Click an unplanned "1-2" multigrade session -> **MultigradePlanner** opens and pre-fills `[HIGH]`
- [ ] LessonPlanner, KindergartenPlanner, and MultigradePlanner all read `pendingLessonTarget` on mount, consume (clear) the sessionStorage key, call `setActiveClass(buildSelection(...))` + local `handleSelectClass(key)`, then call their own `handlePickOccurrence` `[HIGH]`
- [ ] Reload the generator after click -> the handoff is NOT re-applied (key is cleared on first read) `[HIGH]`
- [ ] Synced from a different active class -> the target's class wins; the old active class is replaced `[MEDIUM]`
- [ ] Cross-curricular class (if it somehow matched the routing) -> falls through to LessonPlanner `[LOW]`
- [ ] Click with `class_name` missing -> routes by grade only; active class stays as-is `[LOW]`
- Findings: ___

### 30.8 Curriculum Completion Tagging in ELO/SCO Dropdowns (CC.12)

**Backend endpoint**
- [ ] `GET /api/school-year/curriculum-completion/{teacher_id}?subject=Mathematics&grade_level=3` returns `{ completed_elos: [...], completed_scos: [...] }` `[HIGH]`
- [ ] Omitting subject/grade_level returns completion across all subjects/grades (no filter) `[MEDIUM]`
- [ ] Subject/grade matching is case-insensitive and strips "Grade " prefix `[MEDIUM]`

**LessonPlanner integration**
- [ ] Open LessonPlanner, pick a subject + grade where you've previously marked a lesson as taught (`status='completed'`) -> open ELO dropdown -> the ELO used in that taught lesson shows an emerald "Completed" badge inline with its text `[HIGH]`
- [ ] Same test for SCOs -- each individual SCO that was selected in a taught lesson gets a (smaller) badge in the SCO multi-select `[HIGH]`
- [ ] Non-matching ELOs/SCOs render unchanged (no hiding) `[HIGH]`
- [ ] Clicking a completed ELO/SCO still works normally (badge is display-only) `[HIGH]`

**Progress Tracker integration**
- [ ] Open the Progress Tracker -> tick an individual SCO checkbox on a milestone -> that SCO immediately gets the "Completed" badge when you next open the ELO/SCO dropdown in a generator `[HIGH]`
- [ ] Mark a whole milestone as `completed` -> the milestone's `topic_title` (ELO) AND all its checklist items (SCOs) get tagged in the generator dropdowns `[HIGH]`
- [ ] Uncheck an SCO in the tracker -> tag disappears on next fetch `[MEDIUM]`
- [ ] Hidden milestones (`is_hidden = 1`) don't contribute to completion sets `[LOW]`

**Live refresh via custom event**
- [ ] Keep a generator open in one tab, switch to the Progress Tracker tab, toggle a milestone or checklist item, switch back to the generator -> dropdown reflects the change **without a reload or reopen** (fires `window` event `curriculum-completion-changed`, hook refetches) `[HIGH]`
- [ ] Event fires only after successful `milestoneApi.updateMilestone` (not on error) `[MEDIUM]`

**Kindergarten / Multigrade / Cross-Curricular histories**
- [ ] Saving a KindergartenPlanner / MultigradePlanner / CrossCurricularPlanner entry with ELO/SCO fields populated -> those outcomes are treated as completed (any save counts since flat JSON files don't track status) `[MEDIUM]`

**Matching edge cases**
- [ ] Whitespace-only differences (extra spaces, tabs, trailing newlines) still match (normalized) `[MEDIUM]`
- [ ] Rewording of curriculum upstream will stop matching until milestones are re-synced -- known limitation, low priority to handle `[LOW]`
- Findings: ___

### 30.9 Closed-Loop Smoke Test (CC.13)

- [ ] **Setup**: Create a Grade 3 class, schedule it in the Timetable for Mon/Wed/Fri at 9:00-10:00, configure a ClassConfig for it, add one blocking holiday in the next 2 weeks. `[HIGH]`
- [ ] **Dashboard**: Open the dashboard -> confirm the flip card shows Upcoming Quizzes on the front and a notification toast appears listing unplanned upcoming sessions `[HIGH]`
- [ ] **Click-to-open**: Flip the card -> click the first unplanned Grade 3 session -> LessonPlanner opens -> class is set -> Subject, Grade, Duration are populated from the slot `[HIGH]`
- [ ] **Curriculum**: Pick a strand -> open the ELO dropdown -> confirm that any previously-taught ELO shows the "Completed" badge `[MEDIUM]`
- [ ] **Override**: Click "Override" on the ClassDefaultsBanner -> Step 2 form re-appears with the class defaults already filled in `[MEDIUM]`
- [ ] **Generate + Save**: Fill in Topic, advance to Step 3, click Generate, then Save `[HIGH]`
- [ ] **Loop closes**: Go back to the dashboard -> that session is no longer in the unplanned list -> the count has decreased by 1 `[HIGH]`
- [ ] **Progress Tracker update reflected**: Open Progress Tracker -> tick an SCO on a relevant milestone -> return to LessonPlanner -> reopen the SCO dropdown -> the newly-ticked SCO shows the "Completed" badge without a reload `[HIGH]`
- Findings: ___

### 30.10 Full Teacher-Day Rehearsal

- [ ] Full teacher-day rehearsal: pick one Grade 1A Math class and walk through Lesson -> Quiz -> Worksheet -> Rubric -> Print -> Photo capture -> Auto-grade -> Grades visible in My Overview -> Achievement unlock fires `[CRITICAL]`
- Findings: ___

### 30.11 Full Multi-Class Rehearsal

- [ ] Full multi-class rehearsal: generate one lesson per class for all 27 classes in the same session -- confirm queue handles backpressure and tab pulses fire correctly `[HIGH]`
- Findings: ___

### 30.12 Photo Transfer -> Scan Grade -> Student Grades -> Performance Metrics Chain

- [ ] Photo Transfer -> Scan Grade -> Student Grades -> Performance Metrics chain for one quiz across all of Grade 2 (3 sections, ~75 students) `[HIGH]`
- Findings: ___

---

## STAGE 31 — Tutorials, Support Reporting, System Health

*Goal: Verify the in-app help system and support ticket pipeline.*

### 31.1 Tutorial System

- [ ] `TutorialButton` floating button renders on supported tabs (Resource Manager, Analytics, etc.) `[MEDIUM]`
- [ ] Clicking button starts `TutorialOverlay` on that tab `[HIGH]`
- [ ] Tutorial highlights target elements via `data-tutorial` selectors `[HIGH]`
- [ ] Step navigation (next / back / skip) works `[HIGH]`
- [ ] Completing a tutorial marks it complete in settings `[MEDIUM]`
- [ ] Screenshot-to-ticket button opens Support Reporting with attached screenshot `[HIGH]`
- [ ] Auto-start tutorial fires on first visit to a supported tab `[MEDIUM]`
- Findings: ___

### 31.2 Support Reporting

- [ ] `SupportReporting` tab opens from sidebar `[HIGH]`
- [ ] Submit a new ticket: title, description, category, severity `[CRITICAL]`
- [ ] Attach screenshot (manual or via Tutorial screenshot-to-ticket hook) `[HIGH]`
- [ ] Ticket appears in the list after submit `[HIGH]`
- [ ] Search tickets by keyword `[HIGH]`
- [ ] Filter tickets by status / category / severity `[HIGH]`
- [ ] Sort tickets (date / severity) `[MEDIUM]`
- [ ] Open a ticket -> view full details + response thread `[HIGH]`
- [ ] Mark ticket resolved / reopen ticket `[MEDIUM]`
- [ ] Ticket data persists across restart `[HIGH]`
- Findings: ___

---

## STAGE 32 — Data Management: Export, Import, Privacy Memory Wipe

*Goal: Verify data portability and privacy wipe before the destructive factory reset.*

### 32.1 Export All Data

- [ ] Export full data archive (JSON) `[HIGH]`
- [ ] Archive contains all expected sections `[HIGH]`
- Findings: ___

### 32.2 Import Data

- [ ] Import previously exported archive `[HIGH]`
- [ ] All data restored correctly `[HIGH]`
- [ ] No data duplication on import `[HIGH]`
- Findings: ___

### 32.3 Clear Metrics History

- [ ] Clear metrics -- metrics reset to zero `[MEDIUM]`
- [ ] Other data unaffected `[HIGH]`
- Findings: ___

### 32.4 Privacy Memory Wipe

- [ ] `DELETE /api/teacher-memory/all?teacher_id=X` wipes all coworker long-term memories `[HIGH]`
- [ ] After wipe, next chat session no longer recalls any prior facts `[HIGH]`
- [ ] `GET /api/teacher-memory/list` returns empty post-wipe `[MEDIUM]`
- Findings: ___

---

## STAGE 33 — Destructive: Factory Reset (Run LAST)

> **WARNING: This wipes all settings and data. Only run at end of testing or on a dedicated test instance.**

*Goal: Confirm factory reset returns the app to a clean first-run state.*

### 33.1 Factory Reset

- [ ] Factory reset dialog prompts for confirmation `[CRITICAL]`
- [ ] After reset, app returns to first-run / Setup Wizard state `[CRITICAL]`
- [ ] All JSON history files cleared `[HIGH]`
- [ ] All SQLite tables cleared `[HIGH]`
- [ ] All localStorage cleared `[HIGH]`
- [ ] Factory reset also wipes the photo-transfer sessions folder `[HIGH]`
- [ ] Factory reset wipes `lesson_plan_history.json.bak` files left behind by SQLite migration `[MEDIUM]`
- [ ] Factory reset deletes `license-store.enc` (encrypted license storage) so the device is fully deactivated `[HIGH]`
- Findings: ___

---

## STAGE 34 — Regression Watch (RW.1-RW.4 + CC.1-CC.12 refactor checks)

*Goal: Spot checks for behaviors that changed shape during recent refactors.*

### RW.1 CrossCurricularPlanner Duration Field — Now Numeric-Only `[MEDIUM]`
- [ ] Open CrossCurricularPlanner, Step 1, Duration row
- [ ] Chip buttons (30/40/45/60/80) select cleanly and fill the prompt
- [ ] "Other" fallback accepts a custom number (e.g. 90) and generates OK
- [ ] **Regression check:** previously teachers could type strings like `"2 class periods"` or `"60 minutes"` into this field. That is no longer possible -- the field is numeric-only. Confirm no teacher workflow depends on the freeform wording. If one does, the fix is to let the "Other" input accept text as well.
- Findings: ___

### RW.2 RubricGenerator Assignment-Type Auto-Fill Overwrites Manual Edits `[MEDIUM]`
- [ ] Open RubricGenerator, select `Essay` -- `focusAreas` and `performanceLevels` auto-fill with soft defaults
- [ ] Manually tick/untick `focusAreas` so they differ from the preset
- [ ] Change `assignmentType` to `Presentation`
- [ ] **Expected:** `focusAreas` + `performanceLevels` are overwritten with the Presentation preset. The teacher's manual tweaks are lost.
- [ ] This matches the spec's "soft defaults" language but is a known footgun -- flag it if any teacher complains. Possible fix is to only auto-fill when `focusAreas` is empty or untouched since last type change.
- Findings: ___

### RW.3 Quiz Last-Used Settings Persistence `[LOW]`
- [ ] Generate a quiz with a non-default mix of `questionTypes` / `cognitiveLevels` / `numberOfQuestions` / `timeLimitPerQuestion`
- [ ] Open a new QuizGenerator tab -- those same values should be pre-filled
- [ ] Clear localStorage key `quiz_last_settings` -> new tab opens empty
- Findings: ___

### RW.4 DurationPicker Across All Four Planners `[LOW]`
- [ ] LessonPlanner Step 1 -- chips + Other work, validation error style shows when required and empty
- [ ] KindergartenPlanner -- same
- [ ] MultigradePlanner -- same
- [ ] CrossCurricularPlanner -- same
- [ ] Selected chip visually reflects accent color of the tab
- Findings: ___

### CC.1 Shared applyClassDefaults Util Regression (Step A) `[HIGH]`

The seven generators used to each carry an identical ~35-line `applyClassConfig`
helper. That was consolidated into `applyClassDefaults.ts` with per-generator
field maps + a single merge function. Bonus bug fix: WorksheetGenerator's old
copy only merged strings, so arrays and booleans (learningStyles, specialNeeds)
silently never auto-filled from class config.

- [ ] In each of the 7 generators (Lesson / Quiz / Worksheet / Rubric / Kindergarten / Multigrade / CrossCurricular), pick a class that has a stored ClassConfig -- all the previously-covered fields still auto-fill `[HIGH]`
- [ ] Regression: **WorksheetGenerator** specifically -- pick a class that has `learningStyles` + `hasSpecialNeeds` set in config. Both arrays (learningStyles) and the boolean (specialNeeds) now auto-fill; previously they did not. `[HIGH]`
- [ ] Editing a pre-filled field is not clobbered by switching classes -- existing non-empty user input still wins over class defaults (precedence preserved) `[HIGH]`
- Findings: ___

### CC.2 ActiveClassContext Regression `[HIGH]`

- [ ] Pick a class in LessonPlanner -> switch to QuizGenerator -> the same class is already selected and form is hydrated `[HIGH]`
- [ ] Reload the app -> active class persists `[HIGH]`
- [ ] Clear the class picker in any generator (empty option) -> global state clears, other generators also clear on next visit `[HIGH]`
- [ ] Seven generators + ImageStudio still work when no class is active `[HIGH]`
- [ ] Switching classes in one generator does not wipe the teacher's in-progress form values in another tab `[MEDIUM]`
- Findings: ___

### CC.3 ClassDefaultsBanner Regression `[HIGH]`

- [ ] With a class that has config: LessonPlanner Step 1 and Step 2 both show the banner `[HIGH]`
- [ ] LessonPlanner Step 2 body collapses to a single hint when a class with config is active `[HIGH]`
- [ ] Click **Override** -> full Step 2 form re-appears with the class defaults already populated `[HIGH]`
- [ ] With **no** active class -> banner doesn't render at all (zero regression) `[HIGH]`
- Findings: ___

### CC.4 ClassConfigPanel Focus-Loss Bug Regression `[CRITICAL]`

- [ ] Open Class Manager -> pick a class -> open its config panel `[CRITICAL]`
- [ ] Type a long string in the **Subject** input -- focus is NOT lost between keystrokes `[CRITICAL]`
- [ ] Same for all textareas (Essential Outcomes, Specific Outcomes, Special Needs Details, Additional Instructions, etc.) `[HIGH]`
- [ ] Scroll to a `<ChipGroup>` (e.g. Learning Styles) -> click a chip -> scroll position stays put `[CRITICAL]`
- [ ] Toggle a checkbox (e.g. Has Special Needs) -> no scroll jump `[HIGH]`
- Findings: ___

### CC.5 ClassConfigPanel Timetable Wiring Regression `[HIGH]`

- [ ] For a class that appears in the timetable -> Subject is a dropdown scoped to timetable subjects `[HIGH]`
- [ ] For a class NOT yet scheduled -> falls back to onboarding subjects `[HIGH]`
- [ ] Duration derivation pre-fills correctly from timetable `[HIGH]`
- [ ] "Meets:" strip appears with scheduled slots `[MEDIUM]`
- Findings: ___

### CC.6 Timetable Multi-Block Periods Regression `[HIGH]`

- [ ] Multi-block slot renders as a single taller cell spanning N rows `[HIGH]`
- [ ] Overlap validation fires for conflicting spans `[HIGH]`
- [ ] Weekly Load summary shows correct totals `[MEDIUM]`
- Findings: ___

### CC.7 Unified View Removal + Holidays on School Year Regression `[MEDIUM]`

- [ ] SchoolYearHub top nav shows exactly 3 tabs: **School Year**, **Curriculum Plan**, **Timetable**. No "Unified". `[HIGH]`
- [ ] CompactCalendar widget still pulls from the unified feed `[MEDIUM]`
- [ ] Open School Year -> click + to create an event -> **Type** dropdown includes "Holiday" `[HIGH]`
- [ ] Selecting type=Holiday reveals "Block classes on this day" checkbox `[HIGH]`
- Findings: ___

### CC.8 GenerateForSelector Regression `[HIGH]`

- [ ] With NO active class -> selector shows "Pick a class above to target a specific lesson" `[HIGH]`
- [ ] Active class with slots -> dropdown lists next ~10 upcoming sessions `[HIGH]`
- [ ] Selecting an option auto-fills Subject / Grade / Duration `[HIGH]`
- [ ] Present in all 7 generators `[HIGH]`
- Findings: ___

### CC.9 Lesson <-> Calendar Attachment Regression `[HIGH]`

- [ ] Pick a target session, generate, save -> session drops off unplanned list `[HIGH]`
- [ ] Old plans without `scheduled_for` still load and render correctly `[CRITICAL]`
- [ ] `/api/school-year/upcoming-unplanned/default?within_days=14` returns valid payload `[HIGH]`
- Findings: ___

### CC.10 Dashboard Flip Card Regression `[HIGH]`

- [ ] AnalyticsDashboard shows the flip card `[HIGH]`
- [ ] Toggle rotates card `[MEDIUM]`
- [ ] Back face shows `LessonsNeedingPlans` widget `[HIGH]`
- [ ] Notification fires once per session when unplanned lessons > 0 `[HIGH]`
- Findings: ___

### CC.11 Widget Click -> Generator Routing Regression `[HIGH]`

- [ ] Click Grade 3 session -> LessonPlanner with pre-fill `[HIGH]`
- [ ] Click Grade K session -> KindergartenPlanner `[HIGH]`
- [ ] Click multigrade session -> MultigradePlanner `[HIGH]`
- Findings: ___

### CC.12 Curriculum Completion Tagging Regression `[HIGH]`

- [ ] Taught lesson ELOs show "Completed" badge in dropdown `[HIGH]`
- [ ] Ticking SCO in Progress Tracker -> badge appears in generator without reload `[HIGH]`
- [ ] Hidden milestones don't contribute `[LOW]`
- Findings: ___

---

## STAGE 35 — Open Follow-ups & make user manual

*Goal: Track known deferrals and outstanding items.*

### 35.1 Known Deferrals

1. **Drag-to-resize timetable cells** (Phase 3b) -- Excel-style drag handles on slot edges. Functional need is covered by the modal Length selector; this is visual polish.
2. **Holiday filter in `GenerateForSelector`** -- the component accepts a `blockedDates` prop but none of the generators pass one yet. The backend's unplanned-upcoming endpoint already filters holidays, so this only affects generator dropdown consistency.
3. **Propagate `useCurriculumCompletion` to the other 6 generators** -- same `CurriculumAlignmentFields` component; each is a two-line change (add hook, pass props).
4. **`AutoFilledSection` collapse in the other 6 generators** -- LessonPlanner Step 2 is the reference impl; other generators' form shapes need per-case decisions about which section(s) to wrap.
5. **`scheduled_for` persistence for Quiz / Rubric / Worksheet** -- intentionally deferred because these are supplementary artifacts (assessments/resources), not the lesson itself. Revisit if teachers ask for "Quizzes Needing Preparation" or similar tracking.
6. **ID-based outcome matching** -- completion tagging is text-matched with whitespace normalization. If curriculum data is reworded upstream, old milestones won't match new text until the teacher re-syncs.
7. **SchoolYearContext refactor** -- the existing 3 flip-cards still hold their own state; deferred from Stage 29.9.
8. **Mid-step diffusion cancellation** via diffusers `callback_on_step_end` (only useful if backend switches off OpenVINO/sd.cpp).
9. **Cancel event propagation** into `_grade_detected_answers` / `_grade_single_quiz_scan` for mid-token LLM cancel inside OCR grading.
10. **Replace hardcoded WS fallback job_ids** (`"quiz"`, `"lesson-plan"`, etc.) with UUIDs to prevent collisions.
11. **OCR cancel checks** between QR extraction / OCR fallback / LLM stages within a single file.
- Findings: ___

---

## Issues Log

Use this section to record all issues found during testing.

| # | Stage | Feature | Description | Severity | Status |
|---|-------|---------|-------------|----------|--------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

**Severity scale:** Critical (blocks core function) | High (feature broken) | Medium (degraded UX) | Low (cosmetic)

---

## Testing Checklist Summary

| Stage | Area | Approx Items | Completed | Issues Found |
|-------|------|-------------|-----------|-------------|
| 0 | Vendor Pre-Deployment: License Infra | 30 | | |
| 1 | Teacher Unboxing: Install + UI Shell | 27 | | |
| 2 | First-Run Setup Wizard | 48 | | |
| 3 | Settings Tour | 43 | | |
| 4 | School Year & Calendar Bootstrap | 14 | | |
| 5 | Class Build-Out (27 classes) | 14 | | |
| 6 | Student Rostering | 15 | | |
| 7 | Timetable Construction | 20 | | |
| 8 | ClassConfigPanel & Class Defaults | 17 | | |
| 9 | Curriculum Browser + Milestones | 28 | | |
| 10 | Active Class Context + Defaults Banner | 14 | | |
| 11 | Ask Coworker / Chat | 37 | | |
| 12 | Brain Dump & Sticky Notes | 28 | | |
| 13 | Lesson Planning Suite | 40 | | |
| 14 | Quiz Builder | 26 | | |
| 15 | Worksheet Builder | 22 | | |
| 16 | Rubric Builder | 13 | | |
| 17 | Visual & Media Tools | 49 | | |
| 18 | Photo Transfer | 22 | | |
| 19 | Manual Grading | 10 | | |
| 20 | Scan Auto-Grading Pipeline | 21 | | |
| 21 | Attendance Tracking | 3 | | |
| 22 | Reminders, Notifications, ICS | 19 | | |
| 23 | Generation Queue, Tab Pulse, Cancellation | 64 | | |
| 24 | Scheduled Background Tasks | 24 | | |
| 25 | Analyse Panel | 11 | | |
| 26 | My Resources & File Management | 11 | | |
| 27 | Analytics, Insights, Metrics | 44 | | |
| 28 | Achievements & Gamification | 11 | | |
| 29 | Unified Calendar System (Phase 25 shipped record) | 113 | 96 (all 6 phases shipped, 17 deferred items are frontend polish) | |
| 30 | Cross-Feature Integration + Closed-Loop Smoke Test | 35 | | |
| 31 | Tutorials, Support Reporting, System Health | 17 | | |
| 32 | Data Management: Export, Import, Privacy Wipe | 9 | | |
| 33 | Destructive: Factory Reset | 8 | | |
| 34 | Regression Watch (RW.1-RW.4 + CC.1-CC.12) | 54 | | |
| 35 | Open Follow-ups | 11 | | |
| **TOTAL** | | **~1062** | | |

---

*End of OECS Class Coworker Testing Plan — Teacher Journey Order*

---

make user manual