const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const log = require('electron-log');
const fs = require('fs');
const isDev = !app.isPackaged;

// Configure logging paths
const logsDir = path.join(app.getPath('appData'), 'OECS Learning Hub', 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configure electron-log to use custom path
log.transports.file.resolvePathFn = () => path.join(logsDir, 'main.logs');
log.transports.file.level = 'info';
log.transports.file.maxSize = 10 * 1024 * 1024; // 10MB max file size
log.transports.console.level = isDev ? 'debug' : 'info';

log.info('='.repeat(80));
log.info('Application starting...');
log.info(`Log file location: ${log.transports.file.getFile().path}`);
log.info(`App version: ${app.getVersion()}`);
log.info(`Electron version: ${process.versions.electron}`);
log.info(`Node version: ${process.versions.node}`);
log.info(`Platform: ${process.platform} ${process.arch}`);
log.info(`Development mode: ${isDev}`);
log.info('='.repeat(80));

let mainWindow;
let splashWindow;
let backendProcess;
const BACKEND_PORT = 8000;
const FRONTEND_PORT = 5173;

// Function to find Python executable
function getPythonPath() {
  if (!isDev) {
    const bundledPythonPath = path.join(process.resourcesPath, 'backend-bundle', 'python-embed', 'python.exe');
    
    log.info(`Checking for bundled Python at: ${bundledPythonPath}`);
    
    if (fs.existsSync(bundledPythonPath)) {
      log.info(`Found bundled Python: ${bundledPythonPath}`);
      return bundledPythonPath;
    } else {
      log.error(`Bundled Python not found at: ${bundledPythonPath}`);
      
      // Show error dialog
      const { dialog } = require('electron');
      dialog.showErrorBox(
        'Python Not Found',
        `Expected Python at:\n${bundledPythonPath}\n\nPlease reinstall the application.`
      );
      app.quit();
    }
  }
  
  // In development
  const devPythonPath = path.join(__dirname, '..', 'backend', 'python-embed', 'python.exe');
  if (fs.existsSync(devPythonPath)) {
    log.info(`Using development Python: ${devPythonPath}`);
    return devPythonPath;
  }
  
  return 'python';
}

// Function to check if port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.once('close', () => resolve(true)).close();
      })
      .listen(port, '127.0.0.1');
  });
}

// Function to start the backend server
async function startBackend() {
  log.info('Starting backend server...');
  
  // Check if port is available
  const portAvailable = await checkPort(BACKEND_PORT);
  if (!portAvailable) {
    log.warn(`Port ${BACKEND_PORT} is already in use, assuming backend is running`);
    return;
  }
  
  let backendPath;
  let pythonCmd;
  let startScript;

  if (isDev) {
    backendPath = path.join(__dirname, '..', 'backend');
    pythonCmd = getPythonPath();
    startScript = 'main.py';
    log.info(`Development mode - Backend path: ${backendPath}`);
  } else {
    backendPath = path.join(process.resourcesPath, 'backend-bundle');
    pythonCmd = getPythonPath();
    startScript = 'start_backend.py';
    log.info(`Production mode - Backend path: ${backendPath}`);
    
    // Set models directory for production (models are in resources/models)
    const modelsPath = path.join(process.resourcesPath, 'models');
    log.info(`Production mode - Models path: ${modelsPath}`);
    
    // Verify files exist
    const requiredFiles = ['main.py', 'config.py', 'start_backend.py'];
    for (const file of requiredFiles) {
      const filePath = path.join(backendPath, file);
      if (!fs.existsSync(filePath)) {
        log.error(`Required file missing: ${filePath}`);
        const { dialog } = require('electron');
        dialog.showErrorBox('Installation Error', `Required file missing: ${file}\n\nPlease reinstall the application.`);
        app.quit();
        return;
      }
    }
  }

  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    
    // In production, set MODELS_DIR environment variable for backend
    if (!isDev) {
      const modelsPath = path.join(process.resourcesPath, 'models');
      env.MODELS_DIR = modelsPath;
      log.info(`Set MODELS_DIR environment variable: ${modelsPath}`);

      // Prepend backend-bundle/bin to PATH for GTK DLLs (WeasyPrint)
      const gtkBinPath = path.join(process.resourcesPath, 'backend-bundle', 'bin');
      env.PATH = `${gtkBinPath};${env.PATH}`;
      log.info(`Prepended GTK bin to PATH: ${gtkBinPath}`);
    }
    
    // Use the startup script in production
    const args = isDev ? 
      ['-u', '-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', BACKEND_PORT.toString()] :
      ['-u', startScript];
    
    log.info(`Command: ${pythonCmd} ${args.join(' ')}`);
    log.info(`Working directory: ${backendPath}`);
    
    backendProcess = spawn(pythonCmd, args, {
      cwd: backendPath,
      env: env,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true
    });
    
    let output = '';
    let errorOutput = '';
    let serverStarted = false;
    
    const checkStarted = (data) => {
      const message = data.toString();
      if (!serverStarted && (
        message.includes('Uvicorn running') || 
        message.includes('Application startup complete') ||
        message.includes('Started server process') ||
        message.includes('Starting Uvicorn server')
      )) {
        log.info('Backend server is ready!');
        serverStarted = true;
        resolve();
      }
    };
    
    backendProcess.stdout.on('data', (data) => {
      output += data.toString();
      log.info(`Backend: ${data.toString().trim()}`);
      checkStarted(data);
    });
    
    backendProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      log.info(`Backend: ${data.toString().trim()}`); // Uvicorn logs to stderr
      checkStarted(data);
    });
    
    backendProcess.on('error', (error) => {
      log.error('Failed to start backend:', error);
      log.error('Output:', output);
      log.error('Error output:', errorOutput);
      
      const { dialog } = require('electron');
      dialog.showErrorBox(
        'Backend Failed to Start',
        `Error: ${error.message}\n\nPlease check the logs for more details.`
      );
      reject(error);
    });
    
    backendProcess.on('exit', (code, signal) => {
      if (code !== 0 && !serverStarted) {
        log.error(`Backend process exited with code ${code}`);
        log.error('Output:', output);
        log.error('Error output:', errorOutput);
      }
    });
    
    // Timeout with health check
    setTimeout(async () => {
      if (!serverStarted) {
        // Try health check
        const http = require('http');
        http.get(`http://127.0.0.1:${BACKEND_PORT}/api/health`, (res) => {
          log.info('Backend health check successful!');
          resolve();
        }).on('error', () => {
          log.error('Backend failed to start within timeout');
          reject(new Error('Backend startup timeout'));
        });
      }
    }, 45000);
  });
}

