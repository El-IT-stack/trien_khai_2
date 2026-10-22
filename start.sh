#!/bin/bash
set -e

echo "========================================================"
echo " KHOI DONG HE THONG CINEEVENT (DOCKER COMPOSE)"
echo "========================================================"

if [ ! -f .env ]; then
    echo "[INFO] Tao tep .env tu .env.example..."
    cp .env.example .env
fi

echo "[INFO] Dang build va khoi chay 11 containers..."
docker compose up --build -d

echo "========================================================"
echo " HE THONG DA DUOC KHOI CHAY THANH CONG!"
echo "========================================================"
echo " - Website CineEvent : http://localhost"
echo " - Quan tri MySQL    : http://localhost:8085 (phpMyAdmin)"
echo " - Dashboard Grafana : http://localhost:3000 (admin / Grafana_AdminSecurePass_2026!)"
echo " - Prometheus        : http://localhost:9090"
echo " - Container Monitor : http://localhost:8081 (cAdvisor)"
echo " - Backend Health    : http://localhost/health"
echo "========================================================"
echo "De dung he thong: docker compose down"
echo "========================================================"
