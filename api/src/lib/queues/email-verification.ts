import { type EmailVerificationJob } from '@shared/schemas'
import { Queue } from 'bullmq'

import { connection } from '../redis.js'

export const emailVerificationQueue = new Queue<EmailVerificationJob>(
  'emailVerificationQueue',
  {
    connection: connection,
  },
)
