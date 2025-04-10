import type { ApiError } from '@shared/schemas'
import type { Request, Response } from 'express'
import status from 'http-status'

export const notFoundMiddleware = (req: Request, res: Response) => {
  const resMessage: ApiError = {
    message: 'Route not found.',
    additionalMessage: `Route ${req.path} not found.`,
    statusCode: status.NOT_FOUND,
    type: 'api',
  }

  res.status(status.NOT_FOUND).json(resMessage)
}
