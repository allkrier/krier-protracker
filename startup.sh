#!/bin/bash
# Azure App Service startup script
# Builds the React app then starts the Express server

echo "Installing dependencies..."
pnpm install

echo "Building React app..."
pnpm run build:azure

echo "Starting server..."
pnpm run start
