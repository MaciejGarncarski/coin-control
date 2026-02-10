# CoinControl

<img width="192" height="192" src="https://raw.githubusercontent.com/MaciejGarncarski/coin-control/refs/heads/main/.github/assets/logo.png">

CoinControl is a budget tracking app designed to help users monitor their income and expenses. It addresses the common problem of lacking control over personal finances by providing tools for effective money management.

## Live deployment

This app is hosted on my VPS.

<a href="https://coincontrol.maciej-garncarski.pl" target="_blank">coincontrol.maciej-garncarski.pl</a>

## Screenshots

Here are some screenshots showcasing the app:

### Homepage

<img width="800" src="https://raw.githubusercontent.com/MaciejGarncarski/coin-control/refs/heads/main/.github/assets/screenshots/homepage.png">

### Transactions

<img width="800" src="https://raw.githubusercontent.com/MaciejGarncarski/coin-control/refs/heads/main/.github/assets/screenshots/transactions.png">

### Analytics

<img width="800" src="https://raw.githubusercontent.com/MaciejGarncarski/coin-control/refs/heads/main/.github/assets/screenshots/analytics.png">

### Account

<img width="800" src="https://raw.githubusercontent.com/MaciejGarncarski/coin-control/refs/heads/main/.github/assets/screenshots/account.png">

## Tech used

I have used pnpm workspaces as monorepo for this project. I could use turborepo or nx, but I have decided to keep things simple for now.

### DevOps

- Docker
- Docker compose
- Nginx
- Postgresql database
- Redis
- Github Actions CI/CD

### Frontend

- TypeScript
- React
- TanStack Router
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
API_URL=
WEB_PORT=
APP_URL=
HOST=
ENCRYPTION_SECRET=
API_SECRET=

DATABASE_URL=
MAIL_USER=
MAIL_PASS=

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

### Init database

`pnpm init-db`

### Reset database

`pnpm reset-db`

### Seed database

`pnpm seed-db`

## Run tests

Look for test type you want to run in `package.json` scripts.

Example:

`pnpm test-api-coverage`

## Author

Maciej Garncarski
