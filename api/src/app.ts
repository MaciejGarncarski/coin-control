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
import { createEmailVerificationWorker } from './lib/queues/email-verification/worker.js'
import { createExpiredSessionCron } from './lib/queues/session/session-cron.js'
import helmet from 'helmet'
import { createResetPasswordLinkQueue } from './lib/queues/reset-password-link/worker.js'

const app = express()

declare module 'express-session' {
  interface SessionData {
    userId: string
  }
}

app.use(helmet())
app.use(corsMiddleware())
app.use(bodyParser.json())
app.use(expressSession(sessionConfig))
app.use(httpLogger)
app.use(router())
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})
app.use(errorMiddleware)
createEmailVerificationWorker()
createResetPasswordLinkQueue()
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
