import { pino } from 'pino'
import type { Options } from 'pino-http'
import { pinoHttp } from 'pino-http'

const pinoEnvOptions: Record<'development' | 'production', Options> = {
  development: {
    logger: pino({
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname,req.headers',
        },
      },
    }),
  },
  production: {},
}

const pinoOptions =
  pinoEnvOptions[
    process.env.NODE_ENV === 'production' ? 'production' : 'development'
  ]

export const httpLogger = pinoHttp(pinoOptions)
