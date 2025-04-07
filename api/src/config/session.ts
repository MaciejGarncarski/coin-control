import type { SessionOptions } from 'express-session'
import ms from 'ms'

import PostgresSessionStore from '../lib/session-store.js'
import { env } from './env.js'

const SessionStore = new PostgresSessionStore()

const COOKIE_MAX_AGE = ms('1 week')

export const sessionConfig: SessionOptions = {
  secret: env.API_SECRET,
  resave: false,
  rolling: false,
  saveUninitialized: false,
  store: SessionStore,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
  },
}
