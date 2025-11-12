@echo off
echo ========================================
echo Starting Expo Development Server
echo ========================================
echo.
echo Make sure your phone and computer are on the same WiFi network
echo.
echo Instructions:
echo 1. Install Expo Go on your phone
echo 2. Open Expo Go app
echo 3. Scan the QR code that will appear below
echo 4. Wait for the app to load (30-60 seconds first time)
echo.
echo ========================================
echo.

cd /d "%~dp0"
npx expo start --clear

pause

