Write-Host "=== OLH AI Education Suite Build Process ===" -ForegroundColor Cyan

# Step 0: Pre-build cleanup
Write-Host "`n[0/4] Pre-build cleanup..." -ForegroundColor Green
.\pre-build-cleanup.ps1

# Step 1: Package Backend
Write-Host "`n[1/4] Packaging Backend..." -ForegroundColor Green
.\manual-package.ps1

# Step 2: Build Frontend
Write-Host "`n[2/3] Building Frontend..." -ForegroundColor Green
Set-Location frontend
npm run build
Set-Location ..

# Step 3: Build Electron App
Write-Host "`n[3/4] Building Electron Package..." -ForegroundColor Green
npm run electron:build:win

# Step 4: Copy models folder to packaged app resources
Write-Host "`n[4/4] Copying models folder to packaged app..." -ForegroundColor Green
$unpackedDir = "release\win-unpacked"
if (Test-Path $unpackedDir) {
    $resourcesModelsDir = "$unpackedDir\resources\models"
    
    # Create resources/models directory
    New-Item -ItemType Directory -Path $resourcesModelsDir -Force | Out-Null
    
    # Copy entire models folder
    Copy-Item -Path "models\*" -Destination $resourcesModelsDir -Recurse -Force
    Write-Host "Models folder copied to resources/models" -ForegroundColor Green
} else {
    Write-Host "WARNING: Unpacked directory not found, models may need manual installation" -ForegroundColor Yellow
}

Write-Host "`n=== Build Complete! ===" -ForegroundColor Cyan
Write-Host "Installer location: dist-electron\" -ForegroundColor Yellow
Write-Host "Unpacked app location: release\win-unpacked\" -ForegroundColor Yellow