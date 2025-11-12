@echo off
REM ========================================
REM Start Expo App - Auto Navigate Script
REM ========================================

echo.
echo ========================================
echo Starting Expo Development Server
echo ========================================
echo.

REM Navigate to the Expo app directory
cd /d "%~dp0carelytic"

REM Verify we're in the correct directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please make sure you're running this from the aiassist directory.
    echo.
    echo Trying to navigate to: %CD%
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.
echo Starting Expo server...
echo.
echo Instructions:
echo 1. Wait for QR code to appear
echo 2. Make sure your phone and computer are on the same WiFi
echo 3. Open Expo Go app on your phone
echo 4. Scan the QR code
echo 5. Wait for app to load (30-60 seconds)
echo.
echo ========================================
echo.

REM Start Expo
call npm start

pause

