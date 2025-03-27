import { render } from '@react-email/render'
import { EmailVerification } from '@shared/email'
import { redisClient, Worker } from '@shared/queues'
import type { EmailVerificationJob } from '@shared/schemas'

import { env } from '../env.js'
import { mailer } from '../mailer.js'

export const createEmailVerificationWorker = () => {
  const worker = new Worker<EmailVerificationJob>(
    'emailVerificationQueue',
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
    console.log(`Email job with ID: ${job.id} has completed successfully`)
  })

  worker.on('failed', (job, err) => {
    console.error(
      `Email job with ID: ${job?.id} has failed with ${err.message}`,
    )
  })
}
