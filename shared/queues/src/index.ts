import { Redis } from 'ioredis'

import { env } from './env.js'

export const redisClient = new Redis({
  maxRetriesPerRequest: null,
  host: 'cache',
  password: env.REDIS_PASSWORD,
  port: parseInt(env.REDIS_PORT),
})

export * from 'bullmq'

export const QUEUES = {
  NEW_EMAIL_VERIFICATION: 'new-email-verification',
  EMAIL_VERIFICATION: 'email-verification-queue',
  EXPIRED_CODES_REMOVER: 'expired-codes-remover',
  EXPIRED_PASSWORD_TOKENS: 'expired-password-tokens',
  EXPIRED_SESSION_REMOVER: 'expired-session-remover',
  RESET_PASSWORD: 'reset-password-queue',
  RESET_PASSWORD_NOTIFICATION: 'reset-password-notification',
} as const

export type * from './job-types.js'
