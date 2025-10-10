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
  type: 'chat' | 'grader' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 'split' | 'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 'cross-curricular-planner';
  active: boolean;
  data?: any;
  splitTabs?: [string, string]; // IDs of tabs in split view
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  type: 'chat' | 'grader' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 'cross-curricular-planner';
  description: string;
  group?: string; // For grouping tools in sidebar
}