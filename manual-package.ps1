Write-Host "Creating backend bundle..." -ForegroundColor Green

$bundleDir = "backend-bundle"
if (Test-Path $bundleDir) {
    Remove-Item $bundleDir -Recurse -Force
}
New-Item -ItemType Directory -Path $bundleDir
New-Item -ItemType Directory -Path "$bundleDir\bin\Release"
New-Item -ItemType Directory -Path "$bundleDir\python_libs"

Write-Host "Copying backend files..." -ForegroundColor Yellow

# Copy ALL required Python files and directories from backend (excluding dev/test scripts, if any)
Get-ChildItem "backend\*.py" | ForEach-Object {
    Copy-Item $_.FullName -Destination $bundleDir
}

# Copy all directories EXCEPT bin, data, and models\image_generation
Get-ChildItem "backend\*" -Recurse -Directory | Where-Object {
    $_.Name -ne "bin" -and 
    $_.Name -ne "data" -and 
    $_.FullName -notlike "*\models\image_generation*"
} | ForEach-Object {
    # Get relative path from backend
    $relativePath = $_.FullName -replace [regex]::Escape((Resolve-Path "backend").Path + "\"), ""
    $destPath = Join-Path $bundleDir $relativePath
    
    # Create parent directory if needed
    $parentDir = Split-Path $destPath -Parent
    if (-not (Test-Path $parentDir)) {
        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
    }
    
    # Copy the directory
    if (-not (Test-Path $destPath)) {
        Copy-Item $_.FullName -Destination $destPath -Recurse -Force
    }
}

Write-Host "Skipped backend\models\image_generation (will be in installer)" -ForegroundColor Cyan

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
# Optionally copy other curriculum data files if needed
if (Test-Path "frontend\src\data\curriculumTree.json") {
    Copy-Item "frontend\src\data\curriculumTree.json" -Destination "$bundleDir\data\curriculumTree.json" -Force
    Write-Host "Copied curriculumTree.json" -ForegroundColor Green
}

# Copy routes folder
if (Test-Path "backend\routes") {
    Copy-Item "backend\routes" -Destination "$bundleDir\routes" -Recurse -Force
    Write-Host "Copied routes folder" -ForegroundColor Green
}

# Copy or create JSON files
if (Test-Path "backend\chat_history.json") {
    Copy-Item "backend\chat_history.json" -Destination $bundleDir
} else {
    "[]" | Out-File -FilePath "$bundleDir\chat_history.json" -Encoding UTF8
}

if (Test-Path "backend\lesson_plan_history.json") {
    Copy-Item "backend\lesson_plan_history.json" -Destination $bundleDir
} else {
    "[]" | Out-File -FilePath "$bundleDir\lesson_plan_history.json" -Encoding UTF8
}

Write-Host "Copying llama-cli..." -ForegroundColor Yellow
if (Test-Path "backend\bin\Release") {
    Copy-Item "backend\bin\Release\*" -Destination "$bundleDir\bin\Release" -Recurse
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

# === Copy curriculumIndex.json and curriculumTree.json to production resources/frontend/src/data if in production build ===
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

Write-Host "Installing dependencies..." -ForegroundColor Yellow
& $pythonCmd -m pip install `
    -r backend/requirements-lock.txt `
    --target "$bundleDir\python_libs" `
    --no-warn-script-location `
    --disable-pip-version-check

Write-Host "Copying embedded Python..." -ForegroundColor Yellow
if (Test-Path "backend\python-embed") {
    Copy-Item "backend\python-embed" -Destination "$bundleDir\python-embed" -Recurse
} else {
    Write-Host "ERROR: python-embed not found!" -ForegroundColor Red
    exit 1
}


# Copy bin contents (not the bin folder itself)
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

# Copy other folders as before
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