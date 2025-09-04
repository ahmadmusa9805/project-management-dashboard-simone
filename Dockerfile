# Stage 1: Build the application
FROM node:20-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a default Nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# # Add build argument
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]