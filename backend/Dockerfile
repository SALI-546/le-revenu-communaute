FROM node:22-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /opt/app
COPY --from=build --chown=node:node /opt/app ./
USER node
EXPOSE 1337
CMD ["npm", "run", "start"]
