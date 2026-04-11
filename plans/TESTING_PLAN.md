# PEARL — Systematic Testing Plan
*Test every feature in dependency order | April 2026*

---

## How to Use This Plan
- Work through phases **in order** — later phases depend on earlier ones
- Mark each item `[x]` as you test it
- Note issues in the **Findings** line under each item
- Priority flags: `[CRITICAL]` = blocks other features | `[HIGH]` = core functionality | `[MEDIUM]` = important | `[LOW]` = nice-to-have

---

## PHASE 1 — App Launch & Initial State
*Goal: Confirm the app starts correctly and core infrastructure is ready*

### 1.1 App Launch
- [ ] App opens without crash or console error `[CRITICAL]`
- [ ] HeartbeatLoader / loading spinner appears during startup `[MEDIUM]`
- [ ] App reaches the main UI within reasonable time (< 30s) `[HIGH]`
- Findings: ___

### 1.2 Engine Health Check
- [ ] `EngineStatusContext` shows `online` status indicator `[CRITICAL]`
- [ ] Disconnect backend → status switches to `offline`, toast appears `[HIGH]`
- [ ] Reconnect → status recovers, "Engine is back online" toast `[HIGH]`
- Findings: ___

### 1.3 Login Screen (if enabled)
- [ ] `Login.tsx` renders correctly (even if bypassed) `[MEDIUM]`
- [ ] Auto-login as "admin" works as expected `[HIGH]`
- Findings: ___

### 1.4 First-Run: Setup Wizard (OAK vs Manual)
The welcome step now branches into two paths. School/country are ONLY collected
via OAK — never manually.

**Welcome step — choice view**
- [ ] SetupWizard appears on fresh install / cleared localStorage `[HIGH]`
- [ ] Welcome shows two buttons: **Activate with OAK** and **Continue without OAK (manual setup)** `[HIGH]`
- [ ] Clicking **Activate with OAK** reveals inline OAK input + Activate button `[HIGH]`
- [ ] Clicking **Continue without OAK** advances directly to the profile step `[HIGH]`

**OAK path**
- [ ] Entering an invalid OAK shows an inline error and stays on the welcome step `[HIGH]`
- [ ] Entering a valid OAK activates the license, closes the OAK view, advances to profile `[CRITICAL]`
- [ ] Profile step shows a green **"Verified via OAK"** banner with the retrieved school and territory `[HIGH]`
- [ ] Profile step only asks for **name** and **grades/subjects** (no school input) `[HIGH]`
- [ ] "Back" on OAK input view returns to the choice view without deactivating an already-activated license `[MEDIUM]`
- [ ] After Finish, localStorage `app-settings-main.profile.schoolSource === 'oak'` and `profile.school` + `profile.territory` are populated `[HIGH]`

**Manual path**
- [ ] Profile step only asks for **name** and **grades/subjects** (no school input, no OAK banner) `[HIGH]`
- [ ] After Finish, `profile.schoolSource === null` and `profile.school`/`profile.territory` are empty `[HIGH]`
- [ ] Dashboard welcome sticky-note checklist shows "Set up your profile (name)" — without the "& school" suffix `[MEDIUM]`

**Feature picker + completion**
- [ ] Step 3 — Feature Picker: toggle features on/off `[HIGH]`
- [ ] Step 4 — Completion: confirm and launch `[HIGH]`
- [ ] After completion, wizard does not reappear on restart `[HIGH]`
- Findings: ___

### 1.5 Welcome Modal
- [ ] WelcomeModal appears on first visit `[MEDIUM]`
- [ ] Dismiss works, does not reappear `[MEDIUM]`
- Findings: ___

### 1.6 OAK License Gate
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
- [ ] Manual-setup user → Settings > License → activate OAK → Settings > Profile now shows locked School + Territory without a reload `[HIGH]`
- [ ] Settings > License status card shows `schoolName` / `territoryName` (human-readable) instead of raw IDs `[MEDIUM]`
- Findings: ___

### 1.7 School Year Setup Modal
- [ ] `SchoolYearSetupModal` appears on first run if no active school year config `[HIGH]`
- [ ] Enter school year dates, term boundaries, holidays → saves to backend `[HIGH]`
- [ ] After save, modal does not reappear `[HIGH]`
- [ ] Modal can be reopened from School Year Hub when needed `[MEDIUM]`
- Findings: ___

---

## PHASE 2 — Settings & Configuration
*Goal: Validate all configuration options before testing features that depend on them*

### 2.1 User Profile
- [ ] Display name, school, registration date save and persist `[HIGH]`
- [ ] Grade levels (multi-select) save and persist `[HIGH]`
- [ ] Subjects per grade save and persist `[HIGH]`
- [ ] "Filter content by profile" toggle works `[MEDIUM]`
- Findings: ___

### 2.2 AI Model Selection
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
- Findings: ___

### 2.3 Tier Configuration
- [ ] Tier 1–4 assigned to models saves correctly `[HIGH]`
- [ ] Dual Model Mode toggle works `[HIGH]`
- [ ] Fast model selector for lightweight tasks works `[HIGH]`
- [ ] Task routing (autocomplete / title / organize) toggles save `[MEDIUM]`
- Findings: ___

### 2.4 Thinking Mode
- [ ] Thinking Mode toggle saves and persists `[MEDIUM]`
- Findings: ___

### 2.5 Generation Mode
- [ ] Switch to Queued mode — one generation at a time enforced `[HIGH]`
- [ ] Switch to Simultaneous mode — parallel allowed `[HIGH]`
- [ ] `generation_gate` blocks second generation in Queued mode until first finishes `[HIGH]`
- [ ] `generation_gate` queue drains in order when first job completes `[HIGH]`
- Findings: ___

### 2.6 Display & Accessibility
- [ ] Font size slider (50%–200%) updates UI in real time `[HIGH]`
- [ ] Brightness slider (50–150) updates display `[HIGH]`
- [ ] Warm Tone slider (0–100) applies filter `[MEDIUM]`
- [ ] Light / Dark / System theme toggle works `[HIGH]`
- [ ] Theme persists after restart `[HIGH]`
- Findings: ___

### 2.7 Sidebar Customization
- [ ] Toggle individual features on/off (non-pinned items) `[HIGH]`
- [ ] Drag-reorder sidebar items (dnd-kit) `[HIGH]`
- [ ] Pinned items (My Overview, Metrics, Support, Settings) cannot be removed `[HIGH]`
- [ ] Tab color customization per type applies to sidebar + tab header `[MEDIUM]`
- [ ] Order and visibility persist after restart `[HIGH]`
- Findings: ___

### 2.8 Writing Assistant
- [ ] Spell check toggle saves `[MEDIUM]`
- [ ] Autocorrect toggle saves `[MEDIUM]`
- [ ] Auto-finish toggle saves `[MEDIUM]`
- [ ] Dictionary lookups toggle saves `[MEDIUM]`
- [ ] `SmartInput` applies spell check + autocorrect live when enabled `[HIGH]`
- [ ] `SmartTextArea` provides auto-finish suggestions (Tab/Enter accept) `[HIGH]`
- [ ] Dictionary lookup on double-click/selection works when enabled `[MEDIUM]`
- [ ] Disabling a toggle immediately removes the corresponding behavior `[MEDIUM]`
- Findings: ___

### 2.9 System Behavior
- [ ] Minimize to system tray toggle works `[MEDIUM]`
- [ ] Start on boot toggle works `[LOW]`
- [ ] Auto-close tabs on exit toggle works `[MEDIUM]`
- [ ] File access permissions list saves correctly `[MEDIUM]`
- Findings: ___

### 2.10 Tutorial Preferences
- [ ] "Show floating tutorial buttons" toggle saves `[MEDIUM]`
- [ ] Disabling hides all `TutorialButton` floating buttons across tabs `[MEDIUM]`
- [ ] "Reset completed tutorials" restores tutorials to run again `[MEDIUM]`
- Findings: ___

### 2.11 OAK License Activation
- [ ] License section visible in Settings `[HIGH]`
- [ ] Enter valid key → activated state shown `[CRITICAL]`
- [ ] Enter invalid key → error displayed `[HIGH]`
- [ ] Activation persists and survives restart `[HIGH]`
- [ ] Deactivate / remove key returns app to unlicensed state `[HIGH]`
- [ ] License expiration date displayed when applicable `[MEDIUM]`
- Findings: ___

---

## PHASE 3 — Navigation & UI Shell
*Goal: Confirm core navigation works before testing each tab's content*

### 3.1 Tab Navigation
- [ ] Click each of the 23 sidebar items — correct component loads `[CRITICAL]`
- [ ] Open multiple tabs of the same type (e.g., two Lesson Planners) `[HIGH]`
- [ ] Close a tab via X button `[HIGH]`
- [ ] Draft Save Dialog appears when closing a tab with unsaved work `[HIGH]`
- [ ] Tab titles display correctly `[MEDIUM]`
- Findings: ___

### 3.2 Split-View Mode
- [ ] Right-click a tab → split view option appears `[HIGH]`
- [ ] Split activates: two panes visible side by side `[HIGH]`
- [ ] Switch active pane (left ↔ right) `[HIGH]`
- [ ] Close split view → returns to single pane `[HIGH]`
- [ ] Split state persists in localStorage `[MEDIUM]`
- Findings: ___

