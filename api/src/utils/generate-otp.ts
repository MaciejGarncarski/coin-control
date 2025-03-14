import { randomInt } from 'node:crypto'

export function generateOTP() {
  return randomInt(100000, 999999).toString()
}
