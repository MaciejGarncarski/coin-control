import type { Request, Response } from 'express'
import { type LoginMutation, type RegisterMutation } from '@shared/zod-schemas'
import { status } from 'http-status'
import type {
  ForgotPasswordEmailMutation,
  OTPVerifyMutation,
  ResetPasswordMutation,
} from '@shared/zod-schemas'
import { hash, verify } from '@node-rs/argon2'
import { registerUser } from './auth.service.js'
import { ApiError } from '../../lib/api-error.js'
import { userDTO } from './user.dto.js'
import { generateOTP } from '../../utils/generate-otp.js'
import { v7 } from 'uuid'
import ms from 'ms'
import { db } from '../../lib/db.js'
import { createHash } from 'node:crypto'
import { emailVerificationQueue } from '../../lib/queues/email-verification.js'
import { resetPasswordLinkQueue } from '../../lib/queues/reset-password-link.js'
import { resetPasswordNotificationQueue } from '../../lib/queues/reset-password-notification.js'

interface LoginRequest extends Request {
  body: LoginMutation
}

export const postLoginHandler = async (req: LoginRequest, res: Response) => {
  const email = req.body.email

  const user = await db.users.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      password_hash: true,
      email: true,
      email_verified: true,
    },
  })

  if (!user) {
    throw new ApiError({
      statusCode: status.UNAUTHORIZED,
      message: 'Invalid email or password.',
    })
  }

  const password = req.body.password
  const passwordMatches = await verify(user.password_hash, password)

  if (!passwordMatches) {
    throw new ApiError({
      statusCode: status.UNAUTHORIZED,
      message: 'Invalid email or password.',
    })
  }

  if (user.email_verified === false) {
    req.session.cookie.maxAge = ms('15 minutes')
  }

  req.session.userId = user.id

  const userData = userDTO({
    email: user.email,
    email_verified: user.email_verified,
    id: user.id,
    name: user.name,
  })

  res.status(status.OK).json(userData)
  return
}

export const getUserHandler = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    throw new ApiError({
      message: 'User not found.',
      statusCode: status.UNAUTHORIZED,
    })
  }
  const user = await db.users.findFirst({
    where: {
      id: req.session.userId,
    },
    select: {
      id: true,
      email: true,
      email_verified: true,
      name: true,
    },
  })

  if (!user) {
    throw new ApiError({
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    })
  }

  const userData = userDTO(user)
  res.status(status.OK).json(userData)
}

export const logoutHandler = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    throw new ApiError({
      message: 'Unauthorized.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  req.session.destroy((err) => {
    if (err) {
      throw new ApiError({
        message: 'Internal server error.',
        statusCode: status.INTERNAL_SERVER_ERROR,
      })
    }

    res.status(status.OK).json({ message: 'success' })
  })

  return
}

interface RegisterRequest extends Request {
  body: RegisterMutation
}

export async function registerHandler(req: RegisterRequest, res: Response) {
  const createdUser = await registerUser(req.body)

  if (!createdUser) {
    throw new ApiError({
      toastMessage: 'User not found.',
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    })
  }

  const expires_at = Date.now() + ms('5 minutes')
  const OTPUuid = v7()
  const OTPCode = generateOTP()

  await db.otp_codes.create({
    data: {
      id: OTPUuid,
      user_id: createdUser.id,
      otp: OTPCode,
      expires_at: new Date(expires_at),
    },
  })

  await emailVerificationQueue.add(
    `verification-email-${OTPUuid}`,
    {
      code: OTPCode,
      userEmail: req.body.email,
    },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  )

  req.session.userId = createdUser.id
  res.status(status.OK).json(createdUser)
  return
}

