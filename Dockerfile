# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:latest AS build-stage
#WORKDIR /app
#COPY package*.json /app/

#RUN yarn install
#COPY ./ /app/
#ARG configuration=production
#RUN yarn build
# --output-path=./dist/out --configuration $configuration
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
# Copy ui
COPY ./dist/ /usr/share/nginx/html

# Copy Nginx configuration for the application
COPY default.conf /etc/nginx/conf.d/default.conf.template

# Copy and set permissions for entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && \
    dos2unix /entrypoint.sh

WORKDIR /home/cert

# Launch NGINX through entrypoint
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