// Function to get splashscreen path
function getSplashscreenPath() {
  log.info(`Getting splashscreen path - Running in ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
  
  let splashPath;
  if (isDev) {
    // In development, use the source file
    splashPath = path.join(__dirname, '..', 'frontend', 'public', 'splashscreen', 'splashscreen.html');
  } else {
    // In production, try multiple possible locations
    const possiblePaths = [
      path.join(__dirname, '..', 'frontend', 'dist', 'splashscreen', 'splashscreen.html'),
      path.join(__dirname, '..', 'frontend', 'dist', 'splashscreen.html'),
      path.join(process.resourcesPath, 'frontend', 'dist', 'splashscreen', 'splashscreen.html'),
      path.join(process.resourcesPath, 'splashscreen', 'splashscreen.html'),
      path.join(__dirname, '..', 'splashscreen', 'splashscreen.html')
    ];
    
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        splashPath = testPath;
        log.info(`Found splashscreen at: ${testPath}`);
        break;
      }
    }
    
    if (!splashPath) {
      log.error('Splashscreen file not found in any expected location!');
      log.error('Searched paths:', possiblePaths);
      
      // Use the first path as fallback
      splashPath = possiblePaths[0];
    }
  }
  
  log.info(`Splashscreen path: ${splashPath}`);
  log.info(`File exists: ${fs.existsSync(splashPath)}`);
  
  return splashPath;
}

// Function to create the main window (with splashscreen)
function createWindow() {
  log.info('Creating main window with integrated splashscreen...');
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, '..', 'frontend', 'public', 'OECS.png'),
    title: 'OECS Learning Hub',
    frame: true, // Frameless for splashscreen effect
    center: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: isDev, // Enable DevTools in development
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Allow local file access
    },
    show: false,
    backgroundColor: '#0a0e1a' // Match splashscreen background
  });
  
  // Remove menu
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  // Load splashscreen first
  const splashPath = getSplashscreenPath();
  
  log.info(`Loading splashscreen in main window: ${splashPath}`);
  
  mainWindow.loadFile(splashPath).then(() => {
    log.info('Splashscreen loaded, showing window');
    mainWindow.show();
    
    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  }).catch(err => {
    log.error('Error loading splashscreen:', err);
    // If splashscreen fails, show window anyway
    mainWindow.show();
  });
  
  // Log console messages
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    log.info(`Window console [${level}]: ${message}`);
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Function to load the main application content
function loadMainContent() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    log.error('Cannot load main content: window does not exist');
    return;
  }
  
  log.info('Loading main application content...');
  
  // Add frame back for main application
  // Note: Can't change frame property dynamically, so we keep it frameless
  // but could add custom title bar in React if needed
  
  if (isDev) {
    mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`).then(() => {
      log.info('Main content loaded (dev mode)');
    }).catch(err => {
      log.error('Error loading main content:', err);
    });
  } else {
    const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
    log.info(`Loading main content: ${indexPath}`);
    
    if (!fs.existsSync(indexPath)) {
      log.error('Frontend files not found!');
      const { dialog } = require('electron');
      dialog.showErrorBox('Installation Error', 'Frontend files not found. Please reinstall the application.');
      app.quit();
      return;
    }
    
    mainWindow.loadFile(indexPath).then(() => {
      log.info('Main content loaded (production mode)');
    }).catch(err => {
      log.error('Error loading main content:', err);
    });
  }
}

