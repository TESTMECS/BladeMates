
FROM node:21.6.0

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose the port the backend server will run on
EXPOSE 3001
EXPOSE 4000

# command to run 
CMD ./dockerscript.sh
