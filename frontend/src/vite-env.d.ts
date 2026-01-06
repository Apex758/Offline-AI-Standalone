/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI?: {
      getAppInfo: () => Promise<any>;
      getTasksData: () => Promise<any[]>;
      saveTasksData: (tasks: any[]) => Promise<boolean>;
      downloadFile: (arrayBuffer: ArrayBuffer, filename: string) => Promise<{
        success: boolean;
        path?: string;
        message?: string;
      }>;
      platform: string;
      versions: {
        node: string;
        chrome: string;
        electron: string;
      };
    };
    electron?: {
      ipcRenderer: {
        on: (channel: string, callback: (...args: any[]) => void) => void;
        send: (channel: string, ...args: any[]) => void;
      };
    };
  }
}