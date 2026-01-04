/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI?: {
      getAppInfo: () => Promise<any>;
      getTasksData: () => Promise<any[]>;
      saveTasksData: (tasks: any[]) => Promise<boolean>;
      platform: string;
      versions: {
        node: string;
        chrome: string;
        electron: string;
      };
    };
  }
}