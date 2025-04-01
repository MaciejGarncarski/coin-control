import { Queue, QUEUES, redisClient } from '@shared/queues'

export const expiredCodesQueue = new Queue('expired-codes-remover', {
  connection: redisClient,
})

export const createExpiredCodesCron = async () => {
  await expiredCodesQueue.upsertJobScheduler(
    QUEUES.EXPIRED_CODES_REMOVER,
    {
      pattern: '0 0 * * *',
    },
    {
      name: 'expired-codes',
      opts: {
        backoff: 3,
        attempts: 5,
        removeOnFail: 1000,
      },
    },
  )
}
