import { render } from '@react-email/render'
import { ResetPasswordNotificationEmail } from '@shared/email'
import {
  QUEUES,
  redisClient,
  type ResetPasswordNotificationJob,
  Worker,
} from '@shared/queues'

import { env } from '../env.js'
import { mailer } from '../mailer.js'

const formatter = Intl.DateTimeFormat('en', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export const createResetPasswordNotificationWorker = () => {
  const worker = new Worker<ResetPasswordNotificationJob>(
    QUEUES.RESET_PASSWORD_NOTIFICATION,
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
      connection: redisClient,
    },
  )

  worker.on('completed', (job) => {
    console.log(`Email job with ID: ${job.id} has completed successfully`)
  })

  worker.on('failed', (job, err) => {
    console.error(
      `Email job with ID: ${job?.id} has failed with ${err.message}`,
    )
  })
}
