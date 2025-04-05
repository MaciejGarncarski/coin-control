# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.6.1
ARG DATABASE_URL="test"

# base
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# tests
FROM base AS test
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY api ./api
COPY shared ./shared
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install 
ENV NODE_ENV="test"
EXPOSE ${PORT}
RUN pnpm "--filter=@shared/*" build && \
    pnpm --filter "api" generate-prisma
CMD [ "pnpm", "--filter", "api", "test:coverage" ]

# dev
FROM base AS dev
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY api ./api
COPY shared ./shared
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install 
ENV NODE_ENV="development"
EXPOSE ${PORT}
RUN pnpm --filter "api" generate-prisma
CMD [ "pnpm", "--filter", "api", "dev" ]

# build prod
FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store HUSKY=0 pnpm install --frozen-lockfile
RUN pnpm "--filter=@shared/*" build && \
    pnpm --filter "api" generate-prisma && \
    pnpm --filter=api build && \
    pnpm deploy --filter=api --prod /prod/api

# prod
FROM base AS prod
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE ${PORT}
ENV NODE_ENV="production"
CMD ["node", "./dist/src/server.js"]