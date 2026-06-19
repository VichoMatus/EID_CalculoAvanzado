#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Instalando dependencias del Backend ==="
cd "$ROOT_DIR/backend"

if [ ! -d "venv" ]; then
  python3 -m venv venv
  echo "  Entorno virtual creado."
fi

./venv/bin/pip install --upgrade pip -q
./venv/bin/pip install -r requirements.txt -q
echo "  Dependencias de backend instaladas."

echo ""
echo "=== Instalando dependencias del Frontend ==="
cd "$ROOT_DIR/frontend"
npm install --silent
echo "  Dependencias de frontend instaladas."

echo ""
echo "¡Instalación completada!"
echo "Usa ./start.sh para levantar el proyecto."
