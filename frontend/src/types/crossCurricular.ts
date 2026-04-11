/**
 * Cross-Curricular plan data model
 *
 * Moved out of the old modal CrossCurricularEditor so
 * CrossCurricularPlanner, CrossCurricularTable, and
 * crossCurricularHtmlRenderer can share the types without depending on a
 * deleted component.
 */

export const SUBJECT_COLORS: { [key: string]: string } = {
  Mathematics: "#3b82f6",
  "Language Arts": "#8b5cf6",
  Science: "#10b981",
  "Social Studies": "#f59e0b",
  Arts: "#ec4899",
  "Physical Education": "#06b6d4",
  Technology: "#6366f1",
};

export interface SubjectObjective {
  id: string;
  subject: string;
  objective: string;
}

export interface CrossCurricularActivity {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  duration?: string;
}

export interface Material {
  id: string;
  name: string;
  subjects?: string[];
}

export interface ParsedCrossCurricularPlan {
  metadata: {
    title: string;
    theme: string;
    primarySubject: string;
    integrationSubjects: string[];
    gradeLevel: string;
    duration: string;
    integrationModel: string;
    date?: string;
  };
  learningStandards: string;
  subjectObjectives: SubjectObjective[];
  crossCurricularActivities: CrossCurricularActivity[];
  materials: Material[];
  assessmentStrategies: string[];
  differentiationNotes?: string;
  reflectionPrompts?: string;
  keyVocabulary?: string;
}
