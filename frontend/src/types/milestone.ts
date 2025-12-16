export interface Milestone {
  id: string;
  teacher_id: string;
  topic_id: string;
  topic_title: string;
  grade: string;
  subject: string;
  strand: string;
  route: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  notes: string | null;
  due_date: string | null;
  is_hidden: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MilestoneUpdate {
  status?: string;
  notes?: string;
  due_date?: string | null;
  is_hidden?: boolean;
}

export interface ProgressSummary {
  total: number;
  not_started: number;
  in_progress: number;
  completed: number;
  skipped: number;
}

export interface ProgressBreakdown {
  grade: string;
  subject: string;
  total: number;
  completed: number;
  in_progress: number;
}

export interface MilestoneStats {
  totalMilestones: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionPercentage: number;
  upcomingThisWeek: number;
}

// Tree structure for hierarchical view
export interface MilestoneTreeNode {
  id: string;
  label: string;
  type: 'grade' | 'subject' | 'strand' | 'milestone';
  milestones?: Milestone[];
  children?: MilestoneTreeNode[];
  progress?: {
    total: number;
    completed: number;
    percentage: number;
  };
}