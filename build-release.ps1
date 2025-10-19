Write-Host "=== Building OECS Learning Hub (Model-External Build) ===" -ForegroundColor Cyan

# Step 1: Check if model file exists
Write-Host "`n[1/6] Checking for model file..." -ForegroundColor Yellow
# Get MODEL_NAME dynamically from backend/config.py
$python = "python"
$modelName = & $python -c "import sys; sys.path.append('backend'); from config import MODEL_NAME; print(MODEL_NAME)"
$modelFile = "backend-bundle\$modelName"

if (-not (Test-Path $modelFile)) {
    Write-Host "ERROR: Model file not found at: $modelFile" -ForegroundColor Red
    Write-Host "Please ensure the model file exists before building." -ForegroundColor Yellow
    exit 1
}

$modelSize = [math]::Round((Get-Item $modelFile).Length / 1MB, 2)
Write-Host "Found model file: $modelSize MB" -ForegroundColor Green

# Step 2: Temporarily move model file out of backend-bundle
Write-Host "`n[2/6] Temporarily moving model file..." -ForegroundColor Yellow
$tempModelLocation = "llama-model-temp.gguf"

Move-Item $modelFile $tempModelLocation -Force
Write-Host "Model moved to temp location" -ForegroundColor Green

# Step 3: Build frontend
Write-Host "`n[3/6] Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    # Move model back
    Move-Item ..\$tempModelLocation ..\$modelFile -Force
    exit 1
}
Set-Location ..
Write-Host "Frontend built successfully" -ForegroundColor Green

# Step 4: Build Electron app (without model)
Write-Host "`n[4/6] Building Electron installer..." -ForegroundColor Yellow
Write-Host "Building WITHOUT model file (small installer)" -ForegroundColor Cyan

npx electron-builder --win nsis --x64

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Electron build failed!" -ForegroundColor Red
    # Move model back
    Move-Item $tempModelLocation $modelFile -Force
    exit 1
}

Write-Host "Installer built successfully" -ForegroundColor Green

# Step 5: Move model back to backend-bundle
Write-Host "`n[5/6] Restoring model file..." -ForegroundColor Yellow
Move-Item $tempModelLocation $modelFile -Force
Write-Host "Model file restored" -ForegroundColor Green

# Step 6: Create release package
Write-Host "`n[6/6] Creating release package..." -ForegroundColor Yellow

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

# Copy model file
Copy-Item $modelFile "$releaseDir\$modelName"
Write-Host "Copied model file ($modelName)" -ForegroundColor Green

# Create README
@"
OECS LEARNING HUB - INSTALLATION INSTRUCTIONS
==============================================

IMPORTANT: Both files are required for installation!

FILES IN THIS FOLDER:
1. OECS-Learning-Hub-Setup.exe    (Application installer ~100-200 MB)
2. $modelName    (AI Model ~900 MB)

INSTALLATION STEPS:
-------------------
1. Keep BOTH files in the SAME folder
2. Run OECS-Learning-Hub-Setup.exe
3. The installer will automatically detect and copy the model file
4. Follow the installation wizard
5. Launch the application from your desktop

NOTES:
------
- The model file MUST be in the same folder as the installer
- If the installer doesn't find the model, you can manually copy it later
- Manual copy location: C:\Users\[YourName]\AppData\Local\Programs\oecs-learning-hub\resources\backend-bundle\

TROUBLESHOOTING:
----------------
If the app doesn't work after installation:
1. Check that the model file is in: 
   C:\Users\[YourName]\AppData\Local\Programs\oecs-learning-hub\resources\backend-bundle\
2. The file should be named: $modelName
3. The file size should be around 900 MB

For support, contact: delon.pierre@oecs.int

Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@ | Out-File -FilePath "$releaseDir\INSTALLATION-INSTRUCTIONS.txt" -Encoding UTF8

Write-Host "Created installation instructions" -ForegroundColor Green

# Show summary
Write-Host "`n=== BUILD COMPLETE ===" -ForegroundColor Green
Write-Host "`nRelease package created in: $releaseDir\" -ForegroundColor Cyan

Write-Host "`nPackage Contents:" -ForegroundColor Yellow
Get-ChildItem $releaseDir | ForEach-Object {
    $size = if ($_.PSIsContainer) { "Folder" } else { "$([math]::Round($_.Length / 1MB, 2)) MB" }
    Write-Host "  - $($_.Name) ($size)" -ForegroundColor White
}

$totalSize = (Get-ChildItem $releaseDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB
Write-Host "`nTotal package size: $([math]::Round($totalSize, 2)) GB" -ForegroundColor Cyan

Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Test the installer by running it from the RELEASE folder" -ForegroundColor White
Write-Host "2. Both files MUST stay in the same folder during installation" -ForegroundColor White
Write-Host "3. Distribute the entire RELEASE folder to users" -ForegroundColor White

Write-Host "`nDistribution Options:" -ForegroundColor Yellow
Write-Host "- Create a ZIP: Compress-Archive -Path RELEASE\* -DestinationPath OECS-Learning-Hub-v1.0.zip" -ForegroundColor Gray
Write-Host "- Upload both files together to cloud storage" -ForegroundColor Gray
Write-Host "- Create a Google Drive/OneDrive shared folder with both files" -ForegroundColor Gray