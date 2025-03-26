import { Queue } from 'bullmq'

import { connection } from '../redis.js'

export const expiredSessionQueue = new Queue('expired-session-remover', {
  connection: connection,
})

export const createExpiredSessionCron = async () => {
  await expiredSessionQueue.upsertJobScheduler(
    'expired-session-id',
    {
      pattern: '*/40 * * * *',
    },
    {
      name: 'expired-session',
      opts: {
        backoff: 3,
        attempts: 5,
        removeOnFail: 1000,
      },
    },
  )
}
