Write-Host "=== OLH AI Education Suite Build Process ===" -ForegroundColor Cyan

# Step 1: Package Backend
Write-Host "`n[1/3] Packaging Backend..." -ForegroundColor Green
.\manual-package.ps1

# Step 2: Build Frontend
Write-Host "`n[2/3] Building Frontend..." -ForegroundColor Green
Set-Location frontend
npm run build
Set-Location ..

# Step 3: Build Electron App
Write-Host "`n[3/3] Building Electron Package..." -ForegroundColor Green
npm run electron:build:win

Write-Host "`n=== Build Complete! ===" -ForegroundColor Cyan
Write-Host "Installer location: dist-electron\" -ForegroundColor Yellow