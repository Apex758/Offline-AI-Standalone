export type BrainDumpActionType =
  | 'lesson-plan'
  | 'quiz'
  | 'rubric'
  | 'worksheet'
  | 'calendar-task'
  | 'kindergarten-plan'
  | 'multigrade-plan'
  | 'cross-curricular-plan'
  | 'image-studio'
  | 'presentation'
  | 'grade-quiz'
  | 'grade-worksheet'
  | 'curriculum-tracker'
  | 'curriculum-browse'
  | 'class-management'
  | 'attendance';

export interface BrainDumpAction {
  id: string;
  type: BrainDumpActionType;
  title: string;
  description: string;
  details: Record<string, any>;
  status: 'pending' | 'accepted' | 'denied';
  /** Urgency level — extracted from teacher text (URGENT/ASAP → urgent, deadline → high) */
  priority?: 'normal' | 'high' | 'urgent';
}

export interface BrainDumpSuggestion {
  id: string;
  text: string;
  suggestedTypes: BrainDumpActionType[];
  confidence: 'low' | 'medium';
  selectedType?: BrainDumpActionType;
  status: 'pending' | 'selected' | 'dismissed' | 'generating' | 'generated';
  generatedAction?: BrainDumpAction;
}

export interface BrainDumpEntry {
  id: string;
  text: string;
  timestamp: string;
  actions: BrainDumpAction[];
  suggestions?: BrainDumpSuggestion[];
}
