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

export interface Tab {
  id: string;
  title: string;
  type: 'chat' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 'split' | 'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 'cross-curricular-planner' | 'analytics' | 'resource-manager' | 'settings';
  active: boolean;
  data?: any;
  splitTabs?: [string, string];
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  type: 'chat' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 'cross-curricular-planner' | 'analytics' | 'resource-manager' | 'settings';
  description: string;
  group?: string;
}