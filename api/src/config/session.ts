import type { SessionOptions } from 'express-session'
import { env } from './env.js'
import PostgresSessionStore from '../lib/session-store.js'
import ms from 'ms'

const SessionStore = new PostgresSessionStore()

const COOKIE_MAX_AGE = ms('1 week')

export const sessionConfig: SessionOptions = {
  secret: env.API_SECRET,
  resave: true,
  rolling: false,
  saveUninitialized: false,
  store: SessionStore,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
  },
}
