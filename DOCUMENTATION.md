**OECS Learning Hub [Offline Version]**

**Technical and Functional Documentation**

**_Version 2.0_**

_Date of Issue: February 2026_

_Prepared By: Delon Pierre_

_Reviewed By:_

_Approved By:_  

**_TABLE OF CONTENTS_**

- _Executive Summary_
- _Introduction_
- _System Overview_
- _Feature Catalog_
- _Curriculum Integration_
- _Technical Architecture_
- _User Interface and Experience_
- _Build, Deployment, and Maintenance_
- _Data Management and History Tracking_
- _API Reference_
- _Future Roadmap_
- _Appendices_

**1. Executive Summary**

The OECS Learning Hub is a standalone, integrated digital platform designed to support primary school educators across the Organisation of Eastern Caribbean States (OECS). It provides curriculum-aligned tools for lesson planning, instructional content creation, assessment development, worksheet generation, image creation, and learner progress tracking. Built with an offline-first architecture and powered by sovereign AI, the platform ensures full data ownership, local control, and reliable access in schools with limited infrastructure and low connectivity.

The Learning Hub directly addresses challenges common in resource-constrained environments, including limited preparation time, inconsistent access to digital resources, and strict adherence to national and regional curriculum standards. By centralizing essential teaching tools in a single system, the platform allows teachers to plan efficiently, deliver high-quality instruction, and maintain clear visibility into curriculum coverage and student progress, even in low-resource contexts.

Supporting Kindergarten through Grade 6, the system reflects Caribbean contexts in its instructional materials, visuals, language, and examples. Teachers can generate worksheets, quizzes, rubrics, lesson plans, and custom educational images that are directly mapped to OECS curriculum standards, ensuring instructional consistency and integrity across classrooms and schools.

As a fully standalone application, the OECS Learning Hub operates without reliance on external cloud services. All AI functionality runs locally, preserving data sovereignty, protecting student and teacher information, and enabling uninterrupted use in offline or low-bandwidth environments.

Key benefits of the OECS Learning Hub include:

- Significant reduction in lesson planning and instructional material preparation time
- Direct alignment of all instructional resources with OECS curriculum standards
- Culturally relevant content reflecting Caribbean life and learning environments
- Full offline functionality to support schools with limited or unreliable internet access and infrastructure
- A unified platform combining planning, assessment, analytics, visual content creation, and instructional resources
- Sovereign AI architecture ensuring local data control and long-term sustainability
- Scene-based image generation preventing hallucinations in AI-generated content
- Comprehensive worksheet and quiz generation with integrated visuals

Through these capabilities, the OECS Learning Hub supports regional education goals focused on quality, equity, teacher effectiveness, and data-informed instructional decision-making, particularly in infrastructure-limited settings.

**2. Introduction**

**Background and Rationale**

Teaching in multi-grade, resource-constrained classrooms is a common reality across many OECS territories. Educators often spend substantial time creating basic instructional materials, navigating curriculum documents, and ensuring lessons align with standards—time that could otherwise be devoted to student engagement, differentiated instruction, and formative assessment. Concurrently, there is a strong regional consensus on the need to strengthen curriculum implementation, improve learning outcomes, and leverage technology to support teachers equitably, particularly in schools with limited infrastructure and connectivity.

The OECS Learning Hub was developed in direct response to these challenges. It emerged from consultations with educators, curriculum specialists, and ministry officials who identified a critical gap: the absence of a single, trusted, locally grounded digital environment that supports daily teaching practice while reinforcing alignment with regional standards. Designed as a standalone platform powered by sovereign AI, the Hub ensures that educators can access intelligent, curriculum-aligned tools even in low-bandwidth or offline environments.

**Target Users**

The platform is primarily intended for:

- Classroom teachers (Kindergarten to Grade 6) in public and private schools across OECS member states
- Curriculum coordinators and specialists responsible for instructional quality and resource development
- School administrators seeking visibility into curriculum coverage and teacher support needs
- Teacher training institutions preparing pre-service educators in standards-based planning

**Vision and Core Principles**

The vision of the OECS Learning Hub is to ensure that every teacher in the region has immediate access to intelligent, responsive, and pedagogically sound tools that enhance professional practice without adding complexity or administrative burden.

This vision is guided by four core principles:

- **Curriculum-Centered Design**  
    All features and workflows originate from, and reinforce, the OECS curriculum structure and learning standards.
- **Teacher Empowerment**  
    Tools are designed to reduce cognitive load, streamline repetitive tasks, and increase professional autonomy and creativity.
- **AI Sovereignty**  
    Instructional content, model usage, and data handling ensure full control, privacy, and ownership by OECS educators and institutions.
- **Technical Resilience**  
    The system is engineered to function reliably in low-bandwidth, infrastructure-limited, or offline environments common across many OECS territories.

By embedding these principles into its architecture and user experience, the OECS Learning Hub serves not only as a productivity platform but also as a catalyst for consistent, high-quality teaching across the region.

**3. System Overview**

The OECS Learning Hub is a self-contained, offline-first desktop application designed specifically for primary school teachers across the Organisation of Eastern Caribbean States. It integrates curriculum navigation, content creation, lesson planning, assessment design, worksheet generation, visual media generation, image editing, and progress tracking into a single, secure environment that does not require continuous internet connectivity, making it particularly suited for schools with limited infrastructure or unreliable internet access.

