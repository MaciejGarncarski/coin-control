import { z } from 'zod'

const baseError = z.object({
  statusCode: z.number().min(100).max(600).optional(),
  message: z.string(),
  toastMessage: z.string().optional(),
  formMessage: z.string().optional(),
  additionalMessage: z.string().optional(),
  stack: z.string().optional(),
  type: z.literal('api'),
})

const validationError = z.object({
  statusCode: z.number().min(100).max(600).optional(),
  message: z.string(),
  paths: z.string(),
  formMessage: z.string().optional(),
  type: z.literal('validation'),
})

export const apiErrorSchema = z.union([baseError, validationError])

export type ApiError = z.infer<typeof apiErrorSchema>

export * from './analytics.js'
export * from './auth.js'
export * from './statistics.js'
export * from './transactions.js'
export * from './user.js'
