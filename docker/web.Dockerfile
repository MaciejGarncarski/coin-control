# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.4.1

# base
FROM node:${NODE_VERSION}-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# dev
FROM base AS dev
WORKDIR /app
COPY web ./web
COPY shared ./shared
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
ENV NODE_ENV development
EXPOSE ${PORT}
CMD [ "pnpm", "--filter", "web", "dev" ]

# build prod
FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=web --prod /prod/web
RUN pnpm deploy "--filter=@shared/zod-schemas" --prod /prod/shared/zod-schemas

# prod
FROM base AS prod
COPY --from=build /prod/web /prod/web
WORKDIR /prod/web
EXPOSE ${PORT}
ENV NODE_ENV production
CMD ["node", "./dist/src/app.js"]