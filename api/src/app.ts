import bodyParser from 'body-parser'
import express from 'express'
import expressSession from 'express-session'
import helmet from 'helmet'

import { globalRateLimit } from './config/rate-limit.js'
import { sessionConfig } from './config/session.js'
import { httpLogger } from './logger/logger.js'
import { corsMiddleware } from './middlewares/cors.js'
import { errorMiddleware } from './middlewares/error.js'
import { notFoundMiddleware } from './middlewares/not-found.js'
import { mainRouter } from './middlewares/router.js'
import { authRouter } from './modules/auth/auth.route.js'
declare module 'express-session' {
  interface Session {
    userId: string
  }
}

export const buildApp = () => {
  const app = express()

  app.set('trust proxy', 1)
  app.use(helmet())
  app.use(corsMiddleware())
  app.use(bodyParser.json())
  app.use(expressSession(sessionConfig))
  app.use(httpLogger)
  app.use(globalRateLimit)
  app.use(mainRouter)
  app.use(authRouter)
  app.use(errorMiddleware)
  app.use(notFoundMiddleware)

  return app
}
