
# Base Image
FROM node:20

# Create a app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

# Run deps
RUN npm install

# Copy source code
COPY . .

# Build typescript
RUN npm run build

# Set environment variables if needed
ENV NODE_ENV=production

# Expose the app port (optional but recommended for Docker networking)
EXPOSE 5000

# Start the app
CMD ["npm", "run", "start"]