**High-Level Architecture**

The system follows a three-layer architecture:

**Frontend (User Interface)**  
A modern web-based interface built with React and wrapped in an Electron desktop container. The interface is optimized for teaching workflows and organized around core educator tasks such as planning, creating instructional materials, assessing learning, and reviewing progress. Contextual guidance and embedded tutorials ensure usability in environments with minimal technical support.

**Backend (Local Server)**  
A lightweight FastAPI server runs locally on the user's machine. It manages data persistence, internal API routing, and coordination of AI inference processes. All communication between the interface and intelligence components occurs locally, ensuring user data remains on the device unless explicitly exported.

**AI Layer (Intelligence Engine)**  
A suite of locally hosted AI models supports instructional content generation and media processing. Language models are used for lesson plans, quizzes, worksheets, and rubrics, while vision-language models support image understanding and editing. The modular inference system selects models based on task type and availability. Optional cloud-based AI services can be enabled by users, but are disabled by default, preserving offline functionality and data sovereignty.

**Core Capabilities**

The OECS Learning Hub provides the following integrated capabilities:

- Curriculum-aligned planning through structured navigation of OECS standards by grade and subject
- Automated generation of worksheets, quizzes, rubrics, and lesson plans tailored to selected standards and learner needs
- Scene-based image generation with hallucination prevention for educational content
- A visual content studio (Image Studio) for creating and editing culturally relevant instructional images
- Integrated worksheet generation with automatic image inclusion and question generation
- Progress and curriculum coverage tracking through an analytics dashboard and milestone system
- Full offline functionality for uninterrupted use in low-connectivity or infrastructure-limited environments
- Local data storage ensuring educator ownership and privacy of all generated content

**Offline-First Design and Local Data Management**

The Learning Hub is architected to operate independently of cloud services. After installation and initial setup, educators can use all features without an internet connection. Required AI models are installed locally during setup, enabling sustained offline operation.

All user data—including lesson plans, generated resources, curriculum tracking information, chat histories, milestone data, and interaction histories—is stored locally in structured JSON files. This design ensures:

- No dependency on external servers
- Full data ownership by educators and institutions
- Simple backup and transfer via external storage or local networks

By combining curriculum alignment, intelligent automation, visual content generation, and resilient offline design, the OECS Learning Hub enables educators to focus on delivering engaging, standards-based instruction while maintaining full control over their teaching resources and data, even in resource-constrained environments.

**4. Feature Catalog**

The OECS Learning Hub provides a comprehensive suite of integrated tools designed to support daily teaching practice, from lesson planning through assessment and reflection. Each feature is aligned with the OECS curriculum framework and optimized for primary classrooms from Kindergarten through Grade 6.

**_Analytics and Progress Tracking Dashboard_**

The platform includes a centralized dashboard that provides real-time visibility into curriculum implementation and instructional activity. Teachers can view curriculum coverage by subject and grade, timelines of completed lessons and upcoming instructional milestones, and patterns in resource usage. Where applicable, teachers may also track progress indicators for student groups based on manually entered data.

This dashboard supports reflective practice and helps educators ensure balanced, standards-aligned instruction throughout the academic year, even in infrastructure-limited environments.

**_AI-Powered Content Creation_**

The Learning Hub enables rapid creation of high-quality instructional materials using locally hosted language models. Teachers can generate a range of customizable resources, including:

- Worksheets with multiple question formats and integrated images
- Quizzes aligned to specific standards with teacher and student versions
- Rubrics for projects, presentations, and performance-based assessments

The system also supports differentiated versions of materials to accommodate varied learner needs. All generated resources are fully editable and can be exported in PDF or DOCX format for printing or sharing.

**_Lesson Planning Tools_**

The platform supports multiple lesson planning scenarios to reflect diverse classroom realities:

- **General Lesson Planner:** Single-grade, single-subject lessons
- **Kindergarten Planner:** Play-based and developmental learning approaches
- **Multigrade Planner:** Enables parallel or integrated activities across combined-grade classrooms
- **Cross-Curricular Planner:** Facilitates thematic units integrating multiple subjects around a central concept

Lesson plans can be edited, saved, and exported as PDF or DOCX documents.

**_Visual Content Studio (Image Studio)_**

To support visual learning and engagement, particularly in early primary grades, the platform includes an integrated visual content studio. Teachers can:

- Generate culturally relevant illustrations using text prompts
- Generate images from structured scene presets aligned with curriculum topics
- Edit existing images by adding or removing elements using AI-powered inpainting
- Modify backgrounds or focal objects
- Select from multiple visual styles (3D Cartoon, Line Art, Illustrated Painting, Photorealistic)

Generated visuals can be embedded directly into lesson plans, worksheets, or other instructional materials. All visual tools are designed to reflect Caribbean contexts and environments, ensuring appropriateness and relevance.

**_Worksheet Generator with Scene-Based Images_**

A specialized tool for creating custom worksheets that includes:

- Curriculum-aligned question generation
- Scene-based image generation with preset selection
- Hallucination prevention through structured scene specifications
- Multiple question types (multiple choice, short answer, fill-in-the-blank, etc.)
- Automatic integration of generated images with worksheet content
- Export to PDF and DOCX formats