### 3.3 Command Palette
- [ ] Keyboard shortcut opens Command Palette overlay `[HIGH]`
- [ ] Search for a tab name — result appears `[HIGH]`
- [ ] Navigate to result — correct tab opens `[HIGH]`
- [ ] Mic button → STT input works `[MEDIUM]`
- [ ] Close palette without action works `[HIGH]`
- Findings: ___

### 3.4 Tab Busy State
- [ ] Start a generation — tab shows busy indicator `[HIGH]`
- [ ] Attempt to close busy tab — blocked or warned `[HIGH]`
- [ ] Active Generation Dialog shows current jobs across tabs `[HIGH]`
- Findings: ___

### 3.5 Sticky Notes (Shell-Level)
- [ ] Sticky note panel/button accessible from any tab `[HIGH]`
- [ ] Open a new sticky note `[HIGH]`
- [ ] Notes are isolated per tab type (switch tabs → different notes) `[HIGH]`
- [ ] Notes persist after tab close and reopen `[HIGH]`
- Findings: ___

### 3.6 Tutorial System
- [ ] `TutorialButton` floating button renders on supported tabs (Resource Manager, Analytics, etc.) `[MEDIUM]`
- [ ] Clicking button starts `TutorialOverlay` on that tab `[HIGH]`
- [ ] Tutorial highlights target elements via `data-tutorial` selectors `[HIGH]`
- [ ] Step navigation (next / back / skip) works `[HIGH]`
- [ ] Completing a tutorial marks it complete in settings `[MEDIUM]`
- [ ] Screenshot-to-ticket button opens Support Reporting with attached screenshot `[HIGH]`
- [ ] Auto-start tutorial fires on first visit to a supported tab `[MEDIUM]`
- Findings: ___

---

## PHASE 4 — Ask PEARL (AI Chat)
*Goal: Verify core AI inference pipeline works — this underpins all generation features*

### 4.1 Basic Chat
- [ ] Type a message and send — streaming response appears `[CRITICAL]`
- [ ] Response completes without error `[CRITICAL]`
- [ ] Chat history saves the session `[HIGH]`
- Findings: ___

### 4.2 Chat Features
- [ ] Auto-title generated for the session `[MEDIUM]`
- [ ] Autocomplete suggestions appear while typing `[MEDIUM]`
- [ ] Attach a file (document/image) — content referenced in response `[HIGH]`
- [ ] Smart search: search past chats — correct results returned `[HIGH]`
- [ ] Delete a chat session `[MEDIUM]`
- [ ] AI response containing a curriculum link opens curriculum tab at correct route `[HIGH]`
- [ ] If a curriculum tab is already open, new link reuses it rather than duplicating `[MEDIUM]`
- Findings: ___

### 4.3 TTS & STT
- [ ] TTS: AI response read aloud via Piper `[HIGH]`
- [ ] Volume toggle mutes/unmutes TTS `[HIGH]`
- [ ] STT: mic button → speak → text appears in input field `[HIGH]`
- [ ] STT input sends correctly `[HIGH]`
- Findings: ___

### 4.4 Educator Coach Drawer
- [ ] Open Educator Coach Drawer from Educator Insights `[HIGH]`
- [ ] Send message — consultant-mode response streams `[HIGH]`
- [ ] Conversation history saves and retrieves `[HIGH]`
- [ ] Multiple conversations accessible `[MEDIUM]`
- Findings: ___

### 4.5 Consultant Conversations
- [ ] `GET /api/consultant/conversations` — lists saved conversations `[MEDIUM]`
- [ ] `GET /api/consultant/conversation/{id}` — retrieves specific conversation `[MEDIUM]`
- Findings: ___

---

## PHASE 5 — Curriculum Browser
*Goal: Verify standards data and navigation work before lesson planning*

### 5.1 Browse Standards
- [ ] Filter by grade — standards update correctly `[HIGH]`
- [ ] Filter by subject — standards update correctly `[HIGH]`
- [ ] Standard codes and full descriptions display `[HIGH]`
- Findings: ___

### 5.2 Skill Tree
- [ ] Skill progression tree renders without error `[HIGH]`
- [ ] Navigate skill hierarchy — prerequisite paths visible `[HIGH]`
- Findings: ___

### 5.3 Cross-Curricular Mapping
- [ ] Standards can be viewed across subjects for same grade `[MEDIUM]`
- Findings: ___

### 5.4 Curriculum Navigator / References / Skill Tree
- [ ] `CurriculumNavigator` renders the top-level navigation tree `[HIGH]`
- [ ] `CurriculumReferences` panel lists reference sources for selected topic `[MEDIUM]`
- [ ] `CurriculumSkillTree` renders skill progression with prerequisite edges `[HIGH]`
- [ ] Clicking a node in the skill tree opens the matching curriculum topic `[HIGH]`
- Findings: ___

### 5.5 Math Strand Page
- [ ] `math-strand-page` renders all strands for the selected grade `[HIGH]`
- [ ] Each strand lists its topics and learning outcomes `[HIGH]`
- [ ] Standards badges render correctly for each outcome `[MEDIUM]`
- Findings: ___

### 5.6 Level Journey Path
- [ ] `LevelJourneyPath` renders the progression visualization `[HIGH]`
- [ ] Current position on the path is clearly marked `[HIGH]`
- [ ] Clicking a level node shows the milestones for that level `[MEDIUM]`
- Findings: ___

---

## PHASE 6 — Lesson Planning Suite
*Goal: Test all four lesson planners and their shared editing/export pipeline*

### 6.1 Standard Lesson Planner
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

### 6.2 Early Childhood Planner
- [ ] Open Early Childhood tab `[HIGH]`
- [ ] Generation completes with K-appropriate language `[HIGH]`
- [ ] Story-based activities included in output `[HIGH]`
- [ ] Visual schedule generated `[HIGH]`
- [ ] `daily-plan` view renders the day's activities in time-ordered blocks `[HIGH]`
- [ ] Edit individual blocks (activity, duration, resources) `[HIGH]`
- [ ] Daily plan persists to backend and reloads on tab reopen `[HIGH]`
- Findings: ___

### 6.3 Multi-Level Planner
- [ ] Open Multi-Level tab `[HIGH]`
- [ ] Select 2+ grade levels `[HIGH]`
- [ ] Generation produces per-level objectives and activities `[HIGH]`
- [ ] Shared scaffolding visible `[HIGH]`
- Findings: ___

### 6.4 Integrated Lesson Planner
- [ ] Open Integrated Lesson tab `[HIGH]`
- [ ] Select 2+ subjects `[HIGH]`
- [ ] Generation produces cross-subject connected content `[HIGH]`
- [ ] Standards from multiple subjects referenced `[HIGH]`
- Findings: ___

---

## PHASE 7 — Quiz Builder & Grading

### 7.1 Quiz Generation
- [ ] Open Quiz Builder tab `[CRITICAL]`
- [ ] Set subject, grade, question count, question types `[CRITICAL]`
- [ ] Generation streams question by question `[CRITICAL]`
- [ ] All question types generated: MC, T/F, Fill-blank, Open-ended `[HIGH]`
- [ ] Answer key generated `[CRITICAL]`
- [ ] Quiz saved to history `[HIGH]`
- Findings: ___

### 7.2 Quiz Editing
- [ ] Open QuizEditor `[HIGH]`
- [ ] Add a question `[HIGH]`
- [ ] Delete a question `[HIGH]`
- [ ] Reorder questions `[MEDIUM]`
- [ ] Edit correct answer `[HIGH]`
- [ ] Adjust point values `[HIGH]`
- Findings: ___

### 7.3 Manual Quiz Grading
- [ ] Select student + quiz `[HIGH]`
- [ ] Enter score per question or total `[HIGH]`
- [ ] Percentage auto-calculated `[HIGH]`
- [ ] Add feedback comment `[MEDIUM]`
- [ ] Grade saved to `students.db` `[CRITICAL]`
- [ ] Grade visible in My Classes `[HIGH]`
- Findings: ___

### 7.4 QR Code Generation
- [ ] Quiz exported with QR code in top-right corner `[HIGH]`
- [ ] QR encodes quiz ID correctly `[CRITICAL]`
- Findings: ___

### 7.5 Scan-to-Grade (Quiz)
- [ ] Upload a photographed/scanned quiz `[HIGH]`
- [ ] QR code extracted and quiz identified `[CRITICAL]`
- [ ] OCR reads student answers `[CRITICAL]`
- [ ] Alignment correction applied `[HIGH]`
- [ ] Grade calculated and stored `[CRITICAL]`
- [ ] Stream mode: results appear progressively `[HIGH]`
- Findings: ___

### 7.6 Answer Key Management
- [ ] List all answer keys `[HIGH]`
- [ ] Retrieve a specific key `[HIGH]`
- [ ] Key correctly matches stored quiz `[CRITICAL]`
- Findings: ___

### 7.7 Quiz Instances
- [ ] Save per-student instances `[MEDIUM]`
- [ ] Correct instance used during grading `[HIGH]`
- Findings: ___

### 7.8 Scan Template Preview & Alignment
- [ ] `ScanTemplatePreview` renders the expected answer region layout before print `[HIGH]`
- [ ] `scan_template_extractor` extracts region coordinates from the generated PDF `[CRITICAL]`
- [ ] `image_alignment` corrects skew and rotation on scanned submissions `[CRITICAL]`
- [ ] `region_tracker` maps aligned regions back to question IDs `[HIGH]`
- [ ] `bubble_detector` correctly identifies filled bubbles on multiple-choice scans `[CRITICAL]`
- [ ] Misaligned / low-quality scans surface a clear error `[HIGH]`
- Findings: ___

