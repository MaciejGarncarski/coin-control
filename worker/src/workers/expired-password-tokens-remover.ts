/* eslint-disable no-console */
import { QUEUES, redisClient, Worker } from '@shared/queues'

import { db } from '@shared/database'

export const createExpiredPasswordTokensRemoverWorker = () => {
  const worker = new Worker(
    QUEUES.EXPIRED_PASSWORD_TOKENS,
    async (job) => {
      console.log(`Deleting expired password tokens, job ID: ${job.id}`)
      const codes = await db.reset_password_codes.deleteMany({
        where: {
          expires_at: {
            lt: new Date(),
          },
        },
      })

      return codes
    },
    { connection: redisClient },
  )

  worker.on('completed', (job) => {
    console.log(
      `Expired password tokens deleted count: ${job.returnvalue.count}`,
    )
  })

  worker.on('error', (e) => {
    console.error(`Cannot delete expired password tokens, err: ${e.message}`)
  })
}
