import type { Request, Response } from 'express'
import { db } from '../../../lib/db.js'
import {
  userSchema,
  type LoginMutation,
  type LoginResponse,
  type RegisterMutation,
} from '@shared/zod-schemas'
import { status } from 'http-status'
import type { ApiError as TApiError } from '@shared/zod-schemas'
import { verify } from '@node-rs/argon2'
import { registerUser } from './auth.service.js'
import { ApiError } from '../../lib/api-error.js'

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
      id, email, password_hash
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

export const getUserHandler = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    const notFoundUserError: TApiError = {
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    }

    res.status(status.UNAUTHORIZED).json(notFoundUserError)
    return
  }

  const user = await db`
  select
    id, email, name
  from users
  where 
  id = ${req.session.userId}
  `

  if (!user[0]) {
    throw new ApiError({
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    })
  }

  const userData = user[0]
  const parsedUser = userSchema.safeParse(userData)

  if (!parsedUser.success) {
    throw new ApiError({
      toastMessage: 'User not found.',
      message: 'User not found.',
      statusCode: status.NOT_FOUND,
    })
  }

  res.status(status.OK).json(parsedUser.data)
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
