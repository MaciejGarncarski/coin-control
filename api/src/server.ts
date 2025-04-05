import { buildApp } from './app.js'
import { env } from './config/env.js'
import { setupCron } from './lib/queues/setup-cron.js'
import { httpLogger } from './logger/logger.js'
import { showStartMessage } from './utils/start-message.js'

const app = buildApp()

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
