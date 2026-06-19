#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Iniciando backend Flask..."
cd "$ROOT_DIR/backend"
./venv/bin/python app.py &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Iniciando frontend Next.js..."
cd "$ROOT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "Proyecto levantado:"
echo "  Backend  → http://localhost:5000"
echo "  Frontend → http://localhost:3000"
echo ""
echo "Para detener: ./stop.sh"
