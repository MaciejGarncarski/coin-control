import type { NextFunction, Request, Response } from 'express'
import { status } from 'http-status'
import { z } from 'zod'

import { ApiError } from '../utils/api-error.js'
import { ValidationError } from '../utils/validation-error.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateBody(schema: z.ZodObject<any, any> | z.ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue: z.ZodIssue) => {
          return issue.path.map((el) => el.toString())
        })

        throw new ValidationError({
          message: `Body validation error`,
          paths: errorMessages.toString(),
        })
      } else {
        throw new ApiError({
          message: 'Internal server error',
          statusCode: status.INTERNAL_SERVER_ERROR,
        })
      }
    }
  }
}
