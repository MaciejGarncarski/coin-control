import { db } from '@shared/database'
import { QUEUES, redisClient, Worker } from '@shared/queues'

export const createExpiredSessionRemoverWorker = () => {
  const worker = new Worker(
    QUEUES.EXPIRED_SESSION_REMOVER,
    async (job) => {
      // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log(`Expired sessions deleted count: ${job.returnvalue.count}`)
  })

  worker.on('error', (e) => {
    // eslint-disable-next-line no-console
    console.error(`Cannot delete expired sessions, err: ${e.message}`)
  })
}
