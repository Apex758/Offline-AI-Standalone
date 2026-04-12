// Canonical grade levels and subjects for the OECS Teacher Assistant
// Single source of truth — all components should import from here

export interface GradeLevel {
  value: string;
  label: string;
}

export type GradeSubjectMapping = Record<string, string[]>;

export const GRADE_LEVELS: GradeLevel[] = [
  { value: 'k', label: 'Kindergarten' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
];

export const SUBJECTS = [
  'Mathematics', 'Language Arts', 'Science', 'Social Studies',
] as const;

export type Subject = typeof SUBJECTS[number];

// Map from grade value ('k','1',...) to full label ('Kindergarten','Grade 1',...)
export const GRADE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  GRADE_LEVELS.map(g => [g.value, g.label])
);

// Map from full label back to value
export const GRADE_VALUE_MAP: Record<string, string> = Object.fromEntries(
  GRADE_LEVELS.map(g => [g.label, g.value])
);

// Kindergarten subject-to-learning-domain mapping
export const SUBJECT_TO_DOMAIN: Record<string, string[]> = {
  'Mathematics': ['Mathematics'],
  'Language Arts': ['Language & Literacy'],
  'Science': ['Science & Discovery'],
  'Social Studies': ['Social Studies'],
  'Art': ['Creative Arts'],
  'Music': ['Creative Arts'],
  'Physical Education': ['Physical Development'],
  'Health & Family Life': ['Social-Emotional Development'],
};

// --- Helper functions ---

/** Get all grades the teacher has configured (grade values like 'k','1','2') */
export function getTeacherGrades(mapping: GradeSubjectMapping): string[] {
  return Object.keys(mapping).filter(g => mapping[g].length > 0);
}

/** Get all unique subjects across all grades */
export function getTeacherSubjects(mapping: GradeSubjectMapping): string[] {
  const set = new Set<string>();
  for (const subjects of Object.values(mapping)) {
    for (const s of subjects) set.add(s);
  }
  return [...set];
}

/** Get subjects for a specific grade value */
export function getSubjectsForGrade(mapping: GradeSubjectMapping, grade: string): string[] {
  return mapping[grade] || [];
}

/** Get grade values that include a specific subject */
export function getGradesForSubject(mapping: GradeSubjectMapping, subject: string): string[] {
  return Object.keys(mapping).filter(g => mapping[g].includes(subject));
}

/**
 * Filter a list of subject names by what the teacher teaches.
 * If gradeValue is provided, only return subjects for that grade.
 * If no mapping or empty, returns the full list.
 */
export function filterSubjects(
  allSubjects: string[],
  mapping: GradeSubjectMapping,
  filterEnabled: boolean,
  gradeValue?: string,
): string[] {
  if (!filterEnabled) return allSubjects;
  const teacherSubjects = gradeValue
    ? getSubjectsForGrade(mapping, gradeValue)
    : getTeacherSubjects(mapping);
  if (teacherSubjects.length === 0) return allSubjects;
  return allSubjects.filter(s => teacherSubjects.includes(s));
}

/**
 * Filter a list of grade labels (e.g. 'Grade 1', 'K') by teacher's mapping.
 * Handles both short values ('k','1') and full labels ('Kindergarten','Grade 1').
 */
export function filterGrades(
  allGrades: string[],
  mapping: GradeSubjectMapping,
  filterEnabled: boolean,
): string[] {
  if (!filterEnabled) return allGrades;
  const teacherGrades = getTeacherGrades(mapping);
  if (teacherGrades.length === 0) return allGrades;
  return allGrades.filter(g => {
    const lower = g.toLowerCase();
    // Direct match on value
    if (teacherGrades.includes(lower)) return true;
    // Match on label -> value
    const valueFromLabel = GRADE_VALUE_MAP[g];
    if (valueFromLabel && teacherGrades.includes(valueFromLabel)) return true;
    return false;
  });
}

/**
 * Filter grade ranges (e.g. "Grade 1 - Grade 3") by teacher's mapping.
 * A range is included if any grade in it is in the mapping.
 */
export function filterGradeRanges(
  allRanges: string[],
  mapping: GradeSubjectMapping,
  filterEnabled: boolean,
): string[] {
  if (!filterEnabled) return allRanges;
  const teacherGrades = getTeacherGrades(mapping);
  if (teacherGrades.length === 0) return allRanges;
  return allRanges.filter(range => {
    const parts = range.split(' - ');
    return parts.some(part => {
      const value = GRADE_VALUE_MAP[part];
      return value && teacherGrades.includes(value);
    });
  });
}

/**
 * Filter kindergarten learning domains by teacher's subject mapping.
 */
export function filterLearningDomains(
  allDomains: string[],
  mapping: GradeSubjectMapping,
  filterEnabled: boolean,
): string[] {
  if (!filterEnabled) return allDomains;
  const teacherSubjects = getTeacherSubjects(mapping);
  if (teacherSubjects.length === 0) return allDomains;
  return allDomains.filter(domain =>
    teacherSubjects.some(s => (SUBJECT_TO_DOMAIN[s] || []).includes(domain))
  );
}
