import type { Request, Response } from 'express'
import { type LoginMutation, type RegisterMutation } from '@shared/zod-schemas'
import { status } from 'http-status'
import type { OTPVerifyMutation } from '@shared/zod-schemas'
import { verify } from '@node-rs/argon2'
import { registerUser } from './auth.service.js'
import { ApiError } from '../../lib/api-error.js'
import { userDTO } from './user.dto.js'
import { generateOTP } from '../../utils/generate-otp.js'
import { v7 } from 'uuid'
import ms from 'ms'
import { db } from '../../lib/db.js'
import { emailVerificationQueue } from '../../lib/queues/email-verification/queue.js'

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

  const expires_at = Date.now() + ms('15 minutes')
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

  emailVerificationQueue.add('verification-email', {
    code: OTPCode,
    userEmail: req.body.email,
  })

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
      id: req.session.userId,
    },
    orderBy: {
      expires_at: 'desc',
    },
  })

  const time = new Date(Number(newestOTP?.expires_at)).getTime()
  const codeDate = time - 13 * 60 * 1000

  if (codeDate > Date.now()) {
    throw new ApiError({
      message: 'Wait two minutes before sending new code.',
      toastMessage: 'Wait two minutes before sending new code.',
      statusCode: status.TOO_MANY_REQUESTS,
    })
  }

  const expires_at = Date.now() + ms('15 minutes')
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

  emailVerificationQueue.add('verification-email', {
    code: OTPCode,
    userEmail: user.email,
  })

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

  await db.users.update({
    data: {
      email_verified: true,
    },
    where: {
      id: req.session.userId,
    },
  })

  res.status(status.OK).json({ message: 'success' })
}
