import { z } from 'zod'

const OBFUSCATED_EMAIL_REGEX =
  /\b[a-zA-Z0-9]{1}\*{1,}@([a-zA-Z0-9]{1}\*{1,}\.[a-zA-Z]{2,})\b/

export const emailSchema = z
  .string()
  .email()
  .or(
    z.string().regex(OBFUSCATED_EMAIL_REGEX, 'Invalid obfuscated email format'),
  )

export const userSchema = z.object({
  id: z.string(),
  email: emailSchema,
  name: z.string(),
  isEmailVerified: z.boolean(),
})

export type User = z.infer<typeof userSchema>
