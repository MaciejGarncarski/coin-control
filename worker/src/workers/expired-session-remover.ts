import { QUEUES, redisClient, Worker } from '@shared/queues'

import { db } from '../db.js'

export const createExpiredSessionRemoverWorker = () => {
  const worker = new Worker(
    QUEUES.EXPIRED_SESSION_REMOVER,
    async (job) => {
      console.log(`Deleting expired sessions, job ID: ${job.id}`)
      const deletedCount = await db.sessions.deleteMany({
        where: {
          expire_at: {
            lt: new Date(),
          },
        },
      })

      return deletedCount
    },
    { connection: redisClient },
  )

  worker.on('completed', (job) => {
    console.log(`Expired sessions deleted count: ${job.returnvalue.count}`)
  })

  worker.on('error', (e) => {
    console.error(`Cannot delete expired sessions, err: ${e.message}`)
  })
}
