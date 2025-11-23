@echo off
title 5G Security Masterclass - Setup Script
color 0B

echo.
echo ============================================
echo   5G SECURITY MASTERCLASS - AUTO INSTALLER
echo ============================================
echo.

:: Create the target directory
echo [1/5] Creating directory C:\All Labs...
if not exist "C:\All Labs" mkdir "C:\All Labs"
cd /d "C:\All Labs"

:: Clone the repository
echo [2/5] Cloning repository from GitHub...
if exist "5G-Security-Course" (
    echo      Folder exists, updating...
    cd 5G-Security-Course
    git pull origin claude/5g-security-course-design-01KBS83p9Pn32cQBy6A3zN6L
) else (
    git clone https://github.com/Zango2020/Abhijeet-kumar.git 5G-Security-Course
    cd 5G-Security-Course
)

:: Checkout the correct branch
echo [3/5] Switching to feature branch...
git checkout claude/5g-security-course-design-01KBS83p9Pn32cQBy6A3zN6L

:: Install dependencies
echo [4/5] Installing dependencies (this may take a minute)...
call npm install

:: Create .env.local if it doesn't exist
echo [5/5] Setting up environment...
if not exist ".env.local" (
    echo API_KEY=YOUR_GEMINI_API_KEY_HERE > .env.local
    echo      Created .env.local - Please add your Gemini API key!
)

echo.
echo ============================================
echo   INSTALLATION COMPLETE!
echo ============================================
echo.
echo   Location: C:\All Labs\5G-Security-Course
echo.
echo   NEXT STEPS:
echo   1. Edit .env.local and add your Gemini API key
echo   2. Run: npm run dev
echo   3. Open: http://localhost:5173
echo.
echo ============================================

:: Ask if user wants to start the dev server
set /p START="Do you want to start the dev server now? (Y/N): "
if /i "%START%"=="Y" (
    echo Starting development server...
    npm run dev
)

pause
