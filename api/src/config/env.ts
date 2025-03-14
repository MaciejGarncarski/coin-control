import { z } from '@shared/zod-schemas'

import { httpLogger } from '../logger/logger.js'

const envSchema = z.object({
  DB_URL: z.string().startsWith('postgresql://'),
  API_SECRET: z.string(),
  HOST: z.string().ip({ version: 'v4' }),
  APP_ORIGIN: z.string().startsWith('http'),
  PORT: z.string().length(4),
  NODE_ENV: z
    .union([z.literal('development'), z.literal('production')])
    .default('development'),
  MAIL_USER: z.string().email(),
  MAIL_PASS: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  httpLogger.logger.error(parsedEnv.error.errors)
  process.exit(1)
}

export const env = parsedEnv.data
