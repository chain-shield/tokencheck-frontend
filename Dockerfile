# Use the official Node.js 18 image as the base image
FROM node:18-alpine  AS builder

# Create app directory
WORKDIR /app

# Add build arguments
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG NEXT_PUBLIC_SUBSCRIPTIONS_API_URL
ENV NEXT_PUBLIC_SUBSCRIPTIONS_API_URL=${NEXT_PUBLIC_SUBSCRIPTIONS_API_URL}
ARG RESEND_API_KEY
ENV RESEND_API_KEY=${RESEND_API_KEY}}

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install dev dependencies needed for types
RUN npm install --save-dev @types/jest

# Copy the rest of the application
COPY . .

# Create a build-specific tsconfig file
COPY tsconfig.build.json ./

# Build the Next.js app using the build-specific tsconfig
RUN NEXT_TSCONFIG=tsconfig.build.json npm run build

# Create a new stage for the production image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy only the standalone build and necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the port
EXPOSE 3000

# Start the app using server.js
CMD ["node", "server.js"]
