# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.6.1

# base
FROM node:${NODE_VERSION}-alpine as base
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
# RUN pnpm --filter "@shared/*" build
ENV NODE_ENV development
EXPOSE ${PORT}
CMD [ "pnpm", "--filter", "api", "dev" ]
# RUN pnpm --filter "api" dev

# build prod
FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy "--filter=@shared/zod-schemas" --prod /prod/shared/zod-schemas

# prod
FROM base AS prod
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE ${PORT}
ENV NODE_ENV production
CMD ["node", "./dist/src/app.js"]