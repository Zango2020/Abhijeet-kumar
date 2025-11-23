# 5G Security Masterclass - PowerShell Setup Script
# Run this script in PowerShell as Administrator

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  5G SECURITY MASTERCLASS - AUTO INSTALLER" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Create target directory
Write-Host "[1/5] Creating directory C:\All Labs..." -ForegroundColor Yellow
if (!(Test-Path "C:\All Labs")) {
    New-Item -ItemType Directory -Path "C:\All Labs" | Out-Null
}
Set-Location "C:\All Labs"

# Clone repository
Write-Host "[2/5] Cloning repository from GitHub..." -ForegroundColor Yellow
if (Test-Path "5G-Security-Course") {
    Write-Host "      Folder exists, updating..." -ForegroundColor Gray
    Set-Location "5G-Security-Course"
    git pull origin claude/5g-security-course-design-01KBS83p9Pn32cQBy6A3zN6L
} else {
    git clone https://github.com/Zango2020/Abhijeet-kumar.git 5G-Security-Course
    Set-Location "5G-Security-Course"
}

# Checkout branch
Write-Host "[3/5] Switching to feature branch..." -ForegroundColor Yellow
git checkout claude/5g-security-course-design-01KBS83p9Pn32cQBy6A3zN6L

# Install dependencies
Write-Host "[4/5] Installing dependencies..." -ForegroundColor Yellow
npm install

# Create .env.local
Write-Host "[5/5] Setting up environment..." -ForegroundColor Yellow
if (!(Test-Path ".env.local")) {
    "API_KEY=YOUR_GEMINI_API_KEY_HERE" | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "      Created .env.local - Please add your Gemini API key!" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Location: C:\All Labs\5G-Security-Course" -ForegroundColor White
Write-Host ""
Write-Host "  NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Edit .env.local and add your Gemini API key" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host "  3. Open: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan

# Ask to start dev server
$start = Read-Host "Do you want to start the dev server now? (Y/N)"
if ($start -eq "Y" -or $start -eq "y") {
    Write-Host "Starting development server..." -ForegroundColor Green
    npm run dev
}
