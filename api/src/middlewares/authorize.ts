import type { NextFunction, Request, Response } from 'express'

import { env } from '../config/env.js'
import { HttpError } from '../lib/http-error.js'

export function authorize(req: Request, _: Response, next: NextFunction) {
  if (env.NODE_ENV === 'test') {
    req.session.userId = '019601da-faff-76b7-ad12-ca98c8cffeb4'
    next()
    return
  }

  if (!req.session.id) {
    throw new HttpError({
      message: 'Unauthorized.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  if (!req.session.userId) {
    throw new HttpError({
      message: 'Unauthorized.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  next()
}
