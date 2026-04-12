content = r"""
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

"""

with open('C:/Users/LG/Desktop/Projects/Offline AI Standalone/plans/TESTING_PLAN.md', 'a', encoding='utf-8') as f:
    f.write(content)
print('Stages 8-12 appended OK, chars:', len(content))
