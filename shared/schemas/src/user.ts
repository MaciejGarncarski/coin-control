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
  avatarURL: z.string().nullable(),
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

export type ResendEmailVerificationMutation = z.infer<
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

export const IMAGE_SCHEMA = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/svg+xml',
        'image/gif',
      ].includes(file.type),
    { message: 'Invalid image file type' },
  )

export const userAvatarMutationSchema = z.object({
  avatar: IMAGE_SCHEMA,
})

export type UserAvatarMutation = z.infer<typeof userAvatarMutationSchema>

export const userFullNameMutationSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(32, { message: 'Please use 32 characters at maximum.' }),
})

export type UserFullNameMutation = z.infer<typeof userFullNameMutationSchema>

export const deleteUserAccountMutationSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(32, { message: 'Please use 32 characters at maximum.' }),
})

export type DeleteUserAccountMutation = z.infer<
  typeof deleteUserAccountMutationSchema
>
