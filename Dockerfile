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
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]