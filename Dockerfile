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

# Clean install and rebuild native modules for this Node.js version
RUN rm -rf node_modules package-lock.json && \
    npm install --production && \
    npm rebuild

# Copy application code
COPY . .

# Create data directory for SQLite
RUN mkdir -p /usr/src/app/data

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start the application
CMD ["node", "server.js"]