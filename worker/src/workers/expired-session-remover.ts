import { Worker } from 'bullmq'
import { db } from '../db.js'
import { connection } from '../redis.js'

export const createExpiredSessionRemoverWorker = () => {
  const worker = new Worker(
    'expired-session-remover',
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
    { connection },
  )

  worker.on('completed', (job) => {
    console.log(`Expired sessions deleted count: ${job.returnvalue.count}`)
  })

  worker.on('error', (e) => {
    console.error(`Cannot delete expired sessions, err: ${e.message}`)
  })
}
