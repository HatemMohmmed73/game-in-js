# Use the official Node.js image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Create data directory for SQLite
RUN mkdir -p /usr/src/app/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose port (this is just for documentation, doesn't actually publish the port)
EXPOSE 10000

# Start the application
CMD ["node", "server.js"]