#!/bin/bash

APP_NAME="nextjs-app"
APP_DIR="/root/Website/zombie-app"  # <-- update this
SERVICE_FILE="/etc/systemd/system/$APP_NAME.service"

# Pull latest changes
git pull

# Install dependencies
npm install

# Build the project
npm run build

# Check if systemd service exists
if [ ! -f "$SERVICE_FILE" ]; then
  echo "Creating systemd service..."

  sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Next.js App
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=$(which npm) run start
Restart=always
RestartSec=5
User=root
Environment=PORT=3000
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

  sudo systemctl daemon-reexec
  sudo systemctl daemon-reload
  sudo systemctl enable "$APP_NAME"
fi

# Start (or restart) the service
sudo systemctl restart "$APP_NAME"

echo "✅ $APP_NAME service restarted"