export async function getOTPHandler(req: Request, res: Response) {
  if (!req.session.userId) {
    throw new ApiError({
      message: 'Unauthorized.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  const user = await db.users.findFirst({
    where: {
      id: req.session.userId,
    },
    select: {
      email_verified: true,
      email: true,
    },
  })

  if (!user) {
    throw new ApiError({
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    })
  }

  const newestOTP = await db.otp_codes.findFirst({
    select: {
      expires_at: true,
    },
    where: {
      user_id: req.session.userId,
    },
    orderBy: {
      expires_at: 'desc',
    },
  })

  if (!newestOTP?.expires_at) {
    throw new ApiError({
      message: 'Code not found',
      statusCode: status.TOO_MANY_REQUESTS,
    })
  }

  const codeDate = newestOTP.expires_at.getTime() - ms('3 minutes')

  if (codeDate > Date.now()) {
    throw new ApiError({
      message: 'Wait two minutes before sending new code.',
      toastMessage: 'Wait two minutes before sending new code.',
      statusCode: status.TOO_MANY_REQUESTS,
    })
  }

  const expires_at = Date.now() + ms('5 minutes')
  const otp_uuid = v7()
  const OTPCode = generateOTP()

  await db.otp_codes.create({
    data: {
      expires_at: new Date(expires_at),
      otp: OTPCode,
      user_id: req.session.userId,
      id: otp_uuid,
    },
  })

  await emailVerificationQueue.add(
    `verification-email-${otp_uuid}`,
    {
      code: OTPCode,
      userEmail: user.email,
    },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  )

  res.status(status.OK).json({ message: 'success' })
  return
}

interface VerifyOTPRequest extends Request {
  body: OTPVerifyMutation
}

export async function verifyOTPHandler(req: VerifyOTPRequest, res: Response) {
  if (!req.session.userId) {
    throw new ApiError({
      message: 'Unauthorized.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  const otp = await db.otp_codes.findFirst({
    where: {
      user_id: req.session.userId,
      otp: req.body.code,
    },
    select: {
      id: true,
      expires_at: true,
    },
  })

  if (!otp) {
    throw new ApiError({
      message: 'Invalid OTP code.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  if (otp.expires_at < new Date()) {
    throw new ApiError({
      message: 'OTP code expired.',
      toastMessage: 'Code expired.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  await db.$transaction(async (tx) => {
    await tx.users.update({
      data: {
        email_verified: true,
      },
      where: {
        id: req.session.userId,
      },
    })

    await tx.otp_codes.delete({
      where: {
        user_id: req.session.userId,
        id: otp.id,
      },
    })
  })

  res.status(status.OK).json({ message: 'success' })
}
interface GetPasswordLinkRequest extends Request {
  body: ForgotPasswordEmailMutation
}

export async function forgotPasswordLinkHandler(
  req: GetPasswordLinkRequest,
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
    res.status(status.OK).json({ message: 'success' })
    return
  }

  const passwordCodeId = v7()
  const expiresAt = new Date().getTime() + ms('5 minutes')
  const resetCode = createHash('sha512').update(v7()).digest('hex').slice(0, 48)

  await db.reset_password_codes.create({
    data: {
      id: passwordCodeId,
      expires_at: new Date(expiresAt),
      user_id: foundUser.id,
      reset_code: resetCode,
    },
  })

  await resetPasswordLinkQueue.add(`reset-password-link-${passwordCodeId}`, {
    passwordResetCode: resetCode,
    userEmail: email,
  })

  res.status(status.OK).json({ message: 'success' })
}

interface ResetPasswordRequest extends Request {
  body: ResetPasswordMutation
}

export async function resetPasswordHandler(
  req: ResetPasswordRequest,
  res: Response,
) {
  const resetPasswordToken = req.body.resetToken
  const password = req.body.password

  const codeFromDb = await db.reset_password_codes.findFirst({
    where: {
      reset_code: resetPasswordToken,
      used: false,
    },
  })

  if (!codeFromDb?.expires_at) {
    throw new ApiError({
      message: 'Invalid reset token',
      toastMessage: 'Invalid reset token.',
      statusCode: status.BAD_REQUEST,
    })
  }

  if (codeFromDb?.expires_at < new Date()) {
    throw new ApiError({
      message: 'Invalid reset token',
      toastMessage: 'Code expired!',
      statusCode: status.BAD_REQUEST,
    })
  }

  const user = await db.$transaction(async (tx) => {
    const userId = await tx.reset_password_codes.update({
      where: {
        id: codeFromDb.id,
        reset_code: resetPasswordToken,
      },
      data: {
        used: true,
      },
      select: {
        user_id: true,
      },
    })

    if (!userId) {
      throw new Error('User not found.')
    }

    const hashedPassword = await hash(password)

    const updatedUser = await tx.users.update({
      where: {
        id: userId.user_id,
      },
      data: {
        password_hash: hashedPassword,
      },
    })

    return updatedUser
  })

  const timestamp = Date.now()

  await resetPasswordNotificationQueue.add(
    `reset-password-notification-${codeFromDb.id}`,
    {
      createdAt: timestamp,
      userEmail: user.email,
    },
  )

  res.status(status.OK).json({ message: 'success' })
}
