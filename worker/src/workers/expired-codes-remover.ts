/* eslint-disable no-console */
import { db } from '@shared/database'
import { QUEUES, redisClient, Worker } from '@shared/queues'

export const createExpiredCodesRemoverWorker = () => {
  const worker = new Worker(
    QUEUES.EXPIRED_CODES_REMOVER,
    async (job) => {
      console.log(`Deleting expired codes, job ID: ${job.id}`)
      const otpCodes = await db.email_verification.deleteMany({
        where: {
          expires_at: {
            lt: new Date(),
          },
        },
      })

      return otpCodes
    },
    { connection: redisClient },
  )

  worker.on('completed', (job) => {
    console.log(`Expired codes deleted count: ${job.returnvalue.count}`)
  })

  worker.on('error', (e) => {
    console.error(`Cannot delete expired codes, err: ${e.message}`)
  })
}
