import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'

import { env } from '../config/env.js'
import { createErrorResponse } from '../utils/create-http-error-response.js'

export function authorize(req: Request, res: Response, next: NextFunction) {
  if (env.NODE_ENV === 'test') {
    req.session.userId = '019601da-faff-76b7-ad12-ca98c8cffeb4'
    next()
    return
  }

  if (!req.session.id) {
    createErrorResponse({
      res,
      message: 'Unauthorized.',
      statusCode: status.UNAUTHORIZED,
    })
    return
  }

  if (!req.session.userId) {
    createErrorResponse({
      res,
      message: 'Unauthorized.',
      statusCode: status.UNAUTHORIZED,
    })
    return
  }

  next()
}
