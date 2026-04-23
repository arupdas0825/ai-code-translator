Write-Host ""
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host "   NeuralCode - AI Code Translator Setup  " -ForegroundColor Cyan
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host ""

# ── Check Node.js ────────────────────────────────────────────────
try {
    $nodeVersion = node -v 2>&1
    Write-Host "[OK] Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found. Install from: https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# ── Check npm ────────────────────────────────────────────────────
try {
    $npmVersion = npm -v 2>&1
    Write-Host "[OK] npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] npm not found." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# ── Install dependencies ─────────────────────────────────────────
Write-Host ""
Write-Host "[1/3] Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Dependencies installed" -ForegroundColor Green

# ── Copy .env ────────────────────────────────────────────────────
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "[OK] Created .env from .env.example" -ForegroundColor Green
} else {
    Write-Host "[OK] .env already exists" -ForegroundColor Green
}

# ── Check Ollama ─────────────────────────────────────────────────
Write-Host ""
Write-Host "[2/3] Checking Ollama connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 3 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    $models = $data.models | ForEach-Object { $_.name }
    Write-Host "[OK] Ollama is running" -ForegroundColor Green
    if ($models.Count -gt 0) {
        Write-Host "     Installed models: $($models -join ', ')" -ForegroundColor DarkGray
        if (-not ($models | Where-Object { $_ -like "codellama*" })) {
            Write-Host "[WARN] codellama not found. Run: ollama pull codellama" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[WARN] No models installed. Run: ollama pull codellama" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARN] Ollama not running or not installed." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  To install Ollama: https://ollama.com/download" -ForegroundColor DarkGray
    Write-Host "  Then run in a separate terminal:" -ForegroundColor DarkGray
    Write-Host "    ollama serve" -ForegroundColor DarkGray
    Write-Host "    ollama pull codellama" -ForegroundColor DarkGray
}

# ── Start dev server ─────────────────────────────────────────────
Write-Host ""
Write-Host "[3/3] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  +-----------------------------------------+" -ForegroundColor Cyan
Write-Host "  |  App: http://localhost:3000              |" -ForegroundColor Cyan
Write-Host "  |  Press Ctrl+C to stop                   |" -ForegroundColor Cyan
Write-Host "  +-----------------------------------------+" -ForegroundColor Cyan
Write-Host ""

npm run dev
