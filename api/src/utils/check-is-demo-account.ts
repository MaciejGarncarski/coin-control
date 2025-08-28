import { DEMO_ACC_MAIL } from '../config/const.js'

export function checkIsDemoAccount(email: string) {
  return email === DEMO_ACC_MAIL
}
