# Changing the container path to add 'docker.io/library/'
FROM docker.io/library/node:16-alpine AS build

WORKDIR /opt/node_app

COPY package.json yarn.lock ./
RUN /usr/local/bin/yarn --ignore-optional

ARG NODE_ENV=production

COPY . .
RUN  /usr/local/bin/yarn build:app:docker

# Swapped container path from 'nginx:1.21-alpine' to 'docker.io/nginxinc/nginx-unprivileged:1.23.1'
FROM docker.io/nginxinc/nginx-unprivileged:1.25.2@sha256:23f009b2619ce410123917e7f274fbb810931e6162f89c8050c6c06c80e63bd6

COPY --from=build /opt/node_app/build /usr/share/nginx/html

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
