
# Base Image
FROM node:20

# Install pnpm globally
RUN npm install -g pnpm

# Create a app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

# Run deps
RUN pnpm install

# Copy source code
COPY . .

# Build typescript
# RUN npm run build

# Expose the app port (optional but recommended for Docker networking)
EXPOSE 5000

# Start the app
CMD ["pnpm", "run", "start:dev"]




