#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Get the environment argument (dev, staging, prod)
ENV=$1

if [ -z "$ENV" ]; then
    echo "Error: No environment specified. Usage: ./deploy.sh <env>"
    exit 1
fi

# Define variables based on environment
case "$ENV" in
    "dev")
        CONTAINER_NAME="react-dev"
        PORT=3001
        ;;
    "staging")
        CONTAINER_NAME="react-staging"
        PORT=3002
        ;;
    "prod")
        CONTAINER_NAME="react-prod"
        PORT=3000
        ;;
    *)
        echo "Error: Invalid environment '$ENV'. Allowed: dev, staging, prod"
        exit 1
        ;;
esac

echo "=========================================="
echo "Deploying to Environment: $ENV"
echo "Container Name: $CONTAINER_NAME"
echo "Port: $PORT"
echo "Image: af-frontend"
echo "=========================================="

# Check if the container exists (stopped or running) and remove it
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
    echo "Removing existing container: $CONTAINER_NAME"
    docker rm -f $CONTAINER_NAME
fi

# Check for any OTHER container occupying the port (e.g. legacy containers)
CONFLICT_ID=$(docker ps -q --filter "publish=$PORT")
if [ ! -z "$CONFLICT_ID" ]; then
    echo "Detected conflict on port $PORT. Removing blocking container: $CONFLICT_ID"
    docker stop $CONFLICT_ID || true
    docker rm $CONFLICT_ID || true
fi

echo "Starting new container..."
docker run -d -p $PORT:80 --name $CONTAINER_NAME af-frontend

echo "Deployment to $ENV successful!"
