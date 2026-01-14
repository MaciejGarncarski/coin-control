# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.13.0
ARG PNPM_VERSION=10.10.0
ARG DATABASE_URL="test"

# base
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# tests
FROM base AS test
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY api ./api
COPY shared/database ./shared/database
COPY shared/queues ./shared/queues
COPY shared/email ./shared/email
COPY shared/schemas ./shared/schemas
COPY shared/eslint-prettier ./shared/eslint-prettier
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm "--filter=@shared/*" build

# dev
FROM base AS dev
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY api ./api
COPY shared/database ./shared/database
COPY shared/queues ./shared/queues
COPY shared/email ./shared/email
COPY shared/schemas ./shared/schemas
COPY shared/eslint-prettier ./shared/eslint-prettier
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install 
ENV NODE_ENV="development"
EXPOSE ${PORT}
CMD [ "pnpm", "--filter", "api", "dev" ]

# build prod
FROM base AS build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store HUSKY=0 pnpm install --frozen-lockfile
RUN pnpm "--filter=@shared/*" build && \
    pnpm --filter=api build && \
    pnpm deploy --filter=api --prod /prod/api

# prod
FROM base AS prod
COPY --from=build /prod/api/node_modules /prod/api/node_modules
COPY --from=build /prod/api/dist /prod/api/dist
WORKDIR /prod/api
EXPOSE ${PORT}
ENV NODE_ENV="production"
CMD ["node", "./dist/src/server.js"]