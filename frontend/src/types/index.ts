export interface User {
  id: string;
  name: string;
  username: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SplitViewState {
  isActive: boolean;
  leftTabId: string | null;
  rightTabId: string | null;
  activePaneId: 'left' | 'right';
}

export interface Tab {
  id: string;
  title: string;
  type: 'chat' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 'cross-curricular-planner' | 'analytics' | 'resource-manager' | 'settings';
  active: boolean;
  data?: any;
  lastActiveTime?: number;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  type: 'chat' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 'cross-curricular-planner' | 'analytics' | 'resource-manager' | 'settings';
  description: string;
  group?: string;
}