### 7.9 Bulk Grader (Standalone Flow)
- [ ] Open `BulkGrader` flow from Quiz Grader `[HIGH]`
- [ ] Upload multiple scanned quizzes at once `[HIGH]`
- [ ] Per-scan progress indicator (pending / processing / done / error) `[HIGH]`
- [ ] Failed scans can be retried individually `[HIGH]`
- [ ] All successful grades saved to `students.db` `[CRITICAL]`
- [ ] Summary report shows totals (processed, failed, average) `[MEDIUM]`
- Findings: ___

---

## PHASE 8 — Rubric Builder

### 8.1 Generation
- [ ] Open Rubric Builder tab `[HIGH]`
- [ ] Set subject, grade, assessment type `[HIGH]`
- [ ] Generation streams criteria `[HIGH]`
- [ ] All criteria have: name, levels, descriptors, point values `[HIGH]`
- [ ] Total points calculated correctly `[HIGH]`
- Findings: ___

### 8.2 Editing
- [ ] Add / remove criteria `[HIGH]`
- [ ] Rename levels `[MEDIUM]`
- [ ] Edit descriptors `[HIGH]`
- [ ] Adjust point values `[HIGH]`
- Findings: ___

### 8.3 Export
- [ ] Export to PDF (formatted grid layout) `[HIGH]`
- [ ] Export to DOCX `[MEDIUM]`
- [ ] Export to JSON `[LOW]`
- Findings: ___

---

## PHASE 9 — Worksheet Builder & Grading

### 9.1 Worksheet Generation
- [ ] Open Worksheet Builder tab `[HIGH]`
- [ ] Set subject field `[CRITICAL]`
- [ ] Set grade level `[CRITICAL]`
- [ ] Set grid dimensions (rows × columns) `[HIGH]`
- [ ] Generation produces content in cells `[HIGH]`
- [ ] Answer key generated `[CRITICAL]`
- Findings: ___

### 9.2 Structured Grid Editor
- [ ] Click cell to edit content `[HIGH]`
- [ ] Resize columns/rows `[HIGH]`
- [ ] Merge cells `[MEDIUM]`
- [ ] Apply border styles `[MEDIUM]`
- [ ] Text alignment per cell `[MEDIUM]`
- [ ] Insert image into cell `[HIGH]`
- Findings: ___

### 9.3 Manual Worksheet Grading
- [ ] Select student + worksheet `[HIGH]`
- [ ] Enter score `[HIGH]`
- [ ] Grade saved to `students.db` `[CRITICAL]`
- Findings: ___

### 9.4 Scan-to-Grade (Worksheet)
- [ ] Upload scanned worksheet `[HIGH]`
- [ ] QR code identifies worksheet `[CRITICAL]`
- [ ] OCR reads answers `[CRITICAL]`
- [ ] Grade calculated `[CRITICAL]`
- [ ] Bulk grading: upload multiple scans at once `[HIGH]`
- [ ] Stream mode works `[HIGH]`
- Findings: ___

### 9.5 Worksheet Packages
- [ ] Create a package (group multiple worksheets) `[MEDIUM]`
- [ ] Assign package to a class `[MEDIUM]`
- [ ] Retrieve package list `[MEDIUM]`
- Findings: ___

### 9.6 Worksheet Templates
- [ ] Math template renders and accepts values correctly `[HIGH]`
- [ ] Multiple Choice template renders question + options `[HIGH]`
- [ ] Comprehension template renders passage + questions `[HIGH]`
- [ ] List Based template renders ordered lists `[MEDIUM]`
- [ ] Matching template renders two columns with draggable pairs `[HIGH]`
- [ ] Each template exports cleanly to PDF without layout break `[HIGH]`
- Findings: ___

### 9.7 Bulk Worksheet Grader (Standalone)
- [ ] Open `WorksheetBulkGrader` flow `[HIGH]`
- [ ] Upload a batch of scanned worksheets `[HIGH]`
- [ ] Per-file progress and error state visible `[HIGH]`
- [ ] All grades saved to `students.db` under the correct students `[CRITICAL]`
- [ ] Retry failed items individually `[MEDIUM]`
- Findings: ___

---

## PHASE 10 — Classroom Management

### 10.1 Student Management
- [ ] Add a new student (all fields) `[CRITICAL]`
- [ ] Edit student details `[HIGH]`
- [ ] Delete a student `[HIGH]`
- [ ] Student ID auto-generated `[MEDIUM]`
- [ ] Filter students by class `[HIGH]`
- [ ] Filter students by grade `[HIGH]`
- Findings: ___

### 10.2 Bulk Import
- [ ] Download sample Excel template `[HIGH]`
- [ ] Fill template and upload `[HIGH]`
- [ ] Students imported correctly to database `[CRITICAL]`
- [ ] Validation errors shown for bad data `[HIGH]`
- Findings: ___

### 10.3 Class Management
- [ ] Create a class `[HIGH]`
- [ ] Rename a class `[MEDIUM]`
- [ ] Delete a class `[HIGH]`
- [ ] View class roster `[HIGH]`
- Findings: ___

### 10.4 Grade Tracking
- [ ] View quiz grades per student `[HIGH]`
- [ ] View worksheet grades per student `[HIGH]`
- [ ] Grade history sorted by date `[MEDIUM]`
- Findings: ___

### 10.5 Attendance
- [ ] Mark attendance for a class on a specific date `[HIGH]`
- [ ] View attendance history per student `[HIGH]`
- [ ] Attendance percentage calculated `[HIGH]`
- Findings: ___

### 10.6 Test Reminders
- [ ] Create a test reminder with date and class `[HIGH]`
- [ ] Reminder appears in My Overview `[HIGH]`
- Findings: ___

---

## PHASE 11 — Progress Tracker (Curriculum Milestones)

### 11.1 Milestone Management
- [ ] Milestones populate for selected grade/subject `[HIGH]`
- [ ] Set milestone status: not_started → in_progress → completed `[CRITICAL]`
- [ ] Set milestone as skipped `[MEDIUM]`
- [ ] Add due date to milestone `[HIGH]`
- [ ] Add notes to milestone `[HIGH]`
- Findings: ___

### 11.2 Checklist Items
- [ ] Add checklist items to a milestone `[HIGH]`
- [ ] Toggle checklist item complete/incomplete `[HIGH]`
- Findings: ___

### 11.3 History Audit Trail
- [ ] Status change logged with timestamp `[HIGH]`
- [ ] History visible per milestone `[MEDIUM]`
- Findings: ___

### 11.4 Filters & Progress Display
- [ ] Filter by grade, subject, status `[HIGH]`
- [ ] Visual progress indicators per strand `[HIGH]`
- Findings: ___

### 11.5 Phase Context UI
- [ ] `PhaseContextBanner` shows the current academic phase at the top of relevant tabs `[HIGH]`
- [ ] Banner updates when phase boundaries change `[MEDIUM]`
- [ ] `PhaseHistoryNav` lets user scrub through past phases `[HIGH]`
- [ ] Selecting a historical phase filters milestones to that phase `[HIGH]`
- [ ] `PhaseBreakdownModal` opens from banner and shows phase-level stats `[HIGH]`
- [ ] Modal displays milestone progress, coverage %, and pending items per phase `[HIGH]`
- Findings: ___

---

## PHASE 12 — Brain Dump

### 12.1 Idea Capture
- [ ] Type unstructured text → submit `[HIGH]`
- [ ] AI auto-categorizes the content `[HIGH]`
- [ ] Category label displayed on entry `[HIGH]`
- Findings: ___

### 12.2 File Attachment
- [ ] Attach a file to a brain dump entry `[MEDIUM]`
- Findings: ___

### 12.3 Organization
- [ ] Request AI organization plan for notes `[HIGH]`
- [ ] Execute organization `[HIGH]`
- [ ] Undo organization `[HIGH]`
- [ ] Learned keywords persist across sessions `[MEDIUM]`
- Findings: ___

---

## PHASE 13 — Image Studio

### 13.1 Service Preload
- [ ] Check image service status — idle `[HIGH]`
- [ ] Preload image model `[HIGH]`
- [ ] Status updates to ready `[HIGH]`
- Findings: ___

### 13.2 Text-to-Image
- [ ] Enter prompt → generate single image `[CRITICAL]`
- [ ] Image renders correctly `[CRITICAL]`
- [ ] Adjust dimensions, guidance scale, steps `[HIGH]`
- [ ] Batch generate multiple images `[HIGH]`
- [ ] Prompt enhancement via AI `[MEDIUM]`
- [ ] Comic-style prompt generation `[MEDIUM]`
- Findings: ___

### 13.3 Inpainting
- [ ] Upload an image `[HIGH]`
- [ ] Draw mask over a region `[HIGH]`
- [ ] Enter replacement description `[HIGH]`
- [ ] Inpaint executes and fills region `[HIGH]`
- Findings: ___

### 13.4 Background Removal
- [ ] Upload image → background removed `[HIGH]`
- [ ] Output has transparent or clean background `[HIGH]`
- Findings: ___

