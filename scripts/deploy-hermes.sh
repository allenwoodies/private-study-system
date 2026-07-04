#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/lighthouse/study-learning-system"
SERVICE_NAME="study-learning"
PORT="${PORT:-8610}"

echo "Deploying to ${APP_DIR}"

sudo mkdir -p "${APP_DIR}"
sudo chown -R "$USER":"$USER" "${APP_DIR}"

rsync -a --delete \
  --exclude node_modules \
  --exclude uploads \
  --exclude private \
  --exclude .env \
  ./ "${APP_DIR}/"

cd "${APP_DIR}"
npm install --omit=dev

sudo mkdir -p /etc/private-study-system
if [ ! -f /etc/private-study-system/study-learning.env ]; then
  sudo tee /etc/private-study-system/study-learning.env >/dev/null <<ENV
PORT=${PORT}
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_API_KEY=PLEASE_SET_THIS_ON_SERVER
UPLOAD_DIR=uploads
ENV
  echo "Created /etc/private-study-system/study-learning.env. Edit DEEPSEEK_API_KEY before starting production AI."
fi

sudo tee /etc/systemd/system/${SERVICE_NAME}.service >/dev/null <<SERVICE
[Unit]
Description=Private Study Learning System
After=network.target

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
EnvironmentFile=/etc/private-study-system/study-learning.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
User=${USER}
Group=${USER}

[Install]
WantedBy=multi-user.target
SERVICE

sudo systemctl daemon-reload
sudo systemctl enable ${SERVICE_NAME}.service
sudo systemctl restart ${SERVICE_NAME}.service
sudo systemctl status ${SERVICE_NAME}.service --no-pager -l

echo "Local health:"
curl -fsS "http://127.0.0.1:${PORT}/api/health"
echo

