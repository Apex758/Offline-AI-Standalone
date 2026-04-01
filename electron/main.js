const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Load .env — from backend/ in dev, from backend-bundle/ in production
const isDev_ = !app.isPackaged;
const envPath = isDev_
  ? path.join(__dirname, '..', 'backend', '.env')
  : path.join(process.resourcesPath, 'backend-bundle', '.env');
require('dotenv').config({ path: envPath });
const log = require('electron-log');
const fs = require('fs');
const fsp = fs.promises;
const { autoUpdater } = require('electron-updater');
const isDev = !app.isPackaged;

// Configure auto-updater
autoUpdater.logger = log;
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// For private GitHub repos — use a read-only fine-grained token (contents: read only)
// Generate at: GitHub > Settings > Developer settings > Fine-grained tokens
const UPDATE_TOKEN = process.env.GH_TOKEN || '';
if (UPDATE_TOKEN) {
  autoUpdater.requestHeaders = { Authorization: `token ${UPDATE_TOKEN}` };
}

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

// ── Session error tracking ──
let sessionHasErrors = false;

// Wrap electron-log so any error/warn call flips the flag
const _origLogError = log.error.bind(log);
const _origLogWarn = log.warn.bind(log);
log.error = (...args) => { sessionHasErrors = true; _origLogError(...args); };
log.warn = (...args) => { sessionHasErrors = true; _origLogWarn(...args); };

let mainWindow;
let splashWindow;
let backendProcess;
let tray = null;
let minimizeToTray = false;
let isQuitting = false;
let backendRestartCount = 0;
const MAX_BACKEND_RESTARTS = 3;
const BACKEND_PORT = 8000;
const FRONTEND_PORT = 5173;

// ── Single instance lock ──
// Prevent multiple instances from launching (e.g., auto-start + user click)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  log.info('Another instance is already running — quitting this one.');
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to launch a second instance — focus the existing window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
}

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

// Function to recursively copy directory (async to avoid blocking main thread)
async function copyDirectoryAsync(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectoryAsync(srcPath, destPath);
    } else {
      await fsp.copyFile(srcPath, destPath);
    }
  }
}

