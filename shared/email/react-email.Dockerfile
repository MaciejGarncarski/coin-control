# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.13.0
ARG PNPM_VERSION=10.4.1

# base
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# deps
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY shared/email/package.json ./shared/email/package.json
COPY shared/schemas/package.json ./shared/schemas/package.json
COPY shared/eslint-prettier/package.json ./shared/eslint-prettier/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# dev
FROM deps AS dev
WORKDIR /app
COPY ./shared/email ./react-email
COPY shared ./shared
CMD [ "pnpm", "--filter", "@shared/email", "dev" ]