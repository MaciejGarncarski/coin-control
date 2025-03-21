import { Worker } from 'bullmq'

import { connection } from '../../redis.js'
import { mailer } from '../../mailer.js'
import { httpLogger } from '../../../logger/logger.js'
import { env } from '../../../config/env.js'

type JobData = {
  userEmail: string
  passwordResetCode: string
}

export const createResetPasswordLinkQueue = () => {
  const worker = new Worker<JobData>(
    'resetPasswordLinkQueue',
    async (job) => {
      const link = `${env.APP_ORIGIN}/auth/password-reset?reset_token=${job.data.passwordResetCode}`

      await mailer.sendMail({
        to: job.data.userEmail,
        subject: 'CoinControl | Reset password',
        text: `Your reset password link: ${link}`,
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
