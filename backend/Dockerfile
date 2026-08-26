# ==========================================
# Stage 1: Dependency & Builder Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package descriptors first to leverage Docker cache layers
COPY package*.json ./

# Install all dependencies (development + production)
RUN npm ci

# Copy the rest of the application files
COPY . .

# ==========================================
# Stage 2: Production Runner Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Define production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Copy package files for installing only production modules
COPY package*.json ./

# Install only production dependencies to keep the image slim
RUN npm ci --only=production

# Copy source code from host (avoiding node_modules, handled by dockerignore)
COPY . .

# Adjust file ownership to non-root node user for container security hardening
RUN chown -R node:node /usr/src/app

# Switch container execution to non-privileged user
USER node

# Expose backend port
EXPOSE 5000

# Perform healthcheck (optional but highly recommended for container orchestration)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/health').then(r => r.status === 200 ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
