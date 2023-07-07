# Use the official Node.js image as a base
FROM node:18.16

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application files to the working directory
COPY . .

# Install the dependencies using Yarn and build the application
RUN yarn install --non-interactive && \
	yarn build && \
	yarn install --production --ignore-scripts --prefer-offline --force --non-interactive && \
	npx prisma generate

# Expose the port your application will run on
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"]