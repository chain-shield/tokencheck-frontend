# Use the official Node.js 18 image as the base image
FROM node:18-alpine  AS builder

# Create app directory
WORKDIR /app

# Add build arguments
ARG API_URL
ENV API_URL=${API_URL}

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js app with API_URL set
RUN npm run build

# Create a new stage for the production image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy only the standalone build and necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set environment variables
ENV NODE_ENV production
ENV PORT 8080

# Expose the port
EXPOSE 8080

# Start the app using server.js
CMD ["node", "server.js"]
