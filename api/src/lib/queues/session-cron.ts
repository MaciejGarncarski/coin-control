import { Queue, Worker } from 'bullmq'
import { connection } from '../redis.js'
import { httpLogger } from '../../logger/logger.js'
import { db } from '../db.js'

export const expiredSessionQueue = new Queue('expired-session', {
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

  const worker = new Worker(
    'expired-session',
    async (job) => {
      httpLogger.logger.info(`Deleting expired sessions, job ID: ${job.id}`)
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
    httpLogger.logger.info(
      `Expired sessions deleted count: ${job.returnvalue.count}`,
    )
  })

  worker.on('error', (e) => {
    httpLogger.logger.error(`Cannot delete expired sessions, err: ${e.message}`)
  })
}
