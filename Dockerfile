# Stage 1: Build the application
FROM node:18 AS builder

WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application (if needed)
# RUN npm run build

# Stage 2: Create the production image
FROM node:18-slim

WORKDIR /usr/src/app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built application from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# Create data directory for SQLite
RUN mkdir -p /usr/src/app/data

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["node", "server.js"]