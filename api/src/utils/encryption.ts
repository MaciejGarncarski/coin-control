import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto'

import { env } from '../config/env.js'

const secretKey = env.ENCRYPTION_SECRET
const key = createHash('sha512')
  .update(secretKey)
  .digest('hex')
  .substring(0, 32)
const algorithm = 'aes-256-cbc'

export function encrypt(data: string) {
  const iv = randomBytes(16)
  const cipher = createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(data, 'utf-8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + encrypted
}

export function decrypt(data: string) {
  try {
    const inputIV = data.slice(0, 32)
    const encrypted = data.slice(32)
    const decipher = createDecipheriv(
      algorithm,
      Buffer.from(key),
      Buffer.from(inputIV, 'hex'),
    )
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
  } catch {
    return data
  }
}
