import { Queue, Worker } from 'bullmq'
import { ResetPasswordNotificationEmail } from '@shared/email'

import { render } from '@react-email/render'
import { env } from '../../config/env.js'
import { mailer } from '../mailer.js'
import { connection } from '../redis.js'
import { httpLogger } from '../../logger/logger.js'

type JobData = {
  userEmail: string
  createdAt: number
}

const formatter = Intl.DateTimeFormat('en', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export const createResetPasswordNotificationQueue = () => {
  const worker = new Worker<JobData>(
    'resetPasswordNotification',
    async (job) => {
      const formattedDate = formatter.format(job.data.createdAt)

      const [emailHTML, emailText] = await Promise.all([
        render(
          ResetPasswordNotificationEmail({
            baseUrl: env.APP_ORIGIN,
            createdAt: formattedDate,
          }),
        ),
        render(
          ResetPasswordNotificationEmail({
            baseUrl: env.APP_ORIGIN,
            createdAt: formattedDate,
          }),
          {
            plainText: true,
          },
        ),
      ])

      await mailer.sendMail({
        to: job.data.userEmail,
        subject: 'CoinControl | Password reset notification',
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

export const resetPasswordNotificationQueue = new Queue<JobData>(
  'resetPasswordNotification',
  {
    connection: connection,
  },
)
