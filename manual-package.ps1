# Manual packaging script with fixes
Write-Host "Creating backend bundle manually..." -ForegroundColor Green

# Create directories
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

Write-Host "Copying model file (this may take a while)..." -ForegroundColor Yellow
# Copy model file dynamically based on backend/config.py
# Get the MODEL_NAME value from backend/config.py
$python = "python"
$modelName = & $python -c "import sys; sys.path.append('backend'); from config import MODEL_NAME; print(MODEL_NAME)"

$modelPath = "backend\$modelName"
if (Test-Path $modelPath) {
    Copy-Item $modelPath -Destination $bundleDir
} else {
    Write-Host "WARNING: Model file $modelName not found in backend!" -ForegroundColor Red
}

Write-Host "Copying llama-cli..." -ForegroundColor Yellow
# Copy llama-cli
if (Test-Path "backend\bin\Release") {
    Copy-Item "backend\bin\Release\*" -Destination "$bundleDir\bin\Release" -Recurse
}

Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
# Install dependencies using SYSTEM Python (not embedded Python yet)
py -m pip install --no-user fastapi uvicorn pydantic python-multipart --target "$bundleDir\python_libs" --upgrade --no-warn-script-location

Write-Host "Copying embedded Python..." -ForegroundColor Yellow
# Copy python-embed AFTER installing dependencies
if (Test-Path "backend\python-embed") {
    Copy-Item "backend\python-embed" -Destination "$bundleDir\python-embed" -Recurse
} else {
    Write-Host "ERROR: python-embed not found in backend folder!" -ForegroundColor Red
    exit 1
}

# Create a simple startup script
Write-Host "Creating startup script..." -ForegroundColor Yellow
@"
import sys
import os

# Add python_libs to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python_libs'))
os.environ['PYTHONPATH'] = os.path.join(os.path.dirname(__file__), 'python_libs')

print("Starting backend server...")
print(f"Python: {sys.executable}")
print(f"Working dir: {os.getcwd()}")

try:
    import uvicorn
    from main import app
    
    print("Starting Uvicorn server on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
except Exception as e:
    print(f"Error starting server: {e}")
    import traceback
    traceback.print_exc()
    input("Press Enter to exit...")
"@ | Out-File -FilePath "$bundleDir\start_backend.py" -Encoding UTF8

# Create a test script
@"
import sys
import os

print("Python test successful!")
print(f"Version: {sys.version}")
print(f"Executable: {sys.executable}")

# Test if dependencies are available
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python_libs'))
try:
    import fastapi
    print("✓ FastAPI found!")
except Exception as e:
    print(f"✗ FastAPI not found: {e}")

try:
    import uvicorn
    print("✓ Uvicorn found!")
except Exception as e:
    print(f"✗ Uvicorn not found: {e}")
"@ | Out-File -FilePath "$bundleDir\test.py" -Encoding UTF8

Write-Host "Testing Python installation..." -ForegroundColor Yellow
& "$bundleDir\python-embed\python.exe" "$bundleDir\test.py"

Write-Host "Backend bundle created successfully!" -ForegroundColor Green
Write-Host "Bundle location: $bundleDir" -ForegroundColor Cyan