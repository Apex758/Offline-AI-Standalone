/**
 * Rubric data model
 *
 * Moved out of the old modal RubricEditor so RubricGenerator and
 * RubricTable can share it without a circular dependency on a deleted
 * component.
 */

export interface CriteriaRow {
  id: string;
  criterion: string;
  /** key = performance level name, value = description */
  levels: { [key: string]: string };
  /** optional points for each performance level */
  points?: { [key: string]: number };
}

export interface ParsedRubric {
  metadata: {
    title: string;
    assignmentType: string;
    subject: string;
    gradeLevel: string;
    learningObjectives?: string;
    specificRequirements?: string;
    includePointValues: boolean;
  };
  /** e.g. ["Excellent", "Good", "Satisfactory", "Needs Improvement"] */
  performanceLevels: string[];
  criteria: CriteriaRow[];
}