// Function to setup image generation models on first run
async function setupImageGenerationModels() {
  try {
    log.info('Checking image generation models...');
    
    const userDataPath = app.getPath('userData');
    const targetModelsDir = path.join(userDataPath, 'models');
    const targetImageGenDir = path.join(targetModelsDir, 'image_generation');
    
    // Check if models already exist
    try { await fsp.access(targetImageGenDir); log.info('Image generation models already installed'); return; } catch {}

    log.info('Setting up image generation models for first time...');

    // Ensure models directory exists
    await fsp.mkdir(targetModelsDir, { recursive: true });
    log.info(`Created models directory: ${targetModelsDir}`);
    
    // Determine source path
    let sourceImageGenDir;
    
    if (isDev) {
      // In development, use backend folder
      sourceImageGenDir = path.join(__dirname, '..', 'backend', 'models', 'image_generation');
    } else {
      // In production, use installer resources
      sourceImageGenDir = path.join(process.resourcesPath, 'models', 'image_generation');
    }
    
    log.info(`Source path: ${sourceImageGenDir}`);
    log.info(`Target path: ${targetImageGenDir}`);
    
    // Check if source exists
    try { await fsp.access(sourceImageGenDir); } catch {
      log.warn(`Image generation models not found at: ${sourceImageGenDir}`);
      log.warn('Image generation features will be unavailable');
      return;
    }

    // Copy the models
    log.info('Copying image generation models (this may take a moment)...');
    await copyDirectoryAsync(sourceImageGenDir, targetImageGenDir);

    // Verify the copy
    const sdxlPath = path.join(targetImageGenDir, 'sdxl-turbo-openvino');
    const lamaPath = path.join(targetImageGenDir, 'lama');

    let sdxlExists = false, lamaExists = false;
    try { await fsp.access(sdxlPath); sdxlExists = true; } catch {}
    try { await fsp.access(lamaPath); lamaExists = true; } catch {}

    if (sdxlExists && lamaExists) {
      log.info('✅ Image generation models installed successfully');
      log.info(`  - SDXL-Turbo: ${sdxlPath}`);
      log.info(`  - LaMa: ${lamaPath}`);
    } else {
      log.warn('⚠️  Image models copied but verification failed');
    }
    
  } catch (error) {
    log.error('Error setting up image generation models:', error);
    log.error('App will continue without image generation support');
    // Don't throw - app should still start
  }
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
    
    // Set models directory for production (LLaMA models in resources/models)
    const modelsPath = path.join(process.resourcesPath, 'models');
    log.info(`Production mode - LLaMA models path: ${modelsPath}`);
    
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
    
    // In production, set environment variables for backend
    if (!isDev) {
      const modelsPath = path.join(process.resourcesPath, 'models');
      env.MODELS_DIR = modelsPath;
      log.info(`Set MODELS_DIR environment variable: ${modelsPath}`);
      
      // Set ELECTRON_RESOURCE_PATH for image service
      env.ELECTRON_RESOURCE_PATH = process.resourcesPath;
      log.info(`Set ELECTRON_RESOURCE_PATH environment variable: ${process.resourcesPath}`);
      
      // Set IMAGE_MODELS_DIR to point to user data directory
      const userDataPath = app.getPath('userData');
      const imageModelsPath = path.join(userDataPath, 'models', 'image_generation');
      env.IMAGE_MODELS_DIR = imageModelsPath;
      log.info(`Set IMAGE_MODELS_DIR environment variable: ${imageModelsPath}`);

      // Prepend backend-bundle/bin to PATH for GTK DLLs (WeasyPrint)
      const gtkBinPath = path.join(process.resourcesPath, 'backend-bundle', 'bin');
      env.PATH = `${gtkBinPath};${env.PATH}`;
      log.info(`Prepended GTK bin to PATH: ${gtkBinPath}`);

      // Set FONTCONFIG_PATH for WeasyPrint fonts
      const fontsPath = path.join(process.resourcesPath, 'backend-bundle', 'etc', 'fonts');
      env.FONTCONFIG_PATH = fontsPath;
      log.info(`Set FONTCONFIG_PATH environment variable: ${fontsPath}`);
    } else {
      // In development, also set IMAGE_MODELS_DIR for consistency
      const devImageModelsPath = path.join(__dirname, '..', 'backend', 'models', 'image_generation');
      env.IMAGE_MODELS_DIR = devImageModelsPath;
      log.info(`Set IMAGE_MODELS_DIR (dev) environment variable: ${devImageModelsPath}`);
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
      if (!serverStarted && message.includes('Server ready!')) {
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
      const text = data.toString().trim();
      // Detect actual errors vs normal uvicorn INFO output
      if (/\b(ERROR|CRITICAL|Traceback|Exception|FAILED)\b/i.test(text)) {
        log.error(`Backend: ${text}`);
      } else {
        log.info(`Backend: ${text}`);
      }
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
      // Auto-restart backend if it crashes after initial startup
      if (serverStarted && !isQuitting) {
        backendRestartCount++;
        if (backendRestartCount <= MAX_BACKEND_RESTARTS) {
          log.warn(`Backend crashed (code: ${code}, signal: ${signal}) — restart ${backendRestartCount}/${MAX_BACKEND_RESTARTS}...`);
          backendProcess = null;
          setTimeout(() => {
            if (!isQuitting) {
              startBackend().then(() => {
                log.info('Backend restarted successfully after crash');
                if (mainWindow && !mainWindow.isDestroyed()) {
                  mainWindow.webContents.send('backend-restarted');
                }
              }).catch(err => {
                log.error('Failed to restart backend:', err);
              });
            }
          }, 2000);
        } else {
          log.error(`Backend crashed ${backendRestartCount} times — not restarting again`);
        }
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
    // In production, use extraResources location (outside asar)
    splashPath = path.join(process.resourcesPath, 'splashscreen', 'splashscreen.html');
    
    // Fallback: check if it's in dist inside asar
    if (!fs.existsSync(splashPath)) {
      log.warn(`Splashscreen not found at: ${splashPath}`);
      
      // Try alternative location in dist
      const distPath = path.join(__dirname, '..', 'dist', 'splashscreen', 'splashscreen.html');
      if (fs.existsSync(distPath)) {
        splashPath = distPath;
        log.info(`Found splashscreen in dist: ${distPath}`);
      } else {
        log.error('Splashscreen not found in any location, will skip splashscreen');
        return null;
      }
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
      devTools: isDev, // Only enable DevTools in development
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Allow local file access
    },
    show: false,
    backgroundColor: '#f9fafb' // Match splashscreen background
  });
  
  // Remove menu
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  // Enable DevTools shortcut for debugging (Ctrl+Shift+I)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.shift && input.key.toLowerCase() === 'i') {
      mainWindow.webContents.openDevTools();
      event.preventDefault();
    }
  });

  // Load splashscreen first
  // Load splashscreen first
  const splashPath = getSplashscreenPath();

  if (splashPath && fs.existsSync(splashPath)) {
    log.info(`Loading splashscreen in main window: ${splashPath}`);
    
    mainWindow.loadFile(splashPath).then(() => {
      log.info('Splashscreen loaded, showing window');
      mainWindow.show();
      
      if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
      }
    }).catch(err => {
      log.error('Error loading splashscreen:', err);
      // If splashscreen fails, load main content directly
      mainWindow.show();
      loadMainContent();
    });
  } else {
    log.warn('Splashscreen not available, loading main content directly');
    mainWindow.show();
    loadMainContent();
  }
  // Log console messages
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    log.info(`Window console [${level}]: ${message}`);
  });
  
  // Intercept close to minimize to tray instead of quitting,
  // and warn about active generations before actually closing
  mainWindow.on('close', async (event) => {
    if (minimizeToTray && !isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      log.info('Window hidden to tray');
      return;
    }

    // Ask the renderer if any generations are active
    if (!mainWindow._generationCloseConfirmed) {
      event.preventDefault();
      try {
        const hasActive = await mainWindow.webContents.executeJavaScript(
          `(function() { try { return document.querySelectorAll('[data-generation-active="true"]').length > 0; } catch(e) { return false; } })()`
        );
        if (hasActive) {
          const { response } = await dialog.showMessageBox(mainWindow, {
            type: 'warning',
            buttons: ['Keep Generating', 'Stop & Close'],
            defaultId: 0,
            cancelId: 0,
            title: 'Generation in Progress',
            message: 'You have AI generations still running.',
            detail: 'Closing the application will stop all active generations and any incomplete output will be lost.',
          });
          if (response === 0) {
            log.info('User cancelled close — generations still active');
            return;
          }
        }
      } catch (e) {
        log.warn('Could not check generation state:', e.message);
      }
      mainWindow._generationCloseConfirmed = true;
      mainWindow.close();
    }
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

// IPC handler for user-initiated app restart
ipcMain.handle('restart-app', async () => {
  log.info('User-initiated app restart...');
  if (backendProcess && !backendProcess.killed) {
    killProcessTree(backendProcess.pid);
  }
  app.relaunch();
  app.exit(0);
});

// IPC handlers for task data persistence
ipcMain.handle('get-tasks-data', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const tasksFilePath = path.join(userDataPath, 'tasks.json');
    const data = await fsp.readFile(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code !== 'ENOENT') log.error('Error reading tasks data:', error);
    return [];
  }
});

