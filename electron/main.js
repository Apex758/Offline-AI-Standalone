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
function getPythonPath() {
  // In production, use bundled Python
  if (!isDev) {
    const bundledPythonPath = path.join(process.resourcesPath, 'python-embed', 'python.exe');
    
    if (require('fs').existsSync(bundledPythonPath)) {
      log.info(`Using bundled Python: ${bundledPythonPath}`);
      return bundledPythonPath;
    } else {
      log.error(`Bundled Python not found at: ${bundledPythonPath}`);
    }
  }
  
  // In development, use system Python
  const { execSync } = require('child_process');
  
  if (process.platform === 'win32') {
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
    
    log.warn('No Python found in PATH, trying default "python"');
    return 'python';
  }
  
  return 'python3';
}

// Function to start the backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    log.info('Starting backend server...');
    
  let backendPath;
  let pythonCmd;

  if (isDev) {
    backendPath = path.join(__dirname, '..', 'backend');
    pythonCmd = getPythonPath();
    log.info(`Development mode - Backend path: ${backendPath}`);
  } else {
    backendPath = path.join(process.resourcesPath, 'backend-bundle');
    pythonCmd = getPythonPath();
    log.info(`Production mode - Backend path: ${backendPath}`);
  }

  const env = { ...process.env };
  if (!isDev) {
    // Set Python environment for bundled distribution
    env.PYTHONPATH = path.join(backendPath, 'python_libs');
    env.PYTHONHOME = path.join(process.resourcesPath, 'python-embed');
   
  }
    
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
      
      if (message.includes('Uvicorn running') || message.includes('Application startup complete')) {
        log.info('Backend server is ready!');
        resolve();
      }
    });
    
    backendProcess.stderr.on('data', (data) => {
      const message = data.toString();
      log.error(`Backend Error: ${message}`);
      
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
    show: false,
    backgroundColor: '#f3f4f6'
  });
  
  mainWindow.once('ready-to-show', () => {
    log.info('Window ready to show');
    mainWindow.show();
  });
  
  if (isDev) {
    mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`);
    mainWindow.webContents.openDevTools();
    log.info('Development mode - Loading from Vite dev server');
  } else {
    // FIXED: Look for frontend files in the correct location
    const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
    log.info(`Production mode - Loading from ${indexPath}`);
    
    mainWindow.loadFile(indexPath).catch(err => {
      log.error('Failed to load index.html:', err);
      
      // Show error to user
      const errorHtml = `
        <html>
          <body style="font-family: Arial; padding: 40px; background: #f3f4f6;">
            <h1 style="color: #dc2626;">Failed to Load Application</h1>
            <p>The application files could not be loaded.</p>
            <p><strong>Error:</strong> ${err.message}</p>
            <p><strong>Looking for:</strong> ${indexPath}</p>
            <hr/>
            <p><small>Check the logs for more details.</small></p>
          </body>
        </html>
      `;
      mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
    });
  }
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
      log.warn(`Prevented navigation to: ${url}`);
    }
  });
  
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    log.warn(`Prevented opening new window: ${url}`);
    return { action: 'deny' };
  });
}

// App lifecycle handlers
app.whenReady().then(async () => {
  log.info('App ready, starting initialization...');
  
  try {
    await startBackend();
    log.info('Backend started successfully');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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

app.on('window-all-closed', () => {
  log.info('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', (event) => {
  log.info('Application quitting...');
  
  if (backendProcess && !backendProcess.killed) {
    log.info('Terminating backend process...');
    backendProcess.kill();
  }
});

ipcMain.on('app-info', (event) => {
  event.reply('app-info-response', {
    version: app.getVersion(),
    isDev: isDev,
    backendPort: BACKEND_PORT
  });
});

process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  log.error('Unhandled rejection:', error);
});

log.info('Main process script loaded');