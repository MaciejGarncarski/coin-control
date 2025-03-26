import rateLimit, { type Options } from 'express-rate-limit'
import status from 'http-status'

import { ApiError } from './api-error.js'

export const createRateLimiter = (options: Partial<Options>) => {
  return rateLimit({
    message: {
      message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: () => {
      throw new ApiError({
        message: 'Too many requests, please try again later.',
        statusCode: status.TOO_MANY_REQUESTS,
      })
    },
    ...options,
  })
}
