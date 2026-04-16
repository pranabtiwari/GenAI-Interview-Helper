# Use Debian slim image for better compatibility (e.g. puppeteer deps)
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies using package-lock.json
RUN npm ci 

# Copy all files
COPY . .

# Expose backend port
EXPOSE 3000

# Run server
CMD ["node", "server.js"]