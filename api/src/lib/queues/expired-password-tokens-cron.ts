import { Queue, QUEUES, redisClient } from '@shared/queues'

export const expiredPasswordTokensQueue = new Queue('expired-password-tokens', {
  connection: redisClient,
})

export const createExpiredPasswordTokensCron = async () => {
  await expiredPasswordTokensQueue.upsertJobScheduler(
    QUEUES.EXPIRED_PASSWORD_TOKENS,
    {
      pattern: '0 0 * * *',
    },
    {
      name: 'expired-password-tokens',
      opts: {
        backoff: 3,
        attempts: 5,
        removeOnFail: 1000,
      },
    },
  )
}
