import { Redis } from 'ioredis'
import { env } from './env.js'

export const connection = new Redis({
  maxRetriesPerRequest: null,
  host: 'cache',
  password: env.REDIS_PASSWORD,
  port: parseInt(env.REDIS_PORT),
})
