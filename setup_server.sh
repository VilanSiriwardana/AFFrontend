#!/bin/bash

# setup_server.sh
# ----------------------------------------------------------------------
# RUN THIS SCRIPT ON YOUR UBUNTU JENKINS SERVER AS A SUDO USER
# usage: sudo ./setup_server.sh
# ----------------------------------------------------------------------

set -e

echo ">>> Starting Server Setup..."

# 1. FIX NODE.JS AND NPM
echo ">>> identifying existing Node versions..."
which node || echo "Node not found in path"
node -v || echo "Node version check failed"

echo ">>> Removing OLD Node.js and npm..."
# Aggressively remove old versions
sudo apt-get purge -y nodejs npm libnode* || true
sudo apt-get autoremove -y
sudo rm -rf /etc/apt/sources.list.d/nodesource.list
sudo rm -rf /usr/lib/node_modules
sudo rm -rf /usr/local/bin/node
sudo rm -rf /usr/local/bin/npm
sudo rm -rf /usr/local/bin/npx

echo ">>> Installing Node.js 20.x (LTS)..."
# Add NodeSource repo
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
# Install Node (wrapper for npm included)
sudo apt-get install -y nodejs build-essential

# 2. INSTALL DOCKER (If missing)
if ! command -v docker &> /dev/null; then
    echo ">>> Installing Docker..."
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
else
    echo ">>> Docker is already installed."
fi

# 3. CONFIGURE PERMISSIONS
echo ">>> Configuring permissions..."
sudo usermod -aG docker jenkins || echo "Jenkins user not found, skipping group add."

# 4. VERIFICATION
echo "=========================================="
echo "VERIFICATION RESULTS:"
echo "------------------------------------------"
echo "Node Path: $(which node)"
echo "Node Version: $(node -v)"
echo "NPM Path: $(which npm)"
echo "NPM Version: $(npm -v)"
echo "Docker Version: $(docker --version)"
echo "=========================================="
echo "PLEASE RESTART JENKINS SERVICE TO ENSURE PATH UPDATES PICK UP:"
echo "sudo systemctl restart jenkins"
