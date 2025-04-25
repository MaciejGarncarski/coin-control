import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'

import { ApiError } from '../utils/api-error.js'

export function authorize(req: Request, res: Response, next: NextFunction) {
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
