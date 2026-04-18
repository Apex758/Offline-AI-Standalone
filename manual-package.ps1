Write-Host "Creating backend bundle..." -ForegroundColor Green

$bundleDir = "backend-bundle"
if (Test-Path $bundleDir) {
    Remove-Item $bundleDir -Recurse -Force
}
New-Item -ItemType Directory -Path $bundleDir
New-Item -ItemType Directory -Path "$bundleDir\bin\Release"
New-Item -ItemType Directory -Path "$bundleDir\python_libs"

Write-Host "Copying backend files..." -ForegroundColor Yellow

# Copy ALL Python files from backend root
Get-ChildItem "backend\*.py" | ForEach-Object {
    Copy-Item $_.FullName -Destination $bundleDir
}

# Whitelist of directories to copy (excludes venv, python-embed, var, __pycache__, bin, data, models)
$allowedFolders = @("routes", "share", "ssl", "etc", "lib", "milestones")

Get-ChildItem "backend\*" -Directory | Where-Object {
    $allowedFolders -contains $_.Name
} | ForEach-Object {
    Write-Host "Copying folder: $($_.Name)" -ForegroundColor Cyan
    Copy-Item $_.FullName -Destination $bundleDir -Recurse -Force
}

Write-Host "Copied essential backend folders (excluding venv, var, __pycache__)" -ForegroundColor Green

# Copy data folder
if (Test-Path "backend\data") {
    Copy-Item "backend\data" -Destination "$bundleDir\data" -Recurse -Force
    Write-Host "Copied data folder" -ForegroundColor Green
}

# Copy curriculumIndex.json and curriculum data if present
if (Test-Path "frontend\src\data\curriculumIndex.json") {
    if (-not (Test-Path "$bundleDir\data")) {
        New-Item -ItemType Directory -Path "$bundleDir\data"
    }
    Copy-Item "frontend\src\data\curriculumIndex.json" -Destination "$bundleDir\data\curriculumIndex.json" -Force
    Write-Host "Copied curriculumIndex.json" -ForegroundColor Green
}

if (Test-Path "frontend\src\data\curriculumTree.json") {
    Copy-Item "frontend\src\data\curriculumTree.json" -Destination "$bundleDir\data\curriculumTree.json" -Force
    Write-Host "Copied curriculumTree.json" -ForegroundColor Green
}

# Copy routes folder
if (Test-Path "backend\routes") {
    Copy-Item "backend\routes" -Destination "$bundleDir\routes" -Recurse -Force
    Write-Host "Copied routes folder" -ForegroundColor Green
}

# Create empty JSON files
"[]" | Out-File -FilePath "$bundleDir\chat_history.json" -Encoding UTF8
"[]" | Out-File -FilePath "$bundleDir\lesson_plan_history.json" -Encoding UTF8

Write-Host "Copying llama-cli and required DLLs only..." -ForegroundColor Yellow
if (Test-Path "backend\bin\Release") {
    # Only copy llama-cli.exe and required DLLs (skip test-*.exe and other llama-*.exe)
    $requiredFiles = @("llama-cli.exe", "*.dll")
    foreach ($pattern in $requiredFiles) {
        Get-ChildItem "backend\bin\Release\$pattern" -ErrorAction SilentlyContinue | ForEach-Object {
            Copy-Item $_.FullName -Destination "$bundleDir\bin\Release"
        }
    }
    Write-Host "Copied llama-cli.exe and DLLs (skipped test binaries and unused llama tools)" -ForegroundColor Green
}

# Find Python
$pythonCmd = $null
foreach ($cmd in @('python', 'py', 'python3')) {
    try {
        $null = & $cmd --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $pythonCmd = $cmd
            break
        }
    } catch { continue }
}

# Copy curriculumIndex.json and curriculumTree.json to production resources/frontend/src/data
$prodFrontendDataDir = "resources/frontend/src/data"
if (-not (Test-Path $prodFrontendDataDir)) {
    New-Item -ItemType Directory -Path $prodFrontendDataDir -Force | Out-Null
}
if (Test-Path "frontend\src\data\curriculumIndex.json") {
    Copy-Item "frontend\src\data\curriculumIndex.json" -Destination "$prodFrontendDataDir\curriculumIndex.json" -Force
    Write-Host "Copied curriculumIndex.json to production frontend data dir" -ForegroundColor Green
}
if (Test-Path "frontend\src\data\curriculumTree.json") {
    Copy-Item "frontend\src\data\curriculumTree.json" -Destination "$prodFrontendDataDir\curriculumTree.json" -Force
    Write-Host "Copied curriculumTree.json to production frontend data dir" -ForegroundColor Green
}

