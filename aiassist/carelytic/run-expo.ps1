# PowerShell script to start Expo with error checking
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Expo Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Verify we're in the correct directory
if (-Not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the carelytic directory." -ForegroundColor Yellow
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

if (-Not (Test-Path "app.json")) {
    Write-Host "ERROR: app.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the carelytic directory." -ForegroundColor Yellow
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""
Write-Host "Verifying setup..." -ForegroundColor Yellow
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

# Check Expo installation
Write-Host "Checking Expo installation..." -ForegroundColor Yellow
$expoCheck = npx expo --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Expo version: $expoCheck" -ForegroundColor Green
} else {
    Write-Host "WARNING: Expo not found. Installing..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Expo Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Make sure your phone and computer are on the same WiFi network" -ForegroundColor White
Write-Host "2. Install Expo Go on your phone if you haven't already" -ForegroundColor White
Write-Host "3. Open Expo Go and scan the QR code that will appear below" -ForegroundColor White
Write-Host "4. Wait for the app to load (30-60 seconds first time)" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Expo
npm start

