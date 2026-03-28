Write-Host "=== Quick Build (Frontend + Installer Only) ===" -ForegroundColor Cyan
Write-Host "Skipping: backend packaging, model checks, release folder" -ForegroundColor Yellow
Write-Host ""

# Step 1: Build frontend
Write-Host "[1/2] Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "Frontend built successfully" -ForegroundColor Green

# Step 2: Build Electron installer
Write-Host "`n[2/2] Building Electron installer..." -ForegroundColor Yellow
npx electron-builder --win nsis --x64
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Electron build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Quick Build Complete ===" -ForegroundColor Green
Write-Host "Installer is in: dist-electron\" -ForegroundColor Cyan