app.setName('OECS Learning Hub');

// IPC handlers for splashscreen communication
ipcMain.on('splashscreen-complete', () => {
  log.info('Splashscreen animation complete, loading main content');
  loadMainContent();
});

// IPC handlers for task data persistence
ipcMain.handle('get-tasks-data', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const tasksFilePath = path.join(userDataPath, 'tasks.json');

    if (fs.existsSync(tasksFilePath)) {
      const data = fs.readFileSync(tasksFilePath, 'utf8');
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (error) {
    log.error('Error reading tasks data:', error);
    return [];
  }
});

ipcMain.handle('save-tasks-data', async (event, tasks) => {
  try {
    const userDataPath = app.getPath('userData');
    const tasksFilePath = path.join(userDataPath, 'tasks.json');

    // Ensure user data directory exists
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    log.error('Error saving tasks data:', error);
    return false;
  }
});

// App lifecycle
app.whenReady().then(async () => {
  log.info('App ready, starting initialization...');

  try {
    // === Create main window with splashscreen ===
    createWindow();
    
    // === First install cleanup logic ===
    const userDataPath = app.getPath('userData');
    const firstRunFlag = path.join(userDataPath, 'firstrun.json');
    const { session } = require('electron');

    if (!fs.existsSync(firstRunFlag)) {
      log.info('First install detected — clearing cache, storage, and history.');
      const defaultSession = session.defaultSession;

      await defaultSession.clearCache();
      await defaultSession.clearStorageData({
        storages: [
          'cookies',
          'localstorage',
          'sessionstorage',
          'indexdb',
          'serviceworkers'
        ],
      });

      fs.writeFileSync(firstRunFlag, JSON.stringify({ initialized: true }));
    }

    // === Start backend ===
    await startBackend();
    log.info('Backend started successfully');
    
    // Send IPC message to splashscreen that backend is ready
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('backend-ready');
      log.info('Sent backend-ready message to window');
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    log.error('Failed to initialize:', error);
    const { dialog } = require('electron');
    dialog.showErrorBox('Startup Error', `Failed to start application:\n${error.message}`);
    
    // Close window on error
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.close();
    }
    
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Function to kill process tree on Windows
function killProcessTree(pid) {
  if (process.platform === 'win32') {
    try {
      // Use taskkill to kill the process and all child processes
      const { execSync } = require('child_process');
      execSync(`taskkill /pid ${pid} /T /F`, { windowsHide: true });
      log.info(`Killed process tree for PID ${pid}`);
    } catch (error) {
      log.error(`Error killing process tree for PID ${pid}:`, error.message);
    }
  } else {
    // On Unix-like systems, kill the process group
    try {
      process.kill(-pid, 'SIGTERM');
      log.info(`Killed process group for PID ${pid}`);
    } catch (error) {
      log.error(`Error killing process group for PID ${pid}:`, error.message);
    }
  }
}

app.on('before-quit', (event) => {
  log.info('App is quitting, cleaning up backend processes...');
  
  if (backendProcess && !backendProcess.killed) {
    const pid = backendProcess.pid;
    log.info(`Terminating backend process (PID: ${pid})`);
    
    // Kill the entire process tree
    killProcessTree(pid);
    
    // Also try regular kill as fallback
    try {
      backendProcess.kill('SIGTERM');
    } catch (error) {
      log.error('Error sending SIGTERM:', error.message);
    }
    
    // Force kill after a short delay if still running
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        log.warn('Backend process still running, forcing kill...');
        try {
          backendProcess.kill('SIGKILL');
        } catch (error) {
          log.error('Error sending SIGKILL:', error.message);
        }
      }
    }, 1000);
  }
});

// Handle app quit to ensure cleanup
app.on('will-quit', () => {
  log.info('App will quit, final cleanup...');
  if (backendProcess && !backendProcess.killed) {
    try {
      killProcessTree(backendProcess.pid);
    } catch (error) {
      log.error('Error in final cleanup:', error.message);
    }
  }
});

log.info('Main process loaded');
