import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

import { ValidationError } from '../utils/validation-error.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateBody(schema: z.ZodObject<any, any> | z.ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue: z.ZodIssue) => {
        return issue.path.map((el) => el.toString())
      })

      throw new ValidationError({
        message: `Body validation error`,
        paths: errorMessages.toString(),
      })
    }

    next()
  }
}
