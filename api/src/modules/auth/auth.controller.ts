import type { Request, Response } from 'express'
import { db } from '../../../lib/db.js'
import {
  type LoginMutation,
  type LoginResponse,
  type RegisterMutation,
} from '@shared/zod-schemas'
import { status } from 'http-status'
import type {
  OTPVerifyMutation,
  ApiError as TApiError,
} from '@shared/zod-schemas'
import { verify } from '@node-rs/argon2'
import { registerUser } from './auth.service.js'
import { ApiError } from '../../lib/api-error.js'
import { userDTO } from './user.dto.js'
import { mailer } from '../../lib/mailer.js'
import { generateOTP } from '../../utils/generate-otp.js'
import { v7 } from 'uuid'
import ms from 'ms'

interface LoginRequest extends Request {
  body: LoginMutation
}

const response: LoginResponse = {
  data: {
    id: '2137',
  },
}

export const postLoginHandler = async (req: LoginRequest, res: Response) => {
  const email = req.body.email

  const user = await db`
    select
      id, email, password_hash, email_verified
    from users
    where 
    email = ${email}
    `

  if (!user[0]) {
    throw new ApiError({
      statusCode: status.UNAUTHORIZED,
      message: 'Invalid email or password.',
    })
  }

  const password = req.body.password
  const foundUser = user[0]

  const passwordMatches = await verify(foundUser.password_hash, password)

  if (!passwordMatches) {
    throw new ApiError({
      statusCode: status.UNAUTHORIZED,
      message: 'Invalid email or password.',
    })
  }

  req.session.userId = foundUser.id
  res.status(status.OK).json(response)
  return
}

type UserFromDB = {
  id: string
  email: string
  name: string
  email_verified: boolean
}

export const getUserHandler = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    const notFoundUserError: TApiError = {
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    }

    res.status(status.UNAUTHORIZED).json(notFoundUserError)
    return
  }

  const user = (await db`
  select
    id, email, name, email_verified
  from users
  where 
  id = ${req.session.userId}
  `) as UserFromDB[]

  if (!user[0]) {
    throw new ApiError({
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    })
  }

  const userData = userDTO(user[0])

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

  if (!createdUser.id) {
    throw new ApiError({
      toastMessage: 'User not found.',
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    })
  }

  req.session.userId = createdUser.id
  res.status(status.OK).json({ data: createdUser })
  return
}

export async function getOTPHandler(req: Request, res: Response) {
  if (!req.session.userId) {
    throw new ApiError({
      message: 'Unauthorized.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  const user = await db`
  select
    email_verified, email
  from users
  where 
  id = ${req.session.userId}
  `

  const foundUser = user[0]

  if (!foundUser) {
    throw new ApiError({
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    })
  }

  const newestOTP = await db`
    select expires_at from otp_codes where user_id = ${req.session.userId} order by expires_at desc limit 1
  `

  if (newestOTP[0] && newestOTP[0].expires_at > new Date()) {
    throw new ApiError({
      message: 'You already have an active OTP code.',
      toastMessage: 'You already have an active OTP code.',
      statusCode: status.CONFLICT,
    })
  }

  const OTPCode = generateOTP()

  const expires_at = Date.now() + ms('15 minutes')
  const otp_uuid = v7()

  await db`
      insert into otp_codes (id, user_id, otp, expires_at) values (${otp_uuid}, ${req.session.userId}, ${OTPCode}, ${expires_at})
    `

  await mailer.sendMail({
    to: foundUser.email,
    subject: 'CoinControl | Email verification',
    text: `Your code: ${OTPCode}.\nVerify your email by providing it in the app.`,
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

  const otp = await db`
  select id from otp_codes where user_id = ${req.session.userId} and otp = ${req.body.code}
  `

  if (!otp[0]) {
    throw new ApiError({
      message: 'Invalid OTP code.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  await db`
    update users set email_verified = true where id = ${req.session.userId}
  `

  res.status(status.OK).json({ message: 'success' })
}
