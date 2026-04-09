import { FeatureModuleId } from '../types/feature-disclosure';

export interface ToolStep {
  type: string;
  name: string;
  reason: string;
}

/**
 * Each module maps to an ordered sequence of its tools,
 * in the order that makes pedagogical sense within that module.
 */
const MODULE_PROGRESSIONS: Record<FeatureModuleId, ToolStep[]> = {
  'ai-assistant': [
    { type: 'chat', name: 'Ask PEARL', reason: 'Your AI teaching assistant -- ask for ideas, lesson outlines, or help with anything.' },
    { type: 'brain-dump', name: 'Brain Dump', reason: 'Dump your thoughts and let AI turn them into structured plans.' },
  ],
  'curriculum-resources': [
    { type: 'curriculum', name: 'Curriculum Browser', reason: 'Browse OECS standards to see what you need to teach.' },
    { type: 'school-year-calendar', name: 'School Year', reason: 'Map your curriculum to your academic calendar.' },
    { type: 'resource-manager', name: 'My Resources', reason: 'Save and organize teaching materials in one place.' },
    { type: 'curriculum-tracker', name: 'Progress Tracker', reason: 'Track which standards and topics you have covered.' },
  ],
  'lesson-planning': [
    { type: 'lesson-planner', name: 'Lesson Plan', reason: 'Create your first lesson plan aligned to curriculum standards.' },
    { type: 'kindergarten-planner', name: 'Early Childhood', reason: 'Specialized planner for early childhood education.' },
    { type: 'multigrade-planner', name: 'Multi-Level', reason: 'Plan lessons that serve multiple grade levels at once.' },
    { type: 'cross-curricular-planner', name: 'Integrated Lesson', reason: 'Create lessons that integrate multiple subjects.' },
  ],
  'assessment-tools': [
    { type: 'quiz-generator', name: 'Quiz Builder', reason: 'Build quizzes aligned to what you just taught.' },
    { type: 'rubric-generator', name: 'Rubric Builder', reason: 'Define clear grading criteria for assignments.' },
  ],
  'student-management': [
    { type: 'class-management', name: 'My Classes', reason: 'Set up your classes and student lists.' },
    { type: 'school-year-calendar', name: 'School Year', reason: 'Manage your calendar, curriculum plan, and timetable.' },
    { type: 'achievements', name: 'Achievements', reason: 'Track your teaching milestones and earn rewards.' },
  ],
  'creative-studio': [
    { type: 'worksheet-generator', name: 'Worksheet Builder', reason: 'Create printable worksheets for your students.' },
    { type: 'presentation-builder', name: 'Slide Deck', reason: 'Build slide decks from your lesson plans.' },
    { type: 'image-studio', name: 'Image Studio', reason: 'Generate classroom visuals and illustrations.' },
    { type: 'storybook', name: 'Storybook Creator', reason: 'Create illustrated stories for younger learners.' },
  ],
};

/**
 * Priority order for modules in the progression.
 * Mirrors the pedagogical flow: know what to teach -> brainstorm -> create -> assess -> manage -> enrich
 */
const MODULE_PRIORITY: FeatureModuleId[] = [
  'curriculum-resources',
  'ai-assistant',
  'lesson-planning',
  'assessment-tools',
  'student-management',
  'creative-studio',
];

/**
 * Builds the full personalized progression sequence based on the teacher's enabled modules.
 *
 * 1. Always starts with My Overview (analytics)
 * 2. Walks enabled modules in priority order, appending their tools
 * 3. Skips tools already added (handles modules that share tools)
 * 4. Ends with Educator Insights (always available)
 */
export function buildProgressionSequence(enabledModules: FeatureModuleId[]): ToolStep[] {
  const sequence: ToolStep[] = [];
  const addedTypes = new Set<string>();

  // Always start with My Overview
  sequence.push({
    type: 'analytics',
    name: 'My Overview',
    reason: 'Your home base -- see teaching stats, quick actions, and what is coming up.',
  });
  addedTypes.add('analytics');

  // Walk modules in priority order, only including enabled ones
  for (const moduleId of MODULE_PRIORITY) {
    if (!enabledModules.includes(moduleId)) continue;
    const steps = MODULE_PROGRESSIONS[moduleId];
    if (!steps) continue;

    for (const step of steps) {
      if (addedTypes.has(step.type)) continue;
      sequence.push(step);
      addedTypes.add(step.type);
    }
  }

  // Always end with Educator Insights
  if (!addedTypes.has('educator-insights')) {
    sequence.push({
      type: 'educator-insights',
      name: 'Educator Insights',
      reason: 'AI-powered analysis of your teaching patterns and personalized recommendations.',
    });
  }

  return sequence;
}

/**
 * Returns the next suggested tool the teacher hasn't visited yet,
 * or null if they've visited everything in their progression.
 */
export function getNextSuggestion(
  enabledModules: FeatureModuleId[],
  visitedTools: string[],
  dismissedProgressions: string[],
): ToolStep | null {
  const sequence = buildProgressionSequence(enabledModules);
  const visited = new Set(visitedTools);
  const dismissed = new Set(dismissedProgressions);

  for (const step of sequence) {
    if (!visited.has(step.type) && !dismissed.has(step.type)) {
      return step;
    }
  }

  return null;
}

/**
 * Returns the step number (1-indexed) for a given tool type in the progression,
 * or null if it's not in the sequence.
 */
export function getStepNumber(
  enabledModules: FeatureModuleId[],
  toolType: string,
): number | null {
  const sequence = buildProgressionSequence(enabledModules);
  const index = sequence.findIndex(s => s.type === toolType);
  return index >= 0 ? index + 1 : null;
}

/**
 * Returns the total number of steps in the teacher's progression.
 */
export function getTotalSteps(enabledModules: FeatureModuleId[]): number {
  return buildProgressionSequence(enabledModules).length;
}
