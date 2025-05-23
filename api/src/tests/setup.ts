import { db } from '@shared/database'
import type { TestProject } from 'vitest/node'

import { truncateAllTables } from './truncate-all-tables.js'

export const TEST_USER = {
  email: 'test@test.pl',
  id: '019601da-faff-76b7-ad12-ca98c8cffeb4',
  password_hash:
    '$argon2i$v=19$m=16,t=2,p=1$c2FsdDEyMzQ1$r2mGAshct4JFfcNV/mvDdA',
  // Password hash above is hashed string 'test'
}

export default async function setup(project: TestProject) {
  await truncateAllTables()

  await db.users.create({
    data: {
      ...TEST_USER,
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
