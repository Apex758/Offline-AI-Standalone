// Shared helper for auto-filling generator form data from a ClassConfig.
//
// Each generator declares a field map (its FormData key -> ClassConfig key,
// with an optional transform) and calls `applyClassDefaults(prev, cfg, map)`
// to merge defaults without clobbering values the user has already entered.
//
// Precedence rules (per field):
//   - Arrays:   keep current if non-empty, else use incoming
//   - Booleans: OR (current || incoming)
//   - Strings:  keep current if non-empty/trimmed, else use incoming
//   - Other:    current ?? incoming
//
// This replaces the near-identical `applyClassConfig` functions that used to
// live inside each generator component.

import type { ClassConfig } from './classConfig';

export type FieldMapEntry = {
  from: keyof ClassConfig;
  transform?: (value: any) => any;
  /** Human-readable label shown in the ClassDefaultsBanner summary. */
  label?: string;
};

export type FieldMap<T> = Partial<Record<keyof T, FieldMapEntry>>;

/**
 * Given a FieldMap and a ClassConfig, return the list of human-readable
 * labels for fields that would actually be auto-filled (i.e. the ClassConfig
 * has a non-empty value for that field). Used by the banner summary.
 */
export function listFilledLabels<T>(
  cfg: ClassConfig | undefined | null,
  map: FieldMap<T>
): string[] {
  if (!cfg) return [];
  const out: string[] = [];
  for (const formKeyStr of Object.keys(map)) {
    const entry = map[formKeyStr as keyof T];
    if (!entry) continue;
    const raw = (cfg as any)[entry.from];
    if (raw == null) continue;
    if (typeof raw === 'string' && raw.trim() === '') continue;
    if (Array.isArray(raw) && raw.length === 0) continue;
    if (typeof raw === 'boolean' && !raw) continue;
    out.push(entry.label || String(formKeyStr));
  }
  return out;
}

// Common transform helpers
export const numToStr = (v: any): string => (v != null ? String(v) : '');

/**
 * Merge class-level defaults into a form data object. User-entered values
 * always win over class defaults. Returns a new object (does not mutate).
 */
export function applyClassDefaults<T extends Record<string, any>>(
  prev: T,
  cfg: ClassConfig | undefined | null,
  map: FieldMap<T>
): T {
  if (!cfg) return prev;
  const out: Record<string, any> = { ...prev };

  for (const formKeyStr of Object.keys(map)) {
    const entry = map[formKeyStr as keyof T];
    if (!entry) continue;

    const raw = (cfg as any)[entry.from];
    const incoming = entry.transform ? entry.transform(raw) : raw;
    const current: any = (prev as any)[formKeyStr];

    if (Array.isArray(current)) {
      out[formKeyStr] = current.length > 0 ? current : (incoming || []);
    } else if (typeof current === 'boolean') {
      out[formKeyStr] = current || !!incoming;
    } else if (typeof current === 'string') {
      out[formKeyStr] = current && current.trim() !== '' ? current : (incoming || '');
    } else {
      out[formKeyStr] = current ?? incoming;
    }
  }

  return out as T;
}

// -------------------------------------------------------------------------
// Per-generator field maps
// -------------------------------------------------------------------------
// These define which ClassConfig fields auto-fill which form fields in each
// generator. When adding a new ClassConfig field, add it here and it will
// propagate to every generator that uses it -- no more 7-file edits.
// -------------------------------------------------------------------------

export const lessonPlannerFieldMap: FieldMap<any> = {
  subject: { from: 'subject', label: 'Subject' },
  strand: { from: 'strand', label: 'Strand' },
  essentialOutcomes: { from: 'essentialOutcomes', label: 'Essential Outcomes' },
  specificOutcomes: { from: 'specificOutcomes', label: 'Specific Outcomes' },
  studentCount: { from: 'studentCount', transform: numToStr, label: 'Student Count' },
  duration: { from: 'classPeriodDuration', label: 'Duration' },
  pedagogicalStrategies: { from: 'pedagogicalStrategies', label: 'Pedagogical Strategies' },
  learningStyles: { from: 'learningStyles', label: 'Learning Styles' },
  learningPreferences: { from: 'learningPreferences', label: 'Learning Preferences' },
  multipleIntelligences: { from: 'multipleIntelligences', label: 'Multiple Intelligences' },
  customLearningStyles: { from: 'customLearningStyles', label: 'Custom Learning Styles' },
  materials: { from: 'availableMaterials', label: 'Materials' },
  prerequisiteSkills: { from: 'prerequisiteSkills', label: 'Prerequisite Skills' },
  specialNeeds: { from: 'hasSpecialNeeds', label: 'Special Needs' },
  specialNeedsDetails: { from: 'specialNeedsDetails', label: 'Special Needs Details' },
  additionalInstructions: { from: 'additionalInstructions', label: 'Additional Instructions' },
};

export const quizGeneratorFieldMap: FieldMap<any> = {
  subject: { from: 'subject', label: 'Subject' },
  strand: { from: 'strand', label: 'Strand' },
  essentialOutcomes: { from: 'essentialOutcomes', label: 'Essential Outcomes' },
  specificOutcomes: { from: 'specificOutcomes', label: 'Specific Outcomes' },
  questionTypes: { from: 'defaultQuestionTypes', label: 'Question Types' },
  cognitiveLevels: { from: 'defaultCognitiveLevels', label: 'Cognitive Levels' },
  timeLimitPerQuestion: { from: 'defaultTimeLimitPerQuestion', transform: numToStr, label: 'Time per Question' },
  specialNeeds: { from: 'hasSpecialNeeds', label: 'Special Needs' },
  specialNeedsDetails: { from: 'specialNeedsDetails', label: 'Special Needs Details' },
  additionalInstructions: { from: 'additionalInstructions', label: 'Additional Instructions' },
  preferredAssessmentFormat: { from: 'preferredAssessmentFormat', label: 'Assessment Format' },
};

