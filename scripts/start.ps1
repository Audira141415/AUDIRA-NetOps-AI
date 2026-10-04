# AUDIRA NetOps AI - Stack Launcher
$ErrorActionPreference = "Continue"

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "   ___  _   _ ____ ___ ____     _      _   _      _    ___  ____  ____    _    ___ " -ForegroundColor Cyan
Write-Host "  / _ \| | | |  _ \_ _|  _ \   / \    | \ | | ___| |_ / _ \|  _ \/ ___|  / \  |_ _| " -ForegroundColor Cyan
Write-Host " | |_| | | | | | | | || |_) | / _ \   |  \| |/ _ \ __| | | | |_) \___ \ / _ \  | |  " -ForegroundColor Cyan
Write-Host " |  _  | |_| | |_| | ||  _ < / ___ \  | |\  |  __/ |_| |_| |  __/ ___) / ___ \ | |  " -ForegroundColor Cyan
Write-Host " |_| |_|\___/|____/___|_| \_\/_/   \_\|_| \_|\___|\__|\___/|_|   |____/_/   \_|___| " -ForegroundColor Cyan
Write-Host ""
Write-Host "          AUDIRA NetOps AI - Network Management. Terminal. Automation. AI." -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor Cyan

# 1. Check prerequisites
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js v20+ from https://nodejs.org"
    Read-Host "Press Enter to exit..."
    exit 1
}

if (-not (Get-Command "pnpm" -ErrorAction SilentlyContinue)) {
    Write-Host "[WARNING] pnpm not found. Trying corepack enable..." -ForegroundColor Yellow
    corepack enable
    if (-not (Get-Command "pnpm" -ErrorAction SilentlyContinue)) {
        Write-Host "[ERROR] pnpm is required. Run: npm install -g pnpm" -ForegroundColor Red
        Read-Host "Press Enter to exit..."
        exit 1
    }
}

# 2. Check .env file
$envPath = Join-Path $PSScriptRoot "..\.env"
$envExamplePath = Join-Path $PSScriptRoot "..\.env.example"
if (-not (Test-Path $envPath) -and (Test-Path $envExamplePath)) {
    Write-Host "[INFO] Initializing .env from .env.example..." -ForegroundColor Gray
    Copy-Item $envExamplePath $envPath
}

# 3. Check Docker status
if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    try {
        $dockerCheck = docker ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[DOCKER] Docker daemon active. Starting backing services (PostgreSQL, Redis, Ollama)..." -ForegroundColor Green
            docker compose -f docker-compose.dev.yml up -d
        } else {
            Write-Host "[INFO] Docker daemon is stopped. Proceeding with simulated demo network." -ForegroundColor Gray
        }
    } catch {
        Write-Host "[INFO] Proceeding with simulated demo network." -ForegroundColor Gray
    }
}

# 4. Display service dashboard URLs
Write-Host ""
Write-Host "[AUDIRA NETOPS AI STACK]" -ForegroundColor Green
Write-Host "  * Frontend NOC Interface : http://localhost:5173" -ForegroundColor Cyan
Write-Host "  * Backend API Gateway    : http://localhost:3000" -ForegroundColor Cyan
Write-Host "  * Live Terminal (WS)     : ws://localhost:3000/ws" -ForegroundColor Cyan
Write-Host "  * Worker Polling Daemon  : http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

# Launch browser after 4 seconds
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 4
    Start-Process "http://localhost:5173"
} | Out-Null

# 5. Launch all workspace services with Turborepo
pnpm dev
