# # Stage 1: Build environment (based on node:18-alpine)
# FROM node:18-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json (if present)
# COPY package*.json ./

# # Install dependencies
# RUN npm install --legacy-peer-deps

# # Copy the rest of the application code
# COPY . .

# # Remove test files (optional: avoids TypeScript test build errors in production)
# RUN find src -type f -name "*.test.tsx" -delete || true
# RUN find src -type f -name "*.spec.tsx" -delete || true

# # Build the React application for production
# ENV NODE_OPTIONS=--max-old-space-size=4096
# RUN npm run build

# # Stage 2: Production image (based on nginx:alpine)
# FROM nginx:alpine

# # Copy static assets from the builder stage
# COPY --from=builder /app/build /usr/share/nginx/html

# # Expose port 80 for web traffic
# EXPOSE 80

# # Configure default server block to serve the React app
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Start the Nginx server
# CMD ["nginx", "-g", "daemon off;"]



# Stage 1: Build stage
FROM node:18-alpine AS builder

# Install Python3 and pip to access Google Secret Manager
RUN apk add --no-cache python3 py3-pip

# Install Google Cloud Secret Manager client
RUN pip3 install google-cloud-secret-manager

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy rest of the app
COPY . .

# Fetch secret and create .env.production
ENV GCP_PROJECT_ID=deployments-449806
ENV SECRET_NAME=api-endpoint-url

RUN python3 -c "\
import os; \
from google.cloud import secretmanager; \
client = secretmanager.SecretManagerServiceClient(); \
name = f'projects/{os.environ.get(\"GCP_PROJECT_ID\")}/secrets/{os.environ.get(\"SECRET_NAME\")}/versions/latest'; \
response = client.access_secret_version(request={'name': name}); \
secret = response.payload.data.decode(\"utf-8\"); \
with open('.env.production', 'w') as f: f.write(f'REACT_APP_SPRINGBOOT_BACKEND_SERVICE={secret}\n')"

# Optional: Remove test files
RUN find src -type f -name "*.test.tsx" -delete || true
RUN find src -type f -name "*.spec.tsx" -delete || true

# Build React app (this will use .env.production)
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy build output from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Replace default nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
