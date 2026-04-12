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
      setLicenseStatus?: (licensed: boolean) => void;
      getSecureData?: (key: string) => Promise<string | null>;
      storeSecureData?: (key: string, value: string | null) => Promise<boolean>;
      checkForUpdates?: () => Promise<void>;
      onUpdateAvailable?: (cb: (...args: any[]) => void) => void;
      onUpdateDownloaded?: (cb: (...args: any[]) => void) => void;
      installUpdate?: () => void;
      // File Explorer APIs
      selectFolder?: () => Promise<string | null>;
      getAllowedFolders?: () => Promise<string[]>;
      saveAllowedFolders?: (folders: string[]) => Promise<boolean>;
      browseFolder?: (folderPath: string) => Promise<{
        items?: FileEntry[];
        error?: string;
      }>;
      readFileContent?: (filePath: string) => Promise<{
        base64?: string;
        fileName?: string;
        size?: number;
        extension?: string;
        error?: string;
      }>;
      openFileExternal?: (filePath: string) => Promise<{ success?: boolean; error?: string }>;
      searchFiles?: (query: string, folders?: string[], extensions?: string[]) => Promise<{
        items?: FileEntry[];
        error?: string;
      }>;
      createFolder?: (folderPath: string) => Promise<{ success?: boolean; alreadyExists?: boolean; error?: string }>;
      moveFile?: (sourcePath: string, destPath: string) => Promise<{ success?: boolean; error?: string }>;
      moveFilesBatch?: (moves: Array<{ sourcePath: string; destPath: string }>) => Promise<{
        results: Array<{ source: string; success: boolean; error?: string }>;
        undoLog: Array<{ sourcePath: string; destPath: string }>;
      }>;
    };
    electron?: {
      ipcRenderer: {
        on: (channel: string, callback: (...args: any[]) => void) => void;
        send: (channel: string, ...args: any[]) => void;
      };
    };
  }

  interface FileEntry {
    name: string;
    path: string;
    isDirectory: boolean;
    size: number;
    modifiedTime: string;
    extension: string;
  }
}