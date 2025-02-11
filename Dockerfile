# Use official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally (optional if using locally)
RUN npm install -g nodemon

# Copy the rest of the application
COPY . .

# Expose the application's port
EXPOSE 3000

# Start the application using nodemon
CMD ["nodemon", "app.js"]
