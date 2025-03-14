import { type User } from '@shared/zod-schemas'

type UserFromDB = {
  id: string
  email: string
  name: string
  email_verified: boolean
}

export const userDTO = (user: UserFromDB): User => {
  return {
    email: user.email,
    id: user.id,
    name: user.name,
    isEmailVerified: user.email_verified,
  }
}
