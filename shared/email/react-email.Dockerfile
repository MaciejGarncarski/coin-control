# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.6.0
ARG PNPM_VERSION=10.15.0

# base
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# dev
FROM base AS dev
WORKDIR /app
COPY ./shared/email ./react-email
COPY shared ./shared
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
CMD [ "pnpm", "--filter", "@shared/email", "dev" ]