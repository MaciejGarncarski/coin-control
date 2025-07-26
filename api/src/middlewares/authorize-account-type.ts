import { db } from '@shared/database'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'

import { DEMO_ACC_MAIL } from '../config/const.js'
import { ApiError } from '../utils/api-error.js'

export async function authorizeAccountType(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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

  const userData = await db.users.findFirst({
    where: {
      id: req.session.userId,
    },
  })

  if (userData?.email === DEMO_ACC_MAIL) {
    throw new ApiError({
      message: 'Unauthorized.',
      toastMessage: 'Disabled for demo account.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  next()
}
