import { Queue, redisClient } from '@shared/queues'
import { type ResetPasswordLinkJob } from '@shared/schemas'

export const resetPasswordLinkQueue = new Queue<ResetPasswordLinkJob>(
  'resetPasswordLinkQueue',
  {
    connection: redisClient,
  },
)