### 13.5 Annotation Tools
- [ ] Draw with brush `[HIGH]`
- [ ] Erase drawn content `[HIGH]`
- [ ] Add text overlay `[HIGH]`
- [ ] Change color (6 presets + custom) `[MEDIUM]`
- [ ] Undo annotation step `[HIGH]`
- [ ] Redo annotation step `[HIGH]`
- Findings: ___

### 13.6 Advanced Operations
- [ ] Grayscale conversion `[MEDIUM]`
- [ ] Contrast normalization `[MEDIUM]`
- [ ] Edge detection `[LOW]`
- Findings: ___

### 13.7 Image History
- [ ] Generated images saved to history `[HIGH]`
- [ ] Retrieve previous images `[HIGH]`
- Findings: ___

### 13.8 ESRGAN Upscaling
- [ ] `esrgan_service` upscales a selected image 2x / 4x `[HIGH]`
- [ ] Upscaled result preserves detail without obvious artifacts `[HIGH]`
- [ ] Upscale operation completes within reasonable time on CPU-only `[MEDIUM]`
- [ ] Upscaled image saved to history `[MEDIUM]`
- Findings: ___

### 13.9 Scene API
- [ ] `scene_api_endpoints` accepts a scene schema payload `[HIGH]`
- [ ] `scene_schema` validates fields and rejects malformed scenes `[HIGH]`
- [ ] Scene renders into a composed image `[HIGH]`
- [ ] Scene result can be saved into Image Studio history `[MEDIUM]`
- Findings: ___

---

## PHASE 14 — Slide Deck

### 14.1 Generation
- [ ] Enter topic/lesson — slides generate `[HIGH]`
- [ ] Slide-by-slide streaming works `[HIGH]`
- [ ] All slides have title + body content `[HIGH]`
- [ ] Speaker notes generated `[HIGH]`
- Findings: ___

### 14.2 Editing
- [ ] Reorder slides `[HIGH]`
- [ ] Add a slide `[HIGH]`
- [ ] Delete a slide `[HIGH]`
- [ ] Edit text content `[HIGH]`
- [ ] Apply theme `[MEDIUM]`
- Findings: ___

### 14.3 Export
- [ ] Export to PDF `[HIGH]`
- [ ] Export to HTML `[MEDIUM]`
- Findings: ___

---

## PHASE 15 — Storybook Creator

### 15.1 Generation
- [ ] Enter topic + age range → story generates `[HIGH]`
- [ ] Page-by-page streaming works `[HIGH]`
- [ ] AI-generated illustration per page `[HIGH]`
- Findings: ___

### 15.2 Reading Modes
- [ ] Day mode: bright/warm UI `[MEDIUM]`
- [ ] Night mode: dark/soft UI `[MEDIUM]`
- [ ] Page navigation works (forward/back) `[HIGH]`
- Findings: ___

### 15.3 TTS in Storybook
- [ ] TTS reads page text aloud `[HIGH]`
- [ ] Plays page by page correctly `[HIGH]`
- Findings: ___

### 15.4 Export
- [ ] Export to PDF `[HIGH]`
- [ ] Export to ePub `[MEDIUM]`
- Findings: ___

---

## PHASE 16 — Photo Transfer

### 16.1 QR Generation
- [ ] Generate QR code for quiz/worksheet `[HIGH]`
- [ ] QR code encodes correct metadata `[CRITICAL]`
- Findings: ___

### 16.2 Photo Upload
- [ ] QR displayed for student to scan `[HIGH]`
- [ ] Mobile photo upload received `[HIGH]`
- [ ] SSL works for secure local transfer `[MEDIUM]`
- Findings: ___

### 16.3 Scan-to-Grade Integration
- [ ] Received photo auto-routes to grading pipeline `[HIGH]`
- [ ] Quiz/worksheet ID extracted from QR in photo `[CRITICAL]`
- Findings: ___

---

## PHASE 17 — Educator Insights & Coaching

### 17.1 Insights Dashboard
- [ ] Insights panel loads with personalized data `[HIGH]`
- [ ] Phase detection works (Start of Year / Mid-Year / End of Year) `[MEDIUM]`
- Findings: ___

