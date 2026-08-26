# ==========================================
# Stage 1: Build static web assets
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package config first for cache optimization
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Copy codebase
COPY . .

# Compile Vite production build files into dist/ folder
RUN npm run build

# ==========================================
# Stage 2: Serve web assets with Nginx
# ==========================================
FROM nginx:1.25-alpine AS runner

# Remove the default nginx config file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration mapping API proxy rules
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build assets from builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
