// Shared type + API for class-level configuration.
// These fields are stored once per class and auto-filled into every generator.
//
// All fields are optional — a class only needs to set what's relevant.

export interface ClassConfig {
  // Curriculum / subject
  subject?: string;
  strand?: string;
  essentialOutcomes?: string;
  specificOutcomes?: string;

  // Composition
  studentCount?: number;
  studentsWithDisabilitiesCount?: number;

  // Learner profile / pedagogy
  learningStyles?: string[];
  learningPreferences?: string[];
  multipleIntelligences?: string[];
  pedagogicalStrategies?: string[];
  customLearningStyles?: string;

  // Special needs & accommodations
  hasSpecialNeeds?: boolean;
  specialNeedsDetails?: string;
  culturallyResponsiveNotes?: string;
  hasELLStudents?: boolean;
  ellPercentage?: number;
  hasAdvancedLearners?: boolean;
  behaviorSupportFocus?: string;

  // Reading & language
  readingLevel?: string;
  primaryLanguage?: string;
  bilingualProgram?: string;

  // Assessment preferences
  preferredAssessmentFormat?: string;
  performanceLevels?: string;
  includePointValues?: boolean;
  gradingFocusAreas?: string[];
  defaultQuestionTypes?: string[];
  defaultCognitiveLevels?: string[];
  defaultTimeLimitPerQuestion?: number;

  // Materials & resources
  availableMaterials?: string;
  prerequisiteSkills?: string;

  // Duration / pacing
  classPeriodDuration?: string;

  // General
  additionalInstructions?: string;
}

export interface ClassSummary {
  class_name: string;
  grade_level?: string;
  student_count?: number;
  config?: ClassConfig;
}

const API_BASE = 'http://localhost:8000';

export async function fetchClasses(): Promise<ClassSummary[]> {
  const res = await fetch(`${API_BASE}/api/classes`);
  if (!res.ok) throw new Error('Failed to fetch classes');
  return res.json();
}

export async function fetchClassConfig(
  className: string,
  gradeLevel?: string
): Promise<ClassConfig> {
  const params = new URLSearchParams({ class_name: className });
  if (gradeLevel) params.set('grade_level', gradeLevel);
  const res = await fetch(`${API_BASE}/api/classes/config?${params.toString()}`);
  if (!res.ok) return {};
  const data = await res.json();
  return (data?.config as ClassConfig) || {};
}

export async function saveClassConfig(
  className: string,
  gradeLevel: string | undefined,
  config: ClassConfig
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/classes/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      class_name: className,
      grade_level: gradeLevel || null,
      config,
    }),
  });
  if (!res.ok) throw new Error('Failed to save class config');
}

/**
 * Merge a class config with per-generation overrides.
 * Overrides (non-empty values) always win. Empty strings / undefined / empty arrays
 * in `overrides` fall through to the class value.
 */
export function mergeClassConfig<T extends Record<string, any>>(
  classConfig: ClassConfig | undefined,
  overrides: T
): T & ClassConfig {
  const base: Record<string, any> = { ...(classConfig || {}) };
  for (const [k, v] of Object.entries(overrides)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && v.trim() === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    base[k] = v;
  }
  return base as T & ClassConfig;
}
