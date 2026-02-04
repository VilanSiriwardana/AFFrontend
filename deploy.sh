#!/bin/sh
set -e

# Usage: ./deploy.sh <environment>
# environment: dev, staging, prod

ENV=$1
IMAGE_NAME="af-frontend"

if [ -z "$ENV" ]; then
    echo "Error: No environment specified."
    echo "Usage: ./deploy.sh <dev|staging|prod>"
    exit 1
fi

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
echo "Image: $IMAGE_NAME"
echo "=========================================="

# Check if the container is running and stop it
if [ "$(docker ps -q -f name=^/${CONTAINER_NAME}$)" ]; then
    echo "Stopping running container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME
fi

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
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:80 \
    --restart unless-stopped \
    $IMAGE_NAME

echo "Successfully deployed $CONTAINER_NAME on port $PORT."
