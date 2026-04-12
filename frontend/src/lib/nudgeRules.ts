import { NudgeRule } from '../types/feature-disclosure';

export const NUDGE_RULES: NudgeRule[] = [
  // On lesson planner → suggest curriculum tracking
  {
    triggerTabType: 'lesson-planner',
    disabledModule: 'curriculum-resources',
    message: 'Track how your lessons align to OECS standards with the Curriculum Tracker.',
    ctaLabel: 'Enable Curriculum',
    navigateToTab: 'curriculum-tracker',
  },
  // On lesson planner → suggest assessment
  {
    triggerTabType: 'lesson-planner',
    disabledModule: 'assessment-tools',
    message: 'Assess what students learned with the Quiz Builder.',
    ctaLabel: 'Enable Assessments',
    navigateToTab: 'quiz-generator',
  },
  // On class management → suggest grading
  {
    triggerTabType: 'class-management',
    disabledModule: 'assessment-tools',
    message: 'Grade and track performance for your students with quizzes and rubrics.',
    ctaLabel: 'Enable Assessments',
    navigateToTab: 'quiz-generator',
  },
  // On quiz/rubric → suggest student management
  {
    triggerTabType: 'quiz-generator',
    disabledModule: 'student-management',
    message: 'Manage detailed student profiles alongside grades.',
    ctaLabel: 'Enable Classes',
    navigateToTab: 'class-management',
  },
  {
    triggerTabType: 'rubric-generator',
    disabledModule: 'student-management',
    message: 'Manage student profiles to connect rubrics to real students.',
    ctaLabel: 'Enable Classes',
    navigateToTab: 'class-management',
  },
  // On curriculum → suggest lesson planning
  {
    triggerTabType: 'curriculum',
    disabledModule: 'lesson-planning',
    message: 'Turn curriculum topics into lesson plans instantly.',
    ctaLabel: 'Enable Lesson Planning',
    navigateToTab: 'lesson-planner',
  },
  // On any planner → suggest creative studio
  {
    triggerTabType: 'lesson-planner',
    disabledModule: 'creative-studio',
    message: 'Create worksheets and visual aids to accompany your lessons.',
    ctaLabel: 'Enable Creative Studio',
    navigateToTab: 'worksheet-generator',
  },
  // On chat → suggest lesson planning
  {
    triggerTabType: 'chat',
    disabledModule: 'lesson-planning',
    message: 'Your Assistant can help even more with the Lesson Planner enabled.',
    ctaLabel: 'Enable Lesson Planning',
    navigateToTab: 'lesson-planner',
  },
];

/** 24 hours in milliseconds */
export const NUDGE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
