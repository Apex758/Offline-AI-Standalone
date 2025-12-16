export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;  // ISO date string
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  date: string;
  priority: TaskPriority;
}

export interface TasksByStatus {
  overdue: Task[];
  today: Task[];
  upcoming: Task[];
  completed: Task[];
}

export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'blue',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200'
  },
  medium: {
    label: 'Medium',
    color: 'yellow',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-700',
    borderClass: 'border-yellow-200'
  },
  high: {
    label: 'High',
    color: 'orange',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-700',
    borderClass: 'border-orange-200'
  },
  urgent: {
    label: 'Urgent',
    color: 'red',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
    borderClass: 'border-red-200'
  }
} as const;