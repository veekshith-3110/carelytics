# PowerShell script to start Expo with clear output
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Expo Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure your phone and computer are on the same WiFi network" -ForegroundColor Yellow
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Install Expo Go on your phone" -ForegroundColor White
Write-Host "2. Open Expo Go app" -ForegroundColor White
Write-Host "3. Scan the QR code that will appear below" -ForegroundColor White
Write-Host "4. Wait for the app to load (30-60 seconds first time)" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the directory where the script is located
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Start Expo
npx expo start --clear

