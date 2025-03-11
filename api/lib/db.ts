import postgres from 'postgres'
import { env } from '../src/config/env.js'

export const db = postgres(
  `postgres://${env.PG_USER}:${env.PG_PASS}@db:6432/budget_app`,
)
