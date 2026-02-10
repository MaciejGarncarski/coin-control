import { createAccountVerificationWorker } from './workers/account-verification.js'
import { createExpiredCodesRemoverWorker } from './workers/expired-codes-remover.js'
import { createExpiredPasswordTokensRemoverWorker } from './workers/expired-password-tokens-remover.js'
import { createExpiredSessionRemoverWorker } from './workers/expired-session-remover.js'
import { createNewEmailVerificationWorker } from './workers/new-email-verification.js'
import { createResetPasswordLinkWorker } from './workers/reset-email-password-link.js'
import { createResetPasswordNotificationWorker } from './workers/reset-password-notification.js'

try {
  createResetPasswordLinkWorker()
  createAccountVerificationWorker()
  createResetPasswordNotificationWorker()
  createExpiredSessionRemoverWorker()
  createNewEmailVerificationWorker()
  createExpiredCodesRemoverWorker()
  createExpiredPasswordTokensRemoverWorker()

  // eslint-disable-next-line no-console
  console.log('Workers started')
} catch (e) {
  // eslint-disable-next-line no-console
  console.log(e)
}