if (-not $pythonCmd) {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    exit 1
}

# ========================================
# Detect GPU and install llama-cpp-python
# ========================================
Write-Host "Detecting GPU..." -ForegroundColor Yellow
$hasNvidiaGpu = $false
try {
    $nvidiaSmi = Get-Command "nvidia-smi" -ErrorAction SilentlyContinue
    if ($nvidiaSmi) {
        $gpuInfo = & nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits 2>$null
        if ($LASTEXITCODE -eq 0 -and $gpuInfo) {
            $gpuName = ($gpuInfo -split ",")[0].Trim()
            $gpuVram = ($gpuInfo -split ",")[1].Trim()
            Write-Host "NVIDIA GPU detected: $gpuName ($gpuVram MB VRAM)" -ForegroundColor Green
            $hasNvidiaGpu = $true
        }
    }
} catch {
    Write-Host "GPU detection failed, defaulting to CPU" -ForegroundColor Yellow
}

if (-not $hasNvidiaGpu) {
    Write-Host "No NVIDIA GPU detected, will use CPU-only mode" -ForegroundColor Yellow
}

# Install dependencies (excluding llama-cpp-python, which needs special handling)
Write-Host "Installing dependencies (excluding llama-cpp-python)..." -ForegroundColor Yellow

# Create a temporary requirements file without llama-cpp-python
$tempReqs = "$bundleDir\requirements-no-llama.txt"
Get-Content "backend/requirements-lock.txt" | Where-Object { $_ -notmatch "llama-cpp-python" } | Set-Content $tempReqs

& $pythonCmd -m pip install `
    -r $tempReqs `
    --target "$bundleDir\python_libs" `
    --no-warn-script-location `
    --disable-pip-version-check

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

Remove-Item $tempReqs -ErrorAction SilentlyContinue

