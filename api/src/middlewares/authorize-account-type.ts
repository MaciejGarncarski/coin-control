import { db } from '@shared/database'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'

import { ApiError } from '../utils/api-error.js'
import { checkIsDemoAccount } from '../utils/check-is-demo-account.js'

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

  if (userData?.email && checkIsDemoAccount(userData.email)) {
    throw new ApiError({
      message: 'Unauthorized.',
      toastMessage: 'Disabled for demo account.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  next()
}
