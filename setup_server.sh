#!/bin/bash

# setup_server.sh
# This script forcefully updates Node.js to the latest LTS version and ensures npm is installed.

set -e

echo "Updating package index..."
sudo apt-get update

# --- Docker Setup (Skipped if already installed, but good to ensure latest) ---
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    sudo usermod -aG docker jenkins
else
    echo "Docker is already installed."
fi

# --- Node.js & npm Fix ---
echo "Detected Node version: $(node -v || echo 'None')"
echo "Cleaning up old Node.js versions..."
# Remove old versions to avoid conflicts
sudo apt-get remove -y nodejs npm || true
sudo apt-get autoremove -y

echo "Installing Node.js 20.x (LTS)..."
# Setup NodeSource repository for Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js (which includes npm)
sudo apt-get install -y nodejs build-essential

# Verify
echo "=========================================="
echo "Setup Complete!"
echo "Node Version: $(node -v)"
echo "NPM Version: $(npm -v)"
echo "=========================================="