# Install llama-cpp-python separately using pre-built wheels (no compiler needed)
if ($hasNvidiaGpu) {
    Write-Host "Installing llama-cpp-python with CUDA support (pre-built wheel)..." -ForegroundColor Cyan
    & $pythonCmd -m pip install `
        llama-cpp-python==0.3.19 `
        --target "$bundleDir\python_libs" `
        --force-reinstall --no-deps `
        --no-warn-script-location `
        --disable-pip-version-check `
        --only-binary llama-cpp-python `
        --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cu124

    if ($LASTEXITCODE -eq 0) {
        Write-Host "llama-cpp-python (CUDA) installed successfully" -ForegroundColor Green
    } else {
        Write-Host "CUDA install failed, falling back to CPU pre-built wheel..." -ForegroundColor Yellow
        & $pythonCmd -m pip install `
            llama-cpp-python==0.3.19 `
            --target "$bundleDir\python_libs" `
            --no-deps `
            --no-warn-script-location `
            --disable-pip-version-check `
            --only-binary llama-cpp-python `
            --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cpu
    }
} else {
    Write-Host "Installing CPU-only llama-cpp-python (pre-built wheel)..." -ForegroundColor Yellow
    & $pythonCmd -m pip install `
        llama-cpp-python==0.3.19 `
        --target "$bundleDir\python_libs" `
        --no-deps `
        --no-warn-script-location `
        --disable-pip-version-check `
        --only-binary llama-cpp-python `
        --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cpu

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: llama-cpp-python failed to install! No pre-built wheel found for this Python version." -ForegroundColor Red
        exit 1
    }
}

# Verify llama-cpp-python was installed
if (-not (Test-Path "$bundleDir\python_libs\llama_cpp")) {
    Write-Host "ERROR: llama-cpp-python not found in python_libs after install!" -ForegroundColor Red
    exit 1
}
Write-Host "llama-cpp-python verified in python_libs" -ForegroundColor Green

Write-Host "Copying embedded Python..." -ForegroundColor Yellow
if (Test-Path "backend\python-embed") {
    Copy-Item "backend\python-embed" -Destination "$bundleDir\python-embed" -Recurse
} else {
    Write-Host "ERROR: python-embed not found!" -ForegroundColor Red
    exit 1
}

# Clean unnecessary files from python-embed to reduce bundle size
Write-Host "Cleaning python-embed bloat..." -ForegroundColor Yellow
$cleanupPaths = @(
    "$bundleDir\python-embed\Scripts",
    "$bundleDir\python-embed\Lib\site-packages\cmake",
    "$bundleDir\python-embed\Lib\site-packages\setuptools",
    "$bundleDir\python-embed\Lib\site-packages\pip"
)
foreach ($path in $cleanupPaths) {
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force
        Write-Host "  Removed: $path" -ForegroundColor DarkYellow
    }
}
# Remove protoc.exe from torch if present
$protocPath = "$bundleDir\python-embed\Lib\site-packages\torch\bin\protoc.exe"
if (Test-Path $protocPath) {
    Remove-Item $protocPath -Force
    Write-Host "  Removed: protoc.exe from torch" -ForegroundColor DarkYellow
}
Write-Host "Python-embed cleanup complete" -ForegroundColor Green

# Copy bin contents
$srcBin = "backend\bin"
$dstBin = "backend-bundle\bin"
if (Test-Path $srcBin) {
    Write-Host "Copying GTK bin contents from backend/bin to backend-bundle/bin" -ForegroundColor Yellow
    if (-not (Test-Path $dstBin)) { New-Item -ItemType Directory -Path $dstBin | Out-Null }
    Copy-Item "$srcBin\*" -Destination $dstBin -Recurse -Force
    if ((Get-ChildItem $dstBin -Recurse | Measure-Object).Count -eq 0) {
        Write-Host "ERROR: bin was copied but destination is empty!" -ForegroundColor Red
        exit 1
    }
}

# Copy other GTK folders
$gtkFolders = @("etc", "lib", "share", "ssl")
foreach ($folder in $gtkFolders) {
    $src = Join-Path "backend" $folder
    $dst = Join-Path $bundleDir $folder
    if (Test-Path $src) {
        Write-Host "Copying GTK folder: $folder from backend/" -ForegroundColor Yellow
        try {
            Copy-Item $src -Destination $dst -Recurse -Force -ErrorAction Stop
            if ((Get-ChildItem $dst -Recurse | Measure-Object).Count -eq 0) {
                Write-Host "ERROR: $folder was copied but destination is empty!" -ForegroundColor Red
                exit 1
            }
        } catch {
            Write-Host "ERROR: Failed to copy $folder from backend/ to backend-bundle/: $_" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Warning: GTK folder $folder not found in backend/" -ForegroundColor Yellow
    }
}
Write-Host "Verified GTK runtime folders (bin, etc, lib, share, ssl) from backend/ to backend-bundle" -ForegroundColor Green

# Copy pyzbar DLLs to bin/ so they're on PATH at runtime
$pyzbarDir = "$bundleDir\python_libs\pyzbar"
if (Test-Path $pyzbarDir) {
    Get-ChildItem "$pyzbarDir\*.dll" -ErrorAction SilentlyContinue | ForEach-Object {
        Copy-Item $_.FullName -Destination "$bundleDir\bin\" -Force
        Write-Host "Copied pyzbar DLL: $($_.Name) to bin/" -ForegroundColor Cyan
    }
    # Also check for DLLs in a nested folder (some pyzbar versions)
    Get-ChildItem "$pyzbarDir\*\*.dll" -ErrorAction SilentlyContinue | ForEach-Object {
        Copy-Item $_.FullName -Destination "$bundleDir\bin\" -Force
        Write-Host "Copied pyzbar DLL: $($_.Name) to bin/" -ForegroundColor Cyan
    }
    Write-Host "pyzbar DLLs copied to bin/ for runtime discovery" -ForegroundColor Green
} else {
    Write-Host "Warning: pyzbar not found in python_libs - QR scanning may not work in packaged app" -ForegroundColor Yellow
}

# Create startup script
@"
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
python_libs = os.path.join(script_dir, 'python_libs')
sys.path.insert(0, python_libs)
sys.path.insert(0, script_dir)

#  CRITICAL: Force Python to use bundled GTK DLLs BEFORE imports
if sys.platform == "win32":
    gtk_bin = os.path.join(script_dir, "bin")
    if os.path.isdir(gtk_bin):
        if hasattr(os, "add_dll_directory"):
            os.add_dll_directory(gtk_bin)
        os.environ["PATH"] = gtk_bin + os.pathsep + os.environ.get("PATH", "")
        os.environ.setdefault("GTK_BASEPATH", script_dir)
        os.environ.setdefault("GTK_DATA_PREFIX", script_dir)

print("Starting backend server...")
print(f"Python: {sys.executable}")
print(f"Backend dir: {script_dir}")

try:
    import uvicorn
    from main import app
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    input("Press Enter to exit...")
    sys.exit(1)
"@ | Out-File -FilePath "$bundleDir\start_backend.py" -Encoding UTF8

Write-Host "Backend bundle complete!" -ForegroundColor Green