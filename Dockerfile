# Stage 1: Build the React Application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies strictly from the lockfile
RUN npm ci

# Copy the rest of the application code
# Copy the rest of the application code
COPY . .

# Build Arguments (passed from Jenkins/CI)
ARG REACT_APP_BASE_URL
ARG REACT_APP_API_BASE_URL

# Set as environment variables for the build process
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Build the application
RUN npm run build

# Stage 2: Serve the Application using Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
