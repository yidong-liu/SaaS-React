FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies (with --legacy-peer-deps to resolve conflicts)
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma

# Expose the application port
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "start"]