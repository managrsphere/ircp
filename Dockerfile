# syntax=docker/dockerfile:1.4

ARG NODE_VERSION=24.2.0

FROM ghcr.io/pnpm/pnpm:latest AS base

ENV NODE_ENV=production

WORKDIR /src

FROM base AS deps

WORKDIR /src
COPY package*.json ./

RUN pnpm runtime set node 24 -g
RUN pnpm install

FROM base as build

WORKDIR /src

COPY --from=deps /src/node_modules ./node_modules

COPY . .

RUN pnpm run build

FROM base AS runtime
WORKDIR /src

COPY --from=build /src/.output .
COPY --from=build /src/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "server/index.mjs"]