**_Curriculum Browser and Standards Navigation_**

The Learning Hub provides an interactive browser for the full OECS curriculum. Teachers can:

- Navigate curriculum content by subject and grade level
- Review detailed standard descriptions and learning outcomes
- Explore suggested instructional approaches
- Access topic-specific activities and resources

Selecting a standard enables immediate generation of aligned lesson ideas or instructional resources. This feature eliminates reliance on separate curriculum documents and promotes consistent alignment with regional expectations.

**_AI Teaching Assistant (Chat)_**

An embedded conversational assistant offers on-demand pedagogical support. Teachers can:

- Ask curriculum-related questions
- Request activity ideas aligned to specific standards
- Refine instructional language for clarity or accessibility
- Receive classroom management or differentiation suggestions
- Maintain conversation history for reference

All interactions are stored locally and are not transmitted externally, preserving data sovereignty.

**_Export, Sharing, and Resource Library_**

All generated materials are automatically stored in a personal resource library organized by type and creation date. Teachers can:

- Export resources in PDF, DOCX, CSV, JSON, or Markdown formats
- Print directly from the application
- Share files via removable media, email, or local networks
- View and edit previously created resources
- Track resource usage and curriculum coverage

Previously created resources can be reused or adapted for future lessons, enabling gradual development of a personalized teaching repository.

**_Milestone and Curriculum Tracking_**

A comprehensive milestone tracking system that:

- Automatically generates milestones from curriculum standards
- Tracks completion status (not started, in progress, completed)
- Provides progress summaries by grade and subject
- Shows upcoming milestones for the current week
- Supports bulk reset for new school years
- Provides analytics dashboard integration

**_Calendar, Task, and Milestone Management_**

The Learning Hub includes integrated scheduling tools to support long-term instructional planning. Teachers can:

- Set curriculum milestones
- Schedule recurring instructional tasks
- Receive reminders aligned with pacing guides
- View upcoming milestones and deadlines

Calendar data integrates with lesson plans and progress tracking features to provide a cohesive planning experience.

**_Settings, Personalization, and Accessibility_**

The platform includes configurable settings to accommodate diverse user needs and preferences. Teachers can:

- Adjust display options such as font size and contrast
- Select preferred AI models where available
- Enable or disable tutorial prompts
- Configure default grade or subject views
- Customize sidebar and tab colors
- Enable/disable Visual Studio features
- Configure auto-close tabs on exit
- Use language settings (English by default, with regional variants planned for future releases)

**_Advanced Tab Functionality_**

The Learning Hub supports a flexible, multi-tab interface to improve workflow efficiency. Features include:

- **Groupable Tabs:** Organize related tools under a single parent tab
- **Multi-Tabs:** Open multiple tools or resources simultaneously
- **Split-Screen Mode:** View and interact with two tabs side by side
- **Tab Persistence:** Preserve tab states between sessions
- **Tab Colors:** Customizable colors for different tool types

**_Onboarding and Tutorial System_**

First-time users are guided through an interactive tutorial that introduces platform features and workflows:

- **Guided Overlays:** Step-by-step highlights of key interface areas and controls
- **Contextual Tooltips:** Provide on-the-spot guidance during first use of major features
- **Floating Tutorial Button:** Always available to access help or replay onboarding
- **Interactive Steps:** Users complete small tasks to practice workflows (e.g., creating a lesson plan, editing visual content)
- **Optional Locally Stored Video Demonstrations:** Cover advanced features such as multigrade planning and visual content editing
- **Offline Help Section:** Provides searchable documentation and frequently asked questions

**5. Curriculum Integration**

The OECS Learning Hub is fundamentally structured around the Organisation of Eastern Caribbean States (OECS) Curriculum Framework. All system features—from lesson planning to content generation—are designed to operationalize official curriculum standards and pedagogical priorities. The curriculum is embedded directly into the platform's data model rather than treated as an external reference, enabling immediate, offline access.

**OECS Curriculum Structure Mapping**

The platform mirrors the official curriculum hierarchy within its navigation and internal structure. Curriculum content is organized by:

- Subject (Mathematics, Science, Language Arts, Social Studies)
- Grade level (Kindergarten through Grade 6)
- Strands or themes
- Individual standards
- Weekly activities and resources

Each standard is associated with learning indicators that describe observable evidence of mastery and guide content generation and instructional suggestions. This structure is stored locally in structured data files, allowing teachers to access it without internet connectivity.

**Standards-Driven Content Generation**

When a teacher selects a curriculum standard during planning or browsing, the system activates a standards-aware generation process. Instructional resources—such as worksheets, assessments, and rubrics—are produced using the selected standard's description, grade level, and subject context. Curriculum metadata is embedded into each generation request, constraining outputs to the intended learning outcomes and reinforcing curriculum fidelity.

**Grade-Level Coverage**

The Learning Hub provides full curriculum support for Kindergarten through Grade 6, with resources adapted to developmental stages:

- **Kindergarten:** Play-based learning, oral language development, and visual engagement with unit-based organization (Belonging, Celebrations, Games, Plants and Animals, Weather)
- **Grades 1-3:** Foundational literacy and numeracy skills with guided practice
- **Grades 4-6:** Greater complexity, abstract reasoning, research skills, and integrated problem-solving

