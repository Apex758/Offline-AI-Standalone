# Microsoft.PowerShell_profile.ps1
# Place this in: C:\Users\LG\Documents\WindowsPowerShell\

function Start-Backend {
    param(
        [switch]$StartUvicorn,
        [int]$Port = 8000,
        [string]$AppModule = "main:app"
    )
    
    # Activate venv
    if (Test-Path ".\venv\Scripts\Activate.ps1") {
        Write-Host "Activating venv..." -ForegroundColor Green
        . ".\venv\Scripts\Activate.ps1"
    } else {
        Write-Host "No venv found" -ForegroundColor Yellow
    }
    
    # Start Uvicorn if requested
    if ($StartUvicorn) {
        $portInUse = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        
        if ($portInUse) {
            Write-Host "Port $Port already in use" -ForegroundColor Yellow
        } else {
            Write-Host "Starting Uvicorn on http://127.0.0.1:$Port" -ForegroundColor Green
            Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m", "uvicorn", $AppModule, "--host", "127.0.0.1", "--port", $Port
        }
    }
}

function prompt {
    $currentDir = Split-Path -Leaf (Get-Location)
    
    if ($currentDir -ieq "backend" -and (Test-Path ".\auto_venv_and_uvicorn.ps1") -and -not $env:BACKEND_ACTIVATED) {
        Write-Host ""
        & ".\auto_venv_and_uvicorn.ps1"
        $env:BACKEND_ACTIVATED = "1"
    }
    
    if ($currentDir -ine "backend") {
        $env:BACKEND_ACTIVATED = $null
    }
    
    "PS $($executionContext.SessionState.Path.CurrentLocation)$('>' * ($nestedPromptLevel + 1)) "
}

Write-Host "Profile loaded - Auto-activation enabled for backend folders" -ForegroundColor Cyan