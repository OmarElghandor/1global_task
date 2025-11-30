# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy Prisma schema (config not needed for generation)
COPY prisma ./prisma

# Generate Prisma Client (doesn't require DATABASE_URL)
RUN npx prisma generate

# Copy source files and TypeScript config
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript (if needed - the app uses tsx which can run TS directly, 
# but for production we might want compiled JS)
# For now, we'll use tsx in production as well since it's already a dependency
# If you want compiled JS, uncomment the build step and add a build script

# Stage 2: Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies + prisma and tsx for runtime
COPY package.json package-lock.json ./
RUN npm ci --only=production && \
    npm install prisma tsx && \
    npm cache clean --force

# Copy Prisma schema and generate client (config not needed for generation)
COPY prisma ./prisma
RUN npx prisma generate

# Copy config file (needed for migrations at runtime)
COPY prisma.config.ts ./

# Copy built application
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory to nodejs user
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/ping', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Default command (can be overridden in docker-compose)
CMD ["npx", "tsx", "src/server.ts"]

