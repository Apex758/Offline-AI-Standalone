import { TutorialStep, dashboardWalkthroughSteps } from '../components/TutorialOverlay';

// Tutorial IDs for all tools
export const TUTORIAL_IDS = {
  // Main dashboard tutorial
  DASHBOARD_MAIN: 'dashboard-main',
  
  // Tool-specific tutorials
  ANALYTICS: 'analytics-dashboard',
  CHAT: 'chat-assistant',
  CURRICULUM: 'curriculum-viewer',
  LESSON_PLANNER: 'lesson-planner',
  KINDERGARTEN_PLANNER: 'kindergarten-planner',
  MULTIGRADE_PLANNER: 'multigrade-planner',
  CROSS_CURRICULAR_PLANNER: 'cross-curricular-planner',
  QUIZ_GENERATOR: 'quiz-generator',
  RUBRIC_GENERATOR: 'rubric-generator',
  RESOURCE_MANAGER: 'resource-manager',
  SETTINGS: 'settings',
} as const;

// Type for tutorial IDs
export type TutorialId = typeof TUTORIAL_IDS[keyof typeof TUTORIAL_IDS];

// Tutorial definition interface
export interface TutorialDefinition {
  id: TutorialId;
  name: string;
  description: string;
  steps: TutorialStep[];
}

