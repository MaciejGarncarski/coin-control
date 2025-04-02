import bodyParser from 'body-parser'
import express from 'express'
import expressSession from 'express-session'
import helmet from 'helmet'

import { env } from './config/env.js'
import { limiter } from './config/rate-limit.js'
import { sessionConfig } from './config/session.js'
import { setupCron } from './lib/queues/setup-cron.js'
import { httpLogger } from './logger/logger.js'
import { corsMiddleware } from './middlewares/cors.js'
import { errorMiddleware } from './middlewares/error.js'
import { notFoundMiddleware } from './middlewares/not-found.js'
import { mainRouter } from './middlewares/router.js'
import { authRouter } from './modules/auth/auth.route.js'
import { showStartMessage } from './utils/start-message.js'

const app = express()

declare module 'express-session' {
  interface Session {
    userId: string
  }
}

app.set('trust proxy', 1)
app.use(helmet())
app.use(corsMiddleware())
app.use(bodyParser.json())
app.use(expressSession(sessionConfig))
app.use(httpLogger)
app.use(mainRouter)
app.use(limiter)
app.use(authRouter)
app.use(errorMiddleware)
app.use(notFoundMiddleware)

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

  setupCron()
  showStartMessage()
})
