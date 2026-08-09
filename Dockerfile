# syntax=docker/dockerfile:1.4

FROM node:26-alpine AS build

ENV NODE_ENV=production

WORKDIR /app

# ensure pnpm is available on alpine
RUN npm install -g pnpm@10.33.4 --silent

COPY pnpm-lock.yaml package.json ./

# install all dependencies (try frozen lockfile, fall back to updating)
# If the lockfile is missing platform-specific native binaries (e.g. when
# the lockfile was generated on a different OS), allow install to proceed
# by falling back to a normal install inside the container.
RUN pnpm install --frozen-lockfile || pnpm install

COPY . .

RUN pnpm run build

FROM node:26-alpine AS final
WORKDIR /app

# copy built output only
COPY --from=build /app/.output .output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]