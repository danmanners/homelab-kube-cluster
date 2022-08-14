# Changing the container path to add 'docker.io/library/'
FROM docker.io/library/node:18-alpine AS build

WORKDIR /opt/node_app

COPY package.json yarn.lock ./
RUN yarn --ignore-optional

ARG NODE_ENV=production

COPY . .
RUN yarn build:app:docker

# Swapped container path from 'nginx:1.21-alpine' to 'docker.io/nginxinc/nginx-unprivileged:1.23.1'
FROM docker.io/nginxinc/nginx-unprivileged:1.23.1

COPY --from=build /opt/node_app/build /usr/share/nginx/html

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
