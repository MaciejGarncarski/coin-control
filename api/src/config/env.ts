import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3001"),
  NODE_ENV: z
    .union([z.literal("development"), z.literal("production")])
    .default("development"),
});

export const env = envSchema.parse(process.env);