export const worksheetGeneratorFieldMap: FieldMap<any> = {
  subject: { from: 'subject', label: 'Subject' },
  strand: { from: 'strand', label: 'Strand' },
  essentialOutcomes: { from: 'essentialOutcomes', label: 'Essential Outcomes' },
  specificOutcomes: { from: 'specificOutcomes', label: 'Specific Outcomes' },
  studentCount: { from: 'studentCount', transform: numToStr, label: 'Student Count' },
  learningStyles: { from: 'learningStyles', label: 'Learning Styles' },
  materials: { from: 'availableMaterials', label: 'Materials' },
  prerequisiteSkills: { from: 'prerequisiteSkills', label: 'Prerequisite Skills' },
  specialNeeds: { from: 'hasSpecialNeeds', label: 'Special Needs' },
  specialNeedsDetails: { from: 'specialNeedsDetails', label: 'Special Needs Details' },
  additionalInstructions: { from: 'additionalInstructions', label: 'Additional Instructions' },
};

export const rubricGeneratorFieldMap: FieldMap<any> = {
  subject: { from: 'subject', label: 'Subject' },
  strand: { from: 'strand', label: 'Strand' },
  essentialOutcomes: { from: 'essentialOutcomes', label: 'Essential Outcomes' },
  specificOutcomes: { from: 'specificOutcomes', label: 'Specific Outcomes' },
  performanceLevels: { from: 'performanceLevels', label: 'Performance Levels' },
  includePointValues: { from: 'includePointValues', label: 'Include Point Values' },
  focusAreas: { from: 'gradingFocusAreas', label: 'Focus Areas' },
  specificRequirements: { from: 'additionalInstructions', label: 'Specific Requirements' },
};

export const kindergartenPlannerFieldMap: FieldMap<any> = {
  curriculumSubject: { from: 'subject', label: 'Subject' },
  strand: { from: 'strand', label: 'Strand' },
  essentialOutcomes: { from: 'essentialOutcomes', label: 'Essential Outcomes' },
  specificOutcomes: { from: 'specificOutcomes', label: 'Specific Outcomes' },
  students: { from: 'studentCount', transform: numToStr, label: 'Students' },
  duration: { from: 'classPeriodDuration', label: 'Duration' },
  additionalRequirements: { from: 'additionalInstructions', label: 'Additional Requirements' },
  learningStyles: { from: 'learningStyles', label: 'Learning Styles' },
  pedagogicalStrategies: { from: 'pedagogicalStrategies', label: 'Pedagogical Strategies' },
  materials: { from: 'availableMaterials', label: 'Materials' },
  prerequisiteSkills: { from: 'prerequisiteSkills', label: 'Prerequisite Skills' },
  specialNeeds: { from: 'hasSpecialNeeds', label: 'Special Needs' },
  specialNeedsDetails: { from: 'specialNeedsDetails', label: 'Special Needs Details' },
};

export const multigradePlannerFieldMap: FieldMap<any> = {
  subject: { from: 'subject', label: 'Subject' },
  strand: { from: 'strand', label: 'Strand' },
  essentialOutcomes: { from: 'essentialOutcomes', label: 'Essential Outcomes' },
  specificOutcomes: { from: 'specificOutcomes', label: 'Specific Outcomes' },
  totalStudents: { from: 'studentCount', transform: numToStr, label: 'Total Students' },
  duration: { from: 'classPeriodDuration', label: 'Duration' },
  pedagogicalStrategies: { from: 'pedagogicalStrategies', label: 'Pedagogical Strategies' },
  learningStyles: { from: 'learningStyles', label: 'Learning Styles' },
  learningPreferences: { from: 'learningPreferences', label: 'Learning Preferences' },
  multipleIntelligences: { from: 'multipleIntelligences', label: 'Multiple Intelligences' },
  customLearningStyles: { from: 'customLearningStyles', label: 'Custom Learning Styles' },
  materials: { from: 'availableMaterials', label: 'Materials' },
  prerequisiteSkills: { from: 'prerequisiteSkills', label: 'Prerequisite Skills' },
  specialNeeds: { from: 'hasSpecialNeeds', label: 'Special Needs' },
  specialNeedsDetails: { from: 'specialNeedsDetails', label: 'Special Needs Details' },
};

export const crossCurricularPlannerFieldMap: FieldMap<any> = {
  strand: { from: 'strand', label: 'Strand' },
  essentialOutcomes: { from: 'essentialOutcomes', label: 'Essential Outcomes' },
  specificOutcomes: { from: 'specificOutcomes', label: 'Specific Outcomes' },
  duration: { from: 'classPeriodDuration', label: 'Duration' },
  learningStyles: { from: 'learningStyles', label: 'Learning Styles' },
  learningPreferences: { from: 'learningPreferences', label: 'Learning Preferences' },
  multipleIntelligences: { from: 'multipleIntelligences', label: 'Multiple Intelligences' },
  customLearningStyles: { from: 'customLearningStyles', label: 'Custom Learning Styles' },
  materials: { from: 'availableMaterials', label: 'Materials' },
};
