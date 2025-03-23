import { Queue } from 'bullmq'
import { connection } from '../redis.js'
import { type EmailVerificationJob } from '@shared/schemas'

export const emailVerificationQueue = new Queue<EmailVerificationJob>(
  'emailVerificationQueue',
  {
    connection: connection,
  },
)
