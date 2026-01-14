# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.13.0 
ARG PNPM_VERSION=10.10.0

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
COPY shared/database ./shared/database
COPY shared/queues ./shared/queues
COPY shared/email ./shared/email
COPY shared/schemas ./shared/schemas
COPY shared/eslint-prettier ./shared/eslint-prettier
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install 
ENV NODE_ENV="development"
EXPOSE ${PORT}
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
COPY --from=build /prod/worker/node_modules /prod/worker/node_modules
COPY --from=build /prod/worker/dist /prod/worker/dist
WORKDIR /prod/worker
EXPOSE ${PORT}
ENV NODE_ENV="production"
CMD ["node", "./dist/src/app.js"]