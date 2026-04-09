FROM node:22-alpine AS builder

WORKDIR /app

COPY ./my-app/package*.json ./
RUN npm ci

COPY ./my-app/ .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
