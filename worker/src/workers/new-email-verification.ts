import { render } from '@react-email/render'
import { SecondaryEmailVerification } from '@shared/email'
import {
  type NewEmailVerificationJob,
  QUEUES,
  redisClient,
  Worker,
} from '@shared/queues'

import { env } from '../env.js'
import { mailer } from '../mailer.js'

export const createNewEmailVerificationWorker = () => {
  const worker = new Worker<NewEmailVerificationJob>(
    QUEUES.NEW_EMAIL_VERIFICATION,
    async (job) => {
      const [emailHTML, emailText] = await Promise.all([
        render(
          SecondaryEmailVerification({
            baseUrl: env.APP_ORIGIN,
            email: job.data.email,
            verificationToken: job.data.token,
          }),
        ),
        render(
          SecondaryEmailVerification({
            baseUrl: env.APP_ORIGIN,
            email: job.data.email,
            verificationToken: job.data.token,
          }),
          {
            plainText: true,
          },
        ),
      ])

      await mailer.sendMail({
        to: job.data.email,
        subject: 'CoinControl | Verify your email',
        html: emailHTML,
        text: emailText,
      })

      return { success: true }
    },
    { connection: redisClient },
  )

  worker.on('completed', (job) => {
    // eslint-disable-next-line no-console
    console.log(
      `New email verification job with ID: ${job.id} has completed successfully`,
    )
  })

  worker.on('failed', (job, err) => {
    console.error(
      `New email verification job with ID: ${job?.id} has failed with ${err.message}`,
    )
  })
}
