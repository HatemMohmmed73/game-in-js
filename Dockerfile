FROM node:20-slim

WORKDIR /usr/src/app

# Install runtime dependencies and build tools
RUN apt-get update && apt-get install -y \
    sqlite3 \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild native modules
RUN npm ci --only=production && npm rebuild

# Copy application code
COPY . .

# Create data directory for SQLite
RUN mkdir -p /usr/src/app/data

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start the application
CMD ["node", "server.js"]