ipcMain.handle('save-tasks-data', async (event, tasks) => {
  try {
    const userDataPath = app.getPath('userData');
    const tasksFilePath = path.join(userDataPath, 'tasks.json');
    await fsp.mkdir(userDataPath, { recursive: true });
    await fsp.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    log.error('Error saving tasks data:', error);
    return false;
  }
});

// IPC handler for file downloads
ipcMain.handle('download-file', async (event, { arrayBuffer, filename }) => {
  const { dialog } = require('electron');

  try {
    // Show save dialog
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Export',
      defaultPath: path.join(app.getPath('downloads'), filename),
      filters: [
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (canceled || !filePath) {
      return { success: false, message: 'Download canceled' };
    }

    // Convert ArrayBuffer to Buffer and write to file
    const buffer = Buffer.from(arrayBuffer);
    await fsp.writeFile(filePath, buffer);

    log.info(`File saved successfully: ${filePath}`);
    return { success: true, path: filePath };
  } catch (error) {
    log.error('Error saving file:', error);
    return { success: false, message: error.message };
  }
});

// --- Gated auto-updater IPC ---
ipcMain.handle('check-for-updates', async () => {
  if (isDev) {
    log.info('Skipping update check in development mode');
    return;
  }
  try {
    log.info('Licensed user requested update check');
    await autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    log.error('Update check failed:', err.message);
  }
});

// Frontend log forwarding — renderer sends logs here so they appear in main.logs
ipcMain.on('frontend-log', (event, { level, message }) => {
  const prefix = `[Frontend] ${message}`;
  if (level === 'error') log.error(prefix);
  else if (level === 'warn') log.warn(prefix);
  else log.info(prefix);
});

ipcMain.on('install-update', () => {
  log.info('User requested update install, quitting and installing...');
  autoUpdater.quitAndInstall();
});

// ── System tray ──
function getTrayIconPath() {
  if (isDev) {
    return path.join(__dirname, '..', 'frontend', 'public', 'OECS.png');
  }
  // In production, the icon is bundled via extraResources
  const icoPath = path.join(process.resourcesPath, 'tray-icon.ico');
  if (fs.existsSync(icoPath)) return icoPath;
  const pngPath = path.join(process.resourcesPath, 'tray-icon.png');
  if (fs.existsSync(pngPath)) return pngPath;
  // Fallback: use the app exe icon
  return app.getPath('exe');
}

function createTray() {
  if (tray) return; // already created

  const iconPath = getTrayIconPath();
  let trayIcon;
  try {
    trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  } catch (err) {
    log.warn('Could not load tray icon, using empty image:', err.message);
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('OECS Learning Hub');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show OECS Learning Hub',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  log.info('System tray created');
}

function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
    log.info('System tray destroyed');
  }
}

