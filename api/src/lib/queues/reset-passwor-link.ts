import { Queue, Worker } from 'bullmq'
import { ResetPasswordEmail } from '@shared/email'

import { render } from '@react-email/render'
import { env } from '../../config/env.js'
import { mailer } from '../mailer.js'
import { connection } from '../redis.js'
import { httpLogger } from '../../logger/logger.js'

type JobData = {
  userEmail: string
  passwordResetCode: string
}

export const createResetPasswordLinkQueue = () => {
  const worker = new Worker<JobData>(
    'resetPasswordLinkQueue',
    async (job) => {
      const [emailHTML, emailText] = await Promise.all([
        render(
          ResetPasswordEmail({
            resetToken: job.data.passwordResetCode,
            baseUrl: env.APP_ORIGIN,
          }),
        ),
        render(
          ResetPasswordEmail({
            resetToken: job.data.passwordResetCode,
            baseUrl: env.APP_ORIGIN,
          }),
          {
            plainText: true,
          },
        ),
      ])

      await mailer.sendMail({
        to: job.data.userEmail,
        subject: 'CoinControl | Reset password',
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

export const resetPasswordLinkQueue = new Queue<JobData>(
  'resetPasswordLinkQueue',
  {
    connection: connection,
  },
)
