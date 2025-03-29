import { verify } from '@node-rs/argon2'
import type {
  ForgotPasswordEmailMutation,
  LogOutDeviceQuery,
  OTPVerifyMutation,
  ResetPasswordMutation,
} from '@shared/schemas'
import { type LoginMutation, type RegisterMutation, z } from '@shared/schemas'
import type { Request, Response } from 'express'
import { status } from 'http-status'
import ms from 'ms'
import { UAParser } from 'ua-parser-js'
import { v7 } from 'uuid'

import { ApiError } from '../../lib/api-error.js'
import { db } from '../../lib/db.js'
import { emailVerificationQueue } from '../../lib/queues/email-verification.js'
import { generateOTP } from '../../utils/generate-otp.js'
import { getUserLocation } from '../../utils/get-user-location.js'
import {
  getOTP,
  getUser,
  registerUser,
  resetPassword,
  sendResetPasswordCode,
  verifyOTP,
} from './auth.service.js'
import { sessionsDTO } from './sessions.dto.js'
import { userDTO } from './user.dto.js'
interface LoginRequest extends Request {
  body: LoginMutation
}

const IPResponseSchema = z.object({
  countryName: z.string().min(2).optional(),
  cityName: z.string().min(2).optional(),
})

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

  const user = await getUser({ userId: req.session.userId })

  if (!user) {
    throw new ApiError({
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    })
  }

  const userData = userDTO(user)

  res.status(status.OK).json(userData)

  req.session.save(async (e) => {
    const userIP = req.ip
    const parsedUserAgent = UAParser(req.headers)
    const userIPResponse = await fetch(
      `https://freeipapi.com/api/json/${userIP}`,
    )
    const userIPData = await userIPResponse.json()
    const IPData = IPResponseSchema.safeParse(userIPData)

    const userLocation = IPData.success
      ? getUserLocation(IPData.data.cityName, IPData.data.countryName)
      : null

    await db.sessions.update({
      where: {
        sid: req.session.id,
      },
      data: {
        operating_system: parsedUserAgent.os.name,
        browser: parsedUserAgent.browser.name,
        device_type:
          parsedUserAgent.device.type === 'mobile' ? 'mobile' : 'desktop',
        last_access: new Date(),
        ip_address: userIP,
        location: userLocation,
      },
    })
  })
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
      removeOnComplete: {
        age: 3600,
        count: 1000,
      },
      removeOnFail: {
        age: 24 * 3600,
      },
    },
  )

  req.session.userId = createdUser.id
  res.status(status.ACCEPTED).json(createdUser)
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
  await getOTP({ email: user.email, userId: req.session.id })

  res.status(status.ACCEPTED).json({ message: 'success' })
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

  await verifyOTP({ code: req.body.code, userId: req.session.userId })

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
    res.status(status.ACCEPTED).json({ message: 'success' })
    return
  }

  await sendResetPasswordCode({ email: email, userId: foundUser.id })

  res.status(status.ACCEPTED).json({ message: 'success' })
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

  await resetPassword({
    newPassword: password,
    resetToken: resetPasswordToken,
    resetTokenId: codeFromDb.id,
  })

  res.status(status.ACCEPTED).json({ message: 'success' })
}

export async function getMySessionsHandler(req: Request, res: Response) {
  const sessions = await db.sessions.findMany({
    where: {
      user_id: req.session.userId,
    },
    orderBy: {
      last_access: 'desc',
    },
    take: 10,
    select: {
      browser: true,
      device_type: true,
      ip_address: true,
      last_access: true,
      location: true,
      operating_system: true,
      sid: true,
    },
  })

  const sessionsData = sessions.map((s) => sessionsDTO(s, req.session.id))

  res.status(status.OK).json(sessionsData)
}

export async function logOutEveryDeviceHandler(req: Request, res: Response) {
  const sid = req.session.id
  const sessUserId = req.session.userId

  req.session.destroy(async (err) => {
    if (err) {
      throw err
    }

    await db.sessions.deleteMany({
      where: {
        NOT: {
          sid: sid,
        },
        user_id: sessUserId,
      },
    })

    res.status(status.OK).json({ status: 'ok' })
  })
}

interface LogOutDevice extends Request {
  params: LogOutDeviceQuery
}

export async function logOutDeviceHandler(req: LogOutDevice, res: Response) {
  const sid = req.params.sid

  const foundSession = await db.sessions.findFirst({
    where: {
      sid: sid,
    },
  })

  if (foundSession?.user_id !== req.session.userId) {
    throw new ApiError({
      message: 'Bad request.',
      statusCode: status.BAD_REQUEST,
    })
  }

  if (req.session.id === sid) {
    req.session.destroy(async (err) => {
      if (err) {
        throw err
      }

      await db.sessions.deleteMany({
        where: {
          sid,
        },
      })

      res.status(status.OK).json({ status: 'ok' })
    })

    return
  }

  await db.sessions.deleteMany({
    where: {
      sid,
    },
  })

  res.status(status.OK).json({ status: 'ok' })
}
