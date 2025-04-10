import { db } from '@shared/database'
import type {
  EmailVerificationVerifyMutation,
  LogOutDeviceQuery,
} from '@shared/schemas'
import { type LoginMutation, type RegisterMutation } from '@shared/schemas'
import type { Request, Response } from 'express'
import { status } from 'http-status'
import ms from 'ms'
import { UAParser } from 'ua-parser-js'

import { ApiError } from '../../utils/api-error.js'
import type {
  TypedRequestBody,
  TypedRequestParams,
} from '../../utils/typed-request.js'
import {
  checkUserExists,
  getEmailVerificationCode,
  getOTP,
  getUser,
  registerUser,
  saveSessionData,
  verifyAccount,
  verifyPassword,
} from './auth.service.js'
import { sessionsDTO } from './sessions.dto.js'
import { userDTO } from './user.dto.js'

export async function postLoginHandler(
  req: TypedRequestBody<LoginMutation>,
  res: Response,
) {
  const email = req.body.email
  const password = req.body.password

  const user = await checkUserExists({ email })

  await verifyPassword({
    password,
    hash: user.password_hash,
  })

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
    avatar_url: user.avatar_url,
  })

  res.status(status.OK).json(userData)
  return
}

export async function getUserHandler(req: Request, res: Response) {
  const user = await getUser({ userId: req.session.userId })

  res.status(status.OK).json(user)

  req.session.save(async (e) => {
    if (e) {
      req.log.error(`IP API ERROR, ${e}`)
      return
    }

    try {
      const userIP = req.ip

      if (!userIP) {
        return
      }
      const parsedUserAgent = UAParser(req.headers)
      await saveSessionData({
        parsedUserAgent,
        userIP,
        sessionId: req.sessionID,
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
}

export async function registerHandler(
  req: TypedRequestBody<RegisterMutation>,
  res: Response,
) {
  const createdUser = await registerUser(req.body)

  req.session.userId = createdUser.user.id

  res.status(status.ACCEPTED).json(createdUser.user)
  return
}

export async function sendEmailVerificationHandler(
  req: Request,
  res: Response,
) {
  const userId = req.session.userId
  const userData = await db.users.findFirst({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  })

  if (!userData?.email) {
    throw new ApiError({
      message: 'User email not found.',
      statusCode: status.BAD_REQUEST,
    })
  }

  const newestOTP = await getEmailVerificationCode({ userId })

  if (!newestOTP) {
    throw new ApiError({
      message: 'Internal server error',
      additionalMessage: 'Cannot generate OTP',
      statusCode: status.INTERNAL_SERVER_ERROR,
    })
  }

  if (newestOTP.expires_at) {
    const codeDate = newestOTP.expires_at.getTime() - ms('3 minutes')

    if (codeDate > Date.now()) {
      throw new ApiError({
        message: 'Wait before sending new code.',
        statusCode: status.TOO_MANY_REQUESTS,
      })
    }
  }

  await getOTP({ email: userData.email, userId: userId })

  res.status(status.ACCEPTED).json({ message: 'success' })
  return
}

export async function verifyAccountHandler(
  req: TypedRequestBody<EmailVerificationVerifyMutation>,
  res: Response,
) {
  await verifyAccount({
    code: req.body.code,
    userId: req.session.userId,
  })

  res.status(status.OK).json({ message: 'success' })
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
      if (err instanceof Error) {
        throw new ApiError({
          message: err.message,
          statusCode: status.INTERNAL_SERVER_ERROR,
        })
      }
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

export async function logOutDeviceHandler(
  req: TypedRequestParams<LogOutDeviceQuery>,
  res: Response,
) {
  const sessionUuid = req.params.id

  const foundSession = await db.sessions.findFirst({
    where: {
      id: sessionUuid,
    },
  })

  if (foundSession?.user_id !== req.session.userId) {
    throw new ApiError({
      message: 'Bad request.',
      statusCode: status.BAD_REQUEST,
    })
  }

  if (req.sessionID === foundSession.sid) {
    req.session.destroy(async (err) => {
      if (err) {
        throw err
      }

      await db.sessions.deleteMany({
        where: {
          id: sessionUuid,
        },
      })

      res.status(status.OK).json({ status: 'ok' })
    })

    return
  }

  await db.sessions.deleteMany({
    where: {
      id: sessionUuid,
    },
  })

  res.status(status.OK).json({ status: 'ok' })
}
