# Use the official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Set the command to run your Nest app
CMD ["node", "dist/main"]

# Expose port (Cloud Run listens on $PORT)
EXPOSE 8080

# Set the environment variable to bind to the Cloud Run port
ENV PORT=8080