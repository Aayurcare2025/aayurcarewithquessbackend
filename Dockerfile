# # Stage 1: Build
# FROM node:18 AS builder
# WORKDIR /app

# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build   # generates /app/dist

# # Stage 2: Run
# FROM node:18 AS runner
# WORKDIR /app

# COPY package*.json ./
# RUN npm install --only=production

# COPY --from=builder /app/dist ./dist

# EXPOSE 5000
# CMD ["npm", "run", "start:prod"]


# ===========================
# Stage 1: Build (with dev dependencies)
# ===========================
FROM node:22 AS builder
WORKDIR /build

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies (including dev) for building
RUN npm ci

# Copy source code
COPY . .

# Build the project (generates dist/)
RUN npm run build

# ===========================
# Stage 2: Run (production only)
# ===========================
FROM node:22-slim AS runner
WORKDIR /app

# Copy only package.json & package-lock.json to install prod deps
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy compiled dist folder from builder stage
COPY --from=builder /build/dist ./dist

# Copy .env if you have one
COPY --from=builder /build/.env ./

# Expose port (change if needed)
EXPOSE 6000

# Start the app
CMD ["node", "dist/main.js"]
