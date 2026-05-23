# Stage 1: Build the Vite frontend
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend and serve the application
FROM node:20-slim

WORKDIR /app/backend

# Install backend dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source code
COPY backend/ ./

# Copy the built frontend assets into the backend's public folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose the backend port
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]
