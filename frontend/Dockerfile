# Use Node.js for the frontend container
FROM node:21.6.0

# Set the working directory
WORKDIR /

# Copy package.json and package-lock.json for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your frontend development server will run on
EXPOSE 3000 

# Define the command to start the frontend
CMD ["npm", "run", "serve"]
