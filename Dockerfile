# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
# Install dependencies with clean slate
RUN npm cache clean --force
RUN npm install
COPY . .
# Force reinstall all dependencies to fix esbuild version mismatch
RUN rm -rf node_modules
RUN npm install
RUN npm run build

# Stage 2: Serve with a lightweight web server
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./public/env-config.js /usr/share/nginx/html/env-config.js.template
COPY ./entrypoint.sh /entrypoint.sh

# Make entrypoint executable
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]