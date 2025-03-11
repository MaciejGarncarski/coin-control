import type { Request, Response } from 'express'
import { db } from '../../../lib/db.js'
import type {
  LoginMutation,
  LoginResponse,
} from '@shared/zod-schemas/auth/login.ts'
import { status } from 'http-status'
import type { ApiError } from '@shared/zod-schemas'
import { verify } from '@node-rs/argon2'

interface LoginRequest extends Request {
  body: LoginMutation
}

const credentialsError: ApiError = {
  error: 'Invalid credentials.',
}

const response: LoginResponse = {
  data: {
    id: '2137',
  },
}

const errorMessage: ApiError = {
  error: 'Internal server error.',
}

export const postLoginHandler = async (req: LoginRequest, res: Response) => {
  const email = req.body.email

  try {
    const user = await db`
    select
      id, email, password_hash
    from users
    where 
    email = ${email}
    `

    if (!user[0]) {
      res.status(status.NOT_FOUND).json(credentialsError)
      return
    }

    const password = req.body.password
    const foundUser = user[0]

    const passwordMatches = await verify(foundUser.password_hash, password)

    if (!passwordMatches) {
      res.status(status.BAD_REQUEST).json(credentialsError)
      return
    }

    req.session.userId = foundUser.id
    res.status(status.OK).json(response)
    return
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json(errorMessage)
  }
}

export const getUserHandler = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    res.status(status.UNAUTHORIZED).json({ data: null })
    return
  }

  res.status(status.OK).json({ data: { id: 'costam' } })
}

export const logoutHandler = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    res.status(status.UNAUTHORIZED).json({ data: null })
    return
  }

  req.session.destroy((err) => {
    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'error' })
      return
    }

    res.status(status.OK).json({ message: 'success' })
  })

  return
}
