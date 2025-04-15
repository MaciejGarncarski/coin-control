import type { ApiError as TApiError } from '@shared/schemas'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'

import { env } from '../config/env.js'
import { ApiError } from '../utils/api-error.js'
import { ValidationError } from '../utils/validation-error.js'

const isProd = env.NODE_ENV === 'production'

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
      type: 'api',
    }

    res.status(status.TOO_MANY_REQUESTS).json(responseMessage)
    return
  }

  const errorMessage = error.message || 'Internal server error'

  if (error instanceof ValidationError) {
    const responseMessage: TApiError = {
      statusCode: error.statusCode,
      message: errorMessage,
      paths: error.paths,
      type: 'validation',
    }

    res.status(error.statusCode || 500).json(responseMessage)
    return
  }

  if (error instanceof ApiError) {
    const responseMessage: TApiError = {
      message: errorMessage,
      statusCode: error.statusCode,
      additionalMessage: error.additionalMessage,
      formMessage: error.formMessage,
      toastMessage: error.toastMessage,
      stack: isProd ? undefined : error.stack,
      type: 'api',
    }

    res.status(error.statusCode || 500).json(responseMessage)
    return
  }

  const responseMessage: TApiError = {
    message: errorMessage,
    statusCode: req.statusCode || 500,
    stack: isProd ? undefined : error.stack,
    type: 'api',
  }

  res.status(req.statusCode || 500).json(responseMessage)
  return
}
