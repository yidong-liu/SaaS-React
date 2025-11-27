FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY backend/src ./src

# Expose the application port
EXPOSE 8000

# Command to run the application
CMD ["node", "src/main.ts"]