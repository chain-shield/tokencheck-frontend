# Use the official Node.js 18 image as the base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Set environment variables
ENV NODE_ENV production
ENV PORT 8080

# Expose the port
EXPOSE 8080

# Start the app using server.js
CMD ["node", "server.js"]