// IPC: toggle minimize-to-tray
ipcMain.handle('set-minimize-to-tray', (event, enabled) => {
  minimizeToTray = enabled;
  log.info(`Minimize to tray: ${enabled}`);
  if (enabled) {
    createTray();
  } else {
    destroyTray();
  }
  return true;
});

// IPC: toggle start on boot
ipcMain.handle('set-start-on-boot', (event, enabled) => {
  log.info(`Start on boot: ${enabled}`);
  app.setLoginItemSettings({
    openAtLogin: enabled,
    path: app.getPath('exe')
  });
  return true;
});

// ══════════════════════════════════════════════════════════════
// File Explorer IPC Handlers
// ══════════════════════════════════════════════════════════════

const FILE_EXPLORER_CONFIG_PATH = path.join(app.getPath('userData'), 'file-explorer-config.json');
const ALLOWED_EXTENSIONS = new Set([
  '.docx', '.pptx', '.pdf', '.txt', '.md', '.xlsx', '.csv',
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.doc', '.ppt', '.xls'
]);
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Helper: load allowed folders from disk
async function loadAllowedFolders() {
  try {
    const data = JSON.parse(await fsp.readFile(FILE_EXPLORER_CONFIG_PATH, 'utf8'));
    return data.allowedFolders || [];
  } catch (err) {
    if (err.code !== 'ENOENT') log.error('Error loading file explorer config:', err);
  }
  // Defaults: Downloads + Desktop
  return [app.getPath('downloads'), app.getPath('desktop')];
}

// Helper: save allowed folders to disk
async function saveAllowedFoldersToDisk(folders) {
  try {
    await fsp.mkdir(path.dirname(FILE_EXPLORER_CONFIG_PATH), { recursive: true });
    await fsp.writeFile(FILE_EXPLORER_CONFIG_PATH, JSON.stringify({ allowedFolders: folders }, null, 2));
    return true;
  } catch (err) {
    log.error('Error saving file explorer config:', err);
    return false;
  }
}

// Helper: validate that a path is inside an allowed folder
function isPathAllowed(targetPath, allowedFolders) {
  const resolved = path.resolve(targetPath);
  return allowedFolders.some(folder => {
    const resolvedFolder = path.resolve(folder);
    return resolved === resolvedFolder || resolved.startsWith(resolvedFolder + path.sep);
  });
}

// IPC: Open native folder picker dialog
ipcMain.handle('select-folder', async () => {
  if (!mainWindow) return null;
  mainWindow.focus();
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select a folder to allow access',
    defaultPath: require('os').homedir()
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// IPC: Get allowed folders list
ipcMain.handle('get-allowed-folders', async () => {
  return await loadAllowedFolders();
});

// IPC: Save allowed folders list
ipcMain.handle('save-allowed-folders', async (event, folders) => {
  return await saveAllowedFoldersToDisk(folders);
});

// IPC: Browse folder contents (lazy, non-recursive)
ipcMain.handle('browse-folder', async (event, { folderPath }) => {
  const allowedFolders = await loadAllowedFolders();
  if (!isPathAllowed(folderPath, allowedFolders)) {
    return { error: 'Access denied: folder is not in your allowed list' };
  }

  try {
    const entries = await fsp.readdir(folderPath, { withFileTypes: true });
    const items = [];
    for (const entry of entries) {
      // Skip hidden files and system files
      if (entry.name.startsWith('.') || entry.name === 'desktop.ini' || entry.name === 'Thumbs.db') continue;

      const fullPath = path.join(folderPath, entry.name);
      const isDirectory = entry.isDirectory();
      const ext = isDirectory ? '' : path.extname(entry.name).toLowerCase();

      // For files, only include allowed extensions
      if (!isDirectory && !ALLOWED_EXTENSIONS.has(ext)) continue;

      try {
        const stats = await fsp.stat(fullPath);
        items.push({
          name: entry.name,
          path: fullPath,
          isDirectory,
          size: stats.size,
          modifiedTime: stats.mtime.toISOString(),
          extension: ext,
        });
      } catch (statErr) {
        // Skip files we can't stat (permission errors, etc.)
      }
    }

    // Sort: directories first, then by name
    items.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });

    return { items };
  } catch (err) {
    log.error('Error browsing folder:', err);
    return { error: err.message };
  }
});

