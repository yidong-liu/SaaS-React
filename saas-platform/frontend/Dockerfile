# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all package.json files from both frontend and backend (for workspace)
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies for the entire workspace
RUN pnpm install

# Copy frontend source code
COPY frontend . 

# Build the application
RUN pnpm --filter frontend run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
