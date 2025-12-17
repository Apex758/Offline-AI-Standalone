# Manual packaging script - FINAL VERSION (No blocking tests)
Write-Host "Creating backend bundle..." -ForegroundColor Green

$bundleDir = "backend-bundle"
if (Test-Path $bundleDir) {
    Remove-Item $bundleDir -Recurse -Force
}
New-Item -ItemType Directory -Path $bundleDir
New-Item -ItemType Directory -Path "$bundleDir\bin\Release"
New-Item -ItemType Directory -Path "$bundleDir\python_libs"

Write-Host "Copying backend files..." -ForegroundColor Yellow

# Copy Python files
Copy-Item "backend\main.py" -Destination $bundleDir
Copy-Item "backend\config.py" -Destination $bundleDir
Copy-Item "backend\llama_inference.py" -Destination $bundleDir -ErrorAction SilentlyContinue

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

if (-not $pythonCmd) {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
& $pythonCmd -m pip install --no-user fastapi uvicorn pydantic python-multipart websockets llama-cpp-python --target "$bundleDir\python_libs" --upgrade --no-warn-script-location | Out-Null

Write-Host "Copying embedded Python..." -ForegroundColor Yellow
if (Test-Path "backend\python-embed") {
    Copy-Item "backend\python-embed" -Destination "$bundleDir\python-embed" -Recurse
} else {
    Write-Host "ERROR: python-embed not found!" -ForegroundColor Red
    exit 1
}

# Create startup script
@"
import sys
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
python_libs = os.path.join(script_dir, 'python_libs')
sys.path.insert(0, python_libs)
sys.path.insert(0, script_dir)

print("Starting backend server...")
print(f"Python: {sys.executable}")

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