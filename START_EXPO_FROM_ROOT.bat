@echo off
REM ========================================
REM Start Expo App - From Project Root
REM ========================================

echo.
echo ========================================
echo Starting Expo Development Server
echo ========================================
echo.

REM Navigate to the Expo app directory from project root
cd /d "%~dp0aiassist\carelytic"

REM Verify we're in the correct directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo.
    echo Expected path: aiassist\carelytic\package.json
    echo Current path: %CD%
    echo.
    echo Make sure you're running this from the project root directory.
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

