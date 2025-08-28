# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.6.0
ARG PNPM_VERSION=10.15.0
ARG VITE_API_URL

# base
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# tests
FROM base AS test
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY web ./web
COPY shared/schemas ./shared/schemas
COPY shared/eslint-prettier ./shared/eslint-prettier
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm "--filter=@shared/*" build

# dev
FROM base AS dev
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY web ./web
COPY shared/schemas ./shared/schemas
COPY shared/eslint-prettier ./shared/eslint-prettier
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
ENV NODE_ENV="development"
EXPOSE ${PORT}
CMD [ "pnpm", "--filter", "web", "dev" ]

# build prod
FROM base AS build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store HUSKY=0 pnpm install --frozen-lockfile
ARG NODE_ENV="production"
ENV NODE_ENV="production"
RUN pnpm "--filter=@shared/schemas" build && \
    pnpm --filter=web build && \
    pnpm deploy --filter=web --prod /prod/web


FROM nginx:alpine AS prod
WORKDIR /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /prod/web/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]