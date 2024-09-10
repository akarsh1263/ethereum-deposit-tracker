# Use official Node.js runtime as a parent image
FROM node:14

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container's working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
