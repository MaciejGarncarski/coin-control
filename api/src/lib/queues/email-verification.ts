import {
  type EmailVerificationJob,
  Queue,
  QUEUES,
  redisClient,
} from '@shared/queues'

export const emailVerificationQueue = new Queue<EmailVerificationJob>(
  QUEUES.EMAIL_VERIFICATION,
  {
    connection: redisClient,
  },
)
