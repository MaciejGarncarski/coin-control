import type { NextFunction, Request, Response } from 'express'

import { HttpError } from '../lib/http-error.js'

export function authorize(req: Request, _: Response, next: NextFunction) {
  // eslint-disable-next-line no-console
  console.log(req.session.id, req.sessionID)

  if (!req.session.id) {
    throw new HttpError({
      message: 'Unauthorized.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  // eslint-disable-next-line no-console
  console.log('uid', req.session.userId)

  if (!req.session.userId) {
    throw new HttpError({
      message: 'Unauthorized.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  next()
}
