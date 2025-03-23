import { type User } from '@shared/schemas'

type UserFromDB = {
  email: string
  id: string
  email_verified: boolean | null
  name: string | null
}

function obfuscateEmail(email: string) {
  const [username, domain] = email.split('@')
  const [domainName, domainEnding] = domain ? domain.split('.') : ''

  const obfuscatedUsername = username?.slice(0, 1) + '*'.repeat(4)
  const obfuscatedDomainName = domainName?.slice(0, 1) + '*'.repeat(4)

  return `${obfuscatedUsername}@${obfuscatedDomainName}.${domainEnding}`
}

export const userDTO = (user: UserFromDB): User => {
  const obfuscatedEmail = obfuscateEmail(user.email)

  return {
    email: user.email_verified ? user.email : obfuscatedEmail,
    id: user.id,
    name: user.name || '',
    isEmailVerified: user.email_verified || false,
  }
}
