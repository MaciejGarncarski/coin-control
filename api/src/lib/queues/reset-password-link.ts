import { Queue } from 'bullmq'
import { type ResetPasswordLinkJob } from '@shared/schemas'

import { connection } from '../redis.js'

export const resetPasswordLinkQueue = new Queue<ResetPasswordLinkJob>(
  'resetPasswordLinkQueue',
  {
    connection: connection,
  },
)
