# ========================================
# Model Setup Script for OECS Learning Hub
# ========================================
# Purpose: Copy existing models into proper structure for Electron packaging
# Copies to BOTH backend (for dev) and top-level models folder (for build)

Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "OECS Learning Hub - Model Setup"  -ForegroundColor Cyan
Write-Host "========================================`n"

# Define source paths (where your models currently are)
$SDXL_SOURCE = "C:\Users\LG\Desktop\Projects\OfflineAI-Quantizer\quantized_models\sdxl-turbo-openvino"
$LAMA_CACHE_SOURCE = "$env:USERPROFILE\.cache\torch\hub\checkpoints"

# Define destination paths (relative to project root)
$PROJECT_ROOT = $PSScriptRoot

# Backend folder (for development)
$BACKEND_MODELS = Join-Path $PROJECT_ROOT "backend\models\image_generation"
$BACKEND_SDXL = Join-Path $BACKEND_MODELS "sdxl-turbo-openvino"
$BACKEND_LAMA = Join-Path $BACKEND_MODELS "lama"

# Top-level models folder (for packaging/build)
$TOPLEVEL_MODELS = Join-Path $PROJECT_ROOT "models\image_generation"
$TOPLEVEL_SDXL = Join-Path $TOPLEVEL_MODELS "sdxl-turbo-openvino"
$TOPLEVEL_LAMA = Join-Path $TOPLEVEL_MODELS "lama"

Write-Host "Project Root: $PROJECT_ROOT" -ForegroundColor Yellow
Write-Host "Backend Models: $BACKEND_MODELS" -ForegroundColor Yellow
Write-Host "Top-Level Models: $TOPLEVEL_MODELS`n" -ForegroundColor Yellow

# Create directories
Write-Host "Creating model directories..." -ForegroundColor Green

# Backend folders
New-Item -ItemType Directory -Force -Path $BACKEND_MODELS | Out-Null
New-Item -ItemType Directory -Force -Path $BACKEND_SDXL | Out-Null
New-Item -ItemType Directory -Force -Path $BACKEND_LAMA | Out-Null

# Top-level folders
New-Item -ItemType Directory -Force -Path $TOPLEVEL_MODELS | Out-Null
New-Item -ItemType Directory -Force -Path $TOPLEVEL_SDXL | Out-Null
New-Item -ItemType Directory -Force -Path $TOPLEVEL_LAMA | Out-Null

# ========================================
# Copy SDXL Model
# ========================================
Write-Host "`n[1/2] Copying SDXL-Turbo Model..." -ForegroundColor Cyan

if (Test-Path $SDXL_SOURCE) {
    Write-Host "   Source: $SDXL_SOURCE" -ForegroundColor Gray
    
    # Copy to backend (for development)
    Write-Host "   Copying to backend..." -ForegroundColor Yellow
    Copy-Item -Path "$SDXL_SOURCE\*" -Destination $BACKEND_SDXL -Recurse -Force
    
    # Copy to top-level (for build/packaging)
    Write-Host "   Copying to top-level models..." -ForegroundColor Yellow
    Copy-Item -Path "$SDXL_SOURCE\*" -Destination $TOPLEVEL_SDXL -Recurse -Force
    
    $fileCount = (Get-ChildItem -Path $BACKEND_SDXL -Recurse -File).Count
    Write-Host "   [SUCCESS] SDXL model copied to both locations ($fileCount files each)" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] SDXL model not found at: $SDXL_SOURCE" -ForegroundColor Red
    Write-Host "   Please update the path in this script or run SDXL setup first." -ForegroundColor Yellow
}

# ========================================
# Copy LaMa Model (IOPaint cache)
# ========================================
Write-Host "`n[2/2] Copying LaMa Model (IOPaint)..." -ForegroundColor Cyan

if (Test-Path $LAMA_CACHE_SOURCE) {
    Write-Host "   Source: $LAMA_CACHE_SOURCE" -ForegroundColor Gray
    
    # Copy big-lama.pt specifically
    $lamaFile = Join-Path $LAMA_CACHE_SOURCE "big-lama.pt"
    
    if (Test-Path $lamaFile) {
        # Copy to backend (for development)
        Write-Host "   Copying to backend..." -ForegroundColor Yellow
        Copy-Item -Path $lamaFile -Destination $BACKEND_LAMA -Force
        
        # Copy to top-level (for build/packaging)
        Write-Host "   Copying to top-level models..." -ForegroundColor Yellow
        Copy-Item -Path $lamaFile -Destination $TOPLEVEL_LAMA -Force
        
        Write-Host "   [SUCCESS] LaMa model copied to both locations" -ForegroundColor Green
    } else {
        Write-Host "   [WARNING] big-lama.pt not found" -ForegroundColor Red
        Write-Host "   Run IOPaint once to download the model:" -ForegroundColor Yellow
        Write-Host "   > iopaint start --model=lama --device=cpu --port=8080" -ForegroundColor Gray
    }
} else {
    Write-Host "   [WARNING] Torch cache not found at: $LAMA_CACHE_SOURCE" -ForegroundColor Red
}

# ========================================
# Verify Setup
# ========================================
Write-Host "`nVerifying Setup..." -ForegroundColor Cyan

$backendSdxlFiles = (Get-ChildItem -Path $BACKEND_SDXL -File -ErrorAction SilentlyContinue).Count
$backendLamaFiles = (Get-ChildItem -Path $BACKEND_LAMA -File -ErrorAction SilentlyContinue).Count
$toplevelSdxlFiles = (Get-ChildItem -Path $TOPLEVEL_SDXL -File -ErrorAction SilentlyContinue).Count
$toplevelLamaFiles = (Get-ChildItem -Path $TOPLEVEL_LAMA -File -ErrorAction SilentlyContinue).Count

Write-Host "`nSummary:" -ForegroundColor Yellow
Write-Host "   Backend (Development):" -ForegroundColor Gray
Write-Host "     - SDXL: $backendSdxlFiles files" -ForegroundColor Gray
Write-Host "     - LaMa: $backendLamaFiles files" -ForegroundColor Gray
Write-Host "   Top-Level (Packaging):" -ForegroundColor Gray
Write-Host "     - SDXL: $toplevelSdxlFiles files" -ForegroundColor Gray
Write-Host "     - LaMa: $toplevelLamaFiles files" -ForegroundColor Gray

if ($backendSdxlFiles -gt 0 -and $backendLamaFiles -gt 0 -and $toplevelSdxlFiles -gt 0 -and $toplevelLamaFiles -gt 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "[SUCCESS] Setup Complete!" -ForegroundColor Green
    Write-Host "Models are ready for development AND packaging." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "`nNext Steps:" -ForegroundColor Yellow
    Write-Host "   1. Install dependencies: pip install optimum[openvino] diffusers accelerate iopaint" -ForegroundColor Gray
    Write-Host "   2. Copy image_service_production.py -> backend/image_service.py" -ForegroundColor Gray
    Write-Host "   3. Update backend/main.py (add imports and endpoints)" -ForegroundColor Gray
    Write-Host "   4. Test: cd backend && python main.py" -ForegroundColor Gray
    Write-Host "   5. Build: .\build-release.ps1" -ForegroundColor Gray
} else {
    Write-Host "`n[WARNING] Setup incomplete. Please check the warnings above." -ForegroundColor Red
}

Write-Host "`n========================================`n" -ForegroundColor Cyan