// IPC: Read file content (returns base64 to avoid ArrayBuffer serialization issues)
ipcMain.handle('read-file-content', async (event, { filePath }) => {
  const allowedFolders = await loadAllowedFolders();
  if (!isPathAllowed(filePath, allowedFolders)) {
    return { error: 'Access denied: file is not in an allowed folder' };
  }

  try {
    const stats = await fsp.stat(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      return { error: `File too large (${(stats.size / 1024 / 1024).toFixed(1)}MB). Maximum is 50MB.` };
    }

    const buffer = await fsp.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return {
      base64: buffer.toString('base64'),
      fileName: path.basename(filePath),
      size: stats.size,
      extension: ext,
    };
  } catch (err) {
    log.error('Error reading file:', err);
    return { error: err.message };
  }
});

// IPC: Open file in default external application (Word, PowerPoint, etc.)
ipcMain.handle('open-file-external', async (event, { filePath }) => {
  const allowedFolders = await loadAllowedFolders();
  if (!isPathAllowed(filePath, allowedFolders)) {
    return { error: 'Access denied: file is not in an allowed folder' };
  }

  try {
    const result = await shell.openPath(filePath);
    if (result) {
      return { error: result }; // shell.openPath returns empty string on success, error message on failure
    }
    return { success: true };
  } catch (err) {
    log.error('Error opening file externally:', err);
    return { error: err.message };
  }
});

