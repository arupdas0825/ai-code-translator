@echo off
echo.
echo  ========================================
echo   NeuralCode - AI Code Translator Setup
echo  ========================================
echo.

REM Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Check npm
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found.
    pause
    exit /b 1
)
echo [OK] npm found

REM Install dependencies
echo.
echo [1/3] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)
echo [OK] Dependencies installed

REM Copy .env if not exists
if not exist .env (
    copy .env.example .env >nul
    echo [OK] Created .env from .env.example
) else (
    echo [OK] .env already exists
)

echo.
echo [2/3] Checking Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] Ollama is not running.
    echo        Please open a new terminal and run: ollama serve
    echo        Then run: ollama pull codellama
) else (
    echo [OK] Ollama is running
)

echo.
echo [3/3] Starting development server...
echo.
echo  App will be available at: http://localhost:3000
echo.
npm run dev
