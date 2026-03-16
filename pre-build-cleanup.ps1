Write-Host "Pre-build cleanup: Resetting user data files..." -ForegroundColor Green

# List of JSON history files to reset to empty arrays
$userDataFiles = @(
    "backend\chat_history.json",
    "backend\lesson_plan_history.json",
    "backend\data\cross_curricular_history.json",
    "backend\data\kindergarten_history.json",
    "backend\data\multigrade_history.json",
    "backend\data\quiz_history.json",
    "backend\data\rubric_history.json",
    "backend\data\worksheet_history.json",
    "backend\data\images_history.json"
)

foreach ($file in $userDataFiles) {
    $dir = Split-Path $file
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    "[]" | Out-File -FilePath $file -Encoding UTF8 -Force
    Write-Host "  Reset $file" -ForegroundColor Yellow
}

# Reset notes file
$notesFile = "backend\notes.txt"
"" | Out-File -FilePath $notesFile -Encoding UTF8 -Force
Write-Host "  Reset $notesFile" -ForegroundColor Yellow

# Delete SQLite databases (user data)
$databases = @(
    "backend\data\students.db",
    "backend\data\chat_memory.db",
    "backend\data\milestones.db"
)

foreach ($db in $databases) {
    if (Test-Path $db) {
        Remove-Item $db -Force
        Write-Host "  Deleted $db" -ForegroundColor Yellow
    }
}

# Clean __pycache__ directories
$pycacheDirs = Get-ChildItem -Path "backend" -Directory -Recurse -Filter "__pycache__" -ErrorAction SilentlyContinue
foreach ($dir in $pycacheDirs) {
    Remove-Item $dir.FullName -Recurse -Force
    Write-Host "  Removed $($dir.FullName)" -ForegroundColor Yellow
}

Write-Host "Pre-build cleanup complete!" -ForegroundColor Green