Each grade level includes subject-specific resource structures calibrated to cognitive and linguistic expectations.

**Cross-Curricular Linking and Thematic Planning**

The platform supports interdisciplinary instruction through thematic planning tools. Teachers can:

- Create cross-curricular units centered on real-world themes
- View related standards across multiple subjects
- Generate integrated activities and resources addressing multiple standards simultaneously

This approach promotes holistic learning and reflects the OECS curriculum's emphasis on contextualized, meaningful instruction.

**Topic Presets and Scene-Based Generation**

The platform includes 109 curriculum strand combinations with 150+ image presets covering:

- Mathematics: Number Sense, Operations, Patterns, Measurement, Geometry, Data/Probability
- Science: Space Systems, Earth Systems, Matter, Forces, Engineering Design, Inheritance, Interdependent Relationships
- Social Studies: Civic Participation, Economic Decision-Making, Historical Thinking, Spatial Thinking

Each preset includes structured scene specifications with defined objects, relationships, and exclusions to prevent AI hallucinations.

By embedding curriculum structure directly into its architecture, the OECS Learning Hub transforms static standards into actionable instructional guidance, ensuring that all planning, content creation, and instructional decisions align with regional educational goals.

**6. Technical Architecture**

The OECS Learning Hub is engineered as a secure, self-contained desktop application that operates entirely on the user's device. Its architecture prioritizes offline functionality, data privacy, and long-term maintainability, reflecting the infrastructure realities of small island education systems with variable connectivity and limited technical support.

**Frontend Stack**

The user interface is built using modern web technologies and packaged as a native Windows application through Electron:

- **Framework:** React 18 with TypeScript for reliability and maintainability
- **Build Tool:** Vite for fast development cycles and optimized production builds
- **Styling:** Tailwind CSS, supported by custom design tokens aligned with OECS branding
- **State Management:** React Context API with localStorage for lightweight session persistence
- **Navigation:** Client-side routing with breadcrumb trails for curriculum orientation
- **UI Components:** Custom components with Framer Motion for animations
- **Charts:** Recharts for analytics visualizations
- **Icons:** Lucide React icon library

The frontend communicates exclusively with a local backend server. No external network requests occur during normal operation.

**Backend Stack**

A lightweight Python-based backend server manages internal orchestration and data handling:

- **Framework:** FastAPI, providing asynchronous request handling, REST endpoints, and WebSocket support
- **Local API endpoints** manage lesson saving, curriculum lookup, AI content generation, progress tracking, file export, and image generation
- **WebSocket connections** enable real-time streaming of AI-generated content
- **Process Pool** manages concurrent generation tasks with slot-based queuing
- **Interfaces directly with the local file system**, reading/writing structured JSON files in a designated user data directory
- **All backend processes run locally** and terminate when the application closes

**AI Models and Inference Engines**

The platform uses open-weight AI models installed locally during setup:

- **Language models:** Generate lesson plans, worksheets, quizzes, and rubrics (PEARL_AI.gguf)
- **Vision models (SDXL-Turbo):** Generate educational images from text prompts and scene specifications
- **Inpainting models (IOPaint/LaMa):** Remove or edit elements in existing images
- **Quantized models:** Enable efficient CPU-based inference without requiring dedicated graphics hardware
- **Inference routing:** Modular system selects the appropriate model based on task type via inference_factory.py
- **Scene Schema System:** Structured scene specifications prevent hallucinations in generated content

Optional cloud-based AI services may be enabled manually by users with reliable internet (Gemma API, OpenRouter), but are disabled by default to preserve offline operation and data sovereignty.

**Image Generation Architecture**

The Image Studio and worksheet image generation use a sophisticated multi-component system:

- **SceneSchemaBuilder:** Creates structured scene specifications from curriculum presets
- **IP-Adapter Manager:** Handles reference images for style consistency
- **Image Asset Store:** Persistent storage for generated images with metadata
- **Image Service:** SDXL-Turbo pipeline and IOPaint integration
- **Topic Presets:** 150+ predefined scene configurations covering 109 curriculum strands
- **Style Profiles:** 4 visual styles (3D Cartoon, Line Art, Illustrated Painting, Photorealistic)

**Data Storage Strategy**

All user data is stored locally using human-readable JSON files, including:

- Lesson plans, worksheets, quizzes, rubrics
- Curriculum progress records and milestone data
- Chat histories and user preferences
- Generated images and scene specifications
- Resource library metadata

Files are saved within a user-specific application data directory (%APPDATA%/OECS Learning Hub/). No databases, telemetry systems, or cloud synchronization services are used. This ensures:

- Full data ownership
- Transparency
- Simple backup via direct file copying to external storage

**Electron Packaging for Windows Deployment**

The complete application—including frontend, backend, and AI models—is distributed as a single Windows installer:

- One-click installation
- No automatic updates, avoiding assumptions about internet availability
- Runs under standard user permissions, no administrative privileges required
- Backend bundled as extra resources
- Model files distributed separately or downloaded during setup

While initially targeting Windows due to device prevalence in OECS schools, the architecture is portable to other desktop operating systems with minimal modification.

**Security, Privacy, and Data Handling**

