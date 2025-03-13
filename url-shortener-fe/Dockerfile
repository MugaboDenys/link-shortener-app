# Step 1: Build the frontend app (using a Node.js base image)
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY url-shortener-fe/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY url-shortener-fe/ ./

# Build the Next.js app
RUN npm run build

# Step 2: Create the final production image
FROM node:18

WORKDIR /app

# Copy built app from the build stage
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/package*.json /app/

# Install production dependencies only
RUN npm install --production

# Expose port for the frontend server
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "run", "start"]
