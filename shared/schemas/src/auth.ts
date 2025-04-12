import { z } from 'zod'

import { emailSchema } from './user.js'

export const loginMutationSchema = z.object({
  email: z.string().email({ message: 'Invalid email.' }),
  password: z
    .string()
    .min(4, { message: 'Password is too short.' })
    .max(128, { message: 'Password is too long.' }),
})

export type LoginMutation = z.infer<typeof loginMutationSchema>

export const registerMutationSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email.' }),
    fullName: z
      .string()
      .min(1, { message: 'Full name is required.' })
      .max(32, { message: 'Full name is too long.' }),
    password: z
      .string()
      .min(4, { message: 'Password is too short.' })
      .max(128, { message: 'Password is too long.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type RegisterMutation = z.infer<typeof registerMutationSchema>

export const EmailVerificationResponeSchema = z.object({
  message: z.string(),
})

export type EmailVerificationResponse = z.infer<
  typeof EmailVerificationResponeSchema
>

export const EmailVerificationVerifyMutationSchema = z.object({
  code: z.string().length(6, { message: 'Invalid EmailVerification code.' }),
})

export type EmailVerificationVerifyMutation = z.infer<
  typeof EmailVerificationVerifyMutationSchema
>

export const forgotPasswordEmailMutationSchema = z.object({
  email: emailSchema,
})

export type ForgotPasswordEmailMutation = z.infer<
  typeof forgotPasswordEmailMutationSchema
>

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(4, { message: 'Password is too short.' })
      .max(128, { message: 'Password is too long.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>

export const tokenSchema = z.string().length(48)

export const resetPasswordMutationSchema = z
  .object({
    password: z
      .string()
      .min(4, { message: 'Password is too short.' })
      .max(128, { message: 'Password is too long.' }),
    confirmPassword: z.string(),
    resetToken: tokenSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type ResetPasswordMutation = z.infer<typeof resetPasswordMutationSchema>

export const mySessionSchema = z.object({
  deviceType: z.string().nullable(),
  ip: z.string().nullable(),
  lastAccess: z.string().pipe(z.coerce.date()).nullable(),
  location: z.string().nullable(),
  os: z.string().nullable(),
  browser: z.string().nullable(),
  id: z.string(),
  current: z.boolean(),
})

export type MySession = z.infer<typeof mySessionSchema>

export const logOutDeviceQuerySchema = z.object({
  id: z.string().min(10),
})

export type LogOutDeviceQuery = z.infer<typeof logOutDeviceQuerySchema>

export const googleOauthAccessTokenSchema = z.object({
  access_token: z.string(),
})

export type GoogleOauthAccessToken = z.infer<
  typeof googleOauthAccessTokenSchema
>

export const googleOauthResponseSchema = z.object({
  picture: z.string(),
  email: z.string().email(),
  name: z.string(),
  id: z.string(),
})

export type GoogleOAuthResponse = z.infer<typeof googleOauthResponseSchema>
