import { TutorialStep, dashboardWalkthroughSteps } from '../components/TutorialOverlay';

// Tutorial IDs for all tools
export const TUTORIAL_IDS = {
  // Main dashboard tutorial
  DASHBOARD_MAIN: 'dashboard-main',

  // Tool-specific tutorials
  ANALYTICS: 'analytics-dashboard',
  CURRICULUM: 'curriculum-viewer',
  CURRICULUM_TRACKER: 'curriculum-tracker',
  LESSON_PLANNER: 'lesson-planner',
  KINDERGARTEN_PLANNER: 'kindergarten-planner',
  MULTIGRADE_PLANNER: 'multigrade-planner',
  CROSS_CURRICULAR_PLANNER: 'cross-curricular-planner',
  QUIZ_GENERATOR: 'quiz-generator',
  RUBRIC_GENERATOR: 'rubric-generator',
  WORKSHEET_GENERATOR: 'worksheet-generator',
  IMAGE_STUDIO: 'image-studio',
  RESOURCE_MANAGER: 'resource-manager',
  SETTINGS: 'settings',
  CHAT: 'chat',
  CLASS_MANAGEMENT: 'class-management',
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
        position: 'center'
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
        target: '[data-tutorial="curriculum-breadcrumb"]',
        title: 'Navigation Breadcrumb',
        description: 'Use this to track your location and quickly jump back to previous levels in the curriculum.',
        position: 'bottom'
      }
    ]
  },

  [TUTORIAL_IDS.CURRICULUM_TRACKER]: {
    id: TUTORIAL_IDS.CURRICULUM_TRACKER,
    name: 'Progress Tracker',
    description: 'Track your progress through the curriculum milestones',
    steps: [
      {
        target: '[data-tutorial="curriculum-tracker-header"]',
        title: 'Welcome to Progress Tracker',
        description: 'Track your progress through the OECS curriculum with this comprehensive milestone tracking tool. Monitor completion status, set due dates, and stay organized.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="overall-progress"]',
        title: 'Overall Progress Overview',
        description: 'See your total curriculum completion percentage at a glance. This updates automatically as you mark milestones complete.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="filters-section"]',
        title: 'Filter Your Curriculum',
        description: 'Use these filters to focus on specific grades, subjects, or milestone statuses. Perfect for planning your teaching priorities.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="curriculum-tree"]',
        title: 'Interactive Curriculum Tree',
        description: 'Click on grade, subject, or strand nodes to expand and collapse sections. Each level shows progress indicators.',
        position: 'right'
      },
      {
        target: '[data-tutorial="grade-node"]',
        title: 'Grade Level Nodes',
        description: 'Each grade shows overall progress across all subjects. Click to expand and see subject breakdowns.',
        position: 'right'
      },
      {
        target: '[data-tutorial="grade-node"]',
        title: 'Expand a Grade Node',
        description: 'Click on any grade node to expand it and reveal the subject areas within that grade.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click a grade node!'
      },
      {
        target: '[data-tutorial="subject-node"]',
        title: 'Expand a Subject Node',
        description: 'Click on any subject node to expand it and reveal the strands or milestones within that subject.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click a subject node!'
      },
      {
        target: '[data-tutorial="strand-node"]',
        title: 'Expand a Strand',
        description: 'Click on any strand to expand it and reveal the individual milestones within that strand.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click a strand!'
      },
      {
        target: '[data-tutorial="node-progress"]',
        title: 'Progress Indicators',
        description: 'Visual progress bars and percentages help you track completion at every level of the curriculum.',
        position: 'top'
      },
      {
        target: '[data-tutorial="milestone-item"]',
        title: 'Individual Milestones',
        description: 'These are the specific learning objectives and topics you need to cover. Each milestone can be tracked individually.',
        position: 'left'
      },
      {
        target: '[data-tutorial="milestone-status"]',
        title: 'Update Milestone Status',
        description: 'Change milestone status from Not Started to In Progress, Completed, or Skipped. This updates your progress tracking.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Try changing a status!'
      },
      {
        target: '[data-tutorial="edit-milestone"]',
        title: 'Edit Milestone Details',
        description: 'Click the edit button to add notes, set due dates, or modify milestone information.',
        position: 'left',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click to edit!'
      },
      {
        target: '[data-tutorial="edit-modal"]',
        title: 'Milestone Edit Modal',
        description: 'Here you can add personal notes, set due dates, and update milestone status in detail.',
        position: 'center'
      },
      {
        target: '[data-tutorial="modal-status"]',
        title: 'Modal Status Selector',
        description: 'Choose the current status of this milestone from the dropdown menu.',
        position: 'right'
      },
      {
        target: '[data-tutorial="modal-notes"]',
        title: 'Add Notes',
        description: 'Add personal notes about this milestone - teaching tips, resources needed, or observations.',
        position: 'right'
      },
      {
        target: '[data-tutorial="modal-due-date"]',
        title: 'Set Due Date',
        description: 'Set a target completion date for this milestone to help with planning and prioritization.',
        position: 'right'
      },
      {
        target: '[data-tutorial="save-changes"]',
        title: 'Save Changes',
        description: 'Save your edits to update the milestone with new notes, due date, or status.',
        position: 'top'
      },
      {
        target: '[data-tutorial="cancel-edit"]',
        title: 'Cancel Edit',
        description: 'Close the edit modal without saving changes.',
        position: 'top'
      }
    ]
  },

  [TUTORIAL_IDS.LESSON_PLANNER]: {
    id: TUTORIAL_IDS.LESSON_PLANNER,
    name: 'Lesson Planner',
    description: 'Create comprehensive lesson plans',
    steps: [
      {
        target: '[data-tutorial="lesson-planner-welcome"]',
        title: 'Welcome to Lesson Planner',
        description: 'Create detailed, standards-aligned lesson plans. Perfect for planning engaging and effective lessons.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="lesson-planner-basic-info"]',
        title: 'Basic Information',
        description: 'Start by selecting the grade level, subject, and lesson topic. This helps your Assistant generate relevant content.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-planner-duration"]',
        title: 'Lesson Duration',
        description: 'Specify how long your lesson will be. This helps structure activities within the available time.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-planner-materials"]',
        title: 'Materials Needed',
        description: 'List materials and resources required for the lesson. Appropriate materials can be suggested based on your topic.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-planner-activities"]',
        title: 'Lesson Activities',
        description: 'Plan your lesson procedures including introduction, main activities, and conclusion. Structured, time-appropriate activities will be generated.',
        position: 'right'
      },
      {
        target: '[data-tutorial="lesson-planner-generate"]',
        title: 'Generate Lesson Plan',
        description: 'Click to create a complete, detailed lesson plan based on your inputs.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      }
    ]
  },
  
  [TUTORIAL_IDS.KINDERGARTEN_PLANNER]: {
    id: TUTORIAL_IDS.KINDERGARTEN_PLANNER,
    name: 'Early Childhood Planner',
    description: 'Create early childhood lesson plans',
    steps: [
      {
        target: '[data-tutorial="kinder-planner-welcome"]',
        title: 'Welcome to Kindergarten Planner',
        description: 'Design age-appropriate, play-based learning experiences tailored for kindergarten students. Includes themes, centers, and activities.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="kinder-planner-theme"]',
        title: 'Select Theme',
        description: 'Choose a weekly or daily theme. Themes help integrate learning across all activities and make connections meaningful for young learners.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-planner-learning-areas"]',
        title: 'Learning Areas',
        description: 'Select focus areas like literacy, numeracy, science, social-emotional learning, and physical development.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-planner-centers"]',
        title: 'Learning Centers',
        description: 'Plan activities for different centers: dramatic play, blocks, art, literacy, math, and science exploration.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-planner-circle-time"]',
        title: 'Circle Time Activities',
        description: 'Add morning meeting, songs, stories, and group discussions appropriate for kindergarteners.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-planner-play-activities"]',
        title: 'Play-Based Learning',
        description: 'Include structured and unstructured play activities that support learning objectives through hands-on exploration.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-planner-assessment"]',
        title: 'Observation & Assessment',
        description: 'Plan observation points and simple assessment strategies suitable for kindergarten students.',
        position: 'right'
      },
      {
        target: '[data-tutorial="kinder-planner-generate"]',
        title: 'Generate Plan',
        description: 'Create a comprehensive, developmentally-appropriate kindergarten plan with engaging, play-based activities.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      }
    ]
  },
  
  [TUTORIAL_IDS.MULTIGRADE_PLANNER]: {
    id: TUTORIAL_IDS.MULTIGRADE_PLANNER,
    name: 'Multi-Level Planner',
    description: 'Plan lessons for multiple grade levels',
    steps: [
      {
        target: '[data-tutorial="multigrade-planner-welcome"]',
        title: 'Welcome to Multigrade Planner',
        description: 'Create effective lesson plans for mixed-grade classrooms. Balance common activities with grade-specific differentiation.',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="multigrade-planner-grades"]',
        title: 'Select Grade Levels',
        description: 'Choose all grade levels in your classroom. Your Assistant will help you plan appropriate activities for each.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="multigrade-planner-subject"]',
        title: 'Choose Subject',
        description: 'Select the subject area for your multigrade lesson. Consider which subjects work best for combined teaching.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-planner-theme"]',
        title: 'Common Theme',
        description: 'Enter a central theme or topic that works across grade levels. This creates cohesion while allowing differentiation.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-planner-common-activities"]',
        title: 'Shared Activities',
        description: 'Plan activities all students can participate in together. These build community and maximize teaching time.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-planner-differentiation"]',
        title: 'Grade-Specific Tasks',
        description: 'Add differentiated activities tailored to each grade level\'s abilities and curriculum standards.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-planner-grouping"]',
        title: 'Grouping Strategies',
        description: 'Plan how students will be grouped: by grade, ability, mixed-age pairs, or independent work.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-planner-resources"]',
        title: 'Shared Resources',
        description: 'List materials that can be used across grades and those specific to each grade level.',
        position: 'right'
      },
      {
        target: '[data-tutorial="multigrade-planner-generate"]',
        title: 'Generate Plan',
        description: 'Create a detailed multigrade lesson plan with balanced whole-class and differentiated activities.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      }
    ]
  },
  
  [TUTORIAL_IDS.CROSS_CURRICULAR_PLANNER]: {
    id: TUTORIAL_IDS.CROSS_CURRICULAR_PLANNER,
    name: 'Integrated Lesson Planner',
    description: 'Create integrated subject lesson plans',
    steps: [
      {
        target: '[data-tutorial="cross-curricular-planner-welcome"]',
        title: 'Welcome to Cross-Curricular Planning',
        description: 'Create integrated lessons connecting multiple subjects around a central theme. Make learning more meaningful and engaging!',
        position: 'bottom'
      },
      {
        target: '[data-tutorial="cross-curricular-planner-grade"]',
        title: 'Grade Level',
        description: 'Select the grade level to ensure all integrated activities are age-appropriate and standards-aligned.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-curricular-planner-theme"]',
        title: 'Central Theme',
        description: 'Choose a unifying theme or essential question that connects all subjects. Examples: "Caribbean Climate," "Community Helpers," or "Caribbean History."',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-curricular-planner-subjects"]',
        title: 'Select Subjects',
        description: 'Choose which subjects to integrate: Language Arts, Mathematics, Science, Social Studies, and Arts.',
        position: 'right',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      },
      {
        target: '[data-tutorial="cross-curricular-planner-objectives"]',
        title: 'Subject Objectives',
        description: 'Define learning objectives for each subject area. Your Assistant helps create objectives that naturally connect.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-curricular-planner-connections"]',
        title: 'Integration Strategies',
        description: 'Plan how subjects connect. For example, reading about science topics or using math in social studies projects.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-curricular-planner-activities"]',
        title: 'Integrated Activities',
        description: 'Design activities that incorporate multiple subjects simultaneously, showing real-world connections.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-curricular-planner-assessment"]',
        title: 'Holistic Assessment',
        description: 'Plan assessment that evaluates learning across subjects, such as projects or presentations.',
        position: 'right'
      },
      {
        target: '[data-tutorial="cross-curricular-planner-generate"]',
        title: 'Generate Plan',
        description: 'Create a rich, integrated lesson plan that shows meaningful connections across curriculum areas.',
        position: 'top',
        interactive: true,
        waitForAction: 'click',
        actionHint: '👆 Click here!'
      }
    ]
  },
  
  [TUTORIAL_IDS.QUIZ_GENERATOR]: {
    id: TUTORIAL_IDS.QUIZ_GENERATOR,
    name: 'Quiz Builder',
    description: 'Build customized quizzes',
    steps: [
      {
        target: '[data-tutorial="quiz-generator-welcome"]',
        title: 'Welcome to Quiz Generator',
        description: 'Create customized quizzes and assessments with various question types. Perfect for formative and summative assessments.',
        position: 'center'
      },
      {
        target: '[data-tutorial="quiz-generator-history"]',
        title: 'Quiz History',
        description: 'Open your saved quizzes to reload, edit, or delete them.',
        position: 'top'
      },
      {
        target: '[data-tutorial="quiz-generator-subject"]',
        title: 'Subject Area',
        description: 'Choose the subject: Language Arts, Mathematics, Science, or Social Studies.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-generator-grade"]',
        title: 'Grade Level',
        description: 'Select the grade to align difficulty and standards.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-generator-question-count"]',
        title: 'Number of Questions',
        description: 'Specify how many questions you need. Consider your class time and assessment purpose.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-generator-topic"]',
        title: 'Learning Outcomes',
        description: 'Describe the learning outcomes or focus topic to guide question generation.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-generator-question-types"]',
        title: 'Question Types',
        description: 'Select question formats: multiple choice, true/false, short answer, matching, or fill-in-the-blank.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-generator-cognitive-levels"]',
        title: 'Cognitive Levels',
        description: 'Choose Bloom\'s Taxonomy levels: remember, understand, apply, analyze, evaluate, or create. Mix levels for balanced assessment.',
        position: 'right'
      },
      {
        target: '[data-tutorial="quiz-generator-generate"]',
        title: 'Generate Quiz',
        description: 'Create your quiz! Questions will be generated with answer keys and marking schemes.',
        position: 'top'
      },
      //Future: preview/edit/export steps once anchors exist
    ]
  },
  
  [TUTORIAL_IDS.RUBRIC_GENERATOR]: {
    id: TUTORIAL_IDS.RUBRIC_GENERATOR,
    name: 'Rubric Builder',
    description: 'Build grading rubrics',
    steps: [
      {
        target: '[data-tutorial="rubric-generator-welcome"]',
        title: 'Welcome to Rubric Generator',
        description: 'Create clear, detailed grading rubrics for assignments and projects. Help students understand expectations and make grading consistent.',
        position: 'center'
      },
      {
        target: '[data-tutorial="rubric-generator-history"]',
        title: 'Rubric History',
        description: 'Open your saved rubrics to reload, edit, or delete them.',
        position: 'top'
      },
      {
        target: '[data-tutorial="rubric-generator-assignment"]',
        title: 'Assignment Title',
        description: 'Name the assignment you are grading.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generator-assignment-type"]',
        title: 'Assignment Type',
        description: 'Select the assignment type to tailor the rubric.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generator-subject"]',
        title: 'Subject',
        description: 'Choose the subject for this rubric.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generator-grade"]',
        title: 'Grade Level',
        description: 'Select the grade level to align expectations.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generator-criteria"]',
        title: 'Learning Objectives',
        description: 'Define the learning objectives that the rubric will assess.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generator-descriptors"]',
        title: 'Specific Requirements',
        description: 'List any specific requirements for the assignment.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generator-levels"]',
        title: 'Performance Levels',
        description: 'Choose how many performance levels to include.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generator-points"]',
        title: 'Options',
        description: 'Toggle whether to include point values.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generator-focus-areas"]',
        title: 'Focus Areas',
        description: 'Select focus areas for the rubric criteria.',
        position: 'right'
      },
      {
        target: '[data-tutorial="rubric-generator-generate"]',
        title: 'Generate Rubric',
        description: 'Create a complete, professional rubric with all criteria, levels, and descriptors.',
        position: 'top'
      }
    ]
  },

  [TUTORIAL_IDS.WORKSHEET_GENERATOR]: {
    id: TUTORIAL_IDS.WORKSHEET_GENERATOR,
    name: 'Worksheet Builder',
    description: 'Create and preview worksheets',
    steps: [
      { target: '[data-tutorial="worksheet-generator-welcome"]', title: 'Welcome to Worksheet Generator', description: 'Configure subject, grade, and scope to create aligned worksheets.', position: 'center' },
      { target: '[data-tutorial="worksheet-generator-subject"]', title: 'Pick Subject', description: 'Choose the subject to align standards and content.', position: 'right' },
      { target: '[data-tutorial="worksheet-generator-grade"]', title: 'Set Grade', description: 'Select the grade level for appropriate rigor.', position: 'right' },
      { target: '[data-tutorial="worksheet-generator-strand"]', title: 'Choose Strand', description: 'Pick the strand to narrow curriculum alignment.', position: 'right' },
      { target: '[data-tutorial="worksheet-generator-topic"]', title: 'Topic / Focus', description: 'Add a topic or key idea to guide generation.', position: 'right' },
      { target: '[data-tutorial="worksheet-generator-question-count"]', title: 'Question Count', description: 'Set how many questions to include.', position: 'right' },
      { target: '[data-tutorial="worksheet-generator-question-type"]', title: 'Question Type', description: 'Select the question type to shape the template and prompts.', position: 'right', interactive: true, waitForAction: 'click', actionHint: '👆 Select a type' },
      { target: '[data-tutorial="worksheet-generator-templates"]', title: 'Template Layout', description: 'Pick the worksheet layout that matches your question type.', position: 'right' },
      { target: '[data-tutorial="worksheet-generator-include-images"]', title: 'Images (Optional)', description: 'Toggle images on/off to enrich the worksheet.', position: 'right' },
      { target: '[data-tutorial="worksheet-generator-image-prompt"]', title: 'Image Prompt', description: 'Describe the image to generate when images are enabled.', position: 'right' },
      { target: '[data-tutorial="worksheet-generator-generate"]', title: 'Generate Worksheet', description: 'Produce the worksheet with the chosen settings.', position: 'top', interactive: true, waitForAction: 'click', actionHint: '👆 Generate' },
      { target: '[data-tutorial="worksheet-generator-preview"]', title: 'Live Preview', description: 'See the rendered worksheet; switch between student/teacher views.', position: 'left' },
      { target: '[data-tutorial="worksheet-generator-view-toggle"]', title: 'Student vs. Teacher', description: 'Toggle to show/hide answers.', position: 'left', interactive: true, waitForAction: 'click', actionHint: '👆 Toggle view' },
      { target: '[data-tutorial="worksheet-generator-save"]', title: 'Save', description: 'Save your worksheet to history/resources.', position: 'left' },
      { target: '[data-tutorial="worksheet-generator-export"]', title: 'Export', description: 'Export the worksheet for sharing/printing.', position: 'left' },
      { target: '[data-tutorial="worksheet-generator-history-toggle"]', title: 'History', description: 'Open saved worksheets to load, edit, or delete.', position: 'left' },
      { target: '[data-tutorial="worksheet-generator-preview-pane"]', title: 'Edit / Preview Pane', description: 'Review content; edit text if needed.', position: 'left' }
    ]
  },

  [TUTORIAL_IDS.IMAGE_STUDIO]: {
    id: TUTORIAL_IDS.IMAGE_STUDIO,
    name: 'Image Studio',
    description: 'Generate and edit images with inpainting',
    steps: [
      { target: '[data-tutorial="image-studio-tab-toggle"]', title: 'Generator vs. Editor', description: 'Switch between generating images and editing uploads.', position: 'top', interactive: true, waitForAction: 'click', actionHint: '👆 Toggle' },
      { target: '[data-tutorial="image-studio-prompt"]', title: 'Prompt', description: 'Describe the image you want to generate.', position: 'right' },
      { target: '[data-tutorial="image-studio-batch"]', title: 'Batch Size', description: 'Control how many images to generate at once.', position: 'right' },
      { target: '[data-tutorial="image-studio-generate"]', title: 'Generate Images', description: 'Start generating images.', position: 'top', interactive: true, waitForAction: 'click', actionHint: '👆 Generate' },
      { target: '[data-tutorial="image-studio-results"]', title: 'Results', description: 'Review generated images; download or save.', position: 'left' },
      { target: '[data-tutorial="image-studio-upload"]', title: 'Upload to Edit', description: 'Upload an image for cleanup or inpainting.', position: 'top', interactive: true, waitForAction: 'click', actionHint: '👆 Upload' },
      { target: '[data-tutorial="image-studio-canvas"]', title: 'Mask & Preview', description: 'Draw masks over areas to remove.', position: 'center' },
      { target: '[data-tutorial="image-studio-brush"]', title: 'Brush Size', description: 'Adjust brush size for masking.', position: 'right' },
      { target: '[data-tutorial="image-studio-remove"]', title: 'Remove Marked Area', description: 'Run inpainting on the masked area.', position: 'top', interactive: true, waitForAction: 'click', actionHint: '👆 Remove' },
      { target: '[data-tutorial="image-studio-undo"]', title: 'Undo / Redo', description: 'Step through your edit history.', position: 'right' },
      { target: '[data-tutorial="image-studio-save-edited"]', title: 'Save Edited Image', description: 'Save the edited image to resources.', position: 'left' }
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
        description: 'View 1 shows Resource Creation Trends over time. View 2 shows Resource Type Distribution in the form of a pie chart.',
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
        description: 'Customize your Assistant to match your preferences and teaching style. Adjust appearance, notifications, and more.',
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
      }
    ]
  },

  [TUTORIAL_IDS.CHAT]: {
    id: TUTORIAL_IDS.CHAT,
    name: 'Ask Assistant',
    description: 'Chat with your Assistant',
    steps: [
      {
        target: '[data-tutorial="chat-welcome"]',
        title: 'Welcome to Ask Assistant',
        description: 'Chat with your Assistant for lesson ideas, curriculum questions, differentiation strategies, and more. Your Assistant understands the OECS curriculum and can help you plan effectively.',
        position: 'center'
      },
      {
        target: '[data-tutorial="chat-new"]',
        title: 'New Conversation',
        description: 'Start a fresh conversation with your Assistant. Each conversation is saved automatically so you can return to it later.',
        position: 'right'
      },
      {
        target: '[data-tutorial="chat-conversations"]',
        title: 'Conversation History',
        description: 'Browse your past conversations. Click any conversation to continue where you left off.',
        position: 'right'
      },
      {
        target: '[data-tutorial="chat-history"]',
        title: 'Chat Messages',
        description: 'Your conversation appears here. Your Assistant provides formatted responses with suggestions, examples, and curriculum-aligned content.',
        position: 'left'
      },
      {
        target: '[data-tutorial="chat-input"]',
        title: 'Type Your Message',
        description: 'Ask your Assistant anything about teaching, lesson planning, or the OECS curriculum. Try questions like "Help me plan a Grade 3 Science lesson on plants" or "What activities work for mixed-ability groups?"',
        position: 'top'
      },
      {
        target: '[data-tutorial="chat-send"]',
        title: 'Send Message',
        description: 'Click send or press Enter to submit your message. Your Assistant will respond with helpful, curriculum-aligned suggestions.',
        position: 'top'
      },
      {
        target: '[data-tutorial="chat-sidebar"]',
        title: 'Chat Sidebar',
        description: 'Toggle the sidebar to manage your conversations, search through history, or start new topics.',
        position: 'left'
      }
    ]
  },

  [TUTORIAL_IDS.CLASS_MANAGEMENT]: {
    id: TUTORIAL_IDS.CLASS_MANAGEMENT,
    name: 'My Classes',
    description: 'Manage students, attendance, and grades',
    steps: [
      {
        target: '[data-tutorial="class-welcome"]',
        title: 'Welcome to My Classes',
        description: 'Manage your students, track attendance, monitor quiz grades, and generate report cards all in one place.',
        position: 'center'
      },
      {
        target: '[data-tutorial="class-sidebar"]',
        title: 'Class Navigation',
        description: 'Browse your students organized by grade and class. Click grade levels to expand and see classes, then click classes to see individual students.',
        position: 'right'
      },
      {
        target: '[data-tutorial="class-search"]',
        title: 'Search Students',
        description: 'Quickly find any student by name. Search works across all grades and classes.',
        position: 'right'
      },
      {
        target: '[data-tutorial="class-add-student"]',
        title: 'Add Student',
        description: 'Click to add a new student. Enter their name, grade, class, date of birth, and contact information.',
        position: 'right'
      },
      {
        target: '[data-tutorial="class-import"]',
        title: 'Import Students',
        description: 'Bulk import students from an Excel (.xlsx) or CSV file. Download the sample template to see the required format. You can also drag and drop files directly!',
        position: 'top'
      },
      {
        target: '[data-tutorial="class-tree"]',
        title: 'Grade & Class Tree',
        description: 'Navigate the tree hierarchy: Grade levels contain classes, classes contain students. Click any level to view details on the right panel.',
        position: 'right'
      },
      {
        target: '[data-tutorial="class-right-panel"]',
        title: 'Detail Panel',
        description: 'This panel shows details for whatever you select: grade overview, class student list with attendance, or individual student profiles with quiz grades.',
        position: 'left'
      },
      {
        target: '[data-tutorial="class-attendance"]',
        title: 'Attendance Tracking',
        description: 'Track daily attendance and engagement levels for each student. Mark students as Present, Absent, Late, or Excused, and rate their engagement level.',
        position: 'left'
      },
      {
        target: '[data-tutorial="class-report-card"]',
        title: 'Report Cards',
        description: 'Generate professional PDF report cards for individual students or an entire class. Reports include quiz grades organized by subject with letter grades and averages.',
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
