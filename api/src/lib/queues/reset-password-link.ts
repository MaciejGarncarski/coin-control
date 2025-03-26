import { type ResetPasswordLinkJob } from '@shared/schemas'
import { Queue } from 'bullmq'

import { connection } from '../redis.js'

export const resetPasswordLinkQueue = new Queue<ResetPasswordLinkJob>(
  'resetPasswordLinkQueue',
  {
    connection: connection,
  },
)
