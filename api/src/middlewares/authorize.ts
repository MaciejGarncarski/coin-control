import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'

import { env } from '../config/env.js'
import { ApiError } from '../utils/api-error.js'

export function authorize(req: Request, res: Response, next: NextFunction) {
  if (env.NODE_ENV === 'test') {
    req.session.userId = '019601da-faff-76b7-ad12-ca98c8cffeb4'
    next()
    return
  }

  if (!req.session.id) {
    throw new ApiError({
      message: 'Unauthorized.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  if (!req.session.userId) {
    throw new ApiError({
      message: 'Unauthorized.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  next()
}
