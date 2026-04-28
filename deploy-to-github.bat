@echo off
REM Valuecrop Deployment Script - Push to GitHub

echo.
echo ========================================
echo Valuecrop GitHub Deployment Script
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed. Please install Git from https://git-scm.com
    pause
    exit /b 1
)

REM Initialize repository if needed
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Configure Git (optional)
echo Enter your GitHub username (press Enter to skip):
set /p GITHUB_USER=
if not "%GITHUB_USER%"=="" (
    git config --global user.name "%GITHUB_USER%"
)

echo Enter your GitHub email (press Enter to skip):
set /p GITHUB_EMAIL=
if not "%GITHUB_EMAIL%"=="" (
    git config --global user.email "%GITHUB_EMAIL%"
)

REM Add all files
echo.
echo Adding files to Git...
git add .

REM Show what will be committed
echo.
echo Files to be committed:
git diff --cached --name-only
echo.

REM Commit
set /p COMMIT_MSG="Enter commit message (default: 'Deploy to Render'): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Deploy to Render
git commit -m "%COMMIT_MSG%"

REM Get remote URL
echo.
echo Enter your GitHub repository URL:
echo Example: https://github.com/yourusername/valuecrop.git
set /p REPO_URL=

if "%REPO_URL%"=="" (
    echo ERROR: Repository URL is required
    pause
    exit /b 1
)

REM Add remote if not exists
git remote add origin %REPO_URL% 2>nul
git remote set-url origin %REPO_URL%

REM Push to GitHub
echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

if errorlevel 0 (
    echo.
    echo ========================================
    echo SUCCESS! Your code is now on GitHub
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Go to https://dashboard.render.com
    echo 2. Click "New" ^> "Blueprint"
    echo 3. Connect your GitHub repository
    echo 4. Render will auto-detect render.yaml
    echo 5. Set environment variables
    echo 6. Click Deploy!
    echo.
    echo Repository: %REPO_URL%
    echo.
)

pause
