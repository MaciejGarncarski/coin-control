import type { RegisterMutation } from '@shared/zod-schemas'
import { db } from '../../../lib/db.js'
import { hash } from '@node-rs/argon2'
import { v7 } from 'uuid'
import { ApiError } from '../../lib/api-error.js'
import status from 'http-status'
import { userDTO } from './user.dto.js'

type UserFromDB = {
  id: string
  email: string
  name: string
  email_verified: boolean
}

export async function registerUser(userData: RegisterMutation) {
  const user = await db`
    select
      id, email
    from users
    where 
    email = ${userData.email}
    `

  if (user[0]) {
    throw new ApiError({
      toastMessage: 'User already exists.',
      message: 'User already exists.',
      statusCode: status.CONFLICT,
    })
  }

  const hashedPassword = await hash(userData.password)
  const userId = v7()

  const newUser = (await db`
    insert into users (id, email, password_hash, name)
    values (${userId}, ${userData.email}, ${hashedPassword}, ${userData.fullName})
    returning id, email, name, email_verified
    `) as UserFromDB[]

  return newUser[0] ? userDTO(newUser[0]) : null
}
