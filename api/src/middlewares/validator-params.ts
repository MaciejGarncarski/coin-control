import { type ApiError, z } from '@shared/schemas'
import type { NextFunction, Request, Response } from 'express'
import { status } from 'http-status'

export function validateParams(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any, any> | z.ZodSchema<any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue: z.ZodIssue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))

        const apiError: ApiError = {
          additionalMessage: JSON.stringify(errorMessages),
          message: `Query params validation error`,
          statusCode: status.BAD_REQUEST,
        }

        res.status(status.BAD_REQUEST).json(apiError)
      } else {
        const apiError: ApiError = {
          message: 'Internal server error',
          statusCode: status.INTERNAL_SERVER_ERROR,
        }
        res.status(status.INTERNAL_SERVER_ERROR).json(apiError)
      }
    }
  }
}
