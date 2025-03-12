import postgres from 'postgres'
import { env } from '../src/config/env.js'

export const db = postgres(env.DB_URL, { debug: true })
