@echo off
REM ========================================
REM Expo App Startup Script
REM ========================================

echo.
echo ========================================
echo Starting Expo Development Server
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Verify we're in the correct directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the carelytic directory.
    echo Current directory: %CD%
    pause
    exit /b 1
)

if not exist "app.json" (
    echo ERROR: app.json not found!
    echo Please run this script from the carelytic directory.
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.
echo Verifying setup...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo WARNING: node_modules not found. Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Starting Expo Server...
echo ========================================
echo.
echo Instructions:
echo 1. Make sure your phone and computer are on the same WiFi network
echo 2. Install Expo Go on your phone if you haven't already
echo 3. Open Expo Go and scan the QR code that will appear below
echo 4. Wait for the app to load (30-60 seconds first time)
echo.
echo ========================================
echo.

REM Start Expo
call npm start

pause

