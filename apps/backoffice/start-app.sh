#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-dev}"

case "$MODE" in
  dev|development)
    echo "🟢 Starting app in development mode..."
    npm run dev
    ;;
  staging)
    echo "🟢 Starting app in staging mode..."
    npm run dev -- --mode staging
    ;;
  production|prod)
    echo "🟢 Building app for production..."
    npm run build -- --mode production
    ;;
  preview)
    echo "🟢 Previewing production build..."
    npm run preview
    ;;
  *)
    echo "❌ Unknown mode: $MODE"
    echo "👉 Valid options: dev, staging, production, preview"
    exit 1
    ;;
esac