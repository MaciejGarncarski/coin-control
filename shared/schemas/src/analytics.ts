import { z } from 'zod'

import { categoriesSchema } from './transactions.js'

export const categoriesAnalyticsSchema = z.object({
  categories: z.array(
    z.object({
      category: categoriesSchema,
      value: z.number(),
    }),
  ),
})

export type CategoriesAnalytics = z.infer<typeof categoriesAnalyticsSchema>

export const largestIncomeExpenseSchema = z.object({
  income: z.object({
    value: z.number().nullable(),
    description: z.string().nullable(),
  }),
  expense: z.object({
    value: z.number().nullable(),
    description: z.string().nullable(),
  }),
})

export type LargestIncomeExpense = z.infer<typeof largestIncomeExpenseSchema>
