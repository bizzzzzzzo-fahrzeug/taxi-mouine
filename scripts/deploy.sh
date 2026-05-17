#!/bin/bash
# Deploy Taxi Mouine to Hetzner CX22
# Usage: ./deploy.sh <hetzner-ip>

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <hetzner-ip>"
  exit 1
fi

HOST="root@$1"
PROJECT_DIR="/opt/taxi-mouine"

echo "=== Building project ==="
cd "$(dirname "$0")/.."

echo "=== Syncing files to Hetzner ==="
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.env' \
  --exclude 'website/node_modules' \
  --exclude 'website/dist' \
  --exclude 'mobile' \
  ./ "$HOST:$PROJECT_DIR"

echo "=== Setting up on Hetzner ==="
ssh "$HOST" << 'EOF'
  set -euo pipefail

  cd /opt/taxi-mouine

  # Install Docker if not present
  if ! command -v docker &> /dev/null; then
    apt-get update
    apt-get install -y docker.io docker-compose-v2
  fi

  # Generate JWT secret if not set
  if [ ! -f .env ]; then
    echo "JWT_SECRET=$(openssl rand -hex 32)" > .env
  fi

  # Start services
  docker compose up -d --build

  echo "=== Deployment complete ==="
  echo "Backend: http://$(curl -s ifconfig.me):6868/api/health"
  echo "Website: http://$(curl -s ifconfig.me)"
EOF
