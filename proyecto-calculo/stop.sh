#!/usr/bin/env bash
set -e

echo "Deteniendo servidores..."

# Mata procesos de Flask (app.py) y Next.js (next dev)
pkill -f "python app.py" 2>/dev/null && echo "Backend detenido." || echo "Backend no estaba corriendo."
pkill -f "next dev"      2>/dev/null && echo "Frontend detenido." || echo "Frontend no estaba corriendo."

echo "Listo."