The OECS Learning Hub follows a strict privacy-by-design approach:

- No internet connectivity required during normal use
- All AI processing occurs locally on the device
- No user accounts, authentication credentials, or personal identifiers are collected
- Exported files contain only user-created content, with no embedded metadata or tracking information
- Scene-based generation ensures predictable, hallucination-free content

Ministries and institutions retain full control over software distribution, model updates, and data management, fully aligning with regional data protection expectations.

**7. User Interface and Experience**

The OECS Learning Hub is designed through a teacher-centered lens, prioritizing clarity, contextual guidance, and ease of use. The interface supports daily teaching practice without adding cognitive burden or unnecessary complexity.

**Design Philosophy**

The user experience is guided by three core principles:

- **Teacher-Centered Workflows**  
    Navigation and feature organization align with how educators plan, teach, and assess, beginning with curriculum standards or instructional goals rather than technical tools.
- **Guided Autonomy**  
    New users receive contextual prompts and support, while experienced users can disable guidance and work efficiently without interruption.
- **Accessibility and Inclusivity**  
    High-contrast visuals, scalable typography, clear iconography, and keyboard-friendly navigation ensure usability across diverse abilities and classroom conditions.

The visual design reflects OECS identity through calm, professional color palettes inspired by regional environments and uncluttered layouts that promote focus.

**Key User Interface Patterns**

Consistent interaction patterns create predictability and reduce learning effort:

- **Navigation:** Collapsible sidebar with grouped tools
- **Content Creation:** Focused modal windows preserve background context
- **Orientation:** Breadcrumb trails display curriculum navigation paths
- **Resource Display:** Activity cards include subject, grade, and preview information for quick scanning and reuse
- **Progress Feedback:** Bars and checkmarks provide immediate visual feedback on curriculum coverage and planning status
- **Form Inputs:** Clear labels, examples, and validation reduce errors and friction
- **Tab Management:** Visual grouping by tool type with color coding

**Theme and Display Customization**

The platform supports display customization to accommodate varied preferences and classroom environments:

- Light and dark display modes
- Adjustable font sizes (percentage-based scaling)
- Customizable sidebar colors
- Customizable tab colors by tool type
- Simplified interface options

Customization settings are stored locally and applied consistently across all features. The interface avoids gamification, pop-up interruptions, or distracting animations, maintaining a professional environment suitable for sustained instructional work.

**8. Build, Deployment, and Maintenance**

The OECS Learning Hub is designed for straightforward deployment and sustainable operation across schools with varying technical capacity. Its build and distribution processes are fully scripted, and ongoing maintenance requirements are minimal.

**Build Process Overview**

The application is assembled using automated scripts that:

- Compile frontend assets into optimized static files (npm run build)
- Package the backend server and its dependencies
- Bundle AI models and produce a Windows installer (electron-builder)

Required AI models are downloaded during setup and stored locally. A final build script coordinates all steps and produces a single installer file suitable for offline distribution. All build scripts are repeatable and include basic error checking to ensure consistency across environments.

**Model Setup and Offline AI Requirements**

To support full offline operation:

- All AI models are downloaded once during initial setup and stored locally
- The system verifies model availability at launch and provides prompts if files are missing
- Inference runs on the CPU using optimized model formats; no GPU is required
- Minimum hardware requirements include sufficient memory (8GB+) and storage (10GB+) to support local AI execution and application data

**Update Mechanism and Version Control**

The platform uses a **manual update model** suitable for low-connectivity environments:

- New versions are distributed as complete installers
- User data is stored separately and preserved during updates
- Each release includes a visible version identifier and release notes
- No reliance on update servers or background connectivity

**Troubleshooting and Support Guidance**

An offline help guide included with the application documents common issues and resolutions. Typical support scenarios include:

- Startup issues
- Slow AI performance due to limited system resources
- Missing data files or incomplete model installation
- Image generation failures

For institutional deployment, a lightweight support model is recommended:

- Identify a school-level technical contact
- Maintain offline copies of installers and backups
- Centralize distribution at the ministry or district level

No remote diagnostics, telemetry, or cloud-based logging are used, preserving privacy and simplifying compliance.

**9. Data Management and History Tracking**

The OECS Learning Hub treats user-generated content as the sole property of the educator or institution. All data is stored locally on the user's device in open, human-readable formats, with no transmission to external servers, cloud services, or third parties. This approach ensures full data sovereignty, simplifies compliance, and empowers teachers to retain, reuse, and share their work freely.

**Types of Data Stored Locally**

The application automatically saves the following categories of user-created content:

- **Lesson Plans:** Full records of planned lessons, including objectives, activities, standards, and notes, saved in lesson_plan_history.json.
- **Worksheets and Quizzes:** Generated and edited assessment materials, including question sets, answer keys, and formatting metadata, saved in worksheet_history.json and quiz_history.json.
- **Rubrics:** Generated grading rubrics saved in rubric_history.json.
- **Kindergarten Plans:** Developmentally appropriate lesson plans saved in kindergarten_history.json.
- **Multigrade Plans:** Multi-level classroom plans saved in multigrade_history.json.
- **Cross-Curricular Plans:** Integrated subject plans saved in cross_curricular_history.json.
- **Generated Images:** Image assets with scene specifications and metadata stored in backend/backend/data/image_assets/.
- **Conversation Logs:** Transcripts of interactions with the teaching assistant, stored for reference and continuity, saved in chat_history.json.
- **Milestones:** Curriculum coverage tracking and progress data managed via milestone_db.py.
- **User Preferences:** Settings such as default grade level, theme mode, font size, tab colors, and tutorial status, saved via SettingsContext.

