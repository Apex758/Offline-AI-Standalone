// Source of truth for one-click presets across the generator tools.
// Keep this file pure data — no React, no side effects.

// ---------------------------------------------------------------------------
// Duration chips (shared across all planners)
// ---------------------------------------------------------------------------
export const DURATION_CHIPS: number[] = [30, 40, 45, 60, 80];

// ---------------------------------------------------------------------------
// Quiz presets — used by QuizGenerator
// ---------------------------------------------------------------------------
export interface QuizPreset {
  id: string;
  label: string;
  description: string;
  numberOfQuestions: string;
  questionTypes: string[];
  cognitiveLevels: string[];
}

export const QUIZ_PRESETS: QuizPreset[] = [
  {
    id: 'quick-check',
    label: 'Quick Check',
    description: '10 multiple-choice questions, recall focus',
    numberOfQuestions: '10',
    questionTypes: ['Multiple Choice'],
    cognitiveLevels: ['Knowledge', 'Comprehension'],
  },
  {
    id: 'full-test',
    label: 'Full Test',
    description: '25 mixed questions across cognitive levels',
    numberOfQuestions: '25',
    questionTypes: ['Multiple Choice', 'True/False'],
    cognitiveLevels: ['Knowledge', 'Comprehension', 'Application', 'Analysis'],
  },
  {
    id: 'mixed-assessment',
    label: 'Mixed Assessment',
    description: '15 questions, multiple choice + open-ended',
    numberOfQuestions: '15',
    questionTypes: ['Multiple Choice', 'Open-Ended'],
    cognitiveLevels: ['Comprehension', 'Application', 'Analysis'],
  },
  {
    id: 'short-answer',
    label: 'Short Answer Only',
    description: '10 open-ended questions, higher-order thinking',
    numberOfQuestions: '10',
    questionTypes: ['Open-Ended'],
    cognitiveLevels: ['Application', 'Analysis', 'Evaluation'],
  },
];

// ---------------------------------------------------------------------------
// Rubric presets — used by RubricGenerator
// Keys MUST match assignmentTypes options in RubricGenerator.tsx
// focusAreas MUST match values in focusAreasOptions (US spelling: "Organization")
// ---------------------------------------------------------------------------
export interface RubricPreset {
  focusAreas: string[];
  performanceLevels: string;
}

export const RUBRIC_PRESETS: Record<string, RubricPreset> = {
  Essay: {
    focusAreas: ['Content Knowledge', 'Critical Thinking', 'Communication', 'Organization'],
    performanceLevels: '4',
  },
  Presentation: {
    focusAreas: ['Communication', 'Presentation Skills', 'Creativity', 'Organization'],
    performanceLevels: '4',
  },
  Project: {
    focusAreas: ['Content Knowledge', 'Research Skills', 'Collaboration', 'Problem Solving'],
    performanceLevels: '4',
  },
  'Lab Report': {
    focusAreas: ['Content Knowledge', 'Technical Skills', 'Critical Thinking', 'Organization'],
    performanceLevels: '4',
  },
  'Group Work': {
    focusAreas: ['Collaboration', 'Communication', 'Problem Solving', 'Creativity'],
    performanceLevels: '3',
  },
  'Creative Writing': {
    focusAreas: ['Creativity', 'Communication', 'Organization', 'Content Knowledge'],
    performanceLevels: '4',
  },
  Portfolio: {
    focusAreas: ['Creativity', 'Organization', 'Research Skills', 'Content Knowledge'],
    performanceLevels: '4',
  },
};

// ---------------------------------------------------------------------------
// Quiz settings persistence (last-used)
// ---------------------------------------------------------------------------
export const QUIZ_LAST_SETTINGS_KEY = 'quiz_last_settings';

export interface QuizLastSettings {
  questionTypes: string[];
  cognitiveLevels: string[];
  numberOfQuestions: string;
  timeLimitPerQuestion: string;
}

export function loadQuizLastSettings(): QuizLastSettings | null {
  try {
    const raw = localStorage.getItem(QUIZ_LAST_SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.questionTypes) &&
      Array.isArray(parsed.cognitiveLevels) &&
      typeof parsed.numberOfQuestions === 'string' &&
      typeof parsed.timeLimitPerQuestion === 'string'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveQuizLastSettings(settings: QuizLastSettings): void {
  try {
    localStorage.setItem(QUIZ_LAST_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore quota / privacy errors
  }
}
