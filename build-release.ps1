Write-Host "=== Building OECS Learning Hub (Complete Build) ===" -ForegroundColor Cyan

# Step 0: Package Backend
Write-Host "`n[0/7] Packaging backend..." -ForegroundColor Yellow

# Clean old backend bundle
if (Test-Path "backend-bundle") {
    Remove-Item "backend-bundle" -Recurse -Force
}

# Run the backend packaging
Write-Host "Running backend packaging script..." -ForegroundColor Cyan
.\manual-package.ps1

if (-not (Test-Path "backend-bundle")) {
    Write-Host "ERROR: Backend bundle was not created!" -ForegroundColor Red
    exit 1
}

Write-Host "Backend packaged successfully" -ForegroundColor Green

# Step 1: Check if models folder exists
Write-Host "`n[1/7] Checking for models folder..." -ForegroundColor Yellow

if (-not (Test-Path "models")) {
    Write-Host "ERROR: Models folder not found at: models" -ForegroundColor Red
    exit 1
}

$modelFiles = Get-ChildItem -Path "models" -Filter "*.gguf" -File
if ($modelFiles.Count -eq 0) {
    Write-Host "ERROR: No model files (.gguf) found in models folder" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($modelFiles.Count) model file(s)" -ForegroundColor Green
foreach ($file in $modelFiles) {
    $fileSize = [math]::Round($file.Length / 1MB, 2)
    Write-Host "  - $($file.Name): $fileSize MB" -ForegroundColor Cyan
}

# Step 2: Build frontend
Write-Host "`n[2/7] Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "Frontend built successfully" -ForegroundColor Green

# Step 3: Build Electron app
Write-Host "`n[3/7] Building Electron installer..." -ForegroundColor Yellow
npx electron-builder --win nsis --x64

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Electron build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Installer built successfully" -ForegroundColor Green

# Step 4: Copy models
Write-Host "`n[4/7] Copying models to packaged app..." -ForegroundColor Yellow
$unpackedDir = "dist-electron\win-unpacked"

if (Test-Path $unpackedDir) {
    $resourcesModelsDir = "$unpackedDir\resources\models"
    
    if (-not (Test-Path $resourcesModelsDir)) {
        New-Item -ItemType Directory -Path $resourcesModelsDir -Force | Out-Null
    }
    
    Copy-Item -Path "models\*" -Destination $resourcesModelsDir -Recurse -Force
    Write-Host "Models copied" -ForegroundColor Green
    
    $copiedModelFiles = Get-ChildItem -Path $resourcesModelsDir -Filter "*.gguf" -File
    Write-Host "Verified: $($copiedModelFiles.Count) model(s)" -ForegroundColor Green
} else {
    Write-Host "WARNING: Unpacked directory not found" -ForegroundColor Yellow
}

# Step 5: Test backend
Write-Host "`n[5/7] Testing backend..." -ForegroundColor Yellow
$backendPython = "$unpackedDir\resources\backend-bundle\python-embed\python.exe"

if (Test-Path $backendPython) {
    Write-Host "Backend Python found" -ForegroundColor Green
} else {
    Write-Host "WARNING: Backend Python not found" -ForegroundColor Yellow
}

# Step 6: Create release package
Write-Host "`n[6/7] Creating RELEASE folder..." -ForegroundColor Yellow

$releaseDir = "RELEASE"
if (Test-Path $releaseDir) {
    Remove-Item $releaseDir -Recurse -Force
}
New-Item -ItemType Directory -Path $releaseDir | Out-Null

# Copy installer
$installer = Get-ChildItem "dist-electron\*.exe" | Select-Object -First 1
if ($installer) {
    Copy-Item $installer.FullName "$releaseDir\OECS-Learning-Hub-Setup.exe"
    Write-Host "Copied installer" -ForegroundColor Green
} else {
    Write-Host "ERROR: Installer not found!" -ForegroundColor Red
    exit 1
}

# Copy models
Copy-Item -Path "models" -Destination "$releaseDir\models" -Recurse -Force
Write-Host "Copied models" -ForegroundColor Green

# Create README
$readmeText = "OECS LEARNING HUB - INSTALLATION`n`n"
$readmeText += "FILES:`n"
$readmeText += "1. OECS-Learning-Hub-Setup.exe`n"
$readmeText += "2. models/ folder`n`n"
$readmeText += "INSTALL:`n"
$readmeText += "Run the .exe installer`n`n"
$readmeText += "Support: delon.pierre@oecs.int`n"
$readmeText += "Built: $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n"

$readmeText | Out-File -FilePath "$releaseDir\README.txt" -Encoding UTF8
Write-Host "Created README" -ForegroundColor Green

# Summary
Write-Host "`n=== BUILD COMPLETE ===" -ForegroundColor Green

$totalSize = (Get-ChildItem $releaseDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB
Write-Host "Total size: $([math]::Round($totalSize, 2)) GB" -ForegroundColor Cyan
Write-Host "`nRELEASE folder ready!" -ForegroundColor Green