import { Worker } from 'bullmq'

import { connection } from '../../../src/lib/redis.js'
import { mailer } from '../../../src/lib/mailer.js'

type JobData = {
  userEmail: string
  code: string
}

export const createEmailVerificationWorker = () => {
  const worker = new Worker<JobData>(
    'emailVerificationQueue',
    async (job) => {
      await mailer.sendMail({
        to: job.data.userEmail,
        subject: 'CoinControl | Email verification',
        text: `Your code: ${job.data.code}.\nVerify your email by providing it in the app.`,
      })

      return { success: true }
    },
    {
      connection: connection,
    },
  )

  worker.on('completed', (job) => {
    console.log(`${job.id} has completed!`)
  })

  worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`)
  })
}
