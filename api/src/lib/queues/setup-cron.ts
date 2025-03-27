import { createExpiredCodesCron } from './expired-codes-cron.js'
import { createExpiredPasswordTokensCron } from './expired-password-tokens-cron.js'
import { createExpiredSessionCron } from './session-cron.js'

export function setupCron() {
  createExpiredSessionCron()
  createExpiredCodesCron()
  createExpiredPasswordTokensCron()
}
