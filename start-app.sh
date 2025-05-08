#!/bin/bash

# Map short names to script keys
declare -A APP_MAP
APP_MAP=( 
  ["mor"]="dev:staging:merchant-of-records"
  ["mc"]="dev:staging:merchant-checkout"
)

# If no argument is provided, run all apps in staging mode
if [ -z "$1" ]; then
  echo "🟢 No app specified. Running all apps in staging mode..."
  npm run dev:staging:merchant-of-records &
  npm run dev:staging:merchant-checkout &
  wait
  echo "✅ All apps started in staging mode."
  exit 0
fi

# Normalize input
APP_KEY=$(echo "$1" | tr '[:upper:]' '[:lower:]')

# Check if the short name exists
if [[ -n "${APP_MAP[$APP_KEY]}" ]]; then
  SCRIPT_NAME=${APP_MAP[$APP_KEY]}
  echo "🟢 Starting $APP_KEY with script: $SCRIPT_NAME..."
  npm run "$SCRIPT_NAME"
else
  echo "❌ Unknown app alias: $APP_KEY"
  echo "👉 Available app aliases:"
  for key in "${!APP_MAP[@]}"; do
    echo "  - $key"
  done
  exit 1
fi