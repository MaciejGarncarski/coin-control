import { render } from '@react-email/render'
import { EmailVerification } from '@shared/email'
import {
  type AccountVerificationJob,
  QUEUES,
  redisClient,
  Worker,
} from '@shared/queues'

import { env } from '../env.js'
import { mailer } from '../mailer.js'

export const createAccountVerificationWorker = () => {
  const worker = new Worker<AccountVerificationJob>(
    QUEUES.EMAIL_VERIFICATION,
    async (job) => {
      const [emailHTML, emailText] = await Promise.all([
        render(
          EmailVerification({
            otpCode: job.data.code,
            baseUrl: env.APP_ORIGIN,
          }),
        ),
        render(
          EmailVerification({
            otpCode: job.data.code,
            baseUrl: env.APP_ORIGIN,
          }),
          { plainText: true },
        ),
      ])

      await mailer.sendMail({
        to: job.data.userEmail,
        subject: `CoinControl | Verification code ${job.data.code}`,
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
    // eslint-disable-next-line no-console
    console.log(`Email job with ID: ${job.id} has completed successfully`)
  })

  worker.on('failed', (job, err) => {
    // eslint-disable-next-line no-console
    console.error(
      `Email job with ID: ${job?.id} has failed with ${err.message}`,
    )
  })
}
