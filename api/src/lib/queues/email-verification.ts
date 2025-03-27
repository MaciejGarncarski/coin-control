import { Queue, redisClient } from '@shared/queues'
import { type EmailVerificationJob } from '@shared/schemas'

export const emailVerificationQueue = new Queue<EmailVerificationJob>(
  'emailVerificationQueue',
  {
    connection: redisClient,
  },
)
