# OECS Teacher Assistant — Complete Feature & Function Reference
*Auto-generated deep dive | April 2026*

---

## Table of Contents
1. [App Architecture Overview](#1-app-architecture-overview)
2. [Main Tabs & Navigation](#2-main-tabs--navigation)
3. [Lesson Planning Suite](#3-lesson-planning-suite)
4. [Quiz Builder & Grading](#4-quiz-builder--grading)
5. [Rubric Builder](#5-rubric-builder)
6. [Worksheet Builder & Grading](#6-worksheet-builder--grading)
7. [Classroom Management](#7-classroom-management)
8. [AI Chat Assistant (Ask Assistant)](#8-ai-chat-assistant-ask-coworker)
9. [Curriculum Browser & Progress Tracker](#9-curriculum-browser--progress-tracker)
10. [Brain Dump](#10-brain-dump)
11. [Image Studio](#11-image-studio)
12. [Presentation Builder (Slide Deck)](#12-presentation-builder-slide-deck)
13. [Storybook Creator](#13-storybook-creator)
14. [Achievements & Gamification](#14-achievements--gamification)
15. [Photo Transfer & QR Code System](#15-photo-transfer--qr-code-system)
16. [Educator Insights & Coaching](#16-educator-insights--coaching)
17. [Performance Metrics & Analytics](#17-performance-metrics--analytics)
18. [Sticky Notes System](#18-sticky-notes-system)
19. [My Overview (Dashboard)](#19-my-overview-dashboard)
20. [My Resources](#20-my-resources)
21. [Settings & Configuration](#21-settings--configuration)
22. [Notifications & Reminders](#22-notifications--reminders)
23. [Export & Import System](#23-export--import-system)
24. [AI Model Routing & Inference](#24-ai-model-routing--inference)
25. [OCR & Document Processing](#25-ocr--document-processing)
26. [Real-Time Streaming (WebSocket)](#26-real-time-streaming-websocket)
27. [Data Persistence Layer](#27-data-persistence-layer)
28. [Support & Diagnostics](#28-support--diagnostics)
29. [Onboarding, Setup Wizard & OAK Licensing](#29-onboarding-setup-wizard--oak-licensing)
30. [School Year & Calendar System](#30-school-year--calendar-system)
31. [Active Class Context & Class Defaults](#31-active-class-context--class-defaults)
32. [GenerateForSelector & Calendar Integration](#32-generateforselector--calendar-integration)
33. [Generation Queue, Tab Pulse & Cancellation](#33-generation-queue-tab-pulse--cancellation)
34. [Analyse Panel](#34-analyse-panel)
35. [Unified Calendar System](#35-unified-calendar-system)
36. [Scheduled Background Tasks](#36-scheduled-background-tasks)
37. [Dashboard Enhancements](#37-dashboard-enhancements)
38. [How Each Feature Helps Teachers & Improves Class Performance](#38-how-each-feature-helps-teachers--improves-class-performance)

---

## 1. App Architecture Overview

| Layer | Technology | Role |
|-------|-----------|------|
| **Shell** | Electron | Desktop wrapper, file system access, system tray |
| **Frontend** | React + TypeScript + Vite | All UI — 80+ components, 13 context providers |
| **Backend** | Python + FastAPI | All AI logic, grading, file ops, database |
| **Database** | SQLite (5+ databases) | Structured persistent data |
| **Storage** | JSON files + SQLite | History, drafts, chat sessions, lesson plans |
| **AI (text)** | GGUF models via llama-cpp-python | Local LLM inference |
| **AI (image)** | SDXL-Turbo / Flux.1 via OpenVINO | Local image generation |
| **OCR** | PaddleOCR-VL 1.5 (GGUF) | Scan-to-grade, document parsing |
| **Comms** | WebSocket (FastAPI) | Real-time streaming of all generation |
| **APIs (optional)** | OpenRouter, Gemma API | Cloud model fallbacks |

**Design philosophy:** Offline-first. Everything — AI, grading, storage — works without internet. Optional cloud models require API keys.

**App data folder:** `%APPDATA%/OECS Teacher Assistant/data` on Windows.

---

## 2. Main Tabs & Navigation

The sidebar has **23 primary tabs**, organized into feature groups. Middle tabs are drag-reorderable. Top (My Overview) and bottom (Performance Metrics, Support, Settings) are pinned.

| # | Tab Name | Type ID | Icon | Feature Group |
|---|----------|---------|------|--------------|
| 1 | My Overview | `analytics` | LayoutDashboard | Dashboard |
| 2 | Ask Assistant | `chat` | MessageSquare | AI Assistant |
| 3 | Curriculum Browser | `curriculum` | Search | Planning & Prep |
| 4 | Lesson Plan | `lesson-planner` | BookMarked | Lesson Planners |
| 5 | Early Childhood | `kindergarten-planner` | Baby | Lesson Planners |
| 6 | Multi-Level | `multigrade-planner` | Layers | Lesson Planners |
| 7 | Integrated Lesson | `cross-curricular-planner` | Merge | Lesson Planners |
| 8 | Quiz Builder | `quiz-generator` | PenTool | Assessment Tools |
| 9 | Rubric Builder | `rubric-generator` | ClipboardList | Assessment Tools |
| 10 | Worksheet Builder | `worksheet-generator` | FileSpreadsheet | Assessment Tools |
| 11 | My Classes | `class-management` | UsersRound | My Classroom |
| 12 | Photo Transfer | `photo-transfer` | Camera | My Classroom |
| 13 | Progress Tracker | `curriculum-tracker` | TrendingUp | My Classroom |
| 14 | Image Studio | `image-studio` | Palette | Visual Studio |
| 15 | Slide Deck | `presentation-builder` | Presentation | Visual Studio |
| 16 | Storybook Creator | `storybook` | StoryBook | Visual Studio |
| 17 | Brain Dump | `brain-dump` | Brain | Tools |
| 18 | Educator Insights | `educator-insights` | Lightbulb | Tools |
| 19 | My Resources | `resource-manager` | FolderOpen | Tools |
| 20 | Achievements | `achievements` | Trophy | Gamification |
| 21 | Performance Metrics | `performance-metrics` | Speedometer | Analytics (pinned) |
| 22 | Support & Reporting | `support` | HelpCircle | System (pinned) |
| 23 | Settings | `settings` | Settings | System (pinned) |

**Sidebar behaviors:**
- Each tab can be individually toggled off (except pinned ones)
- Drag-reorder supported for all non-pinned tabs
- Tab color is customizable per tab type (23 distinct colors)
- Multiple tabs of the same type can be open simultaneously
- Split-view mode: two tabs side by side (`SplitViewState`: left pane / right pane)
- Tab busy state prevents accidental close during generation

**Note:** App data folder is at `%APPDATA%/OECS Teacher Assistant/data` on Windows.

---

## 3. Lesson Planning Suite

Four specialized lesson planning tools cover every teaching level.

### 3.1 Standard Lesson Planner (`lesson-planner`)
**Components:** `LessonPlanner.tsx`, `LessonEditor.tsx`
**WebSocket:** `/ws/lesson-plan`
**HTTP:** `/api/generate-lesson-plan`

**Inputs:**
- Subject (e.g., Mathematics, English Language Arts, Science)
- Grade level
- Curriculum standards (selected from browser or typed)
- Duration (minutes)
- Learning context / notes

**AI Generation Output (streamed section by section):**
- Learning objectives (Bloom's taxonomy aligned)
- Required materials list
- Lesson activities (opener, main, closure)
- Assessment methods
- Differentiation strategies (by learning level/style)
- Extensions for advanced learners
- Homework / follow-up suggestions

**Post-generation:**
- Edit in `LessonEditor.tsx` — full rich text editing
- Auto-save to `lesson_drafts.json` while editing
- Save to `lesson_plans` SQLite table on completion (migrated from JSON)
- Export to PDF, DOCX, Markdown, JSON

### 3.2 Early Childhood Planner (`kindergarten-planner`)
**Component:** `KindergartenPlanner.tsx`
**WebSocket:** `/ws/kindergarten`

**Additions over standard planner:**
- Story-based activity integration
- Visual and kinesthetic activity emphasis
- Age-appropriate language calibration
- Storybook integration (links to Storybook Creator)
- Visual schedule output

### 3.3 Multi-Level Planner (`multigrade-planner`)
**Component:** `MultigradePlanner.tsx`
**WebSocket:** `/ws/multigrade`

**Additions:**
- Simultaneous planning for 2+ grade levels
- Per-level objectives and activities in one document
- Differentiated outcomes by grade
- Shared activity scaffolding with level variations

### 3.4 Integrated Lesson Planner (`cross-curricular-planner`)
**Component:** `CrossCurricularPlanner.tsx`
**WebSocket:** `/ws/cross-curricular`

**Additions:**
- Link 2+ subjects in a single lesson
- Cross-curricular standard mapping
- Thematic unit structure
- Integrated assessment design

**Shared Lesson Data Structure:**
```
LessonPlan {
  id, title, subject, gradeLevel, duration,
  standards: Standard[],
  objectives: string[],
  materials: string[],
  activities: Activity[],
  assessments: Assessment[],
  differentiation: Differentiation[]
}
```

**Saved data locations:**
- `backend/lesson_drafts.json` — in-progress work
- `students.db` → `lesson_plans` table — completed plans (migrated from JSON)
- `students.db` → `lesson_plan_edits` table — audit trail
- `backend/kindergarten_history.json`
- `backend/multigrade_history.json`
- `backend/cross_curricular_history.json`

---

## 4. Quiz Builder & Grading

### 4.1 Quiz Generation
**Components:** `QuizGenerator.tsx`, `QuizEditor.tsx`
**WebSocket:** `/ws/quiz`

**Supported question types:**
| Type | Description |
|------|-------------|
| Multiple Choice | 4 options (A-D), single correct answer |
| True/False | Binary choice |
| Fill-in-the-Blank | Open text answer with accepted answers |
| Open-Ended | Extended response with sample answer + rubric |

**Configuration options:**
- Subject, grade level
- Total number of questions
- Point values per question (configurable per item)
- Time limit
- Cognitive level targeting (Bloom's taxonomy)
- Instructions / preamble
- Question randomization flag

**AI generates:**
- Questions from topic/standards
- Correct answers + distractors
- Explanations per question
- Answer key

**Quiz editing (`QuizEditor.tsx`):**
- Add/remove/reorder questions
- Edit any field
- Adjust point values
- Preview quiz as student

**Data saved to:** `backend/quiz_history.json`

### 4.2 Quiz Grading — Manual
**Component:** `QuizGrader.tsx`
**Endpoint:** `POST /api/quiz-grades`

- Teacher selects student + quiz
- Enters score per question or total
- Auto-calculates percentage
- Stores feedback comment
- Saves to `students.db` -> `quiz_grades` table

### 4.3 Quiz Grading — Auto (Scan to Grade)
**Components:** `QuizScanGrader.tsx`
**Endpoints:** `POST /api/quiz/grade-scans`, `POST /api/quiz/grade-scans-stream`

**How it works:**
1. Printed quiz has embedded QR code (top-right) identifying quiz ID
2. Student completes quiz on paper
3. Teacher photographs or scans the quiz
4. System reads QR code -> fetches answer key from `quiz_answer_keys` table
5. OCR (PaddleOCR-VL 1.5) reads student answers
6. Alignment markers correct for rotation/skew
7. AI compares answers to key and scores each question
8. Grade + feedback recorded per student

**Stream mode:** Results appear one question at a time as they're graded

### 4.4 Answer Key Management
**Endpoints:** `GET /api/quiz/answer-keys`, `GET /api/quiz/answer-key/{id}`

- Store answer keys linked to quiz IDs
- Retrieve for manual or auto-grading
- Keys include: correct answers, point values, explanation notes

### 4.5 Quiz Instances
**Endpoint:** `POST /api/save-quiz-instances`

- Save per-student quiz versions (for randomized question order)
- Track which instance each student received
- Ensures correct grading for varied versions

---

## 5. Rubric Builder

**Components:** `RubricGenerator.tsx`, `RubricEditor.tsx`
**WebSocket:** `/ws/rubric`
**History:** `backend/rubric_history.json`

**AI generates:**
- Assessment criteria categories (e.g., Content, Organization, Mechanics)
- Performance levels (e.g., Beginning / Developing / Proficient / Exemplary)
- Descriptors per level per criterion
- Point scale (4-point, 5-point, or custom)
- Total points calculation

**Configuration:**
- Subject, grade level
- Assessment type (essay, project, presentation, lab report, etc.)
- Number of criteria
- Point scale choice

**Editing:**
- Add/remove criteria
- Rename levels and descriptors
- Adjust point values
- Save as template for reuse

**Export:**
- PDF (print-ready, formatted grid)
- DOCX (editable)
- JSON (for integration)

---

## 6. Worksheet Builder & Grading

### 6.1 Worksheet Generation
**Components:** `WorksheetGenerator.tsx`, `WorksheetEditor.tsx`, `WorksheetStructuredEditor.tsx`
**WebSocket:** `/ws/worksheet`
**History:** `backend/worksheet_history.json`

**Key configurable fields:**
- **Grid dimensions:** rows x columns (fully adjustable)
- **Subject field:** Maps to subject-specific templates and AI prompts
- **Grade level:** Adjusts language complexity and content
- Content types per cell: text, image, math equation, table

**AI generates:**
- Instructions preamble
- Question content per cell
- Answer spaces
- Answer key

**Editing (WorksheetStructuredEditor.tsx):**
- Click any cell to edit
- Drag-resize columns and rows
- Merge cells
- Apply border styles (full, inner, outer, none)
- Text alignment per cell
- Insert images into cells

### 6.2 Worksheet Grading — Manual
**Component:** `WorksheetGrader.tsx`
**Endpoint:** `POST /api/worksheet-grades`

- Student + worksheet selection
- Score entry per section or total
- Feedback comment
- Saves to `students.db` -> `worksheet_grades` table

### 6.3 Worksheet Grading — Auto (Scan to Grade)
**Components:** `WorksheetScanGrader.tsx`, `WorksheetBulkGrader.tsx`
**Endpoints:** `POST /api/worksheet/grade-scans`, `POST /api/worksheet/grade-scans-stream`

- Same scan-to-grade pipeline as quizzes (QR -> OCR -> align -> grade)
- Bulk grading: upload multiple scans in one batch
- Stream mode: real-time feedback per scanned item

### 6.4 Worksheet Packages
**Endpoints:** `GET /api/worksheet-packages`, `POST /api/worksheet-packages`

- Group multiple worksheets into a package for distribution
- Assign packages to classes
- Track which students received which package version

---

## 7. Classroom Management

**Component:** `ClassManagement.tsx`
**Service:** `backend/student_service.py`
**Database:** `backend/students.db`

### 7.1 Student Management
- Add / edit / delete individual students
- Fields: full name, student ID (auto-generated), grade level, class name, email, phone
- Bulk import via Excel template (`GET /api/students/sample-excel` -> upload to `/api/students/import-excel`)
- Filter students by class or grade

### 7.2 Class Management
- Create / rename / delete classes
- Assign grade level to class
- Associate teacher to class/subject
- View class roster

### 7.3 Grade Tracking
- View all quiz grades per student (`GET /api/quiz-grades/student/{id}`)
- View all worksheet grades per student (`GET /api/worksheet-grades/student/{id}`)
- Composite grade display per subject
- Grade history sorted by date

### 7.4 Attendance
- Mark attendance per class per date
- View attendance history per student
- Calculate attendance percentage
- Data: `attendance` table in `students.db`

### 7.5 Test Reminders
- Schedule upcoming exam/assessment dates
- Linked to Notifications & Reminders system
- Display on My Overview dashboard

---

## 8. AI Chat Assistant (Ask Assistant)

**Component:** `Chat.tsx`
**WebSocket:** `/ws/chat`
**History:** `backend/chat_history.json`
**Memory:** `backend/chat_memory.py`

**Core features:**
- Real-time streaming chat with the loaded AI model
- Context-aware: references previously shared content within session
- File attachment support (documents, images passed to vision model)
- Auto-title generation for each chat session (`POST /api/generate-title`)
- Autocomplete suggestions while typing (`POST /api/autocomplete`)
- Smart full-text search across all past chats (`POST /api/smart-search`)
- Session persistence: every conversation saved and retrievable
- Delete individual sessions (`DELETE /api/chat-history/{id}`)

**Chat Memory:**
- Sliding context window — older messages dropped gracefully to stay within token limits
- Structured format preserves key facts across turns

### 8.1 Smart Context Budgeting
- Sliding context window with per-tier token budgets:
  - T1 = 1,500 tokens
  - T2 = 6,000 tokens
  - T3 = 8,000 tokens
  - T4 = 12,000 tokens
- Auto-summary triggered approximately every 10 messages
- `build_context_budgeted()` trims oldest message pairs when over budget
- Consultant drawer also applies budgeted context (same budget logic)

### 8.2 Thinking Level Controls (Quick / Deep)
- Per-chat Quick/Deep toggle replaces the old global Thinking Mode setting
- Brain icon in Ask Assistant opens the Quick/Deep popup
- **Quick mode:** Faster, shorter responses — suited for rapid queries
- **Deep mode:** Longer, reasoned responses with chain-of-thought
  - CoT prefix injected for Gemma models
  - `/think` directive for Qwen models
- Analyse panel has its own independent Quick/Deep toggle (see Section 34)

### 8.3 Long-Term Memory (teacher_memories table)
- After approximately 10 messages in a session, key facts are extracted and stored
- New conversations start with relevant recalled facts injected via TF-IDF similarity search
- Duplicate deduplication prevents redundant memories
- Memory extraction piggybacks on the existing auto-summary call (no extra LLM call)
- Privacy toggle in Settings to disable long-term memory
- Uses scikit-learn for TF-IDF vectorization and similarity scoring
- Storage: `chat_memory.db` -> `teacher_memories` table
- Wipe endpoint: `DELETE /api/teacher-memory/all?teacher_id=X`

### 8.4 Static Profile Context
- Profile fields are injected into system prompts to personalize responses
- **Allowlisted fields** (may reach the model):
  - `displayName`, `coworkerName`, `gradeSubjects`, `filterContentByProfile`, `language`, `enabledModules`
- **Denylisted fields** (never injected):
  - `oakKey`, `school`, `theme`, `fontSize`
- Feature-aware scoping: each endpoint type (chat, lesson, quiz, etc.) receives only relevant profile fields
- Combined profile (F6) + feature context (F7) block capped at approximately 350 tokens

**Consultant sub-mode (`/ws/consultant`):**
- Specialized educational consultant persona
- Separate conversation history (`GET /api/consultant/conversations`)
- Focused on pedagogy, classroom strategies, professional development
- Applies the same Smart Context Budgeting as main chat

---

## 9. Curriculum Browser & Progress Tracker

### 9.1 Curriculum Browser (`curriculum`)
**Components:** `CurriculumViewer.tsx`, `CurriculumNavigator.tsx`, `CurriculumSkillTree.tsx`

- Browse curriculum standards by **grade + subject**
- View standard codes and full descriptions
- Skill progression tree visualization (`CurriculumSkillTree.tsx`)
- Cross-curricular standard mapping
- Standards auto-matched to lesson plans via `backend/curriculum_matcher.py`
- ELO/SCO dropdowns in generators show "Completed" badge for taught items
- Live refresh via `curriculum-completion-changed` window event

### 9.2 Progress Tracker (`curriculum-tracker`)
**Component:** `CurriculumTracker.tsx`
**Database:** `backend/milestones.db`
**Service:** `backend/milestone_db.py`

**Milestone statuses:**
- `not_started` | `in_progress` | `completed` | `skipped`

**Per-milestone data:**
- Topic title, grade, subject, strand
- Due date
- Completion date
- Teacher notes
- Checklist items (sub-tasks within a milestone)
- Full history audit trail (every status change logged)

**Features:**
- Filter milestones by grade, subject, status
- Bulk status updates
- Visual progress indicators per strand/subject
- Milestone completion feeds into Performance Metrics
- "Mark as taught" workflow: cascades through lesson_plan + unified_event + milestone simultaneously

---

## 10. Brain Dump

**Component:** `BrainDump.tsx`
**WebSocket:** `/ws/brain-dump`

**Purpose:** Rapid capture of thoughts, ideas, notes without structured input

**Features:**
- Type or paste anything — ideas, observations, plans, reminders
- AI auto-categorizes content by topic/intent
- Learned keyword system: app learns your naming patterns over time (`_load_learned_keywords()`)
- File attachments supported
- AI-powered organization suggestion (`POST /api/file-explorer/organize`)
- Execute organization: moves/renames files per plan (`POST /api/file-explorer/execute-organize`)
- Undo organization (`POST /api/file-explorer/undo-organize`)
- Generate structured prompts from raw ideas (feeds into other tools)

---

## 11. Image Studio

**Component:** `ImageStudio.tsx`
**Models:** SDXL-Turbo, Flux.1 Schnell (both via OpenVINO, fully offline)

### 11.1 Text-to-Image Generation
**Endpoints:** `POST /api/generate-image-base64`, `POST /api/generate-batch-images-base64`

- Enter text prompt -> generate image
- Parameters: dimensions, guidance scale, inference steps, seed
- Prompt enhancement via AI (`POST /api/generate-image-prompt`)
- Batch generation: multiple images in one request
- Comic-style prompt generation (`POST /api/generate-comic-prompts`)

### 11.2 Image Inpainting (Region Editing)
**Endpoint:** `POST /api/inpaint-base64`

- Upload image + draw mask over area to change
- Describe replacement content in text
- LAMA model fills masked region seamlessly
- Start IOPaint editor session (`POST /api/image-service/start-iopaint`)

### 11.3 Background Removal
**Endpoint:** `POST /api/remove-background-base64`

- Automatic subject detection
- Clean background removal with transparent output
- No manual masking needed

### 11.4 Image-to-Image Transform
- Upload existing image + text prompt
- AI modifies image guided by prompt
- Configurable strength (how much to change original)

### 11.5 ESRGAN Upscaling
**Service:** `esrgan_service`

- Upscale images 2x or 4x using ESRGAN model
- Preserves fine detail during upscaling
- Useful for enhancing scanned documents or generated images before print

### 11.6 Scene API
**Service:** `scene_api_endpoints`

- Accepts a scene schema payload describing a composed image
- Validates schema structure and element constraints
- Renders a composed image from the validated scene definition
- Useful for programmatic image composition from generator outputs

### 11.7 Annotation Tools (Drawing Layer)
- **Brush tool:** Freehand drawing
- **Eraser:** Remove drawn content
- **Text overlay:** Add custom text labels
- **Color picker:** 6 preset colors + custom
- **Undo / Redo** history
- **Layers** (in development)

### 11.8 Advanced Image Operations
- Grayscale conversion
- Contrast normalization
- Edge detection (Sobel operator)
- Color correction

### 11.9 Service Management
- `GET /api/image-service/status` — check if model loaded
- `POST /api/image-service/preload` — preload model into memory
- History saved to `backend/images_history.json`

---

## 12. Presentation Builder (Slide Deck)

**Component:** `PresentationBuilder.tsx`
**WebSocket:** `/ws/presentation`

**Features:**
- AI-generated slide content from topic/lesson
- Slide sequencing: reorder, add, delete slides
- Content per slide: title, body text, bullet points, images
- Speaker notes per slide
- Theme customization (color scheme, fonts)
- Export to PDF / HTML
- Integrates with Image Studio for custom visuals

---

## 13. Storybook Creator

**Components:** `StoryBookCreator.tsx`, `KidsStorybookSkeletonDay.tsx`, `KidsStorybookSkeletonNight.tsx`
**WebSocket:** `/ws/storybook`

**Features:**
- AI-generated children's stories from topic + character inputs
- Page-by-page streaming generation
- Illustration support: AI-generated images per page, or upload custom
- Two reading modes:
  - **Day mode** (bright, warm colors)
  - **Night mode** (dark, soft colors for bedtime)
- Interactive page turn navigation
- Text-to-speech reading per page (`POST /api/tts`)
- Export to PDF / ePub
- Age calibration (K, Grade 1-3, Grade 4-6)

---

## 14. Achievements & Gamification

**Component:** `Achievements.tsx`
**Service:** `backend/achievement_service.py`
**Database:** `backend/achievements.db`

### 14.1 Achievement Structure

**Categories:** Quizzes, Rubrics, Worksheets, Lessons, Chat, Brain Dump, Performance, Milestones, Special

**Rarity tiers:**
| Rarity | Unlock difficulty |
|--------|-----------------|
| Common | Low threshold |
| Uncommon | Moderate |
| Rare | Significant effort |
| Epic | Sustained high performance |
| Legendary | Exceptional / rare events |

**Achievement tiers (visual):**
- Bronze -> Silver -> Gold -> Platinum
- Trophy image changes per tier
- Unlock animation + notification on earn

**Impact levels:** Small (1-3 actions), Medium (5-10), Large (15+)

**Hidden achievements:** Unlocked by specific undisclosed actions (surprise element)

### 14.2 Achievement System Details
- 80+ achievement definitions in the database
- Per-achievement criteria: metric name + threshold (e.g., `quizzes_created >= 10`)
- Achievement collections (e.g., "Quiz Master" collection: 5 quiz-related achievements)
- Earned achievement history with timestamp and metadata
- **Showcase:** Select favorite achievements to display on dashboard
- `showcase_items` table — up to N featured items

### 14.3 Gamification Triggers
Every content creation or interaction action fires achievement checks:
- Creating a lesson, quiz, rubric, worksheet
- Completing a chat session
- Filling a brain dump
- Completing curriculum milestones
- Maintaining usage streaks
- Reaching score/count thresholds

---

## 15. Photo Transfer & QR Code System

**Component:** `PhotoReceiver.tsx`
**Routes:** `backend/routes/photo_transfer.py`
**SSL:** `backend/photo_transfer_ssl.py`

### 15.1 QR Code Generation
**Endpoint:** `POST /api/generate-qr`

- Generate QR code encoding quiz/worksheet ID, version, metadata
- QR printed on quiz/worksheet (top-right corner)
- QR also usable for photo upload initiation

### 15.2 Photo Receiving
- App generates a local network URL + QR code
- Student scans QR with mobile camera
- Photo uploaded directly to teacher's machine
- SSL support for secure local transfer

### 15.3 Hotspot & iOS HTTPS Path
**Endpoint:** `POST /api/photo-transfer/hotspot/start`

- Starts Windows Mobile Hotspot programmatically so students can connect without needing the school network
- Self-signed certificate generation enables HTTPS for iOS devices (iOS requires HTTPS for PWA camera access)
- Certificate generated at startup if not present; served alongside the local network URL

### 15.4 Phone PWA
- Full Progressive Web App served at `/phone` route
- Loads over hotspot from teacher's machine
- Provides camera access, upload UI, and outbox download in one interface
- Works on iOS and Android

### 15.5 SSE Real-Time Upload Stream
**Endpoint:** `GET /api/photo-transfer/stream`

- Server-Sent Events stream pushed to teacher UI
- Each upload triggers a real-time notification with filename, student name, and preview thumbnail
- No polling required

### 15.6 Outbox (Answer Key Distribution)
- Teacher queues answer keys for student phone download via the PWA outbox
- Students download keys after submitting photos
- Prevents answer key exposure before submission

### 15.7 Save to Resources
**Endpoint:** `POST /api/photo-transfer/save-to-resources/{session_id}`

- Saves all received photos from a session directly into My Resources
- Organizes by session date and class

### 15.8 Export PDF
**Endpoint:** `POST /api/photo-transfer/export-pdf/{session_id}`

- Compiles all photos from a transfer session into a single PDF
- Useful for printing or archiving a class set of completed work

### 15.9 Scan-to-Grade Integration
- Received photos -> auto-routed to grading pipeline
- `POST /api/quiz/extract-quiz-id` — read QR from photo to identify quiz
- Alignment markers correct for rotation/skew before OCR
- Region tracker maps answer zones to questions

---

## 16. Educator Insights & Coaching

**Component:** `EducatorInsights.tsx`
**WebSocket:** `/ws/educator-insights`
**Routes:** `backend/routes/insights.py`

**Features:**
- AI-powered coaching based on usage patterns and metrics
- Personalized suggestions: "You haven't created a rubric in 2 weeks — try aligning your upcoming project"
- Subject-specific teaching strategy recommendations
- Phase-aware tips (Start of Year, Mid-Year, End of Year, Holiday periods)
- Nudge system: contextual hints delivered at appropriate moments
  - Configurable cooldown per nudge type
  - Dismiss and suppress specific nudge categories
- Data-driven: coaching draws from performance metrics, milestone completion, grade trends

---

## 17. Performance Metrics & Analytics

**Components:** `PerformanceMetrics.tsx`, `AnalyticsDashboard.tsx`, `TeacherMetricsChart.tsx`
**Charts:** Distribution, trend, comparison, grade distribution charts
**Service:** `backend/teacher_metrics_service.py`
**Database:** `backend/metrics.db`

### Metrics Categories

**Content Metrics:**
- Total lessons / quizzes / rubrics / worksheets created
- Resource utilization rate

**Student Performance Metrics:**
- Assessment scores distribution
- Grade distribution by level (Below / At / Above)
- Class average per subject
- Score trends over time

**Curriculum Metrics:**
- Standards coverage percentage per subject
- Topic completion status
- Skill progression tracking
- Milestone completion rate

**Engagement Metrics:**
- Attendance rates per class
- Participation patterns

**Achievement Metrics:**
- Total achievements earned
- Rarity distribution breakdown
- Completion percentage of available achievements
- Showcase composition

**Usage Metrics:**
- Daily/weekly streak (consecutive active days)
- Peak usage hours
- Seasonal trends
- Per-tool usage frequency

**Dimensions calculated:**
- Curriculum alignment score
- Content creation volume index
- Student performance quality score
- Attendance consistency score
- Achievement collection progress

### Dashboard Widgets
- **CompactCalendar widget** — shows unified calendar events as a 4th dot layer (school year, milestones, timetable, lesson plans)
- **MostUsedTools widget** — bar chart of generator usage frequency
- **QuickStatsCard** — single-number KPIs (lessons this week, quizzes graded, etc.)
- **RecentActivityTimeline** — chronological feed of all recent actions
- **TaskListWidget** — pending tasks pulled from milestones + scheduled results
- **CurriculumProgressWidget** — per-subject completion ring chart

### API
- `GET /api/metrics/summary` — KPI summary
- `GET /api/metrics/history` — Full history
- `GET /api/metrics/live-stats` — Real-time stats
- `GET /api/metrics/system-specs` — CPU, RAM, disk
- `GET /api/metrics/export` — Export all metrics
- `DELETE /api/metrics/clear` — Clear history

---

## 18. Sticky Notes System

**Components:** `sticky-notes/StickyNote.tsx`, `StickyNoteContext.tsx`

### Per-Note Features
| Feature | Details |
|---------|---------|
| **Colors** | 6 options: Yellow, Green, Blue, Red, Purple, Orange |
| **Rich text** | Bold, Italic, Underline, Strikethrough |
| **Headers** | H1, H2, H3 in note body |
| **Lists** | Bullet lists, numbered lists |
| **Blockquote** | Quoted text style |
| **Links** | Hyperlink insertion |
| **Checklists** | Toggle items on/off |
| **Pin** | Keep note on top of all windows |
| **Minimize** | Collapse to just header bar |
| **Resize** | Drag corner handles |
| **Move** | Drag header to reposition anywhere |

### System Features
- **Position persistence:** x/y saved and restored on next open
- **Size persistence:** width/height saved
- **Per-tab isolation:** Notes are scoped to the active tab type
- **Auto-save:** Changes saved instantly to context
- **Grouping:** Drag notes together to group them
- **Group operations:** Move/minimize/close all notes in a group

---

## 19. My Overview (Dashboard)

**Component:** `AnalyticsDashboard.tsx`
**Type ID:** `analytics`

**Sections:**
- Recent activity feed (latest lesson, quiz, worksheet actions)
- Quick stats: lessons this week, quizzes graded, milestones completed
- Achievement showcase (featured achievements)
- Upcoming reminders / test dates
- Nudge / tip of the day from Educator Insights
- Streak counter (consecutive days active)
- Shortcut buttons to most-used tools
- CompactCalendar widget with unified calendar events
- Flip Card: front shows upcoming quizzes, back shows `LessonsNeedingPlans` widget with count badge

---

## 20. My Resources

**Component:** `ResourceManager.tsx` (implied from `resource-manager` type)
**Endpoints:** File explorer routes

**Features:**
- Browse and manage all saved content (lessons, quizzes, worksheets, rubrics, images)
- File system explorer with folder browsing (`GET /api/file-explorer/browse`)
- Search files by name/content (`GET /api/file-explorer/search`)
- Preview files (`GET /api/file-explorer/preview-by-path`)
- Read file contents (`GET /api/file-explorer/read-file`)
- Parse uploaded files (PDF, DOCX, XLSX, TXT, images) (`POST /api/file-explorer/parse`)
- Folder organization via AI (`POST /api/file-explorer/organize` + execute/undo)
- Allowed folders whitelist for file access control (`GET/POST /api/file-explorer/allowed-folders`)
- Export class content pack (`POST /api/export-class-pack`)

---

## 21. Settings & Configuration

**Component:** `Settings.tsx`
**Context:** `frontend/src/contexts/SettingsContext.tsx`

### 21.1 User Profile
- Display name, school name, registration date
- **Coworker Name:** User-configurable AI assistant name (default: "Coworker", max 30 characters). This name appears throughout the UI wherever the assistant is referenced.
- Grade levels taught (multi-select)
- Subjects taught (per grade level mapping)
- Toggle: filter all content by profile (shows only relevant grade/subject content)
- Language preference

### 21.2 AI Model Selection
**Text models (local):**
- Auto-scanned from `/models` directory
- Supports any GGUF format (Llama, Mistral, Qwen, etc.)
- Per-model metadata: size, quantization level (Q4, Q5, Q8, etc.)
- Active model indicator

**Text models (API):**
- OpenRouter: configurable model ID + API key
- Gemma API: API key required

**Image models:**
- SDXL-Turbo (OpenVINO) — fast generation
- Flux.1 Schnell (OpenVINO) — higher quality
- Optional API-based models

**OCR model:**
- PaddleOCR-VL 1.5 GGUF (default, ~856 MB)
- Swap-able for alternative vision models

### 21.3 Tier Configuration
| Tier | Description | Use cases |
|------|-------------|-----------|
| Tier 1 | Fast | Autocomplete, title generation, simple suggestions |
| Tier 2 | Standard | General generation tasks |
| Tier 3 | Advanced | Complex lesson plans, multi-criteria rubrics |
| Tier 4 | Expert | Multi-step reasoning, cross-curricular integration |

**Dual Model Mode:**
- Assign a separate "fast model" for lightweight tasks
- Configure per-task routing: `autocomplete`, `organize_note`, `title_generation`
- Routes: `fast` | `default`

**Thinking Level (Quick / Deep):**
- Per-chat Quick/Deep toggle (replaced global Thinking Mode)
- Quick = faster, shorter responses
- Deep = longer reasoned responses (CoT prefix for Gemma, `/think` for Qwen)
- Analyse panel has its own independent Quick/Deep toggle

### 21.4 Generation Mode
| Mode | Behavior | Best for |
|------|----------|---------|
| **Queued** | One generation at a time | Low-RAM systems |
| **Simultaneous** | Parallel generations | High-RAM systems |

### 21.5 Display & Accessibility
| Setting | Range | Default |
|---------|-------|---------|
| Font Size | 50%-200% | 100% |
| Brightness | 50-150 | 100 |
| Warm Tone | 0-100 | 0 |
| Theme | Light / Dark / System | System |

**Display Comfort:** Glare reduction, blue light filter toggle

### 21.6 Sidebar Customization
- Toggle feature visibility (all except pinned items)
- Drag-reorder all non-pinned items
- Tab color customization per type
- Feature grouping labels customizable

### 21.7 Writing Assistant
- Spell check: on/off
- Autocorrect: on/off
- Auto-finish suggestions: on/off
- Dictionary lookups: on/off

### 21.8 System Behavior
- Minimize to system tray: on/off
- **Model Offloading:** Minimizing to tray automatically unloads the AI model from memory; restoring the app reloads the model. Prevents idle memory consumption.
- Start on boot: on/off
- Auto-close tabs on exit: on/off
- File access permissions management

### 21.9 Tutorial Preferences
- "Show floating tutorial buttons" toggle — show/hide the contextual tutorial hint buttons on each feature panel
- "Reset completed tutorials" — clears all tutorial completion flags in localStorage so walkthroughs can be re-triggered

### 21.10 Scheduled Task Configuration
- Pick day of week and time for scheduled background tasks
- Select which tasks to include (ELO Breakdown, Attendance, Progress)
- Manual "Run now" trigger for any scheduled task
- See Section 36 for full details

### 21.11 Data Management
- Export all data (JSON archive)
- Import data from archive
- Factory reset (wipe all settings + data)
- Clear metrics history only
- Privacy Memory Wipe: removes all long-term memories (`DELETE /api/teacher-memory/all?teacher_id=X`)

---

## 22. Notifications & Reminders

**Context:** `NotificationPanel.tsx`, `ReminderContext.tsx`
**Database:** `backend/reminders.db`

### Notification Types
- Content generation completed (lesson, quiz, worksheet, etc.)
- Achievement unlocked (with rarity animation)
- Reminder due dates
- Upcoming test/exam alerts
- System events (model load status)
- Unplanned lessons notification: toast + notification history entry on first daily load when unplanned lessons > 0 (fires once per session)
- Scheduled results ready: notification when background task results are available for review

### Quiet Hours
- Configurable start + end time (HH:MM format)
- All notifications suppressed during quiet period

### Reminders
- Create: title, date, time, type (Exam, Midterm, Grading Deadline, Report Card, Custom)
- Edit / delete reminders
- Export all reminders to `.ics` calendar file (`GET /api/calendar/export.ics`)
- iCalendar format — importable to Google Calendar, Outlook, Apple Calendar

### ICS Calendar Import
**Service:** `calendar_import_service`

- Accept `.ics` file uploads from the user
- Expand recurring events (RRULE) into individual occurrences within a date range
- Deduplicate by UID to prevent double-importing the same event
- Imported events appear in the Unified Calendar feed (see Section 35)

### Nudge System
- Contextual feature discovery hints
- Per-nudge type: configurable cooldown
- Dismiss individual nudges permanently
- Separate from standard reminders

---

## 23. Export & Import System

**Utility:** `backend/export_utils.py`

### Export Formats
| Format | Generator | Use case |
|--------|-----------|---------|
| **PDF** | WeasyPrint | Print-ready output for all content |
| **DOCX** | python-docx | Editable Word documents |
| **CSV** | Python built-in | Grade data, student lists |
| **JSON** | json.dumps | Data backup, inter-tool transfer |
| **Markdown** | Custom | Plain text, GitHub |
| **.ics** | Calendar service | Calendar import |

### PDF Export Features
- QR code injection (top-right, encodes content ID)
- Alignment markers for scan-to-grade pipeline
- HTML -> PDF with CSS styling preserved
- Image embedding (base64 encoded)
- Pagination + page breaks
- Accent color theming (matches app theme)

### Import Features
- Bulk student import: Excel -> students.db
- Sample Excel template download
- JSON data archive restore
- CSV parsing with column mapping
- File format auto-detection
- ICS calendar import (recurring events expanded, deduplicated by UID)

### Class Pack Export
- `POST /api/export-class-pack`
- Bundle all materials for a class into one archive
- Includes: lessons, quizzes, worksheets, rubrics

### Privacy Memory Wipe
- `DELETE /api/teacher-memory/all?teacher_id=X`
- Permanently removes all long-term memories stored in `teacher_memories` table
- Also accessible from Settings -> Data Management

---

## 24. AI Model Routing & Inference

**File:** `backend/inference_factory.py`
**Config:** `backend/config.py` -> `DEFAULT_TIER_CONFIG`

### Inference Backends

**Local (default):**
- llama-cpp-python bindings for GGUF models
- Singleton pattern in queued mode (one model instance shared)
- Fresh instance per request in simultaneous mode
- Vision via CLIP projector (multimodal)
- Context window: 16,384 tokens
- Max output: 2,000 tokens
- Temperature: 0.7

**OpenRouter API:**
- HTTP wrapper
- Default model: `nvidia/nemotron-3-nano-30b-a3b:free` (configurable)
- Requires API key in settings

**Gemma API:**
- Google's hosted Gemma models
- Requires API key

### Capabilities Detection (`CapabilitiesContext`)
The app auto-detects what the loaded model supports:
- `has_vision` — can process images
- `has_ocr` — OCR-specialized
- `has_diffusion` — image generation available
- `has_lama` — inpainting available
- `has_thinking` — extended reasoning (Qwen models)
- `dual_model_enabled` — fast model configured

### Model Parameters (Configurable)
- `n_ctx`: context size (default 16,384)
- `max_tokens`: max output length (default 2,000)
- `temperature`: sampling temperature (default 0.7)
- `verbose`: llama.cpp logging (default False)

---

## 25. OCR & Document Processing

**Service:** `backend/ocr_service.py`
**Model:** PaddleOCR-VL 1.5 GGUF (~856 MB total, CPU-optimized)
- Main weights: Q4_K_M (~286 MB)
- CLIP projector: ~570 MB

**Capabilities:**
- Text extraction from photographed documents
- Handwriting recognition
- Quiz/worksheet answer detection
- Document parsing to Markdown
- Vision-language understanding (describe images)

**Image pre-processing pipeline (`backend/image_alignment.py`):**
1. Load image
2. Detect alignment markers (corner fiducials printed on worksheets/quizzes)
3. Correct rotation and skew
4. Normalize brightness/contrast
5. Extract answer regions via `backend/region_tracker.py`
6. Pass regions to OCR for text extraction
7. Return structured answer data

**Document Processor (`backend/document_processor.py`):**
- PDF text and image extraction
- DOCX parsing
- Format detection and routing

**File Parser (`backend/file_parser.py`):**
- Detect file type and encoding
- Extract embedded metadata
- Handle: PDF, DOCX, XLSX, TXT, PNG, JPG, WEBP

---

## 26. Real-Time Streaming (WebSocket)

**Server:** FastAPI WebSocket support

All AI generation uses WebSocket for real-time token streaming. This prevents UI freezing and allows incremental display.

| WebSocket Route | Purpose |
|----------------|---------|
| `/ws/chat` | Coworker chat — word-by-word streaming |
| `/ws/lesson-plan` | Lesson plan — section by section |
| `/ws/quiz` | Quiz — question by question |
| `/ws/rubric` | Rubric — criterion by criterion |
| `/ws/kindergarten` | K planner — activity by activity |
| `/ws/multigrade` | Multi-grade plan — level by level |
| `/ws/cross-curricular` | CC plan — subject by subject |
| `/ws/worksheet` | Worksheet — cell-by-cell content |
| `/ws/presentation` | Slides — slide by slide |
| `/ws/storybook` | Story — page by page |
| `/ws/brain-dump` | Idea capture — categorization feedback |
| `/ws/educator-insights` | Coaching — tip by tip |
| `/ws/consultant` | Consultant chat — conversational |
| `/ws/analyse` | Analyse panel — section-by-section enhancement |

**Tab Busy Context:** Tracks which tabs have active generations. Prevents accidental close. Active generation dialog shows all in-progress jobs across tabs.

---

## 27. Data Persistence Layer

### SQLite Databases
| Database | Tables | Purpose |
|----------|--------|---------|
| `students.db` | students, classes, quiz_grades, worksheet_grades, quiz_answer_keys, worksheet_answer_keys, quiz_instances, worksheet_instances, attendance, lesson_plans, lesson_plan_edits, daily_plans, unified_events | All classroom data + lesson storage + unified calendar |
| `milestones.db` | milestones, milestone_history | Curriculum tracking |
| `achievements.db` | achievements, earned_achievements, showcase_items | Gamification |
| `metrics.db` | metric_snapshots | Performance history |
| `reminders.db` | reminders | Scheduled events |
| `chat_memory.db` | teacher_memories, scheduled_results | Long-term memory + background task results |

### Key Table Descriptions
| Table | Database | Purpose |
|-------|----------|---------|
| `lesson_plans` | students.db | Completed lesson plans (migrated from JSON) |
| `lesson_plan_edits` | students.db | Audit trail of all lesson plan edits |
| `daily_plans` | students.db | Daily planning records |
| `unified_events` | students.db | 17-column unified calendar events (7 source types) |
| `teacher_memories` | chat_memory.db | Long-term memory facts extracted from chat sessions |
| `scheduled_results` | chat_memory.db | Results from background scheduled tasks (ELO breakdown, etc.) |

### JSON Files
| File | Purpose |
|------|---------|
| `chat_history.json` | All chat sessions |
| `lesson_drafts.json` | In-progress lesson drafts |
| `quiz_history.json` | Quiz records |
| `worksheet_history.json` | Worksheet records |
| `rubric_history.json` | Rubric designs |
| `kindergarten_history.json` | Early childhood plans |
| `multigrade_history.json` | Multi-grade plans |
| `cross_curricular_history.json` | Integrated plans |
| `images_history.json` | Generated images |

### Frontend Storage
- **localStorage:** Settings, preferences, tutorial completion, nudge dismissals
- **React Contexts (13 providers):** Real-time app state

---

## 28. Support & Diagnostics

**Component:** `Support.tsx` (type: `support`)
**Endpoint:** `GET /api/logs/recent`

### Diagnostics
- **Ring buffer log handler** (`_RingBufferHandler`): Captures last 200 log lines in memory
- `GET /api/logs/recent` — retrieve recent logs for support
- `GET /api/metrics/system-specs` — CPU model, RAM, disk usage, OS info
- Real-time engine status via `EngineStatusContext` (WebSocket polling)

### Service Health Checks
- `GET /api/image-service/status` — image generation loaded/idle/generating
- `GET /api/tts/status` — TTS service status
- `GET /api/tts/voices` — available TTS voice list

### Support Ticket System
- **Submit ticket:** Title, description, category (Bug / Feature Request / Question / Other), severity (Low / Medium / High / Critical)
- **Attach screenshots:** Manual upload or auto-attached via Tutorial screenshot-to-ticket hook (when tutorial screenshots are captured, they can be directly submitted as a ticket)
- **Search / filter / sort tickets:** Filter by category, severity, status; sort by date or severity
- **View ticket details:** Full description + response thread from support
- **Mark resolved / reopen:** Update ticket status from the list view

---

## 29. Onboarding, Setup Wizard & OAK Licensing

**Components:** `SetupWizard/SetupWizard.tsx`, `TutorialOverlay.tsx`
**Context:** `TutorialContext.tsx`
**Data:** `frontend/src/data/tutorialSteps.ts`

### Setup Wizard (First Launch)

The Setup Wizard presents two paths:

#### Path A: Activate with OAK
1. **Welcome** — Feature overview slideshow
2. **OAK Key Entry** — User enters OAK license key
3. **OAK Validation** — Key validated via Supabase RPC `validate_oak`
   - On success: retrieves `school_name` and `territory_name` from the OAK record
   - `LicenseSettingsBridge` writes `profile.school`, `profile.territory`, `profile.schoolSource` into local settings
   - School and territory fields are locked (read-only) in the profile editor after OAK activation
4. **Profile** — Enter display name, grade levels, subjects (school pre-filled and locked)
5. **Feature Picker** — Enable/disable specific modules
6. **Completion** — Confirmation, launch app

#### Path B: Continue without OAK (Manual Setup)
1. **Welcome** — Feature overview slideshow
2. **Profile** — Enter display name, grade levels, subjects, school name (free text — no locking)
3. **Feature Picker** — Enable/disable specific modules
4. **Completion** — Confirmation, launch app

No OAK banner is shown in the manual path.

### LicenseGate
- `LicenseGate` component wraps the main app shell
- When license is valid, it passively triggers `checkForUpdates`
- Not a blocking gate — does not prevent app usage if OAK validation fails after activation

### In-App Tutorial
- Interactive walkthroughs triggered per feature
- Floating hint buttons surface contextually (toggled in Settings -> Tutorial Preferences)
- Step highlighting focuses user attention
- Keyboard navigation through steps
- Tutorial completion tracked per feature in localStorage
- Skip option available at any step
- Tutorial can be re-triggered from Settings
- Screenshots taken during tutorial walkthroughs can be submitted directly as support tickets

---

## 30. School Year & Calendar System

**Components:** `SchoolYearSetupModal.tsx`, `SchoolYearHub.tsx`
**Routes:** `backend/routes/school_year.py`

### 30.1 SchoolYearSetupModal
- First-run setup modal for configuring the academic year
- Input: school year start date, end date
- Term/semester boundary configuration (Term 1, Term 2, Term 3, etc.)
- Holiday entry during setup (name + date range + `blocks_classes` flag)
- Saved to `students.db` via school year service

### 30.2 School Year Hub
Three-tab interface:

**Tab 1 — School Year:**
- View and edit year boundaries and term dates
- Holiday list with `blocks_classes` toggle per holiday
- Holidays with `blocks_classes = true` inject EXDATE entries into timetable RRULEs, preventing class generation on those days

**Tab 2 — Curriculum Plan:**
- Milestone planning laid out across the school year timeline
- Phase markers (Start of Year, Mid-Year, End of Year)
- Drag milestones to adjust target dates

**Tab 3 — Timetable:**
- Weekly class schedule configuration
- Multi-block periods: double and triple periods supported
- Overlap validation prevents scheduling conflicts
- Weekly load summary (total periods per subject per week)
- Timetable slots generate recurring RRULE entries in the unified calendar
- Holidays with `blocks_classes` inject EXDATE into those RRULEs

---

## 31. Active Class Context & Class Defaults

### 31.1 ActiveClassContext
- Global class selection state shared across all 7 generators
- Switching the active class in one generator automatically updates all other generators
- Persists across tab changes within the same session
- Feeds into `GenerateForSelector` (see Section 32) to filter relevant timetable sessions

### 31.2 ClassDefaultsBanner
- Appears at the top of any generator when the active class has a saved configuration
- Displays a summary of the class config (subject, grade, duration, etc.)
- Auto-fills all 7 generators via shared `applyClassDefaults.ts` utility
- Dismiss button hides the banner for the session without clearing the config

### 31.3 AutoFilledSection (Lesson Planner Step 2)
- When class config fills all required fields in Step 2 of the Lesson Planner, Step 2 collapses automatically
- Collapsed state shows a summary of auto-filled values
- "Override" button expands the section to allow manual edits

### 31.4 ClassConfigPanel
- Per-class configuration panel accessible from My Classes
- Fields: default subject, grade, standard set, typical duration, notes
- **Timetable Wiring:** Link a class to one or more timetable slots
- **Duration Derivation:** When wired to timetable slots, duration is derived from the scheduled slot length rather than requiring manual input
- **Meets Strip:** Shows a compact "Meets: Mon 9:00, Wed 9:00" strip derived from linked timetable slots

---

## 32. GenerateForSelector & Calendar Integration

### 32.1 GenerateForSelector (Target Session)
- Dropdown present in all 7 generators
- Lists the next approximately 10 upcoming timetable sessions for the active class
- Selecting a session auto-fills Subject, Grade, and Duration from the timetable slot
- "Jump to date" date picker for selecting sessions further in the future
- Sessions that already have a lesson plan attached are marked as planned and de-prioritized

### 32.2 Lesson-to-Calendar Attachment
- Saving a lesson plan with a target session selected marks that session as planned in the unified calendar
- `POST /api/school-year/upcoming-unplanned/default?within_days=14` — returns unplanned sessions within the next 14 days
- Dashboard "Unplanned Lessons" widget updates in real-time as sessions are planned
- "Mark as taught" on a lesson plan cascades: updates lesson_plan status, unified_event status, and related milestone progress simultaneously

---

## 33. Generation Queue, Tab Pulse & Cancellation

### 33.1 Tab Strip Pulse
- Background tabs pulse visually when a generation completes in them
- Applies to all generation types: LLM (lesson, quiz, etc.), Diffusion (image), OCR (scan-to-grade)
- Pulse stops when the user switches to that tab

### 33.2 Queue Panel
- Panel shows all currently active generations across all tabs
- **WebSocket items:** LLM generation jobs with progress indicators
- **External items:** Diffusion and OCR jobs alongside WS items
- Each item shows: tab name, job type, progress percentage, elapsed time
- Cancel button per item

### 33.3 Cancellation
- Frontend cancel via the Queue Panel cancel button per job
- Backend cancel registry: `POST /api/cancel/{job_id}` registers a cancel signal
- Reference-counted cancel events: each job checks for its cancel signal at token boundaries
- **LLM:** Checked between token yields in the streaming loop
- **Diffusion:** Checked between inference steps
- **OCR:** Checked between page/region processing

### 33.4 QueueContext External Item API
- `addExternalItem(id, label, type)` — register a non-WS job in the queue panel
- `completeExternalItem(id)` — mark an external item complete (removes from panel, pulses tab)
- Used by diffusion service and OCR service to integrate with the unified queue display

---

## 34. Analyse Panel

**WebSocket:** `/ws/analyse`

### 34.1 Overview
- After generating any content in any of the 9 generator types, an `[Analyse]` button appears in the output panel
- Clicking `[Analyse]` opens the AI Assistant Panel in Analyse mode
- The generated content is passed as context to the `/ws/analyse` endpoint

### 34.2 Analyse Actions
| Action | Behavior |
|--------|---------|
| "Create a more detailed version" | Triggers section-by-section enhancement of the entire output |
| "Expand the X section" | Re-generates only the named section with expanded detail |
| Normal question | Returns a chat-style response without modifying the output |

### 34.3 Controls
- **Quick/Deep toggle:** Independent Quick/Deep toggle in the Analyse panel (does not affect the main chat Quick/Deep setting)
- **Undo button:** Reverts the output to the previous version (one level of undo)

### 34.4 Supported Generator Types
Analyse panel works across all 9 generator types:
1. Standard Lesson Planner
2. Early Childhood Planner
3. Multi-Level Planner
4. Integrated Lesson Planner
5. Quiz Builder
6. Rubric Builder
7. Worksheet Builder
8. Presentation Builder
9. Storybook Creator

---

## 35. Unified Calendar System

**Service:** `backend/lesson_plan_service.py` (lesson plan storage migrated from JSON to SQLite)
**Migration:** `python -m migrations.unify_calendar`
**Hook:** `useUnifiedCalendarFeed.ts`

### 35.1 unified_events Table
Located in `students.db`. 17 columns covering:
- `id`, `teacher_id`, `source_type`, `source_id`
- `title`, `description`, `location`
- `start_dt`, `end_dt`, `all_day`
- `recurrence_rule` (RRULE string)
- `exdates` (comma-separated excluded dates for holidays)
- `status`, `metadata` (JSON), `created_at`, `updated_at`

### 35.2 Source Types (7)
| Source Type | Origin |
|------------|--------|
| `school_year` | School year boundaries and term dates |
| `holiday` | Holiday entries from School Year Hub |
| `timetable_slot` | Weekly class periods (RRULE recurring) |
| `milestone` | Curriculum milestones with due dates |
| `lesson_plan` | Saved lesson plans attached to timetable sessions |
| `daily_plan` | Daily planning entries |
| `scheduled_result` | Outputs from scheduled background tasks |

### 35.3 Projector Functions
Each source type has a dedicated projector function that reads from the source table and writes/updates corresponding `unified_events` rows. Projectors run on save of each source type.

### 35.4 RRULE Expansion
- Timetable slots stored as RRULE (e.g., `FREQ=WEEKLY;BYDAY=MO,WE;UNTIL=20261201`)
- Query endpoint expands RRULEs into individual occurrences within the requested date range
- Holidays with `blocks_classes = true` inject EXDATE into the timetable slot's RRULE before expansion

### 35.5 Query Endpoint
```
GET /api/calendar/unified?teacher_id=X&start=YYYY-MM-DD&end=YYYY-MM-DD
```
- Accepts optional filter params: `source_types`, `status`
- Expands all recurring events within the date range
- Returns a flat list of calendar event objects sorted by start_dt

### 35.6 Backfill Migration
```
python -m migrations.unify_calendar
```
- Reads all existing lesson plans (formerly JSON), milestones, and timetable slots
- Creates corresponding `unified_events` rows
- Safe to re-run (upsert by source_type + source_id)

### 35.7 Cross-System Auto-Linking
- **milestone -> phase:** Milestones are automatically linked to their containing school year phase
- **lesson_plan -> slot:** When a lesson plan is saved with a target session, the unified event links to the timetable slot
- **lesson_plan -> milestone suggestion:** After saving a lesson plan, the system suggests related milestones based on standard codes

### 35.8 "Mark as Taught" Cascade
Triggering "Mark as Taught" on a lesson plan simultaneously:
1. Updates `lesson_plans.status` = "taught"
2. Updates the linked `unified_events` row status = "taught"
3. Advances the linked milestone toward "completed"

### 35.9 CompactCalendar Widget
- Dashboard widget displaying a mini monthly calendar
- Events shown as colored dots (4th dot layer = unified events)
- Click a day -> shows event list for that day
- Clicking a lesson plan event opens the plan in the appropriate generator

### 35.10 Lesson Plan Storage Migration
- `lesson_plan_service.py` handles all lesson plan CRUD
- Plans stored in `students.db` -> `lesson_plans` table (migrated from `lesson_plan_history.json`)
- Audit trail in `lesson_plan_edits` table (every edit recorded with timestamp and diff)

---

## 36. Scheduled Background Tasks

**Scheduler:** APScheduler (Python)
**Results storage:** `chat_memory.db` -> `scheduled_results` table

### 36.1 Scheduled Task Configuration
- Accessible from Settings -> Scheduled Task Configuration
- Pick day of week and time for the weekly run
- Task checkboxes: ELO Breakdown, Attendance Summary, Progress Report
- Manual "Run now" trigger runs selected tasks immediately without waiting for the schedule

### 36.2 Weekly ELO Breakdown
- Automatically reloads the AI model if it was offloaded (tray minimize)
- Pulls: current curriculum phase + pending milestones + weekly timetable from `students.db`
- LLM generates a JSON structure: days -> periods -> ELO (Expected Learning Outcome) breakdown
- Result validated against schema before saving
- Saved to `scheduled_results` table with `task_type = "elo_breakdown"`

### 36.3 Scheduled Results Review
- Notification panel includes a "Scheduled Results" section
- New results shown as day-by-day cards
- Each card shows subject, period, and ELO summary
- Actions per card:
  - **Accept & Generate Plans:** Queues lesson plan generation for each period in the breakdown
  - **Edit:** Open the breakdown for manual adjustment before accepting
  - **Dismiss:** Remove the result without acting on it

---

## 37. Dashboard Enhancements

### 37.1 Flip Card
- Front face: upcoming quizzes and assessments
- Back face: `LessonsNeedingPlans` widget showing sessions without a plan
- Count badge on card corner shows number of unplanned sessions
- Click to flip between faces

### 37.2 Unplanned Lessons Notification
- On first daily load, checks `POST /api/school-year/upcoming-unplanned/default?within_days=14`
- If unplanned sessions > 0: fires a toast notification and adds a notification history entry
- Fires once per session (not on every tab switch or page reload within the same session)

### 37.3 Widget Click to Generator Routing
- Clicking an unplanned session in the dashboard routes directly to the correct generator with pre-fill:
  - Grade K class -> KindergartenPlanner
  - Multi-grade class -> MultigradePlanner
  - Standard class -> LessonPlanner
  - Cross-curricular flagged session -> CrossCurricularPlanner
- All generator fields pre-filled from the session's class config and timetable slot data

### 37.4 Curriculum Completion Tagging
- ELO/SCO standard dropdowns in all generators show a "Completed" badge next to standards that have been taught
- Badge state sourced from milestone completions and "Mark as Taught" records
- Live refresh: `curriculum-completion-changed` window event triggers dropdown re-query without full page reload

---

## 38. How Each Feature Helps Teachers & Improves Class Performance

---

### Lesson Planning Suite -> Teacher Efficiency & Instructional Quality

**Time savings:**
- A complete, differentiated lesson plan takes AI ~30-60 seconds to generate vs. 1-3 hours manually
- Teachers can generate a full week's plans in under 30 minutes
- Early Childhood planner generates K-ready visual schedules that take specialized expertise to design manually

**Instructional quality:**
- Bloom's taxonomy alignment ensures lessons progress through knowledge -> comprehension -> application -> analysis -> synthesis -> evaluation
- Differentiation suggestions built-in mean diverse learners are planned for from day one, not as an afterthought
- Multi-Level planner enables teachers managing mixed-ability or multi-grade classrooms to plan cohesively instead of writing two separate plans

**Class performance impact:**
- Well-structured lessons with clear objectives correlate with measurable gains in student understanding
- Integrated cross-curricular lessons deepen retention by connecting knowledge across subjects
- Reduced teacher prep burden -> more energy for actual instruction -> better student outcomes

---

### Quiz Builder & Auto-Grading -> Assessment Speed & Feedback Quality

**Time savings:**
- Manual grading of 30 quizzes: 1-3 hours
- Scan-to-grade: under 5 minutes for same 30 quizzes
- Frees up entire evenings for teachers with heavy marking loads

**Instructional quality:**
- Bloom's-level question targeting ensures assessments measure higher-order thinking, not just recall
- Explanations generated per question give teachers ready-made feedback to return to students
- Automatic grade tracking -> no manual spreadsheet maintenance

**Class performance impact:**
- Faster feedback loops: students receive grades same day or next day instead of waiting a week
- Research consistently shows faster feedback improves learning and error correction
- Grade trend visibility (from metrics) helps teachers identify struggling students earlier
- Per-question performance data (where all students miss the same question) reveals gaps for reteaching

---

### Rubric Builder -> Assessment Consistency & Student Transparency

**Time savings:**
- Rubric design from scratch: 45-90 minutes
- AI generation: under 2 minutes, teacher refines from there

**Instructional quality:**
- Clear descriptors reduce subjective grading variance — same work gets same grade regardless of when it's marked
- Students can self-assess against the rubric before submitting, improving submission quality
- Exportable rubrics can be distributed to students in advance

**Class performance impact:**
- Students with clear success criteria outperform those receiving vague instructions
- Consistent grading improves student trust and reduces grade disputes
- Rubric data fed into performance metrics -> curriculum alignment tracking

---

### Worksheet Builder & Bulk Grading -> Differentiation at Scale

**Time savings:**
- Designing a differentiated worksheet for 3 ability levels: 2-4 hours
- AI generation: 3-5 minutes per level
- Bulk scan grading: entire class graded in minutes

**Instructional quality:**
- Grid-based editor enables structured, professional-quality worksheets without design skills
- Subject-field + grade-level targeting ensures appropriate language and cognitive demand
- Per-student instances allow tracking who received which version

**Class performance impact:**
- Differentiated worksheets ensure at-level challenge for all students
- Students are neither bored (too easy) nor overwhelmed (too hard)
- Bulk grading data populates grade tracker -> teachers see class mastery at a glance

---

### Classroom Management -> Organized Data-Driven Teaching

**Time savings:**
- Excel bulk import eliminates manual student-by-student data entry
- Attendance tracking digitized — no paper registers to manage

**Instructional quality:**
- Complete student profiles in one place
- Grade history per student -> evidence-based conversations with parents and administration
- Attendance data cross-referenced with performance -> identify attendance-related underperformance

**Class performance impact:**
- Early identification of students with declining grades or attendance
- Data-ready for parent-teacher conferences without scrambling to compile records
- Test reminders prevent scheduling conflicts and ensure students are informed

---

### Ask Assistant (AI Chat) -> On-Demand Pedagogical Support

**Time savings:**
- Instant answers to "how do I explain fractions to visual learners" without searching the internet
- Strategy suggestions without reading research papers
- File attachment: paste in a worksheet and ask "is this age-appropriate?" for instant feedback

**Instructional quality:**
- Acts as an always-available instructional coach
- Consultant mode provides structured, pedagogically-grounded advice
- Smart search retrieves past conversations — teachers don't lose insights from earlier chats
- Long-term memory recalls teacher preferences and class context across sessions

**Class performance impact:**
- Teachers with access to coaching improve their practice faster
- Better-informed pedagogical decisions -> more effective instruction -> better student outcomes

---

### Curriculum Browser & Progress Tracker -> Standards Alignment & Coverage Confidence

**Time savings:**
- Finding relevant standards no longer requires browsing physical guides or PDFs
- Milestone tracking replaces manual checklists and spreadsheets

**Instructional quality:**
- Every lesson plan auto-matched to standards -> no gap between intended and actual coverage
- Milestone history proves curricular coverage for inspections or reviews
- Skill tree visualization shows prerequisite relationships -> correct sequencing of instruction

**Class performance impact:**
- Students assessed on standards they've been explicitly taught
- Coverage gaps identified early -> reteaching before assessments
- End-of-year milestone completion rates visible in Performance Metrics

---

### Brain Dump -> Idea Capture Without Cognitive Overhead

**Time savings:**
- Ideas captured in seconds before they're forgotten
- AI categorization eliminates manual sorting later

**Instructional quality:**
- Observation notes from class can be dumped and auto-organized into student behavior patterns, lesson ideas, etc.
- Raw ideas fed into other tools (lesson planner, quiz builder) as seeds

**Class performance impact:**
- Teachers capture in-the-moment observations about student understanding
- These observations inform next-day instruction adjustments (responsive teaching)

---

### Image Studio -> Visual Learning Materials Without Design Skills

**Time savings:**
- Custom classroom visuals generated in seconds
- Background removal for cut-out style resources: 1 click
- No need to purchase stock images or use external design tools
- ESRGAN upscaling fixes low-resolution captures without re-shooting

**Instructional quality:**
- Visual learners engage more deeply with illustrated content
- Custom images tailored to specific lessons (not generic stock)
- Annotation tools enable teachers to mark up images for instructional emphasis

**Class performance impact:**
- Visual representations of abstract concepts improve comprehension
- Illustrated worksheets and presentations maintain student attention
- Storybook-style visuals in Early Childhood are developmentally essential for literacy

---

### Presentation Builder -> Consistent, Professional Delivery

**Time savings:**
- Full slide deck generated from lesson topic in minutes
- Speaker notes generated automatically

**Instructional quality:**
- Structured slides ensure lesson progression follows plan
- Speaker notes reduce cognitive load during delivery — teacher can focus on student interactions
- Consistent slide design across all lessons projects professionalism

**Class performance impact:**
- Well-paced, visually structured lessons improve information retention
- Students follow along more easily with projected content
- Reduces teacher cognitive load -> more attention available for student questions

---

### Storybook Creator -> Literacy Development at Early Levels

**Time savings:**
- Creating illustrated storybooks is hours of work — generated in minutes
- Text-to-speech means no need for teacher to record voice separately

**Instructional quality:**
- Stories calibrated to reading level prevent frustration/boredom
- AI-generated illustrations support visual narrative comprehension
- Night mode enables bedtime reading assignments via PDF export

**Class performance impact:**
- Regular exposure to level-appropriate stories is the highest-impact literacy intervention
- Personalized stories (featuring class themes or topics) increase engagement
- Students who read (or are read to) more score higher on language assessments

---

### Achievements & Gamification -> Teacher Motivation & Consistency

**Time savings:**
- Zero teacher effort — automatically tracked and awarded

**Instructional quality:**
- Positive reinforcement for productive behaviors (creating rubrics, tracking milestones, completing chats)
- Showcase system gives teachers agency over their identity within the app

**Class performance impact:**
- Teachers who engage more deeply with planning tools produce more effective instruction
- Streaks encourage consistent daily use, which research shows correlates with better instructional preparation
- Hidden achievements create moments of delight that sustain long-term engagement with the platform

---

### Photo Transfer & QR Codes -> Paperless Grading Workflow

**Time savings:**
- Eliminates scanning hardware requirements — any phone camera works
- QR auto-identifies the quiz, eliminating manual matching of papers to gradebooks
- Hotspot mode means no school network dependency

**Instructional quality:**
- Returned grade data includes per-question feedback, not just a score
- Graded before class next morning -> discuss results while still fresh

**Class performance impact:**
- Rapid result return allows for immediate reteaching of misunderstood concepts
- Error pattern analysis (many students missing same question) guides targeted instruction

---

### Educator Insights & Coaching -> Professional Growth

**Time savings:**
- Coaching delivered in-app — no need for separate professional development sessions
- Phase-aware tips mean relevant advice at the right time (start of year vs. end of year)

**Instructional quality:**
- AI identifies gaps in tool usage and nudges toward better practice
- Strategy suggestions tied to actual usage data, not generic advice

**Class performance impact:**
- Teachers who continuously improve practice show student performance gains year over year
- Early identification of burnout patterns (declining usage streaks) allows intervention

---

### Performance Metrics & Analytics -> Evidence-Based Decision Making

**Time savings:**
- All data aggregated automatically — no manual report compilation
- System specs monitoring prevents performance degradation surprises

**Instructional quality:**
- Teachers can see exactly which subjects they're spending more/less time on
- Grade distribution visibility reveals systematic curriculum gaps

**Class performance impact:**
- Data-informed instruction: teachers adjust focus based on what metrics show
- Standards coverage gaps -> proactive reteaching before high-stakes assessments
- Attendance-performance correlation visible -> early intervention for at-risk students

---

### Sticky Notes -> Contextual Memory While Working

**Time savings:**
- No switching apps to jot a reminder — sticky note on top of current work
- Per-tab isolation means notes stay relevant to what you're doing

**Instructional quality:**
- Group related notes (planning cluster, grading cluster) for organized thinking
- Checklists within notes -> track completion of complex multi-step tasks

**Class performance impact:**
- Teachers who stay organized during planning produce more coherent instructional sequences
- Reminder notes for students' specific needs stay visible during lesson preparation

---

### Settings & AI Configuration -> Resource Efficiency & Customization

**Time savings:**
- Dual model mode routes simple tasks to a fast model -> reduces wait times by 60-80% for lightweight operations
- Queued vs. simultaneous mode adapts to available hardware
- Model offloading on tray minimize frees RAM during breaks

**Instructional quality:**
- Profile filtering ensures content is always grade/subject-relevant — no wasted scrolling
- Font size and display comfort settings reduce eye strain during long planning sessions

**Class performance impact:**
- A teacher using a well-configured tool is more productive and less frustrated
- Tiered model routing ensures complex lesson plans get full model power while autocomplete stays snappy

---

### 38A. Additional Features (Found in Code Review)

#### Login Screen
**File:** `frontend/src/components/Login.tsx`
- Login UI exists and is implemented
- Currently **auto-bypassed** in `App.tsx` (auto-logs in as "admin")
- No registration flow present
- No route guards active

#### Heartbeat / Loading Screen
- `HeartbeatLoader` component shown during initial app load
- `WelcomeModal` shown on first visit (mentions split-screen feature)
- No dedicated splash screen

#### Split-View Mode
**File:** `frontend/src/components/Dashboard.tsx`
- Right-click any tab -> split view option
- Two tabs displayed side by side
- State: `SplitViewState { isActive, leftTabId, rightTabId, activePaneId }`
- Active pane switching (left <-> right)
- Persisted to localStorage

#### Educator Coach Drawer
**File:** `frontend/src/components/EducatorCoachDrawer.tsx`
- Slide-out drawer panel (separate from Ask Assistant tab)
- Consultant-mode AI conversation
- Conversation history via `/api/consultant/conversations`
- Accessible from Educator Insights
- Applies Smart Context Budgeting (same T1-T4 token budgets)

#### Text-to-Speech & Speech-to-Text
**File:** `frontend/src/hooks/useVoice.ts`
- **TTS:** Piper TTS backend — fully offline, natural voice
  - Endpoint: `POST /api/tts`
  - Preload: `POST /api/tts/preload`
  - Voices list: `GET /api/tts/voices`
- **STT:** Browser SpeechRecognition API
  - Mic button in chat interface
  - Voice input to CommandPalette search
- Volume toggle in chat UI

#### Command Palette
**File:** `frontend/src/components/CommandPalette.tsx`
- Global keyboard-triggered search overlay
- Searches commands, tabs, navigation actions
- Voice input via STT (mic button)
- AI-powered smart search index

#### Engine Status & Offline Guard
**File:** `frontend/src/contexts/EngineStatusContext.tsx`
**Hook:** `useOfflineGuard`
- Polls `/api/health` every 10 seconds
- Status: `online` | `offline` | `checking`
- Toast notification: "System is offline" / "Engine is back online"
- `useOfflineGuard` blocks generation actions when offline

#### Sidebar Drag-and-Drop (dnd-kit)
- Library: `@dnd-kit/core`, `@dnd-kit/sortable`
- Sidebar item reordering via drag-and-drop
- Order persisted in `SettingsContext.sidebarOrder`

#### PDF Export Button Component
**File:** `frontend/src/components/pdf-export-button.tsx`
- Reusable export button across tools
- Triggers print-ready PDF export

#### Tab Color Customization
**Interface:** `TabColors` in `SettingsContext`
- Per-tab-type color assignment (23 distinct types)
- Sidebar icon color matches tab color

#### Draft Save Dialog
**Component:** `DraftSaveDialog`
- Prompts to save unsaved work when closing a tab
- Prevents accidental data loss

---

## Summary Table: Features -> Teacher + Class Outcomes

| Feature | Primary Teacher Benefit | Primary Class Outcome |
|---------|------------------------|----------------------|
| Lesson Planning | 90%+ time reduction on planning | Structured, differentiated instruction |
| Quiz Builder | Professional assessments in minutes | Higher-order thinking measured |
| Auto-Grading | Hours saved on marking | Same-day feedback -> faster learning |
| Rubric Builder | Consistent, transparent grading | Students self-assess and improve before submission |
| Worksheet Builder | Differentiated materials at scale | Every student appropriately challenged |
| Classroom Management | All data in one place | Evidence-based student support |
| Ask Assistant | On-demand instructional coaching | Better-informed teaching decisions |
| Curriculum Browser | Standards always accessible | Full coverage without gaps |
| Progress Tracker | Milestone evidence for accountability | Sequenced, prerequisite-aware instruction |
| Brain Dump | Zero-friction idea capture | Observations turned into responsive teaching |
| Image Studio | Professional visuals, no design skills | Visual learners engaged, concepts clarified |
| Slide Deck | Structured presentation in minutes | Students follow content, retention improves |
| Storybook Creator | K-ready illustrated stories in minutes | Literacy development through personalized reading |
| Achievements | Sustained app engagement | More thorough planning -> better instruction |
| Photo Transfer | Phone-based paperless grading | Rapid result return and reteaching |
| Educator Insights | Personalized professional development | Continuous improvement in teaching quality |
| Performance Metrics | Data-driven self-reflection | Early identification of struggling students |
| Sticky Notes | Contextual notes without app switching | Organized, well-prepared lessons |
| Settings | Tool optimized for your hardware | Consistent, responsive experience |
| School Year & Calendar | Full academic year planned upfront | No scheduling conflicts or coverage gaps |
| Active Class Context | One-click class switching across all tools | Consistent per-class configuration applied everywhere |
| Generation Queue | Visibility into all active jobs | Faster iteration, no lost work |
| Analyse Panel | Instant content improvement without re-generating | Higher-quality outputs with less effort |
| Unified Calendar | One view of all events across all systems | Nothing falls through the cracks |
| Scheduled Tasks | Automated weekly planning support | ELO-aligned lesson plans queued without manual effort |

---

*End of OECS Teacher Assistant Feature Reference — generated April 2026*
