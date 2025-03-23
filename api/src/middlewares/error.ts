import type { NextFunction, Request, Response } from 'express'

import { isProd } from '../config/consatnts.js'
import { ApiError } from '../lib/api-error.js'
import type { ApiError as TApiError } from '@shared/schemas'

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(error)
  }

  const errorMessage = error.message || 'Internal server error'

  if (error instanceof ApiError) {
    const responseMessage: TApiError = {
      message: errorMessage,
      statusCode: error.statusCode,
      additionalMessage: error.additionalMessage,
      toastMessage: error.toastMessage,
      stack: isProd ? undefined : error.stack,
    }

    res.status(error.statusCode || 500).json(responseMessage)
    return
  }

  const responseMessage: TApiError = {
    message: 'Internal server error.',
    statusCode: req.statusCode || 500,
    additionalMessage: errorMessage,
    stack: isProd ? undefined : error.stack,
  }

  res.status(req.statusCode || 500).json(responseMessage)
  return
}
