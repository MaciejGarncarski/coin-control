import { Queue, QUEUES, redisClient } from '@shared/queues'

export const expiredSessionQueue = new Queue('expired-session-remover', {
  connection: redisClient,
})

export const createExpiredSessionCron = async () => {
  await expiredSessionQueue.upsertJobScheduler(
    QUEUES.EXPIRED_SESSION_REMOVER,
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
