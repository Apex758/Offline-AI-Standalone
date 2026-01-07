Write-Host "=== Building OECS Learning Hub (Complete Build) ===" -ForegroundColor Cyan

# Step 0: Package Backend
Write-Host "`n[0/8] Packaging backend..." -ForegroundColor Yellow

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

# Step 1: Check if models folders exist
Write-Host "`n[1/8] Checking for models..." -ForegroundColor Yellow

# Check LLaMA models (existing)
if (-not (Test-Path "models")) {
    Write-Host "ERROR: Models folder not found at: models" -ForegroundColor Red
    exit 1
}

$modelFiles = Get-ChildItem -Path "models" -Filter "*.gguf" -File
if ($modelFiles.Count -eq 0) {
    Write-Host "ERROR: No LLaMA model files (.gguf) found in models folder" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($modelFiles.Count) LLaMA model file(s)" -ForegroundColor Green
foreach ($file in $modelFiles) {
    $fileSize = [math]::Round($file.Length / 1MB, 2)
    Write-Host "  - $($file.Name): $fileSize MB" -ForegroundColor Cyan
}

# Check Image Generation models (NEW)
$imageModelsDir = "backend\models\image_generation"
if (-not (Test-Path $imageModelsDir)) {
    Write-Host "WARNING: Image generation models not found at: $imageModelsDir" -ForegroundColor Yellow
    Write-Host "Run setup-models.ps1 first to copy image models" -ForegroundColor Yellow
    Write-Host "Build will continue without image generation support..." -ForegroundColor Yellow
    $hasImageModels = $false
} else {
    $sdxlPath = Join-Path $imageModelsDir "sdxl-turbo-openvino"
    $lamaPath = Join-Path $imageModelsDir "lama"
    
    $sdxlExists = Test-Path $sdxlPath
    $lamaExists = Test-Path $lamaPath
    
    if ($sdxlExists -and $lamaExists) {
        Write-Host "✅ Image generation models found:" -ForegroundColor Green
        Write-Host "  - SDXL-Turbo: $sdxlPath" -ForegroundColor Cyan
        Write-Host "  - LaMa: $lamaPath" -ForegroundColor Cyan
        $hasImageModels = $true
    } else {
        Write-Host "WARNING: Incomplete image models. Run setup-models.ps1" -ForegroundColor Yellow
        $hasImageModels = $false
    }
}

# Step 2: Build frontend
Write-Host "`n[2/8] Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "Frontend built successfully" -ForegroundColor Green

# Step 3: Build Electron app
Write-Host "`n[3/8] Building Electron installer..." -ForegroundColor Yellow
npx electron-builder --win nsis --x64

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Electron build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Installer built successfully" -ForegroundColor Green

# Step 4: Copy LLaMA models (existing)
Write-Host "`n[4/8] Copying LLaMA models to packaged app..." -ForegroundColor Yellow
$unpackedDir = "dist-electron\win-unpacked"

if (Test-Path $unpackedDir) {
    $resourcesModelsDir = "$unpackedDir\resources\models"
    
    if (-not (Test-Path $resourcesModelsDir)) {
        New-Item -ItemType Directory -Path $resourcesModelsDir -Force | Out-Null
    }
    
    Copy-Item -Path "models\*" -Destination $resourcesModelsDir -Recurse -Force
    Write-Host "LLaMA models copied" -ForegroundColor Green
    
    $copiedModelFiles = Get-ChildItem -Path $resourcesModelsDir -Filter "*.gguf" -File
    Write-Host "Verified: $($copiedModelFiles.Count) model(s)" -ForegroundColor Green
} else {
    Write-Host "WARNING: Unpacked directory not found" -ForegroundColor Yellow
}

# Step 5: Copy Image Generation models (NEW)
Write-Host "`n[5/8] Copying image generation models..." -ForegroundColor Yellow

if ($hasImageModels -and (Test-Path $unpackedDir)) {
    $destImageModelsDir = "$unpackedDir\resources\models\image_generation"
    
    if (-not (Test-Path $destImageModelsDir)) {
        New-Item -ItemType Directory -Path $destImageModelsDir -Force | Out-Null
    }
    
    # Copy SDXL model
    $sdxlSource = "backend\models\image_generation\sdxl-turbo-openvino"
    $sdxlDest = "$destImageModelsDir\sdxl-turbo-openvino"
    
    if (Test-Path $sdxlSource) {
        Write-Host "Copying SDXL-Turbo model..." -ForegroundColor Cyan
        Copy-Item -Path $sdxlSource -Destination $sdxlDest -Recurse -Force
        $sdxlFileCount = (Get-ChildItem -Path $sdxlDest -Recurse -File).Count
        Write-Host "  ✅ SDXL copied ($sdxlFileCount files)" -ForegroundColor Green
    }
    
    # Copy LaMa model
    $lamaSource = "backend\models\image_generation\lama"
    $lamaDest = "$destImageModelsDir\lama"
    
    if (Test-Path $lamaSource) {
        Write-Host "Copying LaMa model..." -ForegroundColor Cyan
        Copy-Item -Path $lamaSource -Destination $lamaDest -Recurse -Force
        $lamaFileCount = (Get-ChildItem -Path $lamaDest -Recurse -File).Count
        Write-Host "  ✅ LaMa copied ($lamaFileCount files)" -ForegroundColor Green
    }
    
    Write-Host "Image generation models packaged successfully" -ForegroundColor Green
} else {
    Write-Host "Skipping image models (not found or unpacked dir missing)" -ForegroundColor Yellow
}

# Step 6: Test backend
Write-Host "`n[6/8] Testing backend..." -ForegroundColor Yellow
$backendPython = "$unpackedDir\resources\backend-bundle\python-embed\python.exe"

if (Test-Path $backendPython) {
    Write-Host "Backend Python found" -ForegroundColor Green
} else {
    Write-Host "WARNING: Backend Python not found" -ForegroundColor Yellow
}

# Step 7: Create release package
Write-Host "`n[7/8] Creating RELEASE folder..." -ForegroundColor Yellow

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

# Copy LLaMA models
Copy-Item -Path "models" -Destination "$releaseDir\models" -Recurse -Force
Write-Host "Copied LLaMA models" -ForegroundColor Green

# Copy Image Generation models (if available)
if ($hasImageModels) {
    $releaseImageModels = "$releaseDir\models\image_generation"
    New-Item -ItemType Directory -Path $releaseImageModels -Force | Out-Null
    Copy-Item -Path "backend\models\image_generation\*" -Destination $releaseImageModels -Recurse -Force
    Write-Host "Copied image generation models" -ForegroundColor Green
}

# Create README
$readmeText = "OECS LEARNING HUB - INSTALLATION`n`n"
$readmeText += "FILES:`n"
$readmeText += "1. OECS-Learning-Hub-Setup.exe`n"
$readmeText += "2. models/ folder (includes LLaMA and image generation models)`n`n"
$readmeText += "INSTALL:`n"
$readmeText += "Run the .exe installer`n`n"
$readmeText += "FEATURES:`n"
$readmeText += "- AI-powered lesson planning (LLaMA model)`n"
if ($hasImageModels) {
    $readmeText += "- Image generation (SDXL-Turbo)`n"
    $readmeText += "- Image editing (LaMa inpainting)`n"
}
$readmeText += "`nSupport: delon.pierre@oecs.int`n"
$readmeText += "Built: $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n"

$readmeText | Out-File -FilePath "$releaseDir\README.txt" -Encoding UTF8
Write-Host "Created README" -ForegroundColor Green

# Step 8: Summary
Write-Host "`n[8/8] Build Summary" -ForegroundColor Yellow

$totalSize = (Get-ChildItem $releaseDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB
Write-Host "`n=== BUILD COMPLETE ===" -ForegroundColor Green
Write-Host "Total size: $([math]::Round($totalSize, 2)) GB" -ForegroundColor Cyan

# Feature summary
Write-Host "`nIncluded Features:" -ForegroundColor Yellow
Write-Host "  ✅ LLaMA AI Model" -ForegroundColor Green
if ($hasImageModels) {
    Write-Host "  ✅ Image Generation (SDXL)" -ForegroundColor Green
    Write-Host "  ✅ Image Editing (LaMa)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Image Generation (Not included - run setup-models.ps1)" -ForegroundColor Yellow
}

Write-Host "`nRELEASE folder ready at: $releaseDir" -ForegroundColor Green