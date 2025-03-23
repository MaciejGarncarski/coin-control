# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.6.1

# base
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# dev
FROM base AS dev
WORKDIR /app
COPY api ./api
COPY shared ./shared
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
ENV NODE_ENV=development
EXPOSE ${PORT}
RUN pnpm --filter "api" generate-prisma
CMD [ "pnpm", "--filter", "api", "dev" ]

# build prod
FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm "--filter=@shared/*" build
RUN pnpm --filter "api" generate-prisma
RUN pnpm --filter=api build
RUN pnpm deploy --filter=api --prod /prod/api

# prod
FROM base AS prod
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE ${PORT}
ENV NODE_ENV=production
CMD ["node", "./dist/src/app.js"]