# PowerShell script for clean installation on Windows
# This script helps resolve npm install issues by cleaning and reinstalling dependencies

Write-Host "Cleaning npm installation..." -ForegroundColor Yellow

# Remove node_modules if it exists
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "node_modules removed." -ForegroundColor Green
}

# Remove package-lock.json if it exists
if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force "package-lock.json"
    Write-Host "package-lock.json removed." -ForegroundColor Green
}

# Remove .next build directory if it exists
if (Test-Path ".next") {
    Write-Host "Removing .next directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
    Write-Host ".next directory removed." -ForegroundColor Green
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "npm cache cleared." -ForegroundColor Green

# Verify npm cache
Write-Host "Verifying npm cache..." -ForegroundColor Yellow
npm cache verify
Write-Host "npm cache verified." -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Installation completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Installation failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}

