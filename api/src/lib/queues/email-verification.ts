import {
  type AccountVerificationJob,
  Queue,
  QUEUES,
  redisClient,
} from '@shared/queues'

export const emailVerificationQueue = new Queue<AccountVerificationJob>(
  QUEUES.EMAIL_VERIFICATION,
  {
    connection: redisClient,
  },
)
