import { jakisTest } from '@shared/zod-schemas'
import express from 'express'

import { env } from './config/env.js'
import { httpLogger } from './logger/logger.js'
import { corsMiddleware } from './middlewares/cors.js'
import { errorMiddleware } from './middlewares/error.js'
import { router } from './modules/router.js'
import { showStartMessage } from './utils/start-message.js'

const app = express()

app.use(httpLogger)
app.use(corsMiddleware())
app.use(router())
app.use(errorMiddleware)

console.log(jakisTest)

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
