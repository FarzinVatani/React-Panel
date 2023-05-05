# syntax=docker/dockerfile:1

FROM node:18.14-alpine3.16 AS builder
WORKDIR /opt/app
RUN corepack enable pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY ["package.json", "/opt/app"]
RUN pnpm install --offline

COPY ./ ./
RUN pnpm run build


FROM nginx:alpine AS final
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /opt/app/dist /usr/share/nginx/html

EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
