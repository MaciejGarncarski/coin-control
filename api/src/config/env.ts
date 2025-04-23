import { z } from 'zod'

const envSchema = z.object({
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
  ENCRYPTION_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_OAUTH_URL: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  GOOGLE_ACCESS_TOKEN_URL: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.log(parsedEnv.error.errors)
  process.exit(1)
}

export const env = parsedEnv.data
