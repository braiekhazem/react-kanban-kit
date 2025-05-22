# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to work directory
COPY package.json ./

# Install dependencies in the container
RUN npm install --force

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

EXPOSE 4000

# Run the application in prod mode
CMD ["npm", "run", "build"]

