# Multi-stage build for production
FROM node:18-alpine AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend-build

# Install build dependencies for native modules
RUN apk add --no-cache make gcc g++ python3 sqlite-dev

WORKDIR /app/backend
COPY backend/package*.json ./

# Install dependencies and rebuild native modules for Alpine
RUN npm ci --only=production
RUN npm rebuild

COPY backend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache sqlite

WORKDIR /app

# Copy backend build and rebuilt native modules
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package*.json ./backend/

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Install serve for serving static files
RUN npm install -g serve

# Create database directory
RUN mkdir -p /app/database

# Copy database initialization files
COPY database/ ./database/

EXPOSE 3000
EXPOSE 80

# Start both backend and serve frontend
CMD ["sh", "-c", "cd backend && npm start & serve -s frontend/build -l 80"]