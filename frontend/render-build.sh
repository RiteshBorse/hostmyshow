#!/usr/bin/env bash
set -e

echo "🔧 Cleaning previous installs..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building project..."
npm run build
