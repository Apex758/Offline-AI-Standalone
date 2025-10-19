const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const log = require('electron-log');
const fs = require('fs');
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
    }, 15000);
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
    icon: path.join(__dirname, '..', 'frontend', 'public', 'OECS.png'),
    title: 'OECS Learning Hub',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Allow local file access
    },
    show: false,
    backgroundColor: '#f3f4f6'
  });
  
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  mainWindow.once('ready-to-show', () => {
    log.info('Window ready to show');
    mainWindow.show();
  });
  
  if (isDev) {
    mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
    log.info(`Loading: ${indexPath}`);
    
    if (!fs.existsSync(indexPath)) {
      log.error('Frontend files not found!');
      const { dialog } = require('electron');
      dialog.showErrorBox('Installation Error', 'Frontend files not found. Please reinstall the application.');
      app.quit();
      return;
    }
    
    mainWindow.loadFile(indexPath);
  }
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.setName('OECS Learning Hub');

// App lifecycle
app.whenReady().then(async () => {
  log.info('App ready, starting initialization...');

  try {
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

    // === Continue with normal startup ===
    await startBackend();
    log.info('Backend started successfully');
    await new Promise(resolve => setTimeout(resolve, 3000));
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    log.error('Failed to initialize:', error);
    const { dialog } = require('electron');
    dialog.showErrorBox('Startup Error', `Failed to start application:\n${error.message}`);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
  }
});

log.info('Main process loaded');