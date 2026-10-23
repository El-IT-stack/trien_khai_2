@echo off
chcp 65001 >nul
echo ========================================================
echo  KHOI PHUC FONT CHU TIENG VIET CINEEVENT (UTF-8)
echo ========================================================
echo [INFO] Dang kiem tra va sua loi font chu trong Database...

docker compose exec -T mysql mysql -uroot -pRoot_SecurePassword_2026! --default-character-set=utf8mb4 cineevent_db < database/fix_encoding.sql

if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  DA KHOI PHUC FONT CHU TIENG VIET THANH CONG!
    echo ========================================================
    echo  Vui long tai lai trang web tren trinh duyet:
    echo  http://localhost
    echo ========================================================
) else (
    echo [INFO] Thu sua loi bang backend container...
    docker compose restart cineevent-app
    echo Da restart backend, backend se tu dong sua loi font!
)
pause
