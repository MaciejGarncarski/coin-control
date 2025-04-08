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
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY worker ./worker
COPY shared ./shared
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
ENV NODE_ENV="development"
# RUN pnpm --filter "worker" generate-prisma
CMD [ "pnpm", "--filter", "worker", "dev" ]

# build prod
FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store HUSKY=0 pnpm install --frozen-lockfile
RUN pnpm "--filter=@shared/*" build && \
    pnpm --filter=worker build && \
    pnpm deploy --filter=worker --prod /prod/worker

# prod
FROM base AS prod
COPY --from=build /prod/worker /prod/worker
WORKDIR /prod/worker
EXPOSE ${PORT}
ENV NODE_ENV="production"
CMD ["node", "./dist/src/app.js"]