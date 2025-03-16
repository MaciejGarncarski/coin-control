import { Queue } from 'bullmq'
import { connection } from '../../../src/lib/redis.js'

type JobData = {
  userEmail: string
  code: string
}

export const emailVerificationQueue = new Queue<JobData>(
  'emailVerificationQueue',
  {
    connection: connection,
  },
)
