import type { TestProject } from 'vitest/node'

import { db } from '../src/lib/db.js'
import { truncateAllTables } from './truncate-all-tables.js'

export default async function setup(project: TestProject) {
  await truncateAllTables()
  await db.users.create({
    data: {
      email: 'test@test.pl',
      id: '019601da-faff-76b7-ad12-ca98c8cffeb4',
      password_hash: 'xxxxx',
      user_emails: {
        create: {
          email: 'test@test.pl',
          email_id: '019601da-faff-76b7-ad12-ca98c8cffeb4',
          is_verified: true,
          is_primary: true,
        },
      },
    },
  })
}