// IPC: Search files recursively across allowed folders
ipcMain.handle('search-files', async (event, { query, folders, extensions }) => {
  const allowedFolders = await loadAllowedFolders();
  const searchFolders = (folders || allowedFolders).filter(f => isPathAllowed(f, allowedFolders));
  const queryLower = query.toLowerCase();
  const results = [];
  const MAX_RESULTS = 200;

  async function searchDir(dirPath, depth) {
    if (results.length >= MAX_RESULTS || depth > 10) return;
    try {
      const entries = await fsp.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        if (results.length >= MAX_RESULTS) break;
        if (entry.name.startsWith('.')) continue;

        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          await searchDir(fullPath, depth + 1);
        } else {
          const ext = path.extname(entry.name).toLowerCase();
          if (!ALLOWED_EXTENSIONS.has(ext)) continue;
          if (extensions && extensions.length > 0 && !extensions.includes(ext)) continue;
          if (!entry.name.toLowerCase().includes(queryLower)) continue;

          try {
            const stats = await fsp.stat(fullPath);
            results.push({
              name: entry.name,
              path: fullPath,
              isDirectory: false,
              size: stats.size,
              modifiedTime: stats.mtime.toISOString(),
              extension: ext,
            });
          } catch (statErr) {
            // Skip files we can't stat
          }
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }

  for (const folder of searchFolders) {
    if (results.length >= MAX_RESULTS) break;
    await searchDir(folder, 0);
  }

  return { items: results };
});

// IPC: Create a new folder inside an allowed folder
ipcMain.handle('create-folder', async (event, { folderPath }) => {
  const allowedFolders = await loadAllowedFolders();
  if (!isPathAllowed(folderPath, allowedFolders)) {
    return { error: 'Access denied: path is not in an allowed folder' };
  }

  try {
    try { await fsp.access(folderPath); return { success: true, alreadyExists: true }; } catch {}
    await fsp.mkdir(folderPath, { recursive: true });
    log.info(`Created folder: ${folderPath}`);
    return { success: true };
  } catch (err) {
    log.error('Error creating folder:', err);
    return { error: err.message };
  }
});

// IPC: Move a single file (both source and destination must be in allowed folders)
ipcMain.handle('move-file', async (event, { sourcePath, destPath }) => {
  const allowedFolders = await loadAllowedFolders();
  if (!isPathAllowed(sourcePath, allowedFolders) || !isPathAllowed(destPath, allowedFolders)) {
    return { error: 'Access denied: source or destination is not in an allowed folder' };
  }

  try {
    try { await fsp.access(destPath); return { error: 'A file with this name already exists at the destination' }; } catch {}
    await fsp.mkdir(path.dirname(destPath), { recursive: true });
    // Try rename first (atomic on same drive), fall back to copy+delete
    try {
      await fsp.rename(sourcePath, destPath);
    } catch (renameErr) {
      await fsp.copyFile(sourcePath, destPath);
      await fsp.unlink(sourcePath);
    }
    log.info(`Moved file: ${sourcePath} -> ${destPath}`);
    return { success: true };
  } catch (err) {
    log.error('Error moving file:', err);
    return { error: err.message };
  }
});

// IPC: Move multiple files at once (for AI-organized cleanup)
ipcMain.handle('move-files-batch', async (event, { moves }) => {
  // moves: Array of { sourcePath, destPath }
  const allowedFolders = await loadAllowedFolders();
  const results = [];
  const undoLog = [];

  for (const move of moves) {
    if (!isPathAllowed(move.sourcePath, allowedFolders) || !isPathAllowed(move.destPath, allowedFolders)) {
      results.push({ source: move.sourcePath, success: false, error: 'Access denied' });
      continue;
    }

    try {
      let destExists = false;
      try { await fsp.access(move.destPath); destExists = true; } catch {}
      if (destExists) {
        results.push({ source: move.sourcePath, success: false, error: 'File already exists at destination' });
        continue;
      }
      await fsp.mkdir(path.dirname(move.destPath), { recursive: true });
      try {
        await fsp.rename(move.sourcePath, move.destPath);
      } catch (renameErr) {
        await fsp.copyFile(move.sourcePath, move.destPath);
        await fsp.unlink(move.sourcePath);
      }
      results.push({ source: move.sourcePath, success: true });
      undoLog.push({ sourcePath: move.destPath, destPath: move.sourcePath });
    } catch (err) {
      results.push({ source: move.sourcePath, success: false, error: err.message });
    }
  }

  const succeeded = results.filter(r => r.success).length;
  log.info(`Batch move: ${succeeded}/${moves.length} files moved successfully`);
  return { results, undoLog };
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info.version);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update-available', info);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info.version);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update-downloaded', info);
  }
});

// App lifecycle
app.whenReady().then(async () => {
  if (!gotTheLock) return; // Second instance — bail out
  log.info('App ready, starting initialization...');

  try {
    // === First install cleanup logic (must run before window creation) ===
    const userDataPath = app.getPath('userData');
    const firstRunFlag = path.join(userDataPath, 'firstrun.json');
    const { session } = require('electron');

    if (!fs.existsSync(firstRunFlag)) {
      log.info('First install detected — clearing cache and stale data.');
      const defaultSession = session.defaultSession;

      await defaultSession.clearCache();
      await defaultSession.clearStorageData({
        storages: [
          'cookies',
          'indexdb',
          'serviceworkers'
        ],
      });

      fs.writeFileSync(firstRunFlag, JSON.stringify({ initialized: true }));
    }

    // === Create main window with splashscreen ===
    createWindow();

    // === Setup image generation models (first run only) ===
    await setupImageGenerationModels();

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
  // Don't quit if minimized to tray
  if (minimizeToTray) return;
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
  isQuitting = true;
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
  destroyTray();
  if (backendProcess && !backendProcess.killed) {
    try {
      killProcessTree(backendProcess.pid);
    } catch (error) {
      log.error('Error in final cleanup:', error.message);
    }
  }

  // If no errors occurred this session, replace log file with a clean message
  if (!sessionHasErrors) {
    try {
      const logPath = path.join(logsDir, 'main.logs');
      const cleanMsg = [
        `Session ended: ${new Date().toISOString()}`,
        `App version: ${app.getVersion()}`,
        `Platform: ${process.platform} ${process.arch}`,
        '',
        'No errors occurred during this session.',
        '',
      ].join('\n');
      fs.writeFileSync(logPath, cleanMsg, 'utf-8');
    } catch (e) {
      // Can't log here — just ignore
    }
  }
});

log.info('Main process loaded');