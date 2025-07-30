FROM node:20-slim

WORKDIR /usr/src/app

# Install build tools for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies from source to ensure compatibility
RUN npm ci --only=production || npm install --production

# Force rebuild of native modules for this Node.js version
RUN npm rebuild better-sqlite3 || npm install better-sqlite3 --build-from-source

# Copy application code
COPY . .

# Create data directory for SQLite
RUN mkdir -p /usr/src/app/data

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start the application
CMD ["node", "server.js"]