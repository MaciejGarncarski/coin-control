# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.4.1
ARG VITE_API_URL

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
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL?vite_api_url_not_set}
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG NODE_ENV="production"
ENV NODE_ENV="production"
RUN pnpm run -r build
RUN pnpm deploy --filter=web --prod /prod/web
RUN pnpm deploy "--filter=@shared/zod-schemas" --prod /prod/shared/zod-schemas
FROM nginx:alpine AS prod
WORKDIR /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /prod/web/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]