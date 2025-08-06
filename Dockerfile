# Stage 1: Dependencies
FROM node:18-alpine AS deps

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm install --legacy-peer-deps --force

# Stage 2: Builder
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Remove test files to reduce build size
RUN find src -type f -name "*.test.tsx" -delete || true
RUN find src -type f -name "*.spec.tsx" -delete || true

# Set environment variables for build optimization
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV GENERATE_SOURCEMAP=false
ENV CI=true

# Verify dependencies are installed
RUN npm list --depth=0

# Build React app with optimized settings
RUN npm run build || (echo "Build failed, trying with more memory..." && NODE_OPTIONS="--max-old-space-size=4096" npm run build)

# Stage 3: Production image
FROM nginx:alpine

# Install Python3 and pip for Secret Manager access
RUN apk add --no-cache python3 py3-pip

# Install Google Cloud Secret Manager client
RUN pip3 install --break-system-packages google-cloud-secret-manager

# Copy build output from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
