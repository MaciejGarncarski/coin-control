import { verify } from '@node-rs/argon2'
import { QUEUES } from '@shared/queues'
import type {
  EmailVerificationVerifyMutation,
  ForgotPasswordEmailMutation,
  LogOutDeviceQuery,
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
  verifyEmail,
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

  const foundUser = await db.user_emails.findFirst({
    where: {
      email: email,
      is_verified: true,
    },
    select: {
      user_id: true,
    },
  })

  const user = await db.users.findFirst({
    where: {
      id: foundUser?.user_id,
    },
    include: {
      user_emails: {
        where: {
          is_primary: true,
        },
        select: {
          email: true,
          is_primary: true,
          is_verified: true,
        },
      },
    },
  })

  if (!user) {
    throw new ApiError({
      statusCode: 'UNAUTHORIZED',
      message: 'Invalid email or password.',
    })
  }

  const password = req.body.password
  const passwordMatches = await verify(user.password_hash, password)

  if (!passwordMatches) {
    throw new ApiError({
      statusCode: 'UNAUTHORIZED',
      message: 'Invalid email or password.',
    })
  }

  const isMinimumOneEmailVerified = user.user_emails.some(
    ({ is_verified }) => is_verified,
  )

  if (!isMinimumOneEmailVerified) {
    req.session.cookie.maxAge = ms('15 minutes')
  }

  req.session.userId = user.id

  const userData = userDTO({
    email: user.email,
    email_verified: isMinimumOneEmailVerified,
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
      statusCode: 'UNAUTHORIZED',
    })
  }

  const user = await getUser({ userId: req.session.userId })

  if (!user) {
    throw new ApiError({
      message: 'User not found.',
      statusCode: 'NOT_FOUND',
    })
  }

  const userEmail = await db.user_emails.findFirst({
    where: {
      user_id: user.id,
      is_verified: true,
    },
  })

  const userData = userDTO({
    email: user.email,
    email_verified: userEmail ? userEmail.is_verified : false,
    id: user.id,
    name: user.name,
  })

  res.status(status.OK).json(userData)

  req.session.save(async (e) => {
    try {
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
    } catch (error) {
      req.log.error(`IP API ERROR, ${error}`)
    }
  })
}

export const logoutHandler = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    throw new ApiError({
      message: 'Unauthorized.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  req.session.destroy((err) => {
    if (err) {
      throw new ApiError({
        message: 'Internal server error.',
        statusCode: 'INTERNAL_SERVER_ERROR',
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
      statusCode: 'NOT_FOUND',
    })
  }

  const expires_at = Date.now() + ms('5 minutes')
  const OTPUuid = v7()
  const OTPCode = generateOTP()

  await db.email_verification.create({
    data: {
      id: OTPUuid,
      email_id: createdUser.userEmailData.email_id,
      user_id: createdUser.user.id,
      otp: OTPCode,
      expires_at: new Date(expires_at),
    },
  })

  await emailVerificationQueue.add(
    `${QUEUES.EMAIL_VERIFICATION}-${OTPUuid}`,
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

  req.session.userId = createdUser.user.id
  res.status(status.ACCEPTED).json(createdUser)
  return
}

export async function sendEmailOTPCodeHandler(req: Request, res: Response) {
  if (!req.session.userId) {
    throw new ApiError({
      message: 'Unauthorized.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  const user = await db.users.findFirst({
    where: {
      id: req.session.userId,
    },
    select: {
      email: true,
    },
  })

  if (!user) {
    throw new ApiError({
      message: 'User not found.',
      statusCode: 'NOT_FOUND',
    })
  }

  const newestOTP = await db.email_verification.findFirst({
    select: {
      expires_at: true,
    },
    where: {
      verified: false,
      user_id: req.session.userId,
    },
    orderBy: {
      expires_at: 'desc',
    },
  })

  if (newestOTP?.expires_at) {
    const codeDate = newestOTP.expires_at.getTime() - ms('3 minutes')

    if (codeDate > Date.now()) {
      throw new ApiError({
        message: 'Wait two minutes before sending new code.',
        toastMessage: 'Wait two minutes before sending new code.',
        statusCode: 'TOO_MANY_REQUESTS',
      })
    }
  }

  await getOTP({ email: user.email, userId: req.session.userId })

  res.status(status.ACCEPTED).json({ message: 'success' })
  return
}

interface VerifyEmailRequest extends Request {
  body: EmailVerificationVerifyMutation
}

export async function verifyEmailHandler(
  req: VerifyEmailRequest,
  res: Response,
) {
  if (!req.session.userId) {
    throw new ApiError({
      message: 'Unauthorized.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  await verifyEmail({ code: req.body.code, userId: req.session.userId })

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
      statusCode: 'BAD_REQUEST',
    })
  }

  if (codeFromDb?.expires_at < new Date()) {
    throw new ApiError({
      message: 'Invalid reset token',
      toastMessage: 'Code expired!',
      statusCode: 'BAD_REQUEST',
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
      id: true,
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
  const id = req.params.id

  const foundSession = await db.sessions.findFirst({
    where: {
      id: id,
    },
  })

  if (foundSession?.user_id !== req.session.userId) {
    throw new ApiError({
      message: 'Bad request.',
      statusCode: 'BAD_REQUEST',
    })
  }

  if (req.session.id === id) {
    req.session.destroy(async (err) => {
      if (err) {
        throw err
      }

      await db.sessions.deleteMany({
        where: {
          id: id,
        },
      })

      res.status(status.OK).json({ status: 'ok' })
    })

    return
  }

  await db.sessions.deleteMany({
    where: {
      id: id,
    },
  })

  res.status(status.OK).json({ status: 'ok' })
}
