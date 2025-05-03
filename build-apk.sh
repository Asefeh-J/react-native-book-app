#!/bin/bash

echo "🔧 Checking if EAS CLI is installed..."
if ! command -v eas &> /dev/null
then
    echo "❌ eas-cli not found. Please install it with: npm install -g eas-cli"
    exit 1
fi

echo "✅ eas-cli is installed"

echo "🔑 Logging into Expo (if needed)..."
eas whoami || eas login

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting EAS build for Android (.apk)..."
eas build --platform android --profile preview

echo "📍 Done. If the build starts successfully, check your Expo dashboard to download the APK."
