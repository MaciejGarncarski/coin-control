import type { NextFunction, Request, Response } from 'express'

import { HttpError } from '../lib/http-error.js'

export function authorize(req: Request, _: Response, next: NextFunction) {
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
