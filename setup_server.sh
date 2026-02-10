#!/bin/bash

# setup_server.sh
# This script installs Docker, Node.js, npm, and Git on an Ubuntu server.
# Run this script on your Jenkins server to prepare it for the pipeline.

set -e

echo "Updating package index..."
sudo apt-get update

echo "Installing prerequisites..."
sudo apt-get install -y ca-certificates curl gnupg git unzip

# --- Install Docker ---
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Add jenkins user to docker group so it can run docker commands
    echo "Adding 'jenkins' user to 'docker' group..."
    sudo usermod -aG docker jenkins
    
    echo "Docker installed successfully."
else
    echo "Docker is already installed."
fi

# --- Install Node.js & npm (LTS Version) ---
if ! command -v node &> /dev/null; then
    echo "Installing Node.js and npm..."
    # Using NodeSource for the latest LTS version
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "Node.js and npm installed successfully."
else
    echo "Node.js is already installed."
fi

echo "=========================================="
echo "Setup Complete!"
echo "Docker Version: $(docker --version)"
echo "Node Version: $(node --version)"
echo "NPM Version: $(npm --version)"
echo "Git Version: $(git --version)"
echo "=========================================="
echo "IMPORTANT: You may need to restart Jenkins for group changes to take effect:"
echo "sudo systemctl restart jenkins"
