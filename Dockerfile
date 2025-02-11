# Stage 1: Build the application
FROM node:lts-alpine AS builder

# Set environment variable
ENV NODE_ENV production

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build --production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine AS production

# Set environment variable
ENV NODE_ENV production

# Copy the built application from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
