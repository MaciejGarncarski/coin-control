import type { ApiError as TApiError } from '@shared/schemas'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'

import { isProd } from '../config/consatnts.js'
import { HttpError } from '../lib/http-error.js'

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(error)
  }

  if (req.statusCode === 429) {
    const responseMessage: TApiError = {
      message: 'Too many requests.',
      statusCode: status.TOO_MANY_REQUESTS,
      toastMessage: 'Too many requests, please try again later.',
      stack: isProd ? undefined : error.stack,
    }

    res.status(status.TOO_MANY_REQUESTS).json(responseMessage)
    return
  }

  const errorMessage = error.message || 'Internal server error'

  if (error instanceof HttpError) {
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
    stack: isProd ? undefined : error.stack,
  }

  res.status(req.statusCode || 500).json(responseMessage)
  return
}
