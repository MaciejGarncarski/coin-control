/* eslint-disable no-console */
import { redisClient, Worker } from '@shared/queues'

import { db } from '../db.js'

export const createExpiredCodesRemoverWorker = () => {
  const worker = new Worker(
    'expired-codes-remover',
    async (job) => {
      console.log(`Deleting expired codes, job ID: ${job.id}`)
      const otpCodes = await db.otp_codes.deleteMany({
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
