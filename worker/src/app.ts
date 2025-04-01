import { createEmailVerificationWorker } from './workers/email-verification.js'
import { createExpiredCodesRemoverWorker } from './workers/expired-codes-remover.js'
import { createExpiredPasswordTokensRemoverWorker } from './workers/expired-password-tokens-remover.js'
import { createExpiredSessionRemoverWorker } from './workers/expired-session-remover.js'
import { createNewEmailVerificationWorker } from './workers/new-email-verification.js'
import { createResetPasswordLinkWorker } from './workers/reset-email-password-link.js'
import { createResetPasswordNotificationWorker } from './workers/reset-password-notification.js'

createResetPasswordLinkWorker()
createEmailVerificationWorker()
createResetPasswordNotificationWorker()
createExpiredSessionRemoverWorker()
createNewEmailVerificationWorker()

createExpiredCodesRemoverWorker()
createExpiredPasswordTokensRemoverWorker()
