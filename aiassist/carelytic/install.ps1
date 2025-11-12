# PowerShell script for clean Expo app installation on Windows
# This script helps resolve npm install issues by cleaning and reinstalling dependencies

Write-Host "=== Expo App Installation Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-Not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the carelytic directory." -ForegroundColor Red
    exit 1
}

Write-Host "Cleaning Expo app installation..." -ForegroundColor Yellow

# Remove node_modules if it exists
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ node_modules removed." -ForegroundColor Green
}

# Remove package-lock.json if it exists
if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force "package-lock.json"
    Write-Host "✓ package-lock.json removed." -ForegroundColor Green
}

# Remove .expo directory if it exists
if (Test-Path ".expo") {
    Write-Host "Removing .expo directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".expo"
    Write-Host "✓ .expo directory removed." -ForegroundColor Green
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✓ npm cache cleared." -ForegroundColor Green

# Verify npm cache
Write-Host "Verifying npm cache..." -ForegroundColor Yellow
npm cache verify
Write-Host "✓ npm cache verified." -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Installation completed successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Check Expo dependencies
    Write-Host "Checking Expo dependency compatibility..." -ForegroundColor Yellow
    npx expo install --check
    
    Write-Host ""
    Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To start the Expo app, run:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "Or for Expo Go:" -ForegroundColor Yellow
    Write-Host "  npm run start:go" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Installation failed. Please check the error messages above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running:" -ForegroundColor Yellow
    Write-Host "  npx expo install --fix" -ForegroundColor White
    Write-Host ""
    exit 1
}

