Write-Host "=== Building OECS Learning Hub (Model-External Build) ===" -ForegroundColor Cyan

# Step 1: Check if models folder exists
Write-Host "`n[1/6] Checking for models folder..." -ForegroundColor Yellow

# Check if models folder exists and has at least one .gguf file
if (-not (Test-Path "models")) {
    Write-Host "ERROR: Models folder not found at: models" -ForegroundColor Red
    Write-Host "Please create the models folder and add at least one model file." -ForegroundColor Yellow
    exit 1
}

$modelFiles = Get-ChildItem -Path "models" -Filter "*.gguf" -File
if ($modelFiles.Count -eq 0) {
    Write-Host "ERROR: No model files (.gguf) found in models folder" -ForegroundColor Red
    Write-Host "Please add at least one model file to the models folder." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found $($modelFiles.Count) model file(s) in models folder" -ForegroundColor Green
foreach ($file in $modelFiles) {
    $fileSize = [math]::Round($file.Length / 1MB, 2)
    Write-Host "  - $($file.Name): $fileSize MB" -ForegroundColor Cyan
}m

# Step 2: No need to move models (they stay in models/ folder)

# Step 3: Build frontend
Write-Host "`n[2/6] Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "Frontend built successfully" -ForegroundColor Green

# Step 4: Build Electron app (without model)
Write-Host "`n[3/6] Building Electron installer..." -ForegroundColor Yellow
Write-Host "Building WITHOUT model file (small installer)" -ForegroundColor Cyan

npx electron-builder --win nsis --x64

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Electron build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Installer built successfully" -ForegroundColor Green

# Step 5: Copy models folder to resources directory in unpacked app
Write-Host "`n[4/6] Copying models folder to packaged app..." -ForegroundColor Yellow
$unpackedDir = "release\win-unpacked"
if (Test-Path $unpackedDir) {
    $resourcesModelsDir = "$unpackedDir\resources\models"
    
    # Create resources/models directory if it doesn't exist
    if (-not (Test-Path $resourcesModelsDir)) {
        New-Item -ItemType Directory -Path $resourcesModelsDir -Force | Out-Null
    }
    
    # Copy entire models folder
    Copy-Item -Path "models\*" -Destination $resourcesModelsDir -Recurse -Force
    Write-Host "Models folder copied to resources/models" -ForegroundColor Green
    
    # Verify the copy
    $copiedModelFiles = Get-ChildItem -Path $resourcesModelsDir -Filter "*.gguf" -File
    if ($copiedModelFiles.Count -gt 0) {
        Write-Host "Verified: $($copiedModelFiles.Count) model file(s) copied to resources/models" -ForegroundColor Green
    } else {
        Write-Host "WARNING: No model files found in resources/models" -ForegroundColor Yellow
    }
} else {
    Write-Host "WARNING: Unpacked directory not found at $unpackedDir" -ForegroundColor Yellow
}

# Step 6: Create release package
Write-Host "`n[5/6] Creating release package..." -ForegroundColor Yellow

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

# Copy models folder (not just the model file)
Copy-Item -Path "models" -Destination "$releaseDir\models" -Recurse -Force
Write-Host "Copied models folder" -ForegroundColor Green

# Create README
@"
OECS LEARNING HUB - INSTALLATION INSTRUCTIONS
==============================================

IMPORTANT: Both files are required for installation!

FILES IN THIS FOLDER:
1. OECS-Learning-Hub-Setup.exe    (Application installer ~100-200 MB)
2. models/                        (AI Models folder)
   Contains all required AI model files (.gguf)

INSTALLATION STEPS:
-------------------
1. Run OECS-Learning-Hub-Setup.exe
2. The installer includes all necessary files
3. Follow the installation wizard
4. Launch the application from your desktop

NOTES:
------
- All AI models are already included in the installer
- Models are automatically configured and ready to use
- No manual file copying is required

TROUBLESHOOTING:
----------------
If the app doesn't work after installation:
1. Check that the models folder exists at:
   C:\Users\[YourName]\AppData\Local\Programs\oecs-learning-hub\resources\models\
2. The folder should contain .gguf model files
3. Verify the model files are not corrupted

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