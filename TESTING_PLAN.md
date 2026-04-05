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

### 1.4 First-Run: Setup Wizard
- [ ] SetupWizard appears on fresh install / cleared localStorage `[HIGH]`
- [ ] Step 1 — Welcome: content displays correctly `[MEDIUM]`
- [ ] Step 2 — Profile: enter name, school, grade levels, subjects `[HIGH]`
- [ ] Step 3 — Feature Picker: toggle features on/off `[HIGH]`
- [ ] Step 4 — Completion: confirm and launch `[HIGH]`
- [ ] After completion, wizard does not reappear on restart `[HIGH]`
- Findings: ___

### 1.5 Welcome Modal
- [ ] WelcomeModal appears on first visit `[MEDIUM]`
- [ ] Dismiss works, does not reappear `[MEDIUM]`
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
- Findings: ___

### 2.9 System Behavior
- [ ] Minimize to system tray toggle works `[MEDIUM]`
- [ ] Start on boot toggle works `[LOW]`
- [ ] Auto-close tabs on exit toggle works `[MEDIUM]`
- [ ] File access permissions list saves correctly `[MEDIUM]`
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

---

## PHASE 18 — Performance Metrics & Analytics

### 18.1 My Overview Dashboard
- [ ] Recent activity feed populates correctly `[HIGH]`
- [ ] Quick stats show accurate counts `[HIGH]`
- [ ] Achievement showcase displays selected items `[HIGH]`
- [ ] Upcoming reminders listed `[HIGH]`
- [ ] Streak counter accurate `[MEDIUM]`
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
| 1 | App Launch & Initial State | 12 | | |
| 2 | Settings & Configuration | 35 | | |
| 3 | Navigation & UI Shell | 18 | | |
| 4 | Ask PEARL (AI Chat) | 16 | | |
| 5 | Curriculum Browser | 7 | | |
| 6 | Lesson Planning Suite | 22 | | |
| 7 | Quiz Builder & Grading | 25 | | |
| 8 | Rubric Builder | 12 | | |
| 9 | Worksheet Builder & Grading | 20 | | |
| 10 | Classroom Management | 20 | | |
| 11 | Progress Tracker | 12 | | |
| 12 | Brain Dump | 9 | | |
| 13 | Image Studio | 22 | | |
| 14 | Slide Deck | 11 | | |
| 15 | Storybook Creator | 11 | | |
| 16 | Photo Transfer | 8 | | |
| 17 | Educator Insights | 9 | | |
| 18 | Performance Metrics | 11 | | |
| 19 | Achievements | 11 | | |
| 20 | Sticky Notes | 17 | | |
| 21 | Notifications & Reminders | 13 | | |
| 22 | My Resources & File Mgmt | 11 | | |
| 23 | Data Management | 13 | | |
| 24 | Integration Tests | 14 | | |
| **TOTAL** | | **~377** | | |

---

*End of PEARL Testing Plan*



make user manual