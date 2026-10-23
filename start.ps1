# ========================================================
# KHOI DONG HE THONG CINEEVENT (POWERSHELL)
# ========================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " KHOI DONG HE THONG CINEEVENT (DOCKER COMPOSE)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Kiem tra file .env
if (-not (Test-Path .env)) {
    Write-Host "[INFO] Tao tep .env tu .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

# 2. Kiem tra Docker Daemon co dang chay khong
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[LOI] Docker chua duoc khoi dong!" -ForegroundColor Red
    Write-Host "Vui long mo Docker Desktop truoc khi chay script nay." -ForegroundColor Yellow
    exit 1
}

# 3. Build va khoi chay 11 containers
Write-Host "[INFO] Dang build va khoi chay 11 containers..." -ForegroundColor Yellow
docker compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host " HE THONG DA DUOC KHOI CHAY THANH CONG!" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host " - Website CineEvent : http://localhost" -ForegroundColor White
    Write-Host " - Quan tri MySQL    : http://localhost:8085 (phpMyAdmin)" -ForegroundColor White
    Write-Host " - Dashboard Grafana : http://localhost:3000 (admin / Grafana_AdminSecurePass_2026!)" -ForegroundColor White
    Write-Host " - Prometheus        : http://localhost:9090" -ForegroundColor White
    Write-Host " - Container Monitor : http://localhost:8081 (cAdvisor)" -ForegroundColor White
    Write-Host " - Backend Health    : http://localhost/health" -ForegroundColor White
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "De dung he thong: docker compose down" -ForegroundColor Gray
    Write-Host "========================================================" -ForegroundColor Cyan

    # Tu dong mo trinh duyet den trang chu CineEvent
    Start-Process "http://localhost"
} else {
    Write-Host "[LOI] Co loi xay ra khi khoi chay Docker Compose." -ForegroundColor Red
}
