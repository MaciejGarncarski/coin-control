import { db } from '@shared/database'
import type {
  ForgotPasswordEmailMutation,
  ResetPasswordMutation,
} from '@shared/schemas'
import type { Response } from 'express'
import status from 'http-status'

import { ApiError } from '../../../utils/api-error.js'
import type { TypedRequestBody } from '../../../utils/typed-request.js'
import {
  getPasswordResetToken,
  resetPassword,
  sendResetPasswordCode,
} from './password.service.js'

export async function forgotPasswordLinkHandler(
  req: TypedRequestBody<ForgotPasswordEmailMutation>,
  res: Response,
) {
  const email = req.body.email

  const foundUser = await db.users.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  })

  if (!foundUser?.id) {
    // send fake resopnse so attacker does not know if email exists.
    res.status(status.ACCEPTED).json({ message: 'success' })
    return
  }

  await sendResetPasswordCode({ email: email, userId: foundUser.id })

  res.status(status.ACCEPTED).json({ message: 'success' })
}

export async function resetPasswordHandler(
  req: TypedRequestBody<ResetPasswordMutation>,
  res: Response,
) {
  const resetPasswordToken = req.body.resetToken
  const password = req.body.password

  const code = await getPasswordResetToken({
    token: resetPasswordToken,
  })

  if (!code.expiresAt) {
    throw new ApiError({
      message: 'Invalid reset token',
      toastMessage: 'Invalid reset token.',
      statusCode: status.BAD_REQUEST,
    })
  }

  if (code.expiresAt < new Date()) {
    throw new ApiError({
      message: 'Invalid reset token',
      toastMessage: 'Code expired!',
      statusCode: status.BAD_REQUEST,
    })
  }

  if (!code.id) {
    throw new ApiError({
      message: 'Token not found',
      toastMessage: 'Code expired!',
      statusCode: status.BAD_REQUEST,
    })
  }

  await resetPassword({
    newPassword: password,
    resetToken: resetPasswordToken,
    resetTokenId: code.id,
  })

  res.status(status.ACCEPTED).json({ message: 'success' })
}
