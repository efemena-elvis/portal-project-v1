#!/usr/bin/env bash

# Define per-app script variables
mor="dev:staging:merchant-of-records"
mc="dev:staging:merchant-checkout"
ms="dev:staging:merchant-storefront"

# If no argument is provided, run all apps
if [ -z "$1" ]; then
  echo "🟢 No app specified. Running all apps in staging mode..."
  npm run "$mor" &
  npm run "$mc" &
  npm run "$ms" &
  wait
  echo "✅ All apps started in staging mode."
  exit 0
fi

# Normalize input
APP_KEY=$(echo "$1" | tr '[:upper:]' '[:lower:]')

# Use indirect variable reference to get the script
SCRIPT_NAME="${!APP_KEY}"

if [ -n "$SCRIPT_NAME" ]; then
  echo "🟢 Running: npm run $SCRIPT_NAME"
  npm run "$SCRIPT_NAME"
else
  echo "❌ Unknown app alias: $APP_KEY"
  echo "👉 Valid options: mor, mc, ms"
  exit 1
fi