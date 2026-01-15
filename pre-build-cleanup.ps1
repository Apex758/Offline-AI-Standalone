Write-Host "Pre-build cleanup: Resetting user data files to empty arrays..." -ForegroundColor Green

# List of user data files to reset
$userDataFiles = @(
    "backend\chat_history.json",
    "backend\lesson_plan_history.json",
    "backend\data\cross_curricular_history.json",
    "backend\data\kindergarten_history.json",
    "backend\data\multigrade_history.json",
    "backend\data\quiz_history.json",
    "backend\data\rubric_history.json"
)

foreach ($file in $userDataFiles) {
    # Ensure the directory exists (for data/ files)
    $dir = Split-Path $file
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    # Reset to empty array
    "[]" | Out-File -FilePath $file -Encoding UTF8 -Force
    Write-Host "Reset $file to empty array" -ForegroundColor Yellow
}

Write-Host "Pre-build cleanup complete!" -ForegroundColor Green