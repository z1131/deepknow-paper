#!/bin/sh
SERVICE_NAME=${SERVICE_NAME:-gateway}

case $SERVICE_NAME in
  "gateway")
    echo "Starting Gateway..."
    exec java -jar /app/app-gateway.jar
    ;;
  "auth")
    echo "Starting Auth..."
    exec java -jar /app/app-auth.jar
    ;;
  "core")
    echo "Starting Core..."
    exec java -jar /app/app-core.jar
    ;;
  *)
    echo "Unknown service: $SERVICE_NAME"
    exit 1
    ;;
esac
