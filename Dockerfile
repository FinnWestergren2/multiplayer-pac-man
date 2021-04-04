# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:14-slim

# copy build scripts and package info
COPY server server
COPY core core

# Install production dependencies and generate static files
RUN cd core && npm install && npm run build
RUN cd server && npm install && npm run build-server

WORKDIR /server

# Run the web service on container startup.
CMD ["node", "static"]

EXPOSE 8080