# PowerShell script to start Expo with error checking and troubleshooting
# This script helps identify and fix common issues before starting

Write-Host "=== Expo App Startup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-Not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the carelytic directory." -ForegroundColor Red
    exit 1
}

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

# Check npm version
Write-Host "Checking npm version..." -ForegroundColor Yellow
$npmVersion = npm --version
Write-Host "npm: $npmVersion" -ForegroundColor Green

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "Warning: node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install dependencies." -ForegroundColor Red
        exit 1
    }
}

# Check Expo installation
Write-Host "Checking Expo installation..." -ForegroundColor Yellow
$expoCheck = npx expo --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Expo: $expoCheck" -ForegroundColor Green
} else {
    Write-Host "Warning: Expo not found. Installing..." -ForegroundColor Yellow
    npm install -g expo-cli
}

# Check dependency compatibility
Write-Host "Checking dependency compatibility..." -ForegroundColor Yellow
npx expo install --check 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies are compatible" -ForegroundColor Green
} else {
    Write-Host "Warning: Some dependencies may need updating. Run 'npx expo install --fix'" -ForegroundColor Yellow
}

# Clear cache if requested
$clearCache = Read-Host "Clear cache before starting? (y/n)"
if ($clearCache -eq "y" -or $clearCache -eq "Y") {
    Write-Host "Clearing cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
    Write-Host "✓ Cache cleared" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Starting Expo Development Server ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Make sure your phone and computer are on the same WiFi network" -ForegroundColor White
Write-Host "2. Install Expo Go on your phone:" -ForegroundColor White
Write-Host "   - iOS: https://apps.apple.com/app/expo-go/id982107779" -ForegroundColor Gray
Write-Host "   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent" -ForegroundColor Gray
Write-Host "3. Scan the QR code that appears below" -ForegroundColor White
Write-Host "4. If connection fails, try tunnel mode: npx expo start --tunnel" -ForegroundColor White
Write-Host ""

# Start Expo
npx expo start --go

