import { z } from '@shared/schemas'

import { httpLogger } from '../logger/logger.js'

const envSchema = z.object({
  DATABASE_URL: z.string().startsWith('postgresql://'),
  API_SECRET: z.string(),
  API_URL: z.string(),
  HOST: z.string().ip({ version: 'v4' }),
  APP_ORIGIN: z.string().startsWith('http'),
  PORT: z.string().length(4),
  NODE_ENV: z
    .union([
      z.literal('development'),
      z.literal('production'),
      z.literal('test'),
    ])
    .default('development'),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.log('api', parsedEnv.error.message)
  httpLogger.logger.error(parsedEnv.error.errors)
  process.exit(1)
}

export const env = parsedEnv.data
