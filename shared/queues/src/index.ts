import { Redis } from 'ioredis'

import { env } from './env.js'

export const redisClient = new Redis({
  maxRetriesPerRequest: null,
  host: 'cache',
  password: env.REDIS_PASSWORD,
  port: parseInt(env.REDIS_PORT),
})

export * from 'bullmq'
