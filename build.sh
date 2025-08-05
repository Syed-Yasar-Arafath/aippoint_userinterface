#!/bin/bash

# Build script for React application
set -e

echo "Starting build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps --force
fi

# Set environment variables
export NODE_ENV=production
export GENERATE_SOURCEMAP=false
export CI=true

# Try build with different memory settings
echo "Building React application..."
if npm run build; then
    echo "Build completed successfully!"
else
    echo "Build failed with default settings, trying with increased memory..."
    export NODE_OPTIONS="--max-old-space-size=4096"
    if npm run build; then
        echo "Build completed successfully with increased memory!"
    else
        echo "Build failed even with increased memory. Check the error messages above."
        exit 1
    fi
fi

echo "Build process completed!" 