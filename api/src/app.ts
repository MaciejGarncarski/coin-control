import express from 'express'

import { env } from './config/env.js'
import { httpLogger } from './logger/logger.js'
import { corsMiddleware } from './middlewares/cors.js'
import { errorMiddleware } from './middlewares/error.js'
import { router } from './modules/router.js'
import { showStartMessage } from './utils/start-message.js'
import bodyParser from 'body-parser'
import { sessionConfig } from './config/session.js'
import expressSession from 'express-session'
import { createExpiredSessionCron } from './lib/queues/session-cron.js'
import helmet from 'helmet'
import { limiter } from './config/rate-limit.js'
import { createEmailVerificationWorker } from './lib/queues/email-verification.js'
import { createResetPasswordLinkQueue } from './lib/queues/reset-password-link.js'
import { createResetPasswordNotificationQueue } from './lib/queues/reset-password-notification.js'

const app = express()

declare module 'express-session' {
  interface SessionData {
    userId: string
  }
}

app.set('trust proxy', 1)
app.use(helmet())
app.use(corsMiddleware())
app.use(bodyParser.json())
app.use(expressSession(sessionConfig))
app.use(httpLogger)
app.use(limiter)
app.use(router())
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})
app.use(errorMiddleware)
createEmailVerificationWorker()
createResetPasswordLinkQueue()
createResetPasswordNotificationQueue()
createExpiredSessionCron()

app.listen(Number(env.PORT), env.HOST, (error) => {
  if (error) {
    httpLogger.logger.error('API server failed to start')

    if (error instanceof Error) {
      if (error.message.includes('EADDRINUSE')) {
        httpLogger.logger.error(`Port ${env.PORT} is already in use`)
      } else {
        httpLogger.logger.error(error.message)
      }
    }

    process.exit(1)
  }

  showStartMessage()
})
