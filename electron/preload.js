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

  // Gated updates (license-gated in renderer)
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', (_event, info) => cb(info)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (_event, info) => cb(info)),
  installUpdate: () => ipcRenderer.send('install-update')
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