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

export const monthsSchema = z.enum([
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
])

export type Month = z.infer<typeof monthsSchema>

export const transactionsByMonthSchema = z.object({
  data: z.array(
    z.object({
      month: monthsSchema,
      income: z.number().nullable(),
      expense: z.number().nullable(),
    }),
  ),
})

export type TransactionsByMonth = z.infer<typeof transactionsByMonthSchema>
