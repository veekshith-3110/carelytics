#!/bin/bash
# Bash script for clean installation on Unix-based systems
# This script helps resolve npm install issues by cleaning and reinstalling dependencies

echo "Cleaning npm installation..."

# Remove node_modules if it exists
if [ -d "node_modules" ]; then
    echo "Removing node_modules..."
    rm -rf node_modules
    echo "node_modules removed."
fi

# Remove package-lock.json if it exists
if [ -f "package-lock.json" ]; then
    echo "Removing package-lock.json..."
    rm -f package-lock.json
    echo "package-lock.json removed."
fi

# Remove .next build directory if it exists
if [ -d ".next" ]; then
    echo "Removing .next directory..."
    rm -rf .next
    echo ".next directory removed."
fi

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force
echo "npm cache cleared."

# Verify npm cache
echo "Verifying npm cache..."
npm cache verify
echo "npm cache verified."

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "Installation completed successfully!"
else
    echo "Installation failed. Please check the error messages above."
    exit 1
fi

