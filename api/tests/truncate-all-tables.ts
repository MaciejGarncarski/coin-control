import { env } from '../src/config/env.js'
import { db } from '../src/lib/db.js'

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
      console.log(`Truncated table: ${tableName}`)
    } catch (error) {
      console.error(`Error truncating table ${tableName}:`, error)
      throw error
    }
  }
}
