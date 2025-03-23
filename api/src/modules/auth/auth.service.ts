import type { RegisterMutation } from '@shared/schemas'
import { hash } from '@node-rs/argon2'
import { v7 } from 'uuid'
import { ApiError } from '../../lib/api-error.js'
import status from 'http-status'
import { userDTO } from './user.dto.js'
import { db } from '../../lib/db.js'

type UserFromDB = {
  id: string
  email: string
  name: string
  email_verified: boolean
}

export async function registerUser(userData: RegisterMutation) {
  const user = await db.users.findFirst({
    where: {
      email: userData.email,
    },
    select: {
      id: true,
      email: true,
    },
  })

  if (user) {
    throw new ApiError({
      toastMessage: 'User already exists.',
      message: 'User already exists.',
      statusCode: status.CONFLICT,
    })
  }

  const hashedPassword = await hash(userData.password)
  const userId = v7()

  const newUser = await db.users.create({
    data: {
      id: userId,
      email: userData.email,
      password_hash: hashedPassword,
      name: userData.fullName,
    },
    select: {
      id: true,
      name: true,
      email: true,
      email_verified: true,
    },
  })

  return newUser ? userDTO(newUser) : null
}
