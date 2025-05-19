import { redisClient } from '@shared/queues'
import rateLimit, { type Options } from 'express-rate-limit'
import status from 'http-status'
import { RedisStore } from 'rate-limit-redis'

import { env } from '../config/env.js'
import { ApiError } from '../utils/api-error.js'

export const createRateLimiter = (options: Partial<Options>) => {
  return rateLimit({
    validate: { ip: false },
    message: {
      message: 'Too many requests, please try again later.',
      statusCode: status.TOO_MANY_REQUESTS,
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
      sendCommand: (...args: string[]) => redisClient.call(...args),
    }),
    handler: (_, __, next) => {
      if (env.NODE_ENV === 'test') {
        next()
      }

      throw new ApiError({
        message: 'Too many requests, please try again later.',
        statusCode: status.TOO_MANY_REQUESTS,
      })
    },
    ...options,
  })
}
