# syntax=docker/dockerfile:1.4

FROM node:26-alpine AS build

ENV NODE_ENV=production

WORKDIR /app

# ensure pnpm is available on alpine
RUN npm install -g pnpm@latest --silent

COPY pnpm-lock.yaml package.json ./

# install all dependencies (use frozen lockfile for reproducible builds)
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:26-alpine AS final
WORKDIR /app

# copy built output only
COPY --from=build /app/.output .output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]