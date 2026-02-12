# Use Node.js 18 LTS Alpine for minimal image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source code
COPY src/ ./src/

# Expose the application port
EXPOSE 3000

# Run as non-root user for security
USER node

# Start the application
CMD ["node", "src/server.js"]
