import { z, type ApiError } from '@shared/zod-schemas'
import type { NextFunction, Request, Response } from 'express'
import { status } from 'http-status'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue: z.ZodIssue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))

        const apiError: ApiError = {
          error: 'Invalid data',
          message: errorMessages,
        }

        res.status(status.BAD_REQUEST).json(apiError)
      } else {
        const apiError: ApiError = {
          error: 'Internal server error',
        }
        res.status(status.INTERNAL_SERVER_ERROR).json(apiError)
      }
    }
  }
}
