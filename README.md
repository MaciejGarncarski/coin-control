# CoinControl

<img width="192" height="192" src="https://raw.githubusercontent.com/MaciejGarncarski/coin-control/main/.github/assets/logo.png">

CoinControl is a budget tracking app designed to help users monitor their income and expenses. It addresses the common problem of lacking control over personal finances by providing tools for effective money management.

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
- React Email for emails
- nodemailer
- Prisma
- Zod
- Vitest
- Supertest

## Installation

You need to have docker installed on your system.

`pnpm install`

Create .env file in root directory based on .env.example

`pnpm --filter "@shared/*" build`

`pnpm dev`

## Screenshots
