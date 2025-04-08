import { db } from '@shared/database'

import { env } from '../config/env.js'

export async function truncateAllTables() {
  if (env.NODE_ENV !== 'test') {
    return
  }
  const tables = [
    'email_verification',
    'reset_password_codes',
    'sessions',
    'user_emails',
    'users',
  ]
  for (const tableName of tables) {
    try {
      await db.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`)
      // eslint-disable-next-line no-console
      console.log(`Truncated table: ${tableName}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error truncating table ${tableName}:`, error)
      throw error
    }
  }
}
