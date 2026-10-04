# AUDIRA NetOps AI - Development Environment Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   AUDIRA NetOps AI - Starting Enterprise NOC Stack       " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if node and pnpm are present
if (-not (Get-Command "pnpm" -ErrorAction SilentlyContinue)) {
    Write-Error "pnpm is required to run the AUDIRA monorepo. Please install pnpm."
    exit 1
}

# Run dev services with Turborepo
pnpm dev
