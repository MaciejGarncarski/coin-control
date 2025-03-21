import { Queue } from 'bullmq'
import { connection } from '../../redis.js'

type JobData = {
  userEmail: string
  passwordResetCode: string
}

export const resetPasswordLinkQueue = new Queue<JobData>(
  'resetPasswordLinkQueue',
  {
    connection: connection,
  },
)
