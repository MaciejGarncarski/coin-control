import { Queue, QUEUES, redisClient } from '@shared/queues'
import { type ResetPasswordLinkJob } from '@shared/queues'

export const resetPasswordLinkQueue = new Queue<ResetPasswordLinkJob>(
  QUEUES.RESET_PASSWORD,
  {
    connection: redisClient,
  },
)
