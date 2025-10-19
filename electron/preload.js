const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
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
  
  // Platform information
  platform: process.platform,
  
  // Versions
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
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

// Log that preload script has loaded
console.log('Preload script loaded successfully');