export interface ResourceTrendData {
  date: string;
  total: number;
  lessonPlans: number;
  quizzes: number;
  rubrics: number;
  kindergarten: number;
  multigrade: number;
  crossCurricular: number;
  worksheets: number;
  images: number;
}

export interface DistributionData {
  type: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ToolUsage {
  type: string;
  name: string;
  count: number;
  lastUsed: string;
  icon: string;
}

export interface Activity {
  id: string;
  type: 'resource_created' | 'task_completed' | 'milestone_reached';
  description: string;
  timestamp: string;
  resourceType?: string;
}

export type Timeframe = 'week' | '2weeks' | '4weeks' | 'month' | 'all';
export type CurriculumView = 'overall' | 'grade' | 'subject';

export interface QuickStat {
  title: string;
  value: number | string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  color: string;
  icon: string;
}