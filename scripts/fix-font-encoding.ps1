# ========================================================
# KHOI PHUC FONT CHU TIENG VIET CINEEVENT (POWERSHELL)
# ========================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " KHOI PHUC FONT CHU TIENG VIET CINEEVENT (UTF-8)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "[INFO] Dang kiem tra va sua loi font chu trong Database..." -ForegroundColor Yellow

$sqlPath = Join-Path $PSScriptRoot "..\database\fix_encoding.sql"
if (Test-Path $sqlPath) {
    Get-Content -Path $sqlPath -Encoding UTF8 | docker compose exec -T mysql mysql -uroot -pRoot_SecurePassword_2026! --default-character-set=utf8mb4 cineevent_db
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================================" -ForegroundColor Cyan
        Write-Host " DA KHOI PHUC FONT CHU TIENG VIET THANH CONG!" -ForegroundColor Green
        Write-Host "========================================================" -ForegroundColor Cyan
        Write-Host "Vui long tai lai trang web tren trinh duyet (F5):" -ForegroundColor White
        Write-Host "http://localhost" -ForegroundColor Yellow
        Write-Host "========================================================" -ForegroundColor Cyan
        exit 0
    }
}

Write-Host "[INFO] Khoi dong lai backend de kich hoat co che tu dong sua loi font..." -ForegroundColor Yellow
docker compose restart cineevent-app
Write-Host "Backend da duoc khoi dong lai va tu dong cap nhat font chu UTF-8!" -ForegroundColor Green