All entries include timestamps and are append-only, ensuring a reliable audit trail of teaching activity over time.

**File-Based Storage Structure and Organization**

Data is organized in a flat, transparent directory structure under the user's application data folder (%APPDATA%\\OECS Learning Hub\\ on Windows). Key characteristics include:

- **Format:** Standard JSON files readable by any text editor or spreadsheet tool
- **No Databases:** Files can be opened, searched, or modified manually without specialized software
- **Atomic Writes:** Each save operation writes to a temporary file first, then replaces the original to prevent corruption during power loss or system interruption
- **Versioning:** Users may manually copy files to create snapshots (e.g., lesson_plans_backup_Jan2026.json)

This structure enables schools to manage data using familiar tools without requiring proprietary software.

**Backup, Portability, and Data Ownership**

Teachers and institutions retain complete control over their data:

- **Backup:** Entire data folders may be copied to USB drives, network shares, or personal cloud storage at the user's discretion
- **Portability:** Moving to a new computer requires only copying the data folder and reinstalling the application
- **Export:** Individual resources such as lesson plans and worksheets may be exported as PDF or DOCX files for sharing or portfolio use
- **Deletion:** Users may delete any file at any time using the operating system, with standard file permissions respected

No data is locked behind proprietary formats or vendor-controlled accounts. Educators may retain their complete resource library when transitioning between schools, supporting professional continuity and equity.

The OECS Learning Hub treats data as a professional asset belonging to the educator, aligning with regional values of autonomy, transparency, and sustainable digital practice in education.

**10. API Reference**

The backend exposes a comprehensive REST API and WebSocket endpoints for real-time communication.

**REST API Endpoints**

**Authentication & User Management**
- `POST /api/login` - User authentication (mock implementation)

**Chat History Management**
- `GET /api/chat-history` - Retrieve all chat histories
- `POST /api/chat-history` - Save or update chat history
- `DELETE /api/chat-history/{chat_id}` - Delete specific chat history

**Content Generation History**
- `GET /api/lesson-plan-history` - Retrieve lesson plan history
- `POST /api/lesson-plan-history` - Save lesson plan
- `DELETE /api/lesson-plan-history/{plan_id}` - Delete lesson plan
- `GET /api/quiz-history` - Retrieve quiz history
- `POST /api/quiz-history` - Save quiz
- `DELETE /api/quiz-history/{quiz_id}` - Delete quiz
- `GET /api/rubric-history` - Retrieve rubric history
- `POST /api/rubric-history` - Save rubric
- `DELETE /api/rubric-history/{rubric_id}` - Delete rubric
- `GET /api/worksheet-history` - Retrieve worksheet history
- `POST /api/worksheet-history` - Save worksheet
- `DELETE /api/worksheet-history/{worksheet_id}` - Delete worksheet
- `GET /api/kindergarten-history` - Retrieve kindergarten plans
- `POST /api/kindergarten-history` - Save kindergarten plan
- `DELETE /api/kindergarten-history/{plan_id}` - Delete kindergarten plan
- `GET /api/multigrade-history` - Retrieve multigrade plans
- `POST /api/multigrade-history` - Save multigrade plan
- `DELETE /api/multigrade-history/{plan_id}` - Delete multigrade plan
- `GET /api/cross-curricular-history` - Retrieve cross-curricular plans
- `POST /api/cross-curricular-history` - Save cross-curricular plan
- `DELETE /api/cross-curricular-history/{plan_id}` - Delete cross-curricular plan
- `GET /api/images-history` - Retrieve generated image history
- `POST /api/images-history` - Save image metadata
- `DELETE /api/images-history/{image_id}` - Delete image record

**AI Model Management**
- `GET /api/models` - List available AI models
- `POST /api/models/select` - Select active model
- `GET /api/models/active` - Get currently active model
- `POST /api/models/open-folder` - Open models directory in Explorer

**Content Generation (Non-streaming)**
- `POST /api/generate-title` - Generate chat conversation title
- `POST /api/generate-lesson-plan` - Generate lesson plan (batch mode)

**Image Generation**
- `POST /api/generate-image-prompt` - Generate optimized image prompt using LLM
- `POST /api/generate-image` - Generate image using SDXL-Turbo (returns PNG)
- `POST /api/generate-image-base64` - Generate image (returns base64)
- `POST /api/generate-batch-images-base64` - Generate multiple images
- `POST /api/generate-image-from-seed` - Generate image with specific seed
- `POST /api/inpaint` - Remove objects from image (file upload)
- `POST /api/inpaint-base64` - Remove objects from image (base64)
- `GET /api/image-service/status` - Check image generation services status
- `POST /api/image-service/start-iopaint` - Manually start IOPaint service

