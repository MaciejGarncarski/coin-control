# CoinControl

<img width="192" height="192" src="https://raw.githubusercontent.com/MaciejGarncarski/coin-control/refs/heads/main/.github/assets/logo.png">

CoinControl is a budget tracking app designed to help users monitor their income and expenses. It addresses the common problem of lacking control over personal finances by providing tools for effective money management.

I have created this app mostly for myself, but feel free to use it :P

## Live deployment

This app is hosted on my VPS.

[coincontrol.maciej-garncarski.pl](https://coincontrol.maciej-garncarski.pl)

## Tech used

I have used pnpm workspaces as monorepo for this project. I could use turborepo or nx, but I have decided to keep things simple for now.

### DevOps

- Docker
- Docker compose
- Nginx
- just (command runner)
- Postgresql database
- Redis
- Github Actions CI/CD

### Frontend

- TypeScript
- React
- Tanstack Router
- Tailwind CSS
- Shadcn UI
- Vite
- Vitest
- React testing library
- Zod

### Backend

- Express
- Typescript
- BullMQ for queues and cron
- Prisma
- Zod
- nodemailer
- React Email for emails
- Vitest
- Supertest

## Configuration

Create .env file in root directory based on .env.example

```txt
API_PORT=
HOST=
DATABASE_URL=
MAIL_USER=
MAIL_PASS=

API_SECRET=
WEB_PORT=
APP_URL=
API_URL=

ENCRYPTION_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_OAUTH_URL=
GOOGLE_ACCESS_TOKEN_URL=
GOOGLE_CALLBACK_URL=
```

## Installation and running

You need to have docker installed on your system.

### Install dependencies

`pnpm install`

### Build shared monorepo packages

`pnpm --filter "@shared/*" build`

### Run docker container in dev mode

`pnpm dev`

## Author

Maciej Garncarski
