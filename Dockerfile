# Stage 1: Build React app using Node
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies with peer dependency resolution
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Set environment options to prevent memory issues
ENV NODE_OPTIONS=--max-old-space-size=4096

# Build the app
RUN npm run build

# Stage 2: Serve app using Nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (make sure nginx.conf exists in project root)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
