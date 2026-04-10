import { FeatureModule, FeatureModuleId, PersonaPreset } from '../types/feature-disclosure';

export const FEATURE_MODULES: FeatureModule[] = [
  {
    id: 'lesson-planning',
    name: 'Lesson Planning',
    description: 'Create lesson plans for any grade level — standard, early childhood, multi-level, and integrated.',
    icon: 'BookMarked',
    sidebarItems: ['lesson-planners'],
    tools: ['Lesson Plan', 'Early Childhood', 'Multi-Level', 'Integrated Lesson'],
  },
  {
    id: 'curriculum-resources',
    name: 'Curriculum & Resources',
    description: 'Browse the OECS curriculum, track progress, and manage your saved resources.',
    icon: 'Search',
    sidebarItems: ['curriculum', 'my-classroom', 'planning-prep'],
    tools: ['Curriculum Browser', 'Progress Tracker', 'My Resources', 'School Year'],
  },
  {
    id: 'assessment-tools',
    name: 'Assessment & Grading',
    description: 'Build quizzes and rubrics aligned to curriculum standards.',
    icon: 'PenTool',
    sidebarItems: ['assessment-tools'],
    tools: ['Quiz Builder', 'Rubric Builder'],
  },
  {
    id: 'student-management',
    name: 'Student Management',
    description: 'Manage classes, student profiles, and track quiz grades.',
    icon: 'UsersRound',
    sidebarItems: ['my-classroom'],
    tools: ['My Classes', 'Curriculum Plan', 'Achievements'],
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant & Tools',
    description: 'Chat with your Coworker for ideas, and use Brain Dump to turn thoughts into actions.',
    icon: 'Brain',
    sidebarItems: ['chat', 'planning-prep'],
    tools: ['Ask Coworker', 'Brain Dump'],
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    description: 'Build worksheets, generate images, and create slide decks for your classroom.',
    icon: 'Palette',
    sidebarItems: ['visual-studio'],
    tools: ['Worksheet Builder', 'Image Studio', 'Slide Deck', 'Storybook Creator'],
  },
];

export const PERSONA_PRESETS: PersonaPreset[] = [
  {
    id: 'lesson-focus',
    label: 'I just want to plan lessons',
    description: 'Lesson planners + AI assistant',
    modules: ['lesson-planning', 'ai-assistant'],
  },
  {
    id: 'full-classroom',
    label: 'Full classroom management',
    description: 'Lessons, students, assessments & AI',
    modules: ['lesson-planning', 'student-management', 'assessment-tools', 'ai-assistant'],
  },
  {
    id: 'curriculum-specialist',
    label: 'Curriculum specialist',
    description: 'Lessons, curriculum & resources',
    modules: ['lesson-planning', 'curriculum-resources', 'ai-assistant'],
  },
  {
    id: 'everything',
    label: 'Give me everything',
    description: 'All features enabled',
    modules: ['lesson-planning', 'curriculum-resources', 'assessment-tools', 'student-management', 'ai-assistant', 'creative-studio'],
  },
];

/** Get all sidebar item IDs that should be enabled for the given modules */
export function getEnabledSidebarItems(enabledModules: FeatureModuleId[]): Set<string> {
  const items = new Set<string>();
  for (const mod of FEATURE_MODULES) {
    if (enabledModules.includes(mod.id)) {
      for (const item of mod.sidebarItems) {
        items.add(item);
      }
    }
  }
  // Always keep these enabled (not gated by modules)
  items.add('educator-insights');
  return items;
}

/** Get which module a sidebar item belongs to */
export function getModuleForSidebarItem(sidebarItemId: string): FeatureModuleId | null {
  for (const mod of FEATURE_MODULES) {
    if (mod.sidebarItems.includes(sidebarItemId)) {
      return mod.id;
    }
  }
  return null;
}

/** Get which module a tab type belongs to (checking group membership too) */
export function getModuleForTabType(tabType: string): FeatureModuleId | null {
  // Tab types that map directly to sidebar items
  const TAB_TO_SIDEBAR: Record<string, string> = {
    'lesson-planner': 'lesson-planners',
    'kindergarten-planner': 'lesson-planners',
    'multigrade-planner': 'lesson-planners',
    'cross-curricular-planner': 'lesson-planners',
    'worksheet-generator': 'visual-studio',
    'image-studio': 'visual-studio',
    'presentation-builder': 'visual-studio',
    'storybook': 'visual-studio',
    'quiz-generator': 'assessment-tools',
    'rubric-generator': 'assessment-tools',
    'class-management': 'my-classroom',
    'curriculum-tracker': 'my-classroom',
    'achievements': 'my-classroom',
    'curriculum': 'curriculum',
    'resource-manager': 'planning-prep',
    'brain-dump': 'planning-prep',
    'chat': 'chat',
  };
  const sidebarId = TAB_TO_SIDEBAR[tabType];
  if (!sidebarId) return null;
  return getModuleForSidebarItem(sidebarId);
}
