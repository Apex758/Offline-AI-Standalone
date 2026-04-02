export interface User {
  id: string;
  name: string;
  username: string;
}

export type Theme = 'light' | 'dark' | 'system';

export type ImageMode = 'none' | 'ai' | 'my-images' | 'suggested';

export interface FileOperationPlan {
  action: string;
  description: string;
  folders_to_create: string[];
  moves: { file: string; from: string; to: string }[];
  folderPath?: string;  // the source folder being organized
  status?: 'pending' | 'approved' | 'executed' | 'rejected';
  result?: { success: number; failed: number; errors?: string[] };
}

export interface MessageAttachment {
  name: string;
  extension: string;
  isImage?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  filePlan?: FileOperationPlan;
  attachments?: MessageAttachment[];
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
  type: 'chat' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 'cross-curricular-planner' | 'analytics' | 'resource-manager' | 'settings' | 'curriculum-tracker' | 'worksheet-generator' | 'image-studio' | 'class-management' | 'support' | 'brain-dump' | 'performance-metrics' | 'presentation-builder' | 'achievements' | 'storybook' | 'educator-insights';
  active: boolean;
  data?: any;
  lastActiveTime?: number;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  type: 'chat' | 'lesson-planner' | 'rubric-generator' | 'curriculum' | 'quiz-generator' | 'multigrade-planner' | 'kindergarten-planner' | 'cross-curricular-planner' | 'analytics' | 'resource-manager' | 'settings' | 'curriculum-tracker' | 'worksheet-generator' | 'image-studio' | 'class-management' | 'support' | 'brain-dump' | 'performance-metrics' | 'presentation-builder' | 'achievements' | 'storybook' | 'educator-insights';
  description: string;
  group?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  subject: string;
  grade: string;
  [key: string]: any;
}