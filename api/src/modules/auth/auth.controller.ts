import type { RequestHandler } from 'express'
import { db } from '../../../lib/db.js'
import type { LoginResponse } from '@shared/zod-schemas/auth/login.ts'

export const postLoginHandler: RequestHandler = async (req, res) => {
  try {
    const users = await db`
    select
      id
    from users
    `

    console.log({ users })
  } catch (error) {
    console.log(error)
  }

  const response: LoginResponse = {
    message: 'loggedin',
    status: 'success',
  }

  res.status(200).json(response)
}
