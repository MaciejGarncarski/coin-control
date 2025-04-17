import { db } from '@shared/database'

import { buildApp } from './app.js'
import { env } from './config/env.js'
import { setupCron } from './lib/queues/setup-cron.js'
import { httpLogger } from './logger/logger.js'
import { showStartMessage } from './utils/start-message.js'

const app = buildApp()

const server = app.listen(Number(env.PORT), env.HOST, (error) => {
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

const shutdown = async () => {
  // eslint-disable-next-line no-console
  console.log('Shutdown initiated...')
  try {
    // eslint-disable-next-line no-console
    server.close(() => console.log('HTTP server closed.'))
    httpLogger.logger.flush((err) => {
      if (err) {
        throw err
      }
    })
    await db.$disconnect()
    process.exit(0)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error during shutdown:', err)
    process.exit(1)
  }
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
