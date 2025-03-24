import rateLimit, { type Options } from 'express-rate-limit'
import { ApiError } from './api-error.js'
import status from 'http-status'

export const createRateLimiter = (options: Partial<Options>) => {
  return rateLimit({
    message: {
      toastMessage: 'Too many requests, please try again later.',
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
