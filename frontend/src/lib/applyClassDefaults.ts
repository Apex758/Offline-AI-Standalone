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
};

export type FieldMap<T> = Partial<Record<keyof T, FieldMapEntry>>;

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
  subject: { from: 'subject' },
  strand: { from: 'strand' },
  essentialOutcomes: { from: 'essentialOutcomes' },
  specificOutcomes: { from: 'specificOutcomes' },
  studentCount: { from: 'studentCount', transform: numToStr },
  duration: { from: 'classPeriodDuration' },
  pedagogicalStrategies: { from: 'pedagogicalStrategies' },
  learningStyles: { from: 'learningStyles' },
  learningPreferences: { from: 'learningPreferences' },
  multipleIntelligences: { from: 'multipleIntelligences' },
  customLearningStyles: { from: 'customLearningStyles' },
  materials: { from: 'availableMaterials' },
  prerequisiteSkills: { from: 'prerequisiteSkills' },
  specialNeeds: { from: 'hasSpecialNeeds' },
  specialNeedsDetails: { from: 'specialNeedsDetails' },
  additionalInstructions: { from: 'additionalInstructions' },
};

export const quizGeneratorFieldMap: FieldMap<any> = {
  subject: { from: 'subject' },
  strand: { from: 'strand' },
  essentialOutcomes: { from: 'essentialOutcomes' },
  specificOutcomes: { from: 'specificOutcomes' },
  questionTypes: { from: 'defaultQuestionTypes' },
  cognitiveLevels: { from: 'defaultCognitiveLevels' },
  timeLimitPerQuestion: { from: 'defaultTimeLimitPerQuestion', transform: numToStr },
  specialNeeds: { from: 'hasSpecialNeeds' },
  specialNeedsDetails: { from: 'specialNeedsDetails' },
  additionalInstructions: { from: 'additionalInstructions' },
  preferredAssessmentFormat: { from: 'preferredAssessmentFormat' },
};

export const worksheetGeneratorFieldMap: FieldMap<any> = {
  subject: { from: 'subject' },
  strand: { from: 'strand' },
  essentialOutcomes: { from: 'essentialOutcomes' },
  specificOutcomes: { from: 'specificOutcomes' },
  studentCount: { from: 'studentCount', transform: numToStr },
  learningStyles: { from: 'learningStyles' },
  materials: { from: 'availableMaterials' },
  prerequisiteSkills: { from: 'prerequisiteSkills' },
  specialNeeds: { from: 'hasSpecialNeeds' },
  specialNeedsDetails: { from: 'specialNeedsDetails' },
  additionalInstructions: { from: 'additionalInstructions' },
};

export const rubricGeneratorFieldMap: FieldMap<any> = {
  subject: { from: 'subject' },
  strand: { from: 'strand' },
  essentialOutcomes: { from: 'essentialOutcomes' },
  specificOutcomes: { from: 'specificOutcomes' },
  performanceLevels: { from: 'performanceLevels' },
  includePointValues: { from: 'includePointValues' },
  focusAreas: { from: 'gradingFocusAreas' },
  specificRequirements: { from: 'additionalInstructions' },
};

export const kindergartenPlannerFieldMap: FieldMap<any> = {
  curriculumSubject: { from: 'subject' },
  strand: { from: 'strand' },
  essentialOutcomes: { from: 'essentialOutcomes' },
  specificOutcomes: { from: 'specificOutcomes' },
  students: { from: 'studentCount', transform: numToStr },
  duration: { from: 'classPeriodDuration' },
  additionalRequirements: { from: 'additionalInstructions' },
  learningStyles: { from: 'learningStyles' },
  pedagogicalStrategies: { from: 'pedagogicalStrategies' },
  materials: { from: 'availableMaterials' },
  prerequisiteSkills: { from: 'prerequisiteSkills' },
  specialNeeds: { from: 'hasSpecialNeeds' },
  specialNeedsDetails: { from: 'specialNeedsDetails' },
};

export const multigradePlannerFieldMap: FieldMap<any> = {
  subject: { from: 'subject' },
  strand: { from: 'strand' },
  essentialOutcomes: { from: 'essentialOutcomes' },
  specificOutcomes: { from: 'specificOutcomes' },
  totalStudents: { from: 'studentCount', transform: numToStr },
  duration: { from: 'classPeriodDuration' },
  pedagogicalStrategies: { from: 'pedagogicalStrategies' },
  learningStyles: { from: 'learningStyles' },
  learningPreferences: { from: 'learningPreferences' },
  multipleIntelligences: { from: 'multipleIntelligences' },
  customLearningStyles: { from: 'customLearningStyles' },
  materials: { from: 'availableMaterials' },
  prerequisiteSkills: { from: 'prerequisiteSkills' },
  specialNeeds: { from: 'hasSpecialNeeds' },
  specialNeedsDetails: { from: 'specialNeedsDetails' },
};

export const crossCurricularPlannerFieldMap: FieldMap<any> = {
  strand: { from: 'strand' },
  essentialOutcomes: { from: 'essentialOutcomes' },
  specificOutcomes: { from: 'specificOutcomes' },
  duration: { from: 'classPeriodDuration' },
  learningStyles: { from: 'learningStyles' },
  learningPreferences: { from: 'learningPreferences' },
  multipleIntelligences: { from: 'multipleIntelligences' },
  customLearningStyles: { from: 'customLearningStyles' },
  materials: { from: 'availableMaterials' },
};
