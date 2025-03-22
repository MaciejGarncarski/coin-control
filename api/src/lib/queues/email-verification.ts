import { Worker } from 'bullmq'
import { VerifyEmail } from '@shared/email'
import { render } from '@react-email/render'
import { Queue } from 'bullmq'
import { connection } from '../redis.js'
import { env } from '../../config/env.js'
import { mailer } from '../mailer.js'
import { httpLogger } from '../../logger/logger.js'

type JobData = {
  userEmail: string
  code: string
}

export const emailVerificationQueue = new Queue<JobData>(
  'emailVerificationQueue',
  {
    connection: connection,
  },
)

export const createEmailVerificationWorker = () => {
  const worker = new Worker<JobData>(
    'emailVerificationQueue',
    async (job) => {
      const [emailHTML, emailText] = await Promise.all([
        render(
          VerifyEmail({ otpCode: job.data.code, baseUrl: env.APP_ORIGIN }),
        ),
        render(
          VerifyEmail({ otpCode: job.data.code, baseUrl: env.APP_ORIGIN }),
          { plainText: true },
        ),
      ])

      await mailer.sendMail({
        to: job.data.userEmail,
        subject: 'CoinControl | Email verification',
        html: emailHTML,
        text: emailText,
      })

      return { success: true }
    },
    {
      connection: connection,
    },
  )

  worker.on('completed', (job) => {
    httpLogger.logger.info(
      `Email job with ID: ${job.id} has completed successfully`,
    )
  })

  worker.on('failed', (job, err) => {
    httpLogger.logger.error(
      `Email job with ID: ${job?.id} has failed with ${err.message}`,
    )
  })
}
