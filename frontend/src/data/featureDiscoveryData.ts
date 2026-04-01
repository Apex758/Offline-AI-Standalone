// Feature Discovery Data - Comprehensive catalog of all app features
// Used by the Feature Discovery section in Settings

export type FeatureCategory = 'core' | 'planning' | 'creation' | 'visual' | 'writing' | 'navigation' | 'system';

export type DetectionStrategy =
  | { type: 'tutorial'; tutorialId: string }
  | { type: 'toolUsage'; toolType: string }
  | { type: 'setting'; key: string }
  | { type: 'manual' }
  | { type: 'composite'; strategies: DetectionStrategy[] };

export interface DiscoverableFeature {
  id: string;
  name: string;
  category: FeatureCategory;
  description: string;
  howToUse: string[];
  toolType?: string;       // Opens this tool tab via "Go to Feature"
  settingsSection?: string; // Navigates to this settings section
  detectionStrategy: DetectionStrategy;
}

export const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  core: 'Core Tools',
  planning: 'Lesson Planning',
  creation: 'Creation Tools',
  visual: 'Visual Studio',
  writing: 'Writing Assistant',
  navigation: 'Navigation',
  system: 'System & Settings',
};

export const FEATURE_CATALOG: DiscoverableFeature[] = [
  // ─── Core Tools ───────────────────────────────────────────────
  {
    id: 'tool-analytics',
    name: 'My Overview',
    category: 'core',
    description: 'Your teaching analytics dashboard showing activity trends, resource distribution, quick stats, and recent activity across all tools.',
    howToUse: [
      'Click "My Overview" in the sidebar (always pinned at the top)',
      'View your quick stats: total resources, active days, and completion rate',
      'Check the activity feed for recent actions across all tools',
      'Use the quick-access cards to jump to frequently used tools',
    ],
    toolType: 'analytics',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'analytics-dashboard' },
        { type: 'toolUsage', toolType: 'analytics' },
      ],
    },
  },
  {
    id: 'tool-brain-dump',
    name: 'Brain Dump',
    category: 'core',
    description: 'Capture your thoughts, ideas, and notes quickly, then let AI help you convert them into actionable lesson plans, quizzes, or other teaching materials.',
    howToUse: [
      'Click "Brain Dump" in the sidebar',
      'Type or paste your raw thoughts, ideas, or notes',
      'Use the AI conversion tools to transform your notes into structured content',
      'Export your organized thoughts to other tools like Lesson Planner or Quiz Builder',
    ],
    toolType: 'brain-dump',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'toolUsage', toolType: 'brain-dump' },
      ],
    },
  },
  {
    id: 'tool-curriculum-tracker',
    name: 'Progress Tracker',
    category: 'core',
    description: 'Monitor your curriculum coverage with an interactive tree view. Track which standards you\'ve taught, set milestones, and identify gaps in your coverage.',
    howToUse: [
      'Click "Progress Tracker" in the sidebar',
      'Browse the curriculum tree by subject and grade level',
      'Click on standards to mark them as taught, in-progress, or planned',
      'Add notes and milestones to track your teaching journey',
      'Use filters to focus on specific subjects or completion status',
    ],
    toolType: 'curriculum-tracker',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'curriculum-tracker' },
        { type: 'toolUsage', toolType: 'curriculum-tracker' },
      ],
    },
  },
  {
    id: 'tool-resource-manager',
    name: 'My Resources',
    category: 'core',
    description: 'Your central hub for managing all saved lesson plans, quizzes, rubrics, worksheets, and other teaching materials. Search, filter, sort, and organize everything in one place.',
    howToUse: [
      'Click "My Resources" in the sidebar',
      'Use the search bar to find resources by keyword or topic',
      'Filter by resource type (lesson plans, quizzes, rubrics, etc.)',
      'Sort by date, title, or type',
      'Click any resource card to view, edit, or export it',
    ],
    toolType: 'resource-manager',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'resource-manager' },
        { type: 'toolUsage', toolType: 'resource-manager' },
      ],
    },
  },
  {
    id: 'tool-chat',
    name: 'Ask PEARL',
    category: 'core',
    description: 'Chat with PEARL, your AI teaching assistant. Get help with lesson ideas, curriculum questions, differentiation strategies, and more through natural conversation.',
    howToUse: [
      'Click "Ask PEARL" in the sidebar',
      'Type your question or request in the chat input',
      'PEARL can help with lesson ideas, explain curriculum standards, suggest activities, and more',
      'Your conversation history is saved so you can continue previous chats',
    ],
    toolType: 'chat',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'chat' },
        { type: 'toolUsage', toolType: 'chat' },
      ],
    },
  },
  {
    id: 'tool-curriculum',
    name: 'Curriculum Browser',
    category: 'core',
    description: 'Browse the complete OECS curriculum standards organized by subject, grade level, and strand. Find specific learning outcomes to align your teaching materials.',
    howToUse: [
      'Click "Curriculum Browser" in the sidebar',
      'Select a subject area and grade level',
      'Browse through strands, standards, and learning outcomes',
      'Click on any standard to see its full details',
      'Use the search to find specific topics across the curriculum',
    ],
    toolType: 'curriculum',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'curriculum-viewer' },
        { type: 'toolUsage', toolType: 'curriculum' },
      ],
    },
  },

  // ─── Lesson Planning ─────────────────────────────────────────
  {
    id: 'tool-lesson-planner',
    name: 'Lesson Plan',
    category: 'planning',
    description: 'Create comprehensive, curriculum-aligned lesson plans with AI assistance. Generate objectives, activities, assessments, and differentiation strategies.',
    howToUse: [
      'Click "Lesson Plan" under Lesson Planners in the sidebar',
      'Select your subject, grade level, and topic',
      'Choose curriculum standards to align with',
      'Configure options like duration, teaching strategies, and assessment types',
      'Click "Generate" and watch your lesson plan come to life',
      'Edit, save, or export the generated plan',
    ],
    toolType: 'lesson-planner',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'lesson-planner' },
        { type: 'toolUsage', toolType: 'lesson-planner' },
      ],
    },
  },
  {
    id: 'tool-kindergarten-planner',
    name: 'Early Childhood',
    category: 'planning',
    description: 'Specialized lesson planner for pre-K and early childhood education. Focuses on play-based learning, developmental milestones, and age-appropriate activities.',
    howToUse: [
      'Click "Early Childhood" under Lesson Planners in the sidebar',
      'Select the developmental area and age group',
      'Choose learning themes and activity types',
      'Generate play-based, age-appropriate lesson plans',
      'Plans include sensory activities, group time, and assessment notes',
    ],
    toolType: 'kindergarten-planner',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'kindergarten-planner' },
        { type: 'toolUsage', toolType: 'kindergarten-planner' },
      ],
    },
  },
  {
    id: 'tool-multigrade-planner',
    name: 'Multi-Level',
    category: 'planning',
    description: 'Create lesson plans that span multiple grade levels simultaneously. Perfect for multi-grade classrooms with differentiated activities for each level.',
    howToUse: [
      'Click "Multi-Level" under Lesson Planners in the sidebar',
      'Select the grade levels you want to plan for',
      'Choose a shared topic or theme',
      'The AI generates differentiated activities for each grade level',
      'Each level gets appropriate objectives and assessments',
    ],
    toolType: 'multigrade-planner',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'multigrade-planner' },
        { type: 'toolUsage', toolType: 'multigrade-planner' },
      ],
    },
  },
  {
    id: 'tool-cross-curricular-planner',
    name: 'Integrated Lesson',
    category: 'planning',
    description: 'Design cross-curricular lesson plans that integrate multiple subjects around a central theme. Connect Math, Science, Language Arts, and more in one cohesive lesson.',
    howToUse: [
      'Click "Integrated Lesson" under Lesson Planners in the sidebar',
      'Select the subjects you want to integrate',
      'Choose a unifying theme or topic',
      'The AI weaves standards from each subject into a single plan',
      'Activities naturally connect concepts across disciplines',
    ],
    toolType: 'cross-curricular-planner',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'cross-curricular-planner' },
        { type: 'toolUsage', toolType: 'cross-curricular-planner' },
      ],
    },
  },

  // ─── Creation Tools ──────────────────────────────────────────
  {
    id: 'tool-quiz-generator',
    name: 'Quiz Builder',
    category: 'creation',
    description: 'Generate curriculum-aligned quizzes with multiple question types including multiple choice, true/false, short answer, and more. Perfect for assessments and practice.',
    howToUse: [
      'Click "Quiz Builder" under Tools in the sidebar',
      'Select your subject, grade level, and topic',
      'Choose question types and difficulty level',
      'Optionally align to specific curriculum standards',
      'Click "Generate" to create your quiz',
      'Edit individual questions, reorder, or add your own',
      'Save or export as a printable document',
    ],
    toolType: 'quiz-generator',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'quiz-generator' },
        { type: 'toolUsage', toolType: 'quiz-generator' },
      ],
    },
  },
  {
    id: 'tool-rubric-generator',
    name: 'Rubric Builder',
    category: 'creation',
    description: 'Create detailed grading rubrics with customizable criteria, performance levels, and descriptions. Ensure consistent and transparent assessment of student work.',
    howToUse: [
      'Click "Rubric Builder" under Tools in the sidebar',
      'Describe the assignment or task to be assessed',
      'Select the number of performance levels (e.g., 4-point scale)',
      'The AI generates criteria with detailed descriptors for each level',
      'Edit criteria, adjust point values, and customize as needed',
      'Save or export your rubric',
    ],
    toolType: 'rubric-generator',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'rubric-generator' },
        { type: 'toolUsage', toolType: 'rubric-generator' },
      ],
    },
  },
  {
    id: 'tool-class-management',
    name: 'My Classes',
    category: 'creation',
    description: 'Manage your students, classes, and quiz grades in one place. Create class rosters, track student performance, and organize your teaching groups.',
    howToUse: [
      'Click "My Classes" under Tools in the sidebar',
      'Create a new class with name and grade level',
      'Add students to your class roster',
      'View and manage quiz grades for each student',
      'Track student performance over time',
    ],
    toolType: 'class-management',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'class-management' },
        { type: 'toolUsage', toolType: 'class-management' },
      ],
    },
  },

  // ─── Visual Studio ───────────────────────────────────────────
  {
    id: 'tool-worksheet-generator',
    name: 'Worksheet Builder',
    category: 'visual',
    description: 'Create printable student worksheets with various activity types. Generate fill-in-the-blank, matching, word searches, and more — all aligned to your curriculum.',
    howToUse: [
      'Enable "Visual Studio" in Settings > Features > Sidebar Tools',
      'Click "Worksheet Builder" under Visual Studio in the sidebar',
      'Select the worksheet type and subject',
      'Configure activity options and difficulty',
      'Generate and preview your worksheet',
      'Print or export as PDF',
    ],
    toolType: 'worksheet-generator',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'worksheet-generator' },
        { type: 'toolUsage', toolType: 'worksheet-generator' },
      ],
    },
  },
  {
    id: 'tool-image-studio',
    name: 'Image Studio',
    category: 'visual',
    description: 'Generate and edit classroom visuals using AI image generation. Create illustrations, diagrams, flashcards, and educational graphics for your lessons.',
    howToUse: [
      'Enable "Visual Studio" in Settings > Features > Sidebar Tools',
      'Click "Image Studio" under Visual Studio in the sidebar',
      'Describe the image you want to generate',
      'Choose style options and aspect ratio',
      'Generate your image and make edits as needed',
      'Save or download for use in your materials',
    ],
    toolType: 'image-studio',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'tutorial', tutorialId: 'image-studio' },
        { type: 'toolUsage', toolType: 'image-studio' },
      ],
    },
  },
  {
    id: 'tool-presentation-builder',
    name: 'Slide Deck',
    category: 'visual',
    description: 'Create presentations from your lesson plans. AI generates slide content with key points, visuals, and speaker notes — ready for the classroom.',
    howToUse: [
      'Enable "Visual Studio" in Settings > Features > Sidebar Tools',
      'Click "Slide Deck" under Visual Studio in the sidebar',
      'Select a saved lesson plan or enter a topic',
      'Choose the number of slides and style',
      'Generate your presentation',
      'Edit slides, reorder, and export',
    ],
    toolType: 'presentation-builder',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'toolUsage', toolType: 'presentation-builder' },
      ],
    },
  },

  {
    id: 'tool-storybook',
    name: 'Storybook Creator',
    category: 'visual',
    description: 'Create illustrated K-2 storybooks with multi-voice TTS narration, curriculum-aligned content, and animated playback. Export as PDF, PPTX, or a self-contained HTML ebook.',
    howToUse: [
      'Enable "Visual Studio" in Settings > Features > Sidebar Tools',
      'Click "Storybook Creator" under Visual Studio in the sidebar',
      'Enter a title and describe the story (or use the microphone)',
      'Pick a grade level (K–2), subject, and optionally align to curriculum',
      'Choose image mode and set up narrator/character voices',
      'Generate — the AI writes the story and comprehension questions',
      'Edit pages, assign background scenes, upload character images',
      'Press Play to preview with animated narration, then export',
    ],
    toolType: 'storybook',
    detectionStrategy: {
      type: 'composite',
      strategies: [
        { type: 'toolUsage', toolType: 'storybook' },
      ],
    },
  },

  // ─── Writing Assistant ───────────────────────────────────────
  {
    id: 'sub-spell-check',
    name: 'Spell Check',
    category: 'writing',
    description: 'Highlights misspelled words with a red underline as you type across all text editors in the app. Works in lesson plans, quizzes, rubrics, and more.',
    howToUse: [
      'Go to Settings > Features > Writing Assistant',
      'Toggle "Spell Check" on',
      'Misspelled words will be underlined in red as you type',
      'Works across all text input fields in the app',
    ],
    settingsSection: 'features',
    detectionStrategy: { type: 'setting', key: 'spellCheckEnabled' },
  },
  {
    id: 'sub-dictionary',
    name: 'Dictionary Suggestions',
    category: 'writing',
    description: 'Click on misspelled words to see a popup with spelling suggestions. Select the correct word to replace the misspelling instantly.',
    howToUse: [
      'Go to Settings > Features > Writing Assistant',
      'Make sure both "Spell Check" and "Dictionary Suggestions" are enabled',
      'When you see a red-underlined word, click on it',
      'A popup will show suggested corrections',
      'Click a suggestion to replace the word',
    ],
    settingsSection: 'features',
    detectionStrategy: { type: 'setting', key: 'dictionaryEnabled' },
  },
  {
    id: 'sub-autocorrect',
    name: 'Autocorrect',
    category: 'writing',
    description: 'Automatically fixes common spelling mistakes as you type. Saves time by correcting typos without manual intervention.',
    howToUse: [
      'Go to Settings > Features > Writing Assistant',
      'Toggle "Autocorrect" on',
      'Common misspellings will be automatically corrected as you type',
      'Works silently in the background across all text fields',
    ],
    settingsSection: 'features',
    detectionStrategy: { type: 'setting', key: 'autocorrectEnabled' },
  },
  {
    id: 'sub-auto-finish',
    name: 'Auto-Finish Sentence',
    category: 'writing',
    description: 'AI suggests completions as you type, helping you finish sentences faster. Press Tab to accept a suggestion or keep typing to ignore it.',
    howToUse: [
      'Go to Settings > Features > Writing Assistant',
      'Toggle "Auto-Finish Sentence" on',
      'As you type, ghost text will appear suggesting how to complete your sentence',
      'Press Tab to accept the suggestion',
      'Keep typing to ignore it',
      'Note: Requires an active AI model to work',
    ],
    settingsSection: 'features',
    detectionStrategy: { type: 'setting', key: 'autoFinishEnabled' },
  },

  // ─── Navigation Features ─────────────────────────────────────
  {
    id: 'sub-command-palette',
    name: 'Command Palette',
    category: 'navigation',
    description: 'Quick-access search to jump to any tool, setting, or action in the app. Press Ctrl+K to open and start typing to find what you need instantly.',
    howToUse: [
      'Press Ctrl+K (or Cmd+K on Mac) anywhere in the app',
      'Start typing the name of a tool, setting, or action',
      'Use arrow keys to navigate results',
      'Press Enter to open the selected item',
      'The palette searches across all tools and settings sections',
    ],
    detectionStrategy: { type: 'manual' },
  },
  {
    id: 'sub-split-view',
    name: 'Split View',
    category: 'navigation',
    description: 'View two tools side by side for multitasking. Perfect for referencing a curriculum standard while writing a lesson plan, or comparing resources.',
    howToUse: [
      'Open at least two tool tabs',
      'Right-click on a tab in the tab bar',
      'Select "Split View" from the context menu',
      'The screen splits to show two tabs side by side',
      'Click on either side to interact with that tool',
      'Right-click a tab again to exit split view',
    ],
    detectionStrategy: { type: 'manual' },
  },
  {
    id: 'sub-tab-reorder',
    name: 'Tab Drag & Reorder',
    category: 'navigation',
    description: 'Drag tabs in the tab bar to rearrange them in your preferred order. Keep your most-used tools easily accessible.',
    howToUse: [
      'Open multiple tool tabs',
      'Click and hold on a tab in the tab bar',
      'Drag the tab left or right to reposition it',
      'Release to drop it in the new position',
      'Your tab order is maintained during the session',
    ],
    detectionStrategy: { type: 'manual' },
  },

  // ─── System & Settings ───────────────────────────────────────
  {
    id: 'sub-profile-setup',
    name: 'Profile Setup',
    category: 'system',
    description: 'Set up your teacher profile with your name, school, grade levels, and subjects. This helps the app personalize content and filter curriculum standards for you.',
    howToUse: [
      'Go to Settings > Profile',
      'Enter your display name and school',
      'Select your grade levels and subjects',
      'Optionally upload a profile photo',
      'Your profile is used across the app for personalization',
    ],
    settingsSection: 'profile',
    detectionStrategy: { type: 'setting', key: 'profile.displayName' },
  },
  {
    id: 'sub-theme-customization',
    name: 'Theme & Appearance',
    category: 'system',
    description: 'Customize the app\'s look with light, dark, or system-matched themes. Adjust font size, tab colors, and sidebar colors to match your preference.',
    howToUse: [
      'Go to Settings > Appearance',
      'Choose between Light, Dark, or System theme',
      'Adjust the font size slider for comfortable reading',
      'Customize individual tab colors or use color presets',
      'Change the sidebar color to your preference',
    ],
    settingsSection: 'appearance',
    detectionStrategy: { type: 'manual' },
  },
  {
    id: 'sub-export-data',
    name: 'Export & Backup Data',
    category: 'system',
    description: 'Export all your data including lesson plans, quizzes, rubrics, student records, and settings. Create backups to protect your work or transfer to another device.',
    howToUse: [
      'Go to Settings > Danger Zone',
      'Click "Export Data"',
      'Select the categories you want to export',
      'Choose a save location for the backup file',
      'Your data is saved as a portable file you can import later',
    ],
    settingsSection: 'danger',
    detectionStrategy: { type: 'manual' },
  },
  {
    id: 'sub-import-data',
    name: 'Import Data',
    category: 'system',
    description: 'Import previously exported data back into the app. Restore from a backup or transfer data from another device.',
    howToUse: [
      'Go to Settings > Danger Zone',
      'Click "Import Data"',
      'Select your backup file',
      'Choose which categories to import',
      'Your data will be restored into the app',
    ],
    settingsSection: 'danger',
    detectionStrategy: { type: 'manual' },
  },
  {
    id: 'sub-sidebar-customization',
    name: 'Sidebar Customization',
    category: 'system',
    description: 'Reorder and show/hide tools in the sidebar. Enable optional features like Visual Studio and Performance Metrics, and arrange tools in your preferred order.',
    howToUse: [
      'Go to Settings > Features > Sidebar Tools',
      'Toggle tools on or off with the visibility switches',
      'Drag tools up or down to reorder them',
      'Enable "Visual Studio" to access Worksheet Builder, Image Studio, and Slide Deck',
      'Enable "Performance Metrics" for model benchmarking',
    ],
    settingsSection: 'features',
    detectionStrategy: { type: 'manual' },
  },
  {
    id: 'sub-generation-queue',
    name: 'Generation Queue',
    category: 'system',
    description: 'Control how AI generations are processed — either one at a time (queued) or all at once (simultaneous). Monitor active generations in the queue panel.',
    howToUse: [
      'Go to Settings > General',
      'Choose between "Queued" or "Simultaneous" generation mode',
      'Queued mode processes one generation at a time (more stable)',
      'Simultaneous mode runs multiple generations in parallel (faster)',
      'Monitor active generations via the queue indicator in the toolbar',
    ],
    settingsSection: 'general',
    detectionStrategy: { type: 'manual' },
  },
];
