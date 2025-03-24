import type { NextFunction, Request, Response } from 'express'

import { isProd } from '../config/consatnts.js'
import { ApiError } from '../lib/api-error.js'
import type { ApiError as TApiError } from '@shared/schemas'
import status from 'http-status'

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

  if (error instanceof ApiError) {
    const responseMessage: TApiError = {
      message: errorMessage,
      statusCode: error.statusCode,
      additionalMessage: error.additionalMessage,
      toastMessage: error.toastMessage,
      stack: isProd ? undefined : error.stack,
    }

    res
      .status(error.statusCode || status.INTERNAL_SERVER_ERROR)
      .json(responseMessage)
    return
  }

  const responseMessage: TApiError = {
    message: 'Internal server error.',
    statusCode: req.statusCode || status.INTERNAL_SERVER_ERROR,
    additionalMessage: errorMessage,
    stack: isProd ? undefined : error.stack,
  }

  res
    .status(req.statusCode || status.INTERNAL_SERVER_ERROR)
    .json(responseMessage)
  return
}
