#!/bin/bash

# Build script for React application
set -e

echo "Starting build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "Current directory: $(pwd)"
echo "Contents of current directory:"
ls -la

echo "Checking if node_modules exists:"
if [ -d "node_modules" ]; then
    echo "node_modules directory exists"
    echo "Number of items in node_modules: $(ls node_modules | wc -l)"
else
    echo "node_modules directory does not exist"
fi

# Set environment variables
export NODE_ENV=production
export GENERATE_SOURCEMAP=false
export CI=true

echo "Environment variables set:"
echo "NODE_ENV: $NODE_ENV"
echo "GENERATE_SOURCEMAP: $GENERATE_SOURCEMAP"
echo "CI: $CI"

# Try build with different memory settings
echo "Building React application..."
if npm run build; then
    echo "Build completed successfully!"
else
    echo "Build failed with default settings, trying with increased memory..."
    export NODE_OPTIONS="--max-old-space-size=4096"
    echo "NODE_OPTIONS set to: $NODE_OPTIONS"
    if npm run build; then
        echo "Build completed successfully with increased memory!"
    else
        echo "Build failed even with increased memory. Check the error messages above."
        exit 1
    fi
fi

echo "Build process completed!"

# Check if build directory was created
if [ -d "build" ]; then
    echo "Build directory created successfully"
    echo "Contents of build directory:"
    ls -la build/
else
    echo "ERROR: Build directory was not created!"
    exit 1
fi 