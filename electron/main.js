const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const log = require('electron-log');
const isDev = !app.isPackaged;

// Configure logging
log.transports.file.level = 'info';
log.info('Application starting...');

let mainWindow;
let backendProcess;
const BACKEND_PORT = 8000;
const FRONTEND_PORT = 5173;

// Function to find Python executable
// Function to find Python executable
function getPythonPath() {
  const { execSync } = require('child_process');
  
  if (process.platform === 'win32') {
    // Try common Python commands on Windows
    const pythonCommands = ['python', 'py', 'python3'];
    
    for (const cmd of pythonCommands) {
      try {
        execSync(`${cmd} --version`, { stdio: 'ignore' });
        log.info(`Found Python using command: ${cmd}`);
        return cmd;
      } catch (e) {
        continue;
      }
    }
    
    // If none found, default to 'python' and let it fail with a helpful error
    log.warn('No Python found in PATH, trying default "python"');
    return 'python';
  }
  
  // For Linux/Mac
  return 'python3';
}

// Function to start the backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    log.info('Starting backend server...');
    
    let backendPath;
    let pythonCmd;
    
    if (isDev) {
      // Development mode
      backendPath = path.join(__dirname, '..', 'backend');
      pythonCmd = getPythonPath();
      log.info(`Development mode - Backend path: ${backendPath}`);
    } else {
      // Production mode
      backendPath = path.join(process.resourcesPath, 'backend-bundle');
      pythonCmd = getPythonPath();
      log.info(`Production mode - Backend path: ${backendPath}`);
    }
    
    // Set environment variable for Python to find modules
    const env = { ...process.env };
    if (!isDev) {
      env.PYTHONPATH = path.join(backendPath, 'python_libs');
    }
    
    // Start the backend process
    backendProcess = spawn(
      pythonCmd,
      ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', BACKEND_PORT.toString()],
      {
        cwd: backendPath,
        env: env,
        stdio: ['ignore', 'pipe', 'pipe']
      }
    );
    
    backendProcess.stdout.on('data', (data) => {
      const message = data.toString();
      log.info(`Backend: ${message}`);
      
      // Check if server is ready
      if (message.includes('Uvicorn running') || message.includes('Application startup complete')) {
        log.info('Backend server is ready!');
        resolve();
      }
    });
    
    backendProcess.stderr.on('data', (data) => {
      const message = data.toString();
      log.error(`Backend Error: ${message}`);
      
      // Some startup messages come through stderr
      if (message.includes('Uvicorn running') || message.includes('Application startup complete')) {
        log.info('Backend server is ready!');
        resolve();
      }
    });
    
    backendProcess.on('error', (error) => {
      log.error('Failed to start backend:', error);
      
      if (error.code === 'ENOENT' || error.code === 'EACCES') {
        const { dialog } = require('electron');
        dialog.showErrorBox(
          'Python Not Found',
          'Python is required to run this application.\n\n' +
          'Please install Python 3.9 or higher from:\n' +
          'https://www.python.org/downloads/\n\n' +
          'Make sure to check "Add Python to PATH" during installation.'
        );
      }
      
      reject(error);
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        log.info('Backend started (timeout reached, assuming success)');
        resolve();
      }
    }, 30000);
  });
}

// Function to create the main window
function createWindow() {
  log.info('Creating main window...');
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    show: false, // Don't show until ready
    backgroundColor: '#f3f4f6'
  });
  
  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    log.info('Window ready to show');
    mainWindow.show();
  });
  
  // Load the app
  if (isDev) {
    // Development mode - load from Vite dev server
    mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`);
    mainWindow.webContents.openDevTools();
    log.info('Development mode - Loading from Vite dev server');
  } else {
    // Production mode - load from built files
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
    log.info(`Production mode - Loading from ${indexPath}`);
  }
  
  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Handle navigation
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Prevent navigation to external URLs
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
      log.warn(`Prevented navigation to: ${url}`);
    }
  });
  
  // Handle new window requests
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Prevent opening new windows
    log.warn(`Prevented opening new window: ${url}`);
    return { action: 'deny' };
  });
}

// App lifecycle handlers
app.whenReady().then(async () => {
  log.info('App ready, starting initialization...');
  
  try {
    // Start backend server
    await startBackend();
    log.info('Backend started successfully');
    
    // Wait a bit for backend to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create the window
    createWindow();
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    log.error('Failed to initialize application:', error);
    app.quit();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  log.info('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Cleanup before quit
app.on('before-quit', (event) => {
  log.info('Application quitting...');
  
  if (backendProcess && !backendProcess.killed) {
    log.info('Terminating backend process...');
    backendProcess.kill();
  }
});

// Handle IPC messages from renderer
ipcMain.on('app-info', (event) => {
  event.reply('app-info-response', {
    version: app.getVersion(),
    isDev: isDev,
    backendPort: BACKEND_PORT
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  log.error('Unhandled rejection:', error);
});

log.info('Main process script loaded');