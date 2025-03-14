import { type User } from '@shared/zod-schemas'

type UserFromDB = {
  id: string
  email: string
  name: string
  email_verified: boolean
}

function obfuscateEmail(email: string) {
  const emailParts = email.split('@')

  if (emailParts.length !== 2) {
    return 'Invalid email address'
  }

  const localPart = emailParts[0]?.slice(0, 2) + '****'
  const domainParts = emailParts[1]?.split('.')

  const domainName = domainParts ? domainParts[0]?.slice(0, 2) + '***' : ''
  const tld = domainParts?.slice(1).join('.')

  return localPart + '@' + domainName + '.' + tld
}

export const userDTO = (user: UserFromDB): User => {
  const obfuscatedEmail = obfuscateEmail(user.email)

  return {
    email: user.email_verified ? user.email : obfuscatedEmail,
    id: user.id,
    name: user.name,
    isEmailVerified: user.email_verified,
  }
}
