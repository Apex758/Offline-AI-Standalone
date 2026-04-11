/**
 * Kindergarten plan data model
 *
 * Moved out of the old modal KindergartenEditor so KindergartenPlanner,
 * KindergartenTable, and kindergartenHtmlRenderer can share the types
 * without depending on a deleted component.
 */

export const DEVELOPMENTAL_DOMAINS = [
  "Cognitive",
  "Physical",
  "Social-Emotional",
  "Language",
] as const;

export const ACTIVITY_TYPE_OPTIONS = [
  { id: "circle-time", name: "Circle Time" },
  { id: "centers", name: "Learning Centers" },
  { id: "art", name: "Art Activity" },
  { id: "music", name: "Music/Movement" },
  { id: "story", name: "Story Time" },
  { id: "outdoor", name: "Outdoor Play" },
  { id: "snack", name: "Snack Time" },
] as const;

export interface KindergartenActivity {
  id: string;
  type: string; // one of ACTIVITY_TYPE_OPTIONS id values (or free text)
  name: string;
  description: string;
  duration?: string;
  learningGoals?: string;
}

export interface KindergartenMaterial {
  id: string;
  name: string;
  ageAppropriate: boolean;
  safetyNotes?: string;
}

export interface ParsedKindergartenPlan {
  metadata: {
    title: string;
    theme: string; // Lesson topic
    curriculumUnit: string;
    week: string;
    dayOfWeek: string;
    date: string;
    ageGroup: string;
    students: string;
    duration: string;
  };
  learningObjectives: string[];
  developmentalDomains: string[];
  activities: KindergartenActivity[];
  materials: KindergartenMaterial[];
  assessmentObservations: string[];
  differentiationNotes?: string;
  prerequisites?: string;
}
