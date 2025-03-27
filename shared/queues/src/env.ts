import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .union([z.literal('development'), z.literal('production')])
    .default('development'),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error(parsedEnv.error.errors)
  process.exit(1)
}

export const env = parsedEnv.data
