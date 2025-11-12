Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Starting Carelytics Expo App" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$carelyticPath = Join-Path $scriptPath "aiassist\carelytic"

if (Test-Path $carelyticPath) {
    Set-Location $carelyticPath
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Starting Expo server..." -ForegroundColor Yellow
    Write-Host ""
    npm start
} else {
    Write-Host "ERROR: Could not find carelytic directory at: $carelyticPath" -ForegroundColor Red
    Write-Host "Please make sure you're running this script from the carelytics root directory." -ForegroundColor Yellow
    exit 1
}