// Main tutorials object
export const tutorials: Record<TutorialId, TutorialDefinition> = {
  [TUTORIAL_IDS.DASHBOARD_MAIN]: {
    id: TUTORIAL_IDS.DASHBOARD_MAIN,
    name: 'Dashboard Tutorial',
    description: 'Learn how to navigate and use the main dashboard',
    steps: dashboardWalkthroughSteps
  },
  
  [TUTORIAL_IDS.RESOURCE_MANAGER]: {
    id: TUTORIAL_IDS.RESOURCE_MANAGER,
    name: 'Resource Manager',
    description: 'Manage and edit your saved resources',
    steps: [
      {
        target: '[data-tutorial="resource-welcome"]',
        title: 'Welcome to Resource Manager',
        description: 'This is your central hub for managing all saved lesson plans, quizzes, rubrics, and other teaching materials. Easily search, filter, and organize your resources.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="resource-search"]',
        title: 'Search Your Resources',
        description: 'Quickly find any resource by typing keywords, topics, or grade levels in the search bar.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="resource-filters"]',
        title: 'Filter by Type',
        description: 'Use these filters to show only specific resource types like lesson plans, quizzes, or rubrics.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="resource-sort"]',
        title: 'Sort Options',
        description: 'Sort your resources by date created, title, or type to find what you need faster.',
        position: 'left'
      },
      {
        target: '[data-tutorial="resource-card"]',
        title: 'Resource Cards',
        description: 'Each card displays a summary of your resource. Click to view full details, or use the action buttons for quick operations.',
        position: 'top'
      },
      {
        target: '[data-tutorial="resource-actions"]',
        title: 'Quick Actions',
        description: 'Favorite important resources, edit content, export to PDF or Word, or delete items you no longer need.',
        position: 'left',
        actionHint: '👆 Try these actions!'
      },
      {
        target: '[data-tutorial="resource-favorites"]',
        title: 'Favorites Filter',
        description: 'Toggle this to quickly access your most important resources. Perfect for frequently used lesson plans!',
        position: 'bottom'
      }
    ]
  },
  
  [TUTORIAL_IDS.CHAT]: {
    id: TUTORIAL_IDS.CHAT,
    name: 'Chat Assistant',
    description: 'Learn how to use the AI chat assistant',
    steps: [
      {
        target: '[data-tutorial="chat-welcome"]',
        title: 'Welcome to AI Chat',
        description: 'Chat with PEARL AI to get instant help with teaching tasks, ask questions, brainstorm ideas, or get teaching strategies.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="chat-input"]',
        title: 'Type Your Message',
        description: 'Enter your question or request here. Try asking about lesson ideas, curriculum questions, teaching strategies, or classroom management tips!',
        position: 'top'
      },
      {
        target: '[data-tutorial="chat-send"]',
        title: 'Send Your Message',
        description: 'Click here or press Enter to send your message to PEARL AI.',
        position: 'left',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="chat-history"]',
        title: 'Chat History',
        description: 'Your conversation is saved here. Scroll up to review previous messages and AI responses.',
        position: 'right'
      },
      {
        target: '[data-tutorial="chat-sidebar"]',
        title: 'Conversation List',
        description: 'View all your past conversations. Click any conversation to continue where you left off.',
        position: 'right'
      },
      {
        target: '[data-tutorial="chat-new"]',
        title: 'Start New Chat',
        description: 'Begin a fresh conversation for a new topic or task. Previous chats are always saved for reference.',
        position: 'bottom',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      }
    ]
  },
  
  [TUTORIAL_IDS.CURRICULUM]: {
    id: TUTORIAL_IDS.CURRICULUM,
    name: 'Curriculum Viewer',
    description: 'Navigate the OECS curriculum content',
    steps: [
      {
        target: '[data-tutorial="curriculum-welcome"]',
        title: 'Welcome to Curriculum Browser',
        description: 'Explore the complete OECS curriculum with standards, learning objectives, and suggested activities for all subjects and grades.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="curriculum-grades"]',
        title: 'Select Grade Level',
        description: 'Choose the grade level you teach. The curriculum is organized from Kindergarten through Grade 6.',
        position: 'right'
      },
      {
        target: '[data-tutorial="curriculum-subjects"]',
        title: 'Choose Subject',
        description: 'Select from Language Arts, Mathematics, Science, or Social Studies to view subject-specific content.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="curriculum-topics"]',
        title: 'Browse Topics',
        description: 'Navigate through curriculum topics and learning units. Each topic contains detailed objectives and activities.',
        position: 'right'
      },
      {
        target: '[data-tutorial="curriculum-standards"]',
        title: 'View Standards',
        description: 'See the official OECS curriculum standards and learning objectives for each topic.',
        position: 'left'
      },
      {
        target: '[data-tutorial="curriculum-activities"]',
        title: 'Suggested Activities',
        description: 'Explore recommended teaching activities and strategies aligned with curriculum standards.',
        position: 'left'
      },
      {
        target: '[data-tutorial="curriculum-breadcrumb"]',
        title: 'Navigation Breadcrumb',
        description: 'Use this to track your location and quickly jump back to previous levels in the curriculum.',
        position: 'bottom'
      }
    ]
  },
  
  [TUTORIAL_IDS.LESSON_PLANNER]: {
    id: TUTORIAL_IDS.LESSON_PLANNER,
    name: 'Lesson Planner',
    description: 'Create comprehensive lesson plans',
    steps: [
      {
        target: '[data-tutorial="lesson-welcome"]',
        title: 'Welcome to Lesson Planner',
        description: 'Create detailed, standards-aligned lesson plans with AI assistance. Perfect for planning engaging and effective lessons.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="lesson-basic-info"]',
        title: 'Basic Information',
        description: 'Start by selecting the grade level, subject, and lesson topic. This helps PEARL AI generate relevant content.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-duration"]',
        title: 'Lesson Duration',
        description: 'Specify how long your lesson will be. This helps structure activities within the available time.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-objectives"]',
        title: 'Learning Objectives',
        description: 'Enter clear learning objectives or let AI suggest them. Good objectives define what students should know or do by the end.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-materials"]',
        title: 'Materials Needed',
        description: 'List materials and resources required for the lesson. AI can suggest appropriate materials based on your topic.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-activities"]',
        title: 'Lesson Activities',
        description: 'Plan your lesson procedures including introduction, main activities, and conclusion. AI generates structured, time-appropriate activities.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-assessment"]',
        title: 'Assessment Methods',
        description: 'Define how you\'ll assess student learning. Include formative and summative assessment strategies.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-differentiation"]',
        title: 'Differentiation',
        description: 'Add strategies to support diverse learners. AI suggests modifications for different ability levels.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-generate"]',
        title: 'Generate Lesson Plan',
        description: 'Click to have PEARL AI create a complete, detailed lesson plan based on your inputs.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="lesson-export"]',
        title: 'Save & Export',
        description: 'Save your lesson plan to resources, export as PDF or Word document, or share with colleagues.',
        position: 'left'
      }
    ]
  },
  
  [TUTORIAL_IDS.KINDERGARTEN_PLANNER]: {
    id: TUTORIAL_IDS.KINDERGARTEN_PLANNER,
    name: 'Kindergarten Planner',
    description: 'Create kindergarten-specific lesson plans',
    steps: [
      {
        target: '[data-tutorial="kinder-welcome"]',
        title: 'Welcome to Kindergarten Planner',
        description: 'Design age-appropriate, play-based learning experiences tailored for kindergarten students. Includes themes, centers, and activities.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="kinder-theme"]',
        title: 'Select Theme',
        description: 'Choose a weekly or daily theme. Themes help integrate learning across all activities and make connections meaningful for young learners.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-learning-areas"]',
        title: 'Learning Areas',
        description: 'Select focus areas like literacy, numeracy, science, social-emotional learning, and physical development.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-centers"]',
        title: 'Learning Centers',
        description: 'Plan activities for different centers: dramatic play, blocks, art, literacy, math, and science exploration.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-circle-time"]',
        title: 'Circle Time Activities',
        description: 'Add morning meeting, songs, stories, and group discussions appropriate for kindergarteners.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-play-activities"]',
        title: 'Play-Based Learning',
        description: 'Include structured and unstructured play activities that support learning objectives through hands-on exploration.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-resources"]',
        title: 'Materials & Resources',
        description: 'List age-appropriate materials, books, and supplies. AI suggests kindergarten-friendly resources.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-assessment"]',
        title: 'Observation & Assessment',
        description: 'Plan observation points and simple assessment strategies suitable for kindergarten students.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-generate"]',
        title: 'Generate Plan',
        description: 'Create a comprehensive, developmentally-appropriate kindergarten plan with engaging, play-based activities.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="kinder-export"]',
        title: 'Save & Share',
        description: 'Save to your resources or export your kindergarten plan for printing and sharing.',
        position: 'left'
      }
    ]
  },
  
  [TUTORIAL_IDS.MULTIGRADE_PLANNER]: {
    id: TUTORIAL_IDS.MULTIGRADE_PLANNER,
    name: 'Multigrade Planner',
    description: 'Plan lessons for multiple grade levels',
    steps: [
      {
        target: '[data-tutorial="multigrade-welcome"]',
        title: 'Welcome to Multigrade Planner',
        description: 'Create effective lesson plans for mixed-grade classrooms. Balance common activities with grade-specific differentiation.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="multigrade-grades"]',
        title: 'Select Grade Levels',
        description: 'Choose all grade levels in your classroom. PEARL AI will help you plan appropriate activities for each.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="multigrade-subject"]',
        title: 'Choose Subject',
        description: 'Select the subject area for your multigrade lesson. Consider which subjects work best for combined teaching.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-theme"]',
        title: 'Common Theme',
        description: 'Enter a central theme or topic that works across grade levels. This creates cohesion while allowing differentiation.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-common-activities"]',
        title: 'Shared Activities',
        description: 'Plan activities all students can participate in together. These build community and maximize teaching time.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-differentiation"]',
        title: 'Grade-Specific Tasks',
        description: 'Add differentiated activities tailored to each grade level\'s abilities and curriculum standards.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-grouping"]',
        title: 'Grouping Strategies',
        description: 'Plan how students will be grouped: by grade, ability, mixed-age pairs, or independent work.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-resources"]',
        title: 'Shared Resources',
        description: 'List materials that can be used across grades and those specific to each grade level.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-generate"]',
        title: 'Generate Plan',
        description: 'Create a detailed multigrade lesson plan with balanced whole-class and differentiated activities.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="multigrade-export"]',
        title: 'Save & Export',
        description: 'Save your multigrade plan to resources or export for reference during teaching.',
        position: 'left'
      }
    ]
  },
  
  [TUTORIAL_IDS.CROSS_CURRICULAR_PLANNER]: {
    id: TUTORIAL_IDS.CROSS_CURRICULAR_PLANNER,
    name: 'Cross-Curricular Planner',
    description: 'Create integrated subject lesson plans',
    steps: [
      {
        target: '[data-tutorial="cross-welcome"]',
        title: 'Welcome to Cross-Curricular Planning',
        description: 'Create integrated lessons connecting multiple subjects around a central theme. Make learning more meaningful and engaging!',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="cross-theme"]',
        title: 'Central Theme',
        description: 'Choose a unifying theme or essential question that connects all subjects. Examples: "Caribbean Climate," "Community Helpers," or "Caribbean History."',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-subjects"]',
        title: 'Select Subjects',
        description: 'Choose which subjects to integrate: Language Arts, Mathematics, Science, Social Studies, and Arts.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="cross-grade"]',
        title: 'Grade Level',
        description: 'Select the grade level to ensure all integrated activities are age-appropriate and standards-aligned.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-objectives"]',
        title: 'Subject Objectives',
        description: 'Define learning objectives for each subject area. PEARL AI helps create objectives that naturally connect.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-connections"]',
        title: 'Integration Strategies',
        description: 'Plan how subjects connect. For example, reading about science topics or using math in social studies projects.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-activities"]',
        title: 'Integrated Activities',
        description: 'Design activities that incorporate multiple subjects simultaneously, showing real-world connections.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-assessment"]',
        title: 'Holistic Assessment',
        description: 'Plan assessment that evaluates learning across subjects, such as projects or presentations.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-generate"]',
        title: 'Generate Plan',
        description: 'Create a rich, integrated lesson plan that shows meaningful connections across curriculum areas.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="cross-export"]',
        title: 'Save & Export',
        description: 'Save your cross-curricular plan to resources or export for implementation.',
        position: 'left'
      }
    ]
  },
  
  [TUTORIAL_IDS.QUIZ_GENERATOR]: {
    id: TUTORIAL_IDS.QUIZ_GENERATOR,
    name: 'Quiz Generator',
    description: 'Generate customized quizzes',
    steps: [
      {
        target: '[data-tutorial="quiz-welcome"]',
        title: 'Welcome to Quiz Generator',
        description: 'Create customized quizzes and assessments with various question types. Perfect for formative and summative assessments.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="quiz-topic"]',
        title: 'Topic & Grade',
        description: 'Enter the topic or learning objective and select the grade level for your quiz.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-subject"]',
        title: 'Subject Area',
        description: 'Choose the subject: Language Arts, Mathematics, Science, or Social Studies.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-question-types"]',
        title: 'Question Types',
        description: 'Select question formats: multiple choice, true/false, short answer, matching, or fill-in-the-blank.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="quiz-cognitive-levels"]',
        title: 'Cognitive Levels',
        description: 'Choose Bloom\'s Taxonomy levels: remember, understand, apply, analyze, evaluate, or create. Mix levels for balanced assessment.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-count"]',
        title: 'Number of Questions',
        description: 'Specify how many questions you need. Consider your class time and assessment purpose.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-difficulty"]',
        title: 'Difficulty Level',
        description: 'Set overall difficulty: easy, medium, or hard. Or mix difficulties for differentiation.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-generate"]',
        title: 'Generate Quiz',
        description: 'Create your quiz! PEARL AI will generate questions with answer keys and marking schemes.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="quiz-preview"]',
        title: 'Preview & Edit',
        description: 'Review generated questions, edit as needed, and rearrange question order before finalizing.',
        position: 'left'
      },
      {
        target: '[data-tutorial="quiz-export"]',
        title: 'Save & Export',
        description: 'Save to resources, print for students, or export with answer keys for grading.',
        position: 'left'
      }
    ]
  },
  
  [TUTORIAL_IDS.RUBRIC_GENERATOR]: {
    id: TUTORIAL_IDS.RUBRIC_GENERATOR,
    name: 'Rubric Generator',
    description: 'Create grading rubrics',
    steps: [
      {
        target: '[data-tutorial="rubric-welcome"]',
        title: 'Welcome to Rubric Generator',
        description: 'Create clear, detailed grading rubrics for assignments and projects. Help students understand expectations and make grading consistent.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="rubric-assignment"]',
        title: 'Assignment Details',
        description: 'Describe the assignment, project, or task being assessed. Include grade level and subject.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-criteria"]',
        title: 'Assessment Criteria',
        description: 'List the criteria you\'ll assess: content knowledge, organization, creativity, effort, etc. Add as many as needed.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="rubric-levels"]',
        title: 'Performance Levels',
        description: 'Choose performance levels: typically 3-5 levels like "Exceeds," "Meets," "Approaching," and "Below" expectations.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-points"]',
        title: 'Point Values',
        description: 'Assign point values to each performance level. Total points help with grade calculation.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-descriptors"]',
        title: 'Performance Descriptors',
        description: 'PEARL AI generates clear descriptors for each criterion at each level, making expectations explicit.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generate"]',
        title: 'Generate Rubric',
        description: 'Create a complete, professional rubric with all criteria, levels, and descriptors.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="rubric-export"]',
        title: 'Save & Share',
        description: 'Save to resources, print to share with students, or export for your records.',
        position: 'left'
      }
    ]
  },
  [TUTORIAL_IDS.ANALYTICS]: {
    id: TUTORIAL_IDS.ANALYTICS,
    name: 'Analytics Dashboard',
    description: 'Explore your teaching analytics, track progress, and manage tasks',
    steps: [
      {
        target: '[data-tutorial="analytics-profile"]',
        title: 'Welcome to Your Analytics Dashboard! 📊',
        description: 'This is your personal teaching hub where you can track all your resources, monitor curriculum progress, manage tasks, and see your productivity patterns at a glance.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="analytics-profile-edit"]',
        title: 'Your Profile',
        description: 'Click here to edit your profile photo and display name. Personalize your dashboard to make it yours!',
        position: 'right'
      },
      {
        target: '[data-tutorial="analytics-quick-stats"]',
        title: 'Quick Stats Overview',
        description: 'Get instant insights: total resources created, active teaching days, and task completion rate. These update in real-time as you work.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="analytics-chart-carousel"]',
        title: 'Interactive Chart Carousel',
        description: 'Your main analytics hub! This carousel automatically rotates through different chart views every 5 seconds, or you can navigate manually.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="analytics-chart-navigation"]',
        title: 'Chart Navigation Controls',
        description: 'Use these controls to navigate between charts, pause auto-rotation, or jump directly to a specific view using the indicator dots.',
        position: 'left',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Try the controls!'
      },
      {
        target: '[data-tutorial="analytics-chart-display"]',
        title: 'Multiple Chart Views',
        description: 'View 1 shows Resource Creation Trends over time. View 2 shows Resource Type Distribution and Lesson Plan Comparison side-by-side.',
        position: 'top'
      },
      {
        target: '[data-tutorial="analytics-timeframe-selector"]',
        title: 'Timeframe Selector',
        description: 'Switch between 1 Week, 2 Weeks, Month, or All Time views to analyze your productivity patterns over different periods.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="analytics-curriculum-progress"]',
        title: 'Curriculum Progress Tracking',
        description: 'Track your progress through the OECS curriculum with completion stats, milestone tracking, and upcoming deadlines.',
        position: 'top'
      },
      {
        target: '[data-tutorial="analytics-curriculum-views"]',
        title: 'Progress View Modes',
        description: 'Toggle between Overall, By Grade, or By Subject views to see your curriculum coverage from different perspectives.',
        position: 'bottom',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Switch views!'
      },
      {
        target: '[data-tutorial="analytics-completion-ring"]',
        title: 'Completion Percentage',
        description: 'This visual ring shows your overall curriculum completion percentage, with detailed stats for completed, in-progress, and not-started milestones below.',
        position: 'right'
      },
      {
        target: '[data-tutorial="analytics-recent-activity"]',
        title: 'Recent Activity',
        description: 'View your latest created resources and teaching activities. This timeline shows what you\'ve been working on recently.',
        position: 'left'
      },
      {
        target: '[data-tutorial="analytics-calendar-widget"]',
        title: 'Compact Calendar',
        description: 'View your teaching activity at a glance. Color-coded dots show resources created, tasks scheduled, and milestones on each day.',
        position: 'left'
      },
      {
        target: '[data-tutorial="analytics-calendar-navigation"]',
        title: 'Calendar Navigation',
        description: 'Navigate months with arrow buttons or click the expand icon to open a full-screen calendar view with detailed daily information.',
        position: 'left'
      },
      {
        target: '[data-tutorial="analytics-calendar-legend"]',
        title: 'Activity Indicators',
        description: 'The legend shows what each colored dot means: green for resources, orange for tasks, and brown for milestones.',
        position: 'top'
      },
      {
        target: '[data-tutorial="analytics-task-widget"]',
        title: 'Task Management',
        description: 'Manage your teaching tasks directly from the dashboard. Tasks are organized by status: Overdue, Today, Upcoming, and Completed.',
        position: 'left'
      },
      {
        target: '[data-tutorial="analytics-add-task"]',
        title: 'Create New Tasks',
        description: 'Click here to quickly add new tasks with titles, descriptions, due dates, and priority levels.',
        position: 'left',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Add a task!'
      },
      {
        target: '[data-tutorial="task-edit-modal"]',
        title: 'Create a Task',
        description: 'To create a task:\n\n• Enter a task title (required)\n• Add optional description\n• Set due date\n• Choose priority: Low, Medium, High, or Urgent\n• Click "Create Task" to save',
        position: 'right',
        clickTarget: '[data-tutorial="task-modal-close"]'
      },
      {
        target: '[data-tutorial="analytics-task-list"]',
        title: 'Task Organization',
        description: 'Tasks are automatically grouped by urgency. Overdue tasks appear first with alerts, followed by today\'s tasks, then upcoming ones.',
        position: 'left'
      },
      {
        target: '[data-tutorial="analytics-most-used-tools"]',
        title: 'Most Used Tools',
        description: 'See which teaching tools you use most frequently. Tools are ranked by usage with badges showing their position. Click any tool icon to quickly open it in a new tab.',
        position: 'top'
      },
      {
        target: '[data-tutorial="main-content"]',
        title: 'You\'re All Set! 🎉',
        description: 'Your Analytics Dashboard is your command center for tracking teaching progress, managing tasks, and optimizing your workflow. Explore each section to discover more features!',
        position: 'center'
      }
    ]
  },
  
  [TUTORIAL_IDS.SETTINGS]: {
    id: TUTORIAL_IDS.SETTINGS,
    name: 'Settings',
    description: 'Customize your application settings',
    steps: [
      {
        target: '[data-tutorial="settings-welcome"]',
        title: 'Welcome to Settings',
        description: 'Customize PEARL AI to match your preferences and teaching style. Adjust appearance, notifications, and more.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="settings-appearance"]',
        title: 'Appearance Settings',
        description: 'Choose between light, dark, or auto theme. Adjust font size and display preferences for comfortable viewing.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="settings-tab-colors"]',
        title: 'Tab Color Customization',
        description: 'Personalize tab colors for each tool to help you navigate and organize your workflow.',
        position: 'right'
      },
      {
        target: '[data-tutorial="settings-tutorials"]',
        title: 'Tutorial Preferences',
        description: 'Control when and how tutorials appear. Reset completed tutorials or disable them if you prefer.',
        position: 'right'
      },
      {
        target: '[data-tutorial="settings-api"]',
        title: 'API Configuration',
        description: 'Configure API settings for AI features. Most users can keep default settings.',
        position: 'right'
      },
      {
        target: '[data-tutorial="settings-notifications"]',
        title: 'Notification Settings',
        description: 'Manage notifications for completed tasks, updates, and other system alerts.',
        position: 'right'
      },
      {
        target: '[data-tutorial="settings-reset"]',
        title: 'Reset Options',
        description: 'Reset app to defaults, clear cache, or reset specific settings if needed.',
        position: 'left'
      },
      {
        target: '[data-tutorial="settings-export"]',
        title: 'Export Settings',
        description: 'Export your preferences to backup or transfer settings to another device.',
        position: 'left'
      }
    ]
  },
};

// Helper function to get tutorial by ID
export const getTutorialById = (id: TutorialId): TutorialDefinition | undefined => {
  return tutorials[id];
};

// Helper function to check if a tutorial has steps defined
export const hasTutorialSteps = (id: TutorialId): boolean => {
  const tutorial = tutorials[id];
  return tutorial ? tutorial.steps.length > 0 : false;
};