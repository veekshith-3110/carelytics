# PowerShell script to start Expo - Auto Navigate
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Expo Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory (aiassist)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$expoPath = Join-Path $scriptPath "carelytic"

# Navigate to Expo app directory
Set-Location $expoPath

Write-Host "Navigating to: $expoPath" -ForegroundColor Yellow
Write-Host ""

# Verify we're in the correct directory
if (-Not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found!" -ForegroundColor Red
    Write-Host "Expected location: $expoPath" -ForegroundColor Yellow
    Write-Host "Current location: $(Get-Location)" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host "✓ package.json found" -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "WARNING: node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Expo Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Wait for QR code to appear" -ForegroundColor White
Write-Host "2. Make sure your phone and computer are on the same WiFi" -ForegroundColor White
Write-Host "3. Open Expo Go app on your phone" -ForegroundColor White
Write-Host "4. Scan the QR code" -ForegroundColor White
Write-Host "5. Wait for app to load (30-60 seconds)" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Expo
npm start

