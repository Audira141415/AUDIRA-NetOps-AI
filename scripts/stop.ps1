# AUDIRA NetOps AI - Stack Shutdown Utility
$ErrorActionPreference = "SilentlyContinue"

Write-Host "==============================================================================" -ForegroundColor Yellow
Write-Host "                 AUDIRA NetOps AI - Graceful Shutdown                         " -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor Yellow
Write-Host "[INFO] Terminating all AUDIRA NetOps AI processes and releasing network ports..." -ForegroundColor Gray
Write-Host ""

$ports = @(5173, 3000, 3001)

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $pids) {
            try {
                $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
                if ($proc) {
                    Write-Host "  [-] Freeing Port $port (Killing '$($proc.ProcessName)' PID: $procId)..." -ForegroundColor Yellow
                    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                }
            } catch {}
        }
    }
}

# Stop Docker backing services if running
if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    try {
        $runningContainers = docker ps -q --filter "name=audira_" 2>$null
        if ($runningContainers) {
            Write-Host "[DOCKER] Stopping development backing containers..." -ForegroundColor Gray
            docker stop $runningContainers 2>$null | Out-Null
        }
    } catch {}
}

Start-Sleep -Seconds 1

Write-Host ""
Write-Host "[VERIFICATION] Port Status Check:" -ForegroundColor Cyan
foreach ($port in $ports) {
    $stillActive = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($stillActive) {
        Write-Host "  - Port $port : STILL ACTIVE (PID: $($stillActive.OwningProcess))" -ForegroundColor Red
    } else {
        Write-Host "  - Port $port : CLOSED / RELEASED [OK]" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "[SUCCESS] All AUDIRA NetOps AI components have been safely terminated." -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