**Scene-Based Image Generation**
- `GET /api/topic-presets` - Get all available topic presets
- `GET /api/topic-presets/{topic_id}` - Get presets for specific topic
- `GET /api/style-profiles` - Get available style profiles
- `POST /api/generate-scene-image` - Generate image from scene specification
- `GET /api/image-assets/{asset_id}` - Retrieve image asset by ID
- `GET /api/image-assets/topic/{topic_id}` - Get assets by topic
- `GET /api/image-assets/recent` - Get recently generated assets
- `DELETE /api/image-assets/{asset_id}` - Delete image asset
- `GET /api/scene-stats` - Get scene generation statistics

**Export**
- `POST /api/export` - Export resources in various formats (PDF, DOCX, CSV, JSON, Markdown)

**Milestones**
- `POST /api/milestones/initialize/{teacher_id}` - Generate milestones from curriculum
- `GET /api/milestones/{teacher_id}` - Get milestones with filters
- `GET /api/milestones/{teacher_id}/progress` - Get progress statistics
- `GET /api/milestones/{teacher_id}/upcoming` - Get upcoming milestones
- `PATCH /api/milestones/{milestone_id}` - Update milestone status
- `POST /api/milestones/bulk-reset` - Reset all milestones
- `GET /api/milestones/{teacher_id}/stats` - Get comprehensive statistics

**System**
- `GET /api/health` - Health check endpoint
- `POST /api/shutdown` - Graceful shutdown

**WebSocket Endpoints**

Real-time streaming endpoints for AI content generation:

- `WS /ws/chat` - AI teaching assistant chat with conversation history
- `WS /ws/lesson-plan` - Lesson plan generation with streaming
- `WS /ws/quiz` - Quiz generation with streaming
- `WS /ws/rubric` - Rubric generation with streaming
- `WS /ws/kindergarten` - Kindergarten plan generation
- `WS /ws/multigrade` - Multigrade plan generation
- `WS /ws/cross-curricular` - Cross-curricular plan generation
- `WS /ws/worksheet` - Worksheet generation with streaming

All WebSocket endpoints support:
- Token-by-token streaming responses
- Job cancellation messages
- Error handling and reconnection
- Generation queue management via generation_gate.py

**11. Future Roadmap**

While the current version of the OECS Learning Hub delivers a complete, offline-capable suite of tools for primary teachers, ongoing development is planned to expand functionality, improve usability, and extend the platform's reach across the region. All planned enhancements prioritize offline resilience, data sovereignty, cultural relevance, and pedagogical effectiveness.

**Planned Enhancements**

**OECS Authentication Key (OAK)**  
A secure OECS Authentication Key (OAK) will allow teachers and institutions to access official updates, new AI models, report issues, submit complaints, or contact support. This ensures controlled distribution of updates while maintaining offline functionality for daily use.

**Task Queueing System**  
A task queueing system will manage computationally intensive operations, such as AI-driven content generation and image rendering, enabling teachers to continue using the platform while tasks are processed in the background.

**Visual Studio Enhancements**  
The integrated Visual Studio for image generation and editing will receive additional capabilities:

- Improved AI-assisted editing and customization of instructional visuals
- Support for batch image generation and resource reuse
- Enhanced templates and culturally relevant asset libraries
- Additional style profiles for diverse visual representations

**Multilingual Support**  
The platform will support additional regional language variants, enabling teachers and learners to interact with instructional materials in their preferred language. Core menus, tutorials, and generated resources will be progressively localized.

**Improved Content Generation**  
AI-driven generation of worksheets, quizzes, lesson plans, and rubrics will be refined to:

- Produce higher-quality, pedagogically aligned resources
- Support differentiated instruction more effectively
- Include enhanced formatting options for printing and digital use

**New Content Types and Tools**

- **PowerPoint Generator:** Automated creation of curriculum-aligned presentation slides for classroom use
- **Comprehensive Exam Creator:** Tools for generating summative assessments, including multi-section exams with answer keys
- **Expansion to Higher Levels:** Curriculum support and resource generation will extend to Secondary Schools using the existing standards-driven framework

**Autocorrect and Internal Dictionary**

The system will include a lightweight autocorrect and internal dictionary system focused solely on improving writing efficiency and accuracy during content creation.

**Key Functions**

- **Basic Spellchecking and Autocorrect:**  
    Common spelling errors and typographical mistakes will be corrected or flagged in real time while typing.
- **Non-Intrusive Suggestions:**  
    Corrections will be presented as suggestions rather than enforced changes, allowing teachers to retain full control over their text.
- **User-Extendable Dictionary:**  
    Teachers can add custom words, names, or terms to a local personal dictionary to prevent repeated correction prompts.

**Metric Acquisition and Performance Monitoring**  
The system will implement local metrics tracking for both AI models and the application itself:

- **LLM and Model Metrics:** Measure inference time, memory usage, and output quality for AI-driven content generation
- **Application Performance Metrics:** Track task completion times, UI responsiveness, and background processing efficiency
- Metrics will remain fully local, optional, and anonymized, supporting optimization without transmitting user data
- Dashboard insights will allow teachers and institutions to monitor system efficiency and resource usage while remaining offline

**Institutional and Regional Integration**

- Export adapters for national Learning Management Systems (LMS) or Management Information Systems (MIS), supporting curriculum reporting, lesson records, and calendar synchronization
- Optional, non-intrusive sharing of anonymized school-level analytics to support planning and resource allocation