### 17.2 Nudge System
- [ ] Contextual nudge appears at appropriate moment `[MEDIUM]`
- [ ] Dismiss a nudge permanently `[MEDIUM]`
- [ ] Nudge respects cooldown (doesn't reappear immediately) `[MEDIUM]`
- Findings: ___

### 17.3 Coach Drawer
- [ ] Open Educator Coach Drawer `[HIGH]`
- [ ] Coaching conversation streams correctly `[HIGH]`
- [ ] Conversation saved to history `[HIGH]`
- Findings: ___

### 17.4 Insights Coach Panel
- [ ] `InsightsCoachPanel` renders inline inside Educator Insights (distinct from the drawer) `[HIGH]`
- [ ] Panel surfaces contextual coaching tied to current insights data `[HIGH]`
- [ ] Clicking a suggestion deep-links to the relevant tab / tool `[MEDIUM]`
- Findings: ___

### 17.5 Metrics Nudge Banner
- [ ] `MetricsNudgeBanner` appears at the top of metrics when a nudge is active `[MEDIUM]`
- [ ] Banner respects cooldown (doesn't reappear immediately after dismissal) `[MEDIUM]`
- [ ] Dismiss permanently removes the banner for that nudge `[MEDIUM]`
- Findings: ___

---

## PHASE 18 — Performance Metrics & Analytics

### 18.1 My Overview Dashboard
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

### 18.2 Performance Metrics Tab
- [ ] All metric categories load: Content, Student, Curriculum, Engagement, Achievement, Usage `[HIGH]`
- [ ] Charts render without errors `[HIGH]`
- [ ] Grade distribution chart accurate `[HIGH]`
- [ ] Curriculum standards coverage percentage shown `[HIGH]`
- [ ] Live stats endpoint responds `[HIGH]`
- Findings: ___

### 18.3 Metrics Export
- [ ] Export metrics to file `[MEDIUM]`
- [ ] Clear metrics history `[LOW]`
- Findings: ___

### 18.4 Analytics Dashboard Tab
- [ ] `AnalyticsDashboard` opens as its own sidebar tab (distinct from Performance Metrics) `[HIGH]`
- [ ] Action cards navigate to curriculum tab with the correct route `[HIGH]`
- [ ] Clicking an action card that targets an existing tab reuses that tab `[MEDIUM]`
- [ ] Clicking a card for a closed tool creates a new tab `[HIGH]`
- [ ] Tab color overrides from settings apply to dashboard cards `[MEDIUM]`
- [ ] Analytics tutorial overlay launches from floating button `[MEDIUM]`
- Findings: ___

### 18.5 Teacher Metrics Panel
- [ ] `TeacherMetricsPanel` renders teacher-specific metrics outside the Performance Metrics tab `[HIGH]`
- [ ] Data pulled from `teacher_metrics_service` matches source `[HIGH]`
- [ ] Chart carousel renders (`TeacherMetricsChart`, `CategoryRadialChart`, `LessonPlanComparisonChart`, `ResourceDistributionChart`, `ResourceTrendChart`) `[HIGH]`
- [ ] Year phase popover shows correct bounds `[MEDIUM]`
- Findings: ___

---

## PHASE 19 — Achievements & Gamification

### 19.1 Achievement Display
- [ ] Achievements tab loads all 80+ achievement definitions `[HIGH]`
- [ ] Rarity tiers displayed correctly (Common → Legendary) `[HIGH]`
- [ ] Earned vs. unearned state visually distinct `[HIGH]`
- Findings: ___

### 19.2 Achievement Unlock
- [ ] Perform an action that triggers an achievement (create a lesson, quiz, etc.) `[CRITICAL]`
- [ ] Achievement unlock notification fires `[HIGH]`
- [ ] Trophy tier shown (Bronze/Silver/Gold/Platinum) `[HIGH]`
- [ ] Achievement appears in earned list with timestamp `[HIGH]`
- Findings: ___

### 19.3 Collections & Hidden
- [ ] Achievement collections group correctly `[MEDIUM]`
- [ ] Hidden achievement unlocks via specific action (investigate which one) `[LOW]`
- Findings: ___

### 19.4 Showcase
- [ ] Select favorite achievements to showcase `[HIGH]`
- [ ] Selected items appear in My Overview `[HIGH]`
- [ ] Deselect showcase item works `[MEDIUM]`
- Findings: ___

---

## PHASE 20 — Sticky Notes (Full Test)

### 20.1 Create & Manage
- [ ] Create a new note `[HIGH]`
- [ ] Change note color (6 options) `[MEDIUM]`
- [ ] Drag note to reposition `[HIGH]`
- [ ] Resize note via corner handle `[HIGH]`
- [ ] Pin note (stays on top) `[HIGH]`
- [ ] Minimize note (collapses to header) `[HIGH]`
- [ ] Close note `[HIGH]`
- Findings: ___

### 20.2 Rich Text Editing
- [ ] Bold, Italic, Underline, Strikethrough `[HIGH]`
- [ ] H1, H2, H3 headings `[MEDIUM]`
- [ ] Bullet list, numbered list `[HIGH]`
- [ ] Blockquote `[LOW]`
- [ ] Link insertion `[MEDIUM]`
- Findings: ___

### 20.3 Checklists
- [ ] Add checklist items `[HIGH]`
- [ ] Toggle checklist item complete `[HIGH]`
- Findings: ___

### 20.4 Grouping
- [ ] Drag two notes together to group `[HIGH]`
- [ ] Move group together `[HIGH]`
- [ ] Minimize group `[MEDIUM]`
- Findings: ___

### 20.5 Persistence
- [ ] Notes persist after tab close and reopen `[CRITICAL]`
- [ ] Notes scoped to tab type (different notes per tab) `[HIGH]`
- Findings: ___

---

## PHASE 21 — Notifications & Reminders

### 21.1 Notifications
- [ ] Generation complete notification fires `[HIGH]`
- [ ] Achievement unlock notification fires `[HIGH]`
- [ ] Notification panel opens and lists items `[HIGH]`
- [ ] Mark notification as read `[MEDIUM]`
- Findings: ___

### 21.2 Reminders
- [ ] Create reminder: title, date, time, type `[HIGH]`
- [ ] Reminder appears in list `[HIGH]`
- [ ] Edit reminder `[MEDIUM]`
- [ ] Delete reminder `[HIGH]`
- [ ] Reminder triggers notification at due time `[HIGH]`
- Findings: ___

### 21.3 Quiet Hours
- [ ] Set quiet hours start/end time `[MEDIUM]`
- [ ] Notifications suppressed during quiet period `[MEDIUM]`
- Findings: ___

### 21.4 Calendar Export
- [ ] Export reminders to `.ics` file `[HIGH]`
- [ ] ICS file imports correctly into external calendar app `[MEDIUM]`
- Findings: ___

### 21.5 Calendar Import
- [ ] `calendar_import_service` accepts a `.ics` file upload `[HIGH]`
- [ ] Imported events land in unified calendar under the correct source type `[HIGH]`
- [ ] Duplicate events (same UID) are deduplicated on re-import `[HIGH]`
- [ ] Recurring events (RRULE) are expanded correctly on import `[HIGH]`
- [ ] Malformed ICS surfaces a clear error, no partial writes `[MEDIUM]`
- Findings: ___

---

## PHASE 22 — My Resources & File Management

### 22.1 Resource Browser
- [ ] Browse saved content (lessons, quizzes, worksheets, etc.) `[HIGH]`
- [ ] Preview a file `[HIGH]`
- [ ] Open/read file contents `[HIGH]`
- Findings: ___

### 22.2 File Explorer
- [ ] Browse allowed folders `[HIGH]`
- [ ] Search for files by name `[HIGH]`
- [ ] Parse an uploaded file (PDF, DOCX, XLSX, TXT, image) `[HIGH]`
- Findings: ___

### 22.3 AI Organization
- [ ] Request AI folder organization plan `[MEDIUM]`
- [ ] Execute organization — files moved as planned `[MEDIUM]`
- [ ] Undo organization — files returned to original locations `[HIGH]`
- Findings: ___

### 22.4 Class Pack Export
- [ ] Export all materials for a class as archive `[MEDIUM]`
- [ ] Archive contains all expected files `[MEDIUM]`
- Findings: ___

### 22.5 Support Reporting
- [ ] `SupportReporting` tab opens from sidebar `[HIGH]`
- [ ] Submit a new ticket: title, description, category, severity `[CRITICAL]`
- [ ] Attach screenshot (manual or via Tutorial screenshot-to-ticket hook) `[HIGH]`
- [ ] Ticket appears in the list after submit `[HIGH]`
- [ ] Search tickets by keyword `[HIGH]`
- [ ] Filter tickets by status / category / severity `[HIGH]`
- [ ] Sort tickets (date / severity) `[MEDIUM]`
- [ ] Open a ticket → view full details + response thread `[HIGH]`
- [ ] Mark ticket resolved / reopen ticket `[MEDIUM]`
- [ ] Ticket data persists across restart `[HIGH]`
- Findings: ___

---

## PHASE 23 — Data Management (Run Last — Destructive)

### 23.1 Export All Data
- [ ] Export full data archive (JSON) `[HIGH]`
- [ ] Archive contains all expected sections `[HIGH]`
- Findings: ___

### 23.2 Import Data
- [ ] Import previously exported archive `[HIGH]`
- [ ] All data restored correctly `[HIGH]`
- [ ] No data duplication on import `[HIGH]`
- Findings: ___

### 23.3 Clear Metrics History
- [ ] Clear metrics — metrics reset to zero `[MEDIUM]`
- [ ] Other data unaffected `[HIGH]`
- Findings: ___

### 23.4 Factory Reset ⚠️ TEST LAST
> **WARNING: This wipes all settings and data. Only run at end of testing or on a test instance.**
- [ ] Factory reset dialog prompts for confirmation `[CRITICAL]`
- [ ] After reset, app returns to first-run / Setup Wizard state `[CRITICAL]`
- [ ] All JSON history files cleared `[HIGH]`
- [ ] All SQLite tables cleared `[HIGH]`
- [ ] All localStorage cleared `[HIGH]`
- Findings: ___

---

## PHASE 24 — Cross-Feature Integration Tests
*Goal: Test that features talk to each other correctly*

### 24.1 Lesson → Curriculum Alignment
- [ ] Generate lesson plan → standards auto-matched to curriculum `[HIGH]`
- [ ] Matched standards appear in Progress Tracker `[HIGH]`
- Findings: ___

### 24.2 Quiz → Grades → Metrics
- [ ] Grade a quiz → grade appears in My Classes `[CRITICAL]`
- [ ] Grade reflected in Performance Metrics `[HIGH]`
- [ ] Grade feeds Achievement system (if threshold met) `[HIGH]`
- Findings: ___

### 24.3 Scan-to-Grade Full Pipeline
- [ ] Print quiz with QR → photograph → upload → grade assigned to correct student `[CRITICAL]`
- Findings: ___

### 24.4 Milestone → Performance Metrics
- [ ] Complete a milestone → completion feeds Metrics `[HIGH]`
- [ ] Curriculum coverage percentage updates `[HIGH]`
- Findings: ___

### 24.5 Achievements → My Overview
- [ ] Earn an achievement → appears in Overview showcase (if selected) `[HIGH]`
- Findings: ___

### 24.6 Brain Dump → Lesson Planner
- [ ] Generate structured prompt in Brain Dump `[MEDIUM]`
- [ ] Use prompt as input in Lesson Planner `[MEDIUM]`
- Findings: ___

### 24.7 Image Studio → Worksheet
- [ ] Generate image in Image Studio `[HIGH]`
- [ ] Insert generated image into worksheet cell `[HIGH]`
- Findings: ___

---

## PHASE 25 — Unified Calendar System
*Goal: Verify the single derived event layer that syncs School Year Calendar, Timetable, Curriculum Plan, Lesson Plans, Holidays, and Scheduled Tasks*

> **Implementation phases:** Phase 1 (foundation) and Phase 6 (migration + validation) are SHIPPED. Phases 2–5 are pending. Items marked `[x]` were verified end-to-end via the synthetic test in `backend/migrations/unify_calendar.py` on 2026-04-10.

### 25.1 Schema Foundation (Sub-Phase 1) — SHIPPED
- [x] `unified_events` table created in `students.db` with all 17 columns `[CRITICAL]`
- [x] Three indexes present: `idx_unified_teacher_date`, `idx_unified_source`, `idx_unified_phase` `[HIGH]`
- [x] `UNIQUE(source_type, source_id)` constraint enforces upsert semantics `[CRITICAL]`
- [x] `init_schema()` is idempotent — running twice does not error or duplicate `[HIGH]`
- [x] `python-dateutil>=2.8.0` declared explicitly in `requirements.txt` `[HIGH]`
- Findings: All verified via `python -c "import unified_calendar_service as u; u.init_schema()"` against current `students.db`. Indexes confirmed via `sqlite_master` query.

### 25.2 Projector Functions (Sub-Phase 1) — SHIPPED (stubs for Phase 2 sources)
- [x] `project_school_year_event(conn, row)` upserts a school year event `[CRITICAL]`
- [x] `project_school_year_event` routes `event_type='holiday'` rows to `source_type='holiday'` `[HIGH]`
- [x] `project_timetable_slot(conn, slot, school_year_bounds)` builds an RRULE `[CRITICAL]`
- [x] RRULE format is `FREQ=WEEKLY;BYDAY=<TOKEN>;UNTIL=<YYYYMMDDTHHMMSS>` `[HIGH]`
- [x] `project_milestone(conn, row)` upserts only milestones with a `due_date` `[HIGH]`
- [x] `project_milestone` skips milestones with no `due_date` (returns None) `[HIGH]`
- [x] Status normalization map: `not_started→planned`, `in_progress→in_progress`, `completed→completed`, `skipped→cancelled` `[HIGH]`
- [ ] `project_lesson_plan(conn, row)` — wired in Phase 2 (currently raises NotImplementedError) `[HIGH]`
- [ ] `project_scheduled_result(conn, row)` — wired in Phase 2 `[MEDIUM]`
- [ ] `project_daily_plan(conn, row)` — wired in Phase 2 `[MEDIUM]`
- Findings: Synthetic test inserted 1 quiz event + 1 timetable slot, projected both, validated `expected==actual`.

### 25.3 Query Endpoint (Sub-Phase 1) — SHIPPED
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
- Findings: Synthetic test produced 27 events from 1 timetable slot (26 weekly Monday occurrences Jan 5 → Jun 30) + 1 school year quiz. Sort and expansion verified.

### 25.4 Sync + Conflicts Endpoints (Sub-Phase 1) — SHIPPED
- [x] `POST /api/calendar/sync` returns stub message pointing to migration script `[MEDIUM]`
- [x] `GET /api/calendar/conflicts?teacher_id=X` returns empty array (Phase 1 stub) `[MEDIUM]`
- [ ] `POST /api/calendar/sync` triggers full backfill in-process (Phase 6 wiring) `[HIGH]`
- [ ] `GET /api/calendar/conflicts` flags timetable occurrences on `blocks_classes=true` holidays (Phase 3) `[HIGH]`
- [ ] `GET /api/calendar/conflicts` flags lesson plans whose `start_datetime` no longer matches their bound slot (Phase 3) `[HIGH]`
- Findings: ___

### 25.5 Backfill Migration (Sub-Phase 6) — SHIPPED
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
- [ ] Backfill projects `lesson_plans` rows (requires Phase 2 SQLite migration) `[HIGH]`
- [ ] Backfill projects `daily_plans` rows (requires Phase 2 SQLite migration) `[MEDIUM]`
- [ ] Backfill projects `scheduled_results` rows (requires Phase 2 wiring) `[MEDIUM]`
- [ ] Rollback test: `DROP TABLE unified_events` → app continues to function without error `[CRITICAL]`
- Findings: Synthetic E2E test on 2026-04-10 verified all SHIPPED items. Created test config + event + timetable slot under teacher `__phase1_test__`, ran migration twice, confirmed counts stayed at 2 parent rows. Cleanup successful.

### 25.6 Holiday System (Sub-Phases 2 + 4) — BACKEND SHIPPED, FRONTEND PENDING
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
- Findings: Synthetic E2E test on 2026-04-10 (Phase 2 turn) created config + slot + blocking holiday on Mon 2026-02-16 via actual `school_year_service.save_event()`. Verified EXDATE was added to the timetable RRULE, query expansion suppressed Feb 16 while Feb 9 + Feb 23 still appeared, and `delete_event(holiday)` cleared the EXDATE. **Bug found and fixed:** initial RRULE format used inline `;EXDATE=...` which is invalid iCal syntax — `dateutil.rrulestr` rejected it and the soft fallback returned the unexpanded parent. Switched to multi-line format `RRULE:...\nEXDATE:...` which `rrulestr` parses correctly into an `rruleset`.

### 25.7 Source Projector Wiring (Sub-Phase 2) — PARTIALLY SHIPPED
- [x] `school_year_service.save_event()` calls `project_school_year_event()` in same transaction `[CRITICAL]`
- [x] `school_year_service.delete_event()` calls `delete_unified_event()` for both `school_year` and `holiday` source types `[CRITICAL]`
- [x] `school_year_service.upsert_timetable_slot()` calls `project_timetable_slot()` in same transaction with active config bounds `[CRITICAL]`
- [x] `school_year_service.delete_timetable_slot()` calls `delete_unified_event()` `[HIGH]`
- [x] `milestone_db.create_milestone()` projects via `_project_milestone_safe()` (cross-DB, no-op without due_date) `[CRITICAL]`
- [x] `milestone_db.update_milestone()` projects, deletes projection if due_date cleared, deletes if hidden `[CRITICAL]`
- [x] `_get_active_config_bounds()` helper looks up config without opening a new connection `[HIGH]`
- [x] `_reproject_teacher_timetable_slots()` helper rebuilds all slot RRULEs after a holiday change (in-transaction) `[CRITICAL]`
- [x] `lesson_plans` table schema created (empty placeholder, populated in 2b) `[HIGH]`
- [x] `lesson_plan_edits` table schema created (empty placeholder) `[HIGH]`
- [x] `daily_plans` table schema created (empty placeholder, populated in 2c) `[MEDIUM]`
- [x] Creating a school year event via service function immediately appears in `unified_events` `[CRITICAL]`
- [x] Creating a timetable slot via service function immediately appears in `unified_events` `[CRITICAL]`
- [x] Creating a milestone with due_date via service function immediately appears in `unified_events` `[CRITICAL]`
- [x] Cross-DB milestone projection failures are caught and logged, never break the milestone write itself `[HIGH]`
- [ ] New `routes/lesson_plans.py` create/update calls `project_lesson_plan()` `[HIGH]` (Phase 2b — pending)
- [ ] `scheduled_tasks.py` result write calls `project_scheduled_result()` `[MEDIUM]` (Phase 2d — pending)
- [ ] `lesson_plan_history.json` migrated to `lesson_plans` SQLite table `[HIGH]` (Phase 2b — pending)
- [ ] Original JSON renamed to `.bak` and preserved `[HIGH]` (Phase 2b)
- [ ] 50-entry history cap removed (all rows preserved) `[HIGH]` (Phase 2b)
- [ ] Kindergarten localStorage `daily_plans` migrated to backend SQLite table `[MEDIUM]` (Phase 2c — pending)
- [ ] Creating a lesson plan via UI immediately appears in `unified_events` `[CRITICAL]` (Phase 2b)
- [ ] Saving a scheduled task result immediately appears in `unified_events` `[MEDIUM]` (Phase 2d)
- Findings: Synthetic E2E test on 2026-04-10 ran 9 steps using actual service functions: save_config → save_event(quiz) → upsert_timetable_slot → save_event(blocking holiday) → verify EXDATE → query expansion suppression → delete_event(holiday) → delete_timetable_slot → delete_event(quiz). All 9 steps passed with all unified_events rows created and torn down correctly. Separate milestone test verified all 5 cross-DB scenarios: (1) create with no due_date → no projection, (2) update with due_date → projection appears with status mapping `in_progress`, (3) status flip to completed → unified status flips, (4) clear due_date → projection deleted, (5) hide milestone → projection deleted.

### 25.8 Cross-System Auto-Linking (Sub-Phase 3) — PENDING
- [ ] Setting a milestone `due_date` auto-stamps `phase_id` from `get_phase_for_date()` `[HIGH]`
- [ ] Editing a phase's date range re-buckets affected milestones `[HIGH]`
- [ ] Creating a lesson plan auto-stamps `timetable_slot_id` via `lookup_timetable_slot()` `[HIGH]`
- [ ] Lesson plans with no matching slot remain valid as "drafts" `[MEDIUM]`
- [ ] Lesson plans with `curriculumMatches` auto-stamp `suggested_milestone_id` (top match) `[HIGH]`
- [ ] Suggesting a milestone DOES NOT advance its status (manual only) `[HIGH]`
- [ ] "Mark as taught" button on lesson plan detail flips lesson + milestone + unified_event in one transaction `[CRITICAL]`
- [ ] "Mark as taught" appends a row to `milestone_history` `[HIGH]`
- [ ] Lesson planner shows "this class has a quiz today" when a school year event matches the date `[MEDIUM]`
- [ ] Scheduled task results tagged with `week_of` roll into `academic_phase_summaries` `[MEDIUM]`
- [ ] `GET /api/calendar/conflicts` flags real conflicts (not the Phase 1 stub) `[HIGH]`
- Findings: ___

### 25.9 Dashboard Hub Unification (Sub-Phase 4) — PENDING
- [ ] New `frontend/src/contexts/SchoolYearContext.tsx` provides shared state to all 3 flip-cards `[CRITICAL]`
- [ ] New `frontend/src/lib/teacherId.ts` extracts the `getTeacherId()` helper from `SchoolYearHub.tsx` `[HIGH]`
- [ ] Selecting Term 2 in the Calendar panel filters Curriculum and Timetable panels too `[HIGH]`
- [ ] Selecting a grade/subject in any panel filters all three `[HIGH]`
- [ ] New 4th flip-card "Unified View" pulls from `/api/calendar/unified` `[HIGH]`
- [ ] Holiday Manager UI panel renders inside SchoolYearCalendar `[HIGH]`
- [ ] All 3 flip-cards no longer hold duplicate copies of `activeConfigId`/`selectedPhaseId` `[MEDIUM]`
- Findings: ___

### 25.10 CompactCalendar Widget Refactor (Sub-Phase 5) — PENDING
- [ ] Widget fetches from `/api/calendar/unified` instead of taking 4 prop dicts `[HIGH]`
- [ ] Widget gates fetch on `teacherId` presence (no fetch before auth resolves) `[HIGH]`
- [ ] Color-coded dots distinguish source types (school_year, timetable, milestone, holiday, etc.) `[MEDIUM]`
- [ ] Click a dot → routes to originating tab with date preselected `[HIGH]`
- [ ] No regression in current sidebar rendering or layout `[MEDIUM]`
- Findings: ___

### 25.11 Performance & Edge Cases
- [ ] Query 1 year of data with 5 timetable slots → expansion completes in <200ms `[HIGH]`
- [ ] Query with 100+ school year events → no N+1, single SQL query `[HIGH]`
- [ ] Migration on a DB with 10000+ source rows completes in reasonable time `[MEDIUM]`
- [ ] Concurrent writes (UI saves event while migration runs) do not corrupt unified_events `[HIGH]`
- [ ] Invalid `source_type` passed to `upsert_unified_event()` raises ValueError `[HIGH]`
- [ ] Invalid `status` passed to `upsert_unified_event()` raises ValueError `[HIGH]`
- [ ] Date range filter with `start > end` returns empty array (not error) `[MEDIUM]`
- [ ] Timezone handling: events with naive datetimes don't crash expansion `[HIGH]`
- Findings: ___

### 25.12 Integration with Existing Phases
- [ ] Phase 11 (Progress Tracker): completing a milestone updates its `unified_events.status` `[HIGH]`
- [ ] Phase 21 (Calendar Export): `.ics` export pulls from unified_events instead of separate sources `[MEDIUM]`
- [ ] Phase 6 (Lesson Planner): "Mark as taught" workflow integrates correctly `[HIGH]`
- [ ] Phase 17 (Educator Insights): phase summaries reflect milestone completions from unified layer `[MEDIUM]`
- [ ] Phase 23 (Data Management): full data export includes `unified_events` table dump `[HIGH]`
- [ ] Phase 23 (Factory Reset): reset clears `unified_events` along with other tables `[HIGH]`
- Findings: ___

---

## PHASE 26 — Coworker Supercharge Features
*Goal: Verify the personalization, thinking, scheduling, and analyse layers added in the Supercharge pass (features 1–4, 6, 7 — feature 5 is covered by Phase 25)*

### 26.1 Smart Context Budgeting (Feature 1)
- [ ] Long chat session (20+ messages) stays responsive — no context overflow on Tier 1 models `[HIGH]`
- [ ] Summary auto-generated every ~10 messages (fire-and-forget, no UI hang) `[HIGH]`
- [ ] `build_context_budgeted()` trims oldest pairs when over tier budget — backend log confirms `[MEDIUM]`
- [ ] `CONTEXT_BUDGET` per-tier constants applied (T1=1500, T2=6000, T3=8000, T4=12000) `[MEDIUM]`
- [ ] Consultant drawer (Educator Coach) also applies budgeted context `[MEDIUM]`
- Findings: ___

### 26.2 Thinking Level Controls (Feature 2)
- [ ] Settings page no longer shows a global "Thinking Mode" toggle `[MEDIUM]`
- [ ] Brain icon in Ask Coworker opens Quick / Deep popup `[HIGH]`
- [ ] Quick mode: faster, shorter responses `[HIGH]`
- [ ] Deep mode: longer, more reasoned responses (CoT prefix for Gemma, `/think` for Qwen) `[HIGH]`
- [ ] Brain icon visual state reflects current selection (dim = Quick, glow = Deep) `[MEDIUM]`
- [ ] Analyse panel has its own independent Quick/Deep toggle `[MEDIUM]`
- [ ] Legacy `thinkingEnabled` localStorage key is ignored without error `[LOW]`
- Findings: ___

### 26.3 Model Offloading (Feature 3A)
- [ ] Minimize app to tray — backend log shows `Model unloaded (app hidden)` `[HIGH]`
- [ ] RAM usage drops by several GB after unload `[HIGH]`
- [ ] Restore app window — `Model reload triggered (app shown)` fires `[HIGH]`
- [ ] First generation after reload works correctly (model reinitialized) `[CRITICAL]`
- [ ] `POST /api/model/unload` and `POST /api/model/reload` respond 200 `[MEDIUM]`
- [ ] `is_model_loaded()` returns correct state before and after unload `[MEDIUM]`
- Findings: ___

### 26.4 Scheduled Task Configuration (Feature 3B)
- [ ] Settings → Background Schedule section renders `ScheduledTaskSettings` `[HIGH]`
- [ ] Pick day of week and time — saves via `POST /api/scheduled/config` `[HIGH]`
- [ ] Reminder offset saves correctly `[MEDIUM]`
- [ ] Task checkboxes (ELO Breakdown, Attendance, Progress) toggle and persist `[HIGH]`
- [ ] Config persists across app restart `[HIGH]`
- [ ] APScheduler job registered on backend startup from saved config `[HIGH]`
- [ ] Manual "Run now" trigger executes task immediately `[HIGH]`
- [ ] `ScheduleTestModal` opens for a dry-run / manual trigger with preview `[MEDIUM]`
- [ ] Test modal surfaces task output without committing to `scheduled_results` `[MEDIUM]`
- Findings: ___

### 26.5 Weekly ELO Breakdown Task (Feature 3C)
- [ ] Task ensures model loaded before running (auto-reload if offloaded) `[CRITICAL]`
- [ ] Task pulls current phase from School Year config `[HIGH]`
- [ ] Task pulls pending milestones for that phase `[HIGH]`
- [ ] Task pulls weekly timetable and includes it in LLM prompt `[HIGH]`
- [ ] LLM output is valid JSON (days → periods → elo) `[CRITICAL]`
- [ ] Result saved to `scheduled_results` table with `pending_review` status `[HIGH]`
- [ ] Model unloaded after task completes `[MEDIUM]`
- [ ] Notification fires when result ready `[HIGH]`
- Findings: ___

### 26.6 Scheduled Results Review (Feature 3E)
- [ ] Notification Panel shows a `ScheduledResultsSection` with toggle `[HIGH]`
- [ ] ELO breakdown renders as day-by-day / period-by-period cards `[HIGH]`
- [ ] "Accept & Generate Plans" queues lesson plan jobs from assigned ELOs `[HIGH]`
- [ ] "Edit" opens inline editor for the plan `[MEDIUM]`
- [ ] "Dismiss" removes the result from the panel `[MEDIUM]`
- [ ] Accepted/rejected state persists in `scheduled_results` `[MEDIUM]`
- [ ] `HistoryItem.category = 'scheduled'` distinguishes these entries from regular notifications `[LOW]`
- Findings: ___

### 26.7 Analyse Chat Panel (Feature 4)
- [ ] After generating a lesson/quiz/rubric/worksheet, an `[Analyse]` button appears `[HIGH]`
- [ ] Clicking it opens AIAssistantPanel in `analyse` mode, connected to `/ws/analyse` `[CRITICAL]`
- [ ] Init message sends full content; AI responds with greeting + suggestions `[HIGH]`
- [ ] "Create a more detailed version" triggers section-by-section enhancement with progress labels `[HIGH]`
- [ ] Each section streams (`section_token` events) and replaces corresponding section in editor `[HIGH]`
- [ ] "Expand the X section" edits only that section with full doc kept as read-only context `[HIGH]`
- [ ] Normal question (no edit) returns chat response without modifying output `[HIGH]`
- [ ] Undo button pops previous version from stack `[HIGH]`
- [ ] Closing panel discards ephemeral session (not saved to history) `[MEDIUM]`
- [ ] Analyse works across: LessonPlanner, QuizGenerator, RubricGenerator, WorksheetGenerator, Multigrade, CrossCurricular, Kindergarten, PresentationBuilder, StoryBookCreator `[HIGH]`
- Findings: ___

### 26.8 Coworker Long-Term Memory (Feature 6)
- [ ] After ~10 messages, `teacher_memories` table gains new rows (extracted facts) `[HIGH]`
- [ ] New conversation starts with relevant recalled facts in system prompt `[HIGH]`
- [ ] TF-IDF similarity search returns related past facts for current query `[HIGH]`
- [ ] Duplicate facts deduplicated, not re-inserted `[MEDIUM]`
- [ ] Extraction piggybacks on existing summary call — no extra LLM round trip `[MEDIUM]`
- [ ] scikit-learn loaded successfully at backend startup `[HIGH]`
- [ ] Privacy toggle: user can disable memory extraction and recall `[HIGH]`
- [ ] Contradictions between profile (F7) and extracted facts (F6) are flagged, not silently overwritten `[MEDIUM]`
- Findings: ___

### 26.9 Static Profile Context (Feature 7)
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

## PHASE 27 — Tab Pulse, Queue Panel & Cancellation
*Goal: Verify the unified busy/queue/cancel system across all generator types (diffusion, LLM, OCR).*
*Background: Originally only WS-based generators (LLM) participated in the tab-pulse and queue panel.
ImageStudio (diffusion) and the scan graders (OCR) ran via HTTP and bypassed both — finishing
silently and showing only as toasts, with no way to cancel from the queue panel. Phase 27 covers
the cross-cutting fix that brings them into the unified system end-to-end.*

### 27.1 Tab Strip Pulse on Completion `[HIGH]`
The "blink" (tab-tag pulse) is driven by `Dashboard.tsx`'s busy→idle transition tracker. It must
fire for **every** generator type when finished on a non-active tab.

**LLM generators (regression baseline — should already work)**
- [ ] Open Quiz Builder, switch to another tab, wait for generation → Quiz tab tag pulses on completion `[HIGH]`
- [ ] Same for: Lesson Plan, Rubric, Worksheet, Brain Dump, Storybook, Presentation, Multigrade, Kindergarten, Cross-Curricular `[HIGH]`

**Diffusion (ImageStudio) — fixed in this round**
- [ ] Start an image generation in ImageStudio, switch tabs → Image Studio tab tag pulses when generation finishes `[HIGH]`
- [ ] Comic generation (multi-panel) also pulses on completion `[MEDIUM]`
- [ ] Pulse clears as soon as the user clicks back into the Image Studio tab `[MEDIUM]`

**OCR scan graders — fixed in this round**
- [ ] Start grading scans in QuizScanGrader, switch tabs → Quiz tab tag pulses when grading finishes `[HIGH]`
- [ ] Same for WorksheetScanGrader `[HIGH]`

**Internal mechanism check**
- [ ] `TabBusyContext` exposes reactive `httpBusyTabIds` (Set) and Dashboard's pulse effect lists it in deps `[MEDIUM]`
- [ ] No spurious pulse on a tab that never went busy `[MEDIUM]`
- [ ] No pulse on the currently active tab (only background tabs flash) `[MEDIUM]`
- Findings: ___

### 27.2 Queue Panel Visibility `[HIGH]`
Every generator type must appear in the global queue panel while running, not just as a toast.

- [ ] LLM generators show up in queue panel as before (regression check) `[HIGH]`
- [ ] ImageStudio batch generation appears as **one queue entry per batch** (not one per slot) `[HIGH]`
- [ ] QuizScanGrader run appears in queue panel with label like `"Quiz Scans: N files"` `[HIGH]`
- [ ] WorksheetScanGrader run appears with label like `"Worksheet Scans: N files"` `[HIGH]`
- [ ] External (diffusion / OCR) entries appear immediately in the **generating** state (no waiting phase) `[MEDIUM]`
- [ ] Multiple concurrent generators across tabs all appear simultaneously in the panel `[MEDIUM]`
- [ ] On completion, entry transitions to "completed" with completedAt timestamp `[MEDIUM]`
- [ ] On error, entry transitions to "error" with the error message visible `[MEDIUM]`
- Findings: ___

### 27.3 Cancellation from the Queue Panel — Frontend `[HIGH]`
The cancel button in the queue panel must work for every generator type.

**LLM cancellation (regression baseline)**
- [ ] Click cancel on a running quiz → tokens stop streaming mid-generation, panel marks cancelled `[HIGH]`
- [ ] Same for Lesson Plan, Rubric, Worksheet, Brain Dump, Storybook, Presentation `[HIGH]`
- [ ] LLM tab returns to idle immediately after cancel (no leftover busy state) `[HIGH]`

**Diffusion cancellation**
- [ ] Click cancel on a running image generation → ImageStudio resets to input phase, slots cleared `[HIGH]`
- [ ] AbortController on the axios request fires (`CanceledError` / `ERR_CANCELED` is handled cleanly, no error toast) `[HIGH]`
- [ ] Cancelled mid-batch leaves no orphaned slots in the results view `[MEDIUM]`
- [ ] After cancel, the user can immediately start a new generation without restarting the app `[HIGH]`

**OCR cancellation**
- [ ] Click cancel on QuizScanGrader mid-grading → phase returns to `upload-scans`, no error message shown `[HIGH]`
- [ ] AbortError on the streaming fetch is handled silently (no red error toast) `[HIGH]`
- [ ] Same for WorksheetScanGrader `[HIGH]`
- [ ] Tab returns to idle, queue entry marked cancelled `[HIGH]`
- Findings: ___

### 27.4 Cancellation — Backend Token Plumbing `[HIGH]`
End-to-end cancel must actually stop server-side work, not just disconnect the client.

**Cancel registry (`/api/cancel/{job_id}`)**
- [ ] `_active_cancel_events` registry exists in `backend/main.py` and the POST endpoint sets the event `[HIGH]`
- [ ] Unknown job_id returns `not_found` AND logs a warning (debugging aid) `[MEDIUM]`
- [ ] Registry entries cleaned up in `finally` blocks of all generators (no leak across runs) `[HIGH]`

**LLM (`/ws/*`) — already wired, regression check**
- [ ] `LlamaInference.generate_stream` checks `cancel_event.is_set()` per token, breaks the loop `[HIGH]`
- [ ] Cancel mid-generation actually frees the inference lock (next request goes through immediately) `[HIGH]`
- [ ] WebSocket handlers register/clean up cancel_event in `_active_cancel_events` `[HIGH]`
- [ ] Hardcoded fallback IDs (`"quiz"`, `"lesson-plan"`, …) replaced with unique generated IDs to prevent collisions `[MEDIUM]`

**Diffusion (`/api/generate-image-base64`)**
- [ ] Endpoint accepts `jobId` in the request body `[HIGH]`
- [ ] Frontend `imageApi.generateImageBase64` forwards `jobId` from ImageStudio's queue id `[HIGH]`
- [ ] Backend registers cancel event before kicking off `image_service.generate_image()` and clears it in `finally` `[HIGH]`
- [ ] Diffusers backend: `callback_on_step_end` is wired to raise `CancelledError` when event is set → mid-step cancellation works `[HIGH]`
- [ ] OpenVINO backend: cancel checked between consecutive `generate_image()` calls (per-image granularity, mid-step not supported by library — documented) `[MEDIUM]`
- [ ] stable-diffusion.cpp backend: per-image cancel works, mid-step limitation documented `[MEDIUM]`
- [ ] Cancelled response is `{"success": false, "cancelled": true}` so frontend can distinguish from real errors `[MEDIUM]`
- [ ] ImageStudio's `onCancel` fires a `POST /api/cancel/{jobId}` in addition to `abortController.abort()` `[HIGH]`

**OCR (`/api/smart-grade-stream`)**
- [ ] Endpoint accepts `jobId` as a Form field `[HIGH]`
- [ ] Both QuizScanGrader and WorksheetScanGrader append `jobId` to FormData (sourced from queue id) `[HIGH]`
- [ ] Backend registers cancel event in `_active_cancel_events[jobId]` at top of SSE generator, cleans up in finally `[HIGH]`
- [ ] Cancel event checked at the **top of the file loop** (subsequent files skipped) `[HIGH]`
- [ ] Cancel event checked **between QR extraction and OCR fallback** `[MEDIUM]`
- [ ] Cancel event checked **between OCR detection and LLM grading** `[MEDIUM]`
- [ ] Cancel event passed into `_grade_detected_answers` / `_grade_single_quiz_scan` so it propagates to `LlamaInference.generate_stream` (mid-token cancellation in subjective grading) `[HIGH]`
- [ ] On cancel, SSE stream emits a final `{"event": "cancelled"}` event and closes cleanly `[MEDIUM]`
- [ ] Both scan graders fire `POST /api/cancel/{jobId}` in `onCancel` in addition to `abortController.abort()` `[HIGH]`

**Smoke / collision tests**
- [ ] Two concurrent quizzes (different tabs) cancelled independently — neither affects the other `[HIGH]`
- [ ] Diffusion + OCR + LLM running simultaneously → cancelling one leaves the other two running `[MEDIUM]`
- [ ] Cancel a job that is already finishing at the moment the cancel arrives → no exception, no zombie entry in registry `[MEDIUM]`
- Findings: ___

### 27.5 QueueContext External Item API `[MEDIUM]`
The new "external" item kind underpins ImageStudio + scan graders' queue integration.

- [ ] `QueueItem` has `kind: 'ws' | 'external'` (defaults to `'ws'`) `[MEDIUM]`
- [ ] `addExternalItem({ label, toolType, tabId, onCancel })` creates a generating-state item, returns its id `[MEDIUM]`
- [ ] `completeExternalItem(id, 'completed' | 'error', errorMessage?)` finalizes the entry `[MEDIUM]`
- [ ] `processNext` skips external items (they're not WS-driven) — verify it never tries to open a WS for them `[HIGH]`
- [ ] `cancelGenerating` invokes `item.onCancel()` for external items instead of hitting the REST cancel endpoint `[HIGH]`
- [ ] `cancelGenerating` falls back to the REST cancel endpoint for `kind === 'ws'` items (regression) `[HIGH]`
- [ ] External items don't break `clearAll` / `clearCompleted` / `reorderQueue` `[MEDIUM]`
- Findings: ___

---

## Issues Log

Use this section to record all issues found during testing.

| # | Phase | Feature | Description | Severity | Status |
|---|-------|---------|-------------|----------|--------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

**Severity scale:** Critical (blocks core function) | High (feature broken) | Medium (degraded UX) | Low (cosmetic)

---

## Testing Checklist Summary

| Phase | Area | Total Items | Completed | Issues Found |
|-------|------|------------|-----------|-------------|
| 1 | App Launch & Initial State | 23 | | |
| 2 | Settings & Configuration | 55 | | |
| 3 | Navigation & UI Shell | 25 | | |
| 4 | Ask PEARL (AI Chat) | 18 | | |
| 5 | Curriculum Browser | 17 | | |
| 6 | Lesson Planning Suite | 25 | | |
| 7 | Quiz Builder & Grading | 37 | | |
| 8 | Rubric Builder | 12 | | |
| 9 | Worksheet Builder & Grading | 31 | | |
| 10 | Classroom Management | 20 | | |
| 11 | Progress Tracker | 18 | | |
| 12 | Brain Dump | 9 | | |
| 13 | Image Studio | 30 | | |
| 14 | Slide Deck | 11 | | |
| 15 | Storybook Creator | 11 | | |
| 16 | Photo Transfer | 8 | | |
| 17 | Educator Insights | 15 | | |
| 18 | Performance Metrics & Analytics | 29 | | |
| 19 | Achievements | 11 | | |
| 20 | Sticky Notes | 17 | | |
| 21 | Notifications & Reminders | 18 | | |
| 22 | My Resources & File Mgmt | 21 | | |
| 23 | Data Management | 13 | | |
| 24 | Integration Tests | 14 | | |
| 25 | Unified Calendar System | 91 | 56 (Phase 1+6+2 backend shipped) | |
| 26 | Coworker Supercharge Features | 70 | | |
| 27 | Tab Pulse, Queue Panel & Cancellation | 71 | | |
| **TOTAL** | | **~737** | | |

---

*End of PEARL Testing Plan*



make user manual