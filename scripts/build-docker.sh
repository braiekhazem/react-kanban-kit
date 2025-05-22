#!/bin/bash

# Check if the .env file exists
if [ -f ./.env ]; then
    source ./.env
else
    echo "Error: .env file not found."
    exit 1
fi

# Define variables
IMAGE_NAME="front-end-guidlines"
CONTAINER_NAME="${IMAGE_NAME}-${VITE_APP_BASE_NODE_ENV}"
PORT_MAPPING="${VITE_APP_PORT}:4000"

# Function to handle errors
handle_error() {
    echo "Error: $1"
    echo "Exiting..."
    exit 1
}

# Stop and remove existing Docker container if it exists
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "Stopping and removing existing container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Build the Docker image
echo "Building Docker image: $IMAGE_NAME"
docker build -t $IMAGE_NAME . || handle_error "Docker image build failed."

echo "Docker image built successfully: $IMAGE_NAME"

# Run the Docker container in detached mode and redirect logs to stdout
echo "Starting Docker container: $CONTAINER_NAME"
docker run -p $PORT_MAPPING -d --name $CONTAINER_NAME $IMAGE_NAME || handle_error "Failed to start container."

# Display logs from the container
echo "Displaying logs from container: $CONTAINER_NAME"
docker logs -f $CONTAINER_NAME

# Capture the exit status of the container
exit_status=$(docker inspect -f '{{.State.ExitCode}}' $CONTAINER_NAME)

# Check if the container exited with an error
if [ $exit_status -ne 0 ]; then
    handle_error "Container exited with error: $exit_status"
fi

# Copy the built files from the container to the host
echo "Copying files from container to host..."
sudo docker cp $CONTAINER_NAME:/app/dist "${VITE_APP_DIST_LOCATION}" || handle_error "Failed to copy files from container to host."

echo "Docker container completed and files copied: $CONTAINER_NAME"

# Stop and remove the Docker container
echo "Stopping and removing container: $CONTAINER_NAME"
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Remove the Docker image
echo "Removing Docker image: $IMAGE_NAME"
docker rmi $IMAGE_NAME