All future development will continue to respect **offline-first design, local data ownership, and pedagogical integrity**, ensuring that teachers retain full control over their resources while benefiting from enhanced functionality, improved efficiency, and broader curriculum coverage.

**12. Appendices**

**Appendix A: File Structure**

```
OECS Learning Hub/
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── config.py                  # Configuration settings
│   ├── curriculum_matcher.py      # Curriculum search and matching
│   ├── image_service.py           # SDXL and IOPaint integration
│   ├── scene_api_endpoints.py     # Scene-based image generation API
│   ├── scene_schema.py            # Scene specification system
│   ├── ip_adapter_manager.py      # Reference image management
│   ├── image_asset_store.py       # Image persistence
│   ├── generation_gate.py         # Concurrent generation queuing
│   ├── inference_factory.py       # AI backend abstraction
│   ├── llama_inference.py         # Local LLM inference
│   ├── gemma_inference.py         # Gemma API integration
│   ├── openrouter_inference.py    # OpenRouter API integration
│   ├── export_utils.py            # Export format handlers
│   ├── routes/
│   │   └── milestones.py          # Milestone API endpoints
│   ├── milestones/
│   │   └── milestone_db.py        # Milestone data management
│   └── config/
│       ├── topic_presets.json     # 150+ curriculum image presets
│       ├── style_profiles.json    # Visual style definitions
│       └── reference_images_index.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Application root
│   │   ├── components/            # React components
│   │   │   ├── Dashboard.tsx      # Main dashboard
│   │   │   ├── Chat.tsx           # AI assistant
│   │   │   ├── LessonPlanner.tsx
│   │   │   ├── QuizGenerator.tsx
│   │   │   ├── RubricGenerator.tsx
│   │   │   ├── WorksheetGenerator.tsx
│   │   │   ├── ImageStudio.tsx    # Image creation/editing
│   │   │   ├── KindergartenPlanner.tsx
│   │   │   ├── MultigradePlanner.tsx
│   │   │   ├── CrossCurricularPlanner.tsx
│   │   │   ├── CurriculumViewer.tsx
│   │   │   ├── CurriculumTracker.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── ResourceManager.tsx
│   │   │   └── Settings.tsx
│   │   ├── curriculum/            # Grade-level curriculum pages
│   │   │   ├── kindergarten/
│   │   │   ├── grade1-subjects/
│   │   │   ├── grade2-subjects/
│   │   │   ├── grade3-subjects/
│   │   │   ├── grade4-subjects/
│   │   │   ├── grade5-subjects/
│   │   │   └── grade6-subjects/
│   │   ├── utils/                 # Prompt builders and renderers
│   │   │   ├── worksheetPromptBuilder.ts
│   │   │   ├── quizPromptBuilder.ts
│   │   │   ├── lessonPromptBuilder.ts
│   │   │   ├── rubricPromptBuilder.ts
│   │   │   ├── multigradePromptBuilder.ts
│   │   │   ├── kindergartenPromptBuilder.ts
│   │   │   ├── worksheetHtmlRenderer.ts
│   │   │   └── quizHtmlRenderer.ts
│   │   ├── types/                 # TypeScript definitions
│   │   ├── contexts/              # React contexts
│   │   ├── hooks/                 # Custom React hooks
│   │   └── lib/                   # API clients and utilities
│   └── package.json
├── electron/                      # Electron main process
│   ├── main.js
│   └── preload.js
├── build-scripts/                 # Build automation
├── package.json                   # Root package configuration
└── DOCUMENTATION.md              # This document
```

**Appendix B: Environment Variables**

- `MODELS_DIR` - Override path to AI models directory
- `INFERENCE_BACKEND` - Select backend: "local", "gemma_api", or "openrouter"
- `GEMMA_API_KEY` - API key for Gemma cloud service
- `OPENROUTER_API_KEY` - API key for OpenRouter service
- `OPENROUTER_MODEL` - Model selection for OpenRouter
- `ELECTRON_RESOURCE_PATH` - Custom resource path for packaged app
- `PYTHONIOENCODING` - Set to "utf-8" for proper character encoding
- `TORCH_HOME` - Cache directory for PyTorch models (IOPaint)

**Appendix C: Key Technical Specifications**

**System Requirements**
- Windows 10 or higher
- 8GB RAM minimum (16GB recommended)
- 10GB free disk space
- CPU with AVX2 support (for optimal AI performance)
- No GPU required

**Supported Export Formats**
- PDF (all resource types)
- DOCX (all resource types)
- CSV (history data)
- JSON (history data)
- Markdown (history data)

**AI Model Specifications**
- Primary LLM: PEARL_AI.gguf (quantized for CPU inference)
- Image Generation: SDXL-Turbo (OpenVINO optimized)
- Inpainting: LaMa (Large Mask Inpainting)
- Context Window: 4096 tokens
- Max Generation Tokens: 2000-6000 depending on task

**Curriculum Coverage**
- Grades: Kindergarten through Grade 6
- Subjects: Mathematics, Science, Language Arts, Social Studies
- Strands: 109 unique curriculum strand combinations
- Image Presets: 150+ topic-specific presets
- Activities: 200+ pre-designed learning activities

---

*End of Documentation*
