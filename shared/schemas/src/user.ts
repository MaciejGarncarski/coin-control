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

export const emailsResponseSchema = z.array(
  z.object({
    emailID: z.string(),
    email: z.string().email(),
    isVerified: z.boolean(),
    isPrimary: z.boolean(),
  }),
)

export type EmailsResponse = z.infer<typeof emailsResponseSchema>

export const addEmailMutationSchema = z.object({
  email: z.string().email(),
})

export type AddEmailMutation = z.infer<typeof addEmailMutationSchema>

export const resendEmailVerificationMutationSchema = z.object({
  email: z.string().email(),
})

export type RsendEmailVerificationMutation = z.infer<
  typeof resendEmailVerificationMutationSchema
>

export const verifySecondaryEmailMutaitonSchema = z.object({
  email: z.string().email(),
  token: z.string().length(48),
})

export type VerifySecondaryEmailMutation = z.infer<
  typeof verifySecondaryEmailMutaitonSchema
>

export const setPrimaryEmailMutationSchema = z.object({
  email: z.string().email(),
})

export type SetPrimaryEmailMutation = z.infer<
  typeof setPrimaryEmailMutationSchema
>

export const deleteEmailMutationSchema = z.object({
  email: z.string().email(),
})

export type DeleteEmailMutation = z.infer<typeof deleteEmailMutationSchema>
