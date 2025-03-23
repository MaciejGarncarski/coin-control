import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().startsWith("postgresql://"),
  APP_ORIGIN: z.string().startsWith("http"),
  NODE_ENV: z
    .union([z.literal("development"), z.literal("production")])
    .default("development"),
  MAIL_USER: z.string().email(),
  MAIL_PASS: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(parsedEnv.error.errors);
  process.exit(1);
}

export const env = parsedEnv.data;
