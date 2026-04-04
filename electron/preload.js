const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Get application info
  getAppInfo: () => {
    return new Promise((resolve) => {
      ipcRenderer.send('app-info');
      ipcRenderer.once('app-info-response', (event, data) => {
        resolve(data);
      });
    });
  },

  // Task data persistence
  getTasksData: () => ipcRenderer.invoke('get-tasks-data'),
  saveTasksData: (tasks) => ipcRenderer.invoke('save-tasks-data', tasks),

  // File download
  downloadFile: (arrayBuffer, filename) => ipcRenderer.invoke('download-file', { arrayBuffer, filename }),

  // ✅ ADD: File download handler
  downloadFile: (arrayBuffer, filename) => 
    ipcRenderer.invoke('download-file', { arrayBuffer, filename }),

  // Platform information
  platform: process.platform,

  // Versions
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },

  // Forward renderer logs to main.logs
  sendLog: (level, message) => ipcRenderer.send('frontend-log', { level, message }),

  // App restart
  restartApp: () => ipcRenderer.invoke('restart-app'),

  // System behavior
  setMinimizeToTray: (enabled) => ipcRenderer.invoke('set-minimize-to-tray', enabled),
  setStartOnBoot: (enabled) => ipcRenderer.invoke('set-start-on-boot', enabled),

  // Gated updates (license-gated in renderer)
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', (_event, info) => cb(info)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (_event, info) => cb(info)),
  installUpdate: () => ipcRenderer.send('install-update'),

  // File Explorer APIs
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getAllowedFolders: () => ipcRenderer.invoke('get-allowed-folders'),
  saveAllowedFolders: (folders) => ipcRenderer.invoke('save-allowed-folders', folders),
  browseFolder: (folderPath) => ipcRenderer.invoke('browse-folder', { folderPath }),
  readFileContent: (filePath) => ipcRenderer.invoke('read-file-content', { filePath }),
  openFileExternal: (filePath) => ipcRenderer.invoke('open-file-external', { filePath }),
  searchFiles: (query, folders, extensions) => ipcRenderer.invoke('search-files', { query, folders, extensions }),
  createFolder: (folderPath) => ipcRenderer.invoke('create-folder', { folderPath }),
  moveFile: (sourcePath, destPath) => ipcRenderer.invoke('move-file', { sourcePath, destPath }),
  moveFilesBatch: (moves) => ipcRenderer.invoke('move-files-batch', { moves }),

  // Desktop notifications
  showNotification: (title, body) =>
    ipcRenderer.invoke('show-notification', { title, body })
});

// Expose IPC communication for splashscreen
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (channel, callback) => {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },
    send: (channel, ...args) => {
      ipcRenderer.send(channel, ...args);
    }
  }
});

console.log('Preload script loaded successfully');