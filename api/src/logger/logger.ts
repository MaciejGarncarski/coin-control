import type { Options } from 'pino-http'
import { pinoHttp } from 'pino-http'
import { pino } from 'pino'

const pinoEnvOptions: Record<'development' | 'production', Options> = {
  development: {
    logger: pino({
      enabled: true,
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname,req.remoteAddress,req.remotePort',
        },
      },
    }),
  },
  production: {
    logger: pino({
      enabled: true,
      transport: {
        target: 'pino/file',
        options: {
          destination: 1,
          all: true,
          translateTime: true,
        },
      },
    }),
  },
}

const pinoInstance =
  pinoEnvOptions[
    process.env.NODE_ENV === 'production' ? 'production' : 'development'
  ]

export const httpLogger = pinoHttp(pinoInstance)
