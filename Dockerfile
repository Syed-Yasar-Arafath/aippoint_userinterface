# Stage 1: Build environment (based on node:18-alpine)
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React application for production
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# Stage 2: Production image (based on nginx:alpine)
FROM nginx:alpine

# Copy static assets from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Configure default server block to serve the React app
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]