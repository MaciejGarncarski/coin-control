import { z } from 'zod'

export const categoriesSchema = z.union([
  z.literal('groceries'),
  z.literal('income'),
  z.literal('foodAndDrink'),
  z.literal('utilities'),
  z.literal('housing'),
  z.literal('shopping'),
  z.literal('transportation'),
  z.literal('other'),
])

export type Category = z.infer<typeof categoriesSchema>

export const addTransactionMutation = z
  .object({
    description: z
      .string()
      .max(64, { message: 'Description is too long.' })
      .optional(),
    category: categoriesSchema,
    amount: z.coerce.number().min(-999_999).max(999_999),
  })
  .refine(
    ({ amount }) => {
      if (amount === 0) {
        return false
      }
      return true
    },
    {
      message: 'Amount cannot be 0.',
      path: ['amount'],
    },
  )

export type AddTransactionMutation = z.infer<typeof addTransactionMutation>

export const editTransactionParamsSchema = z.object({
  transactionId: z.string(),
})
export type EditTransactionParams = z.infer<typeof editTransactionParamsSchema>

export const editTransactionMutation = z
  .object({
    description: z
      .string()
      .max(64, { message: 'Description is too long.' })
      .optional(),
    category: categoriesSchema.optional(),
    amount: z.coerce.number().min(-999_999).max(999_999).optional(),
  })
  .refine(
    ({ amount }) => {
      if (amount === 0) {
        return false
      }
      return true
    },
    {
      message: 'Amount cannot be 0.',
      path: ['amount'],
    },
  )

export type EditTransactionMutation = z.infer<typeof editTransactionMutation>

export const getTransactionsQuery = z.object({
  transactionId: z.string(),
  description: z.string().nullable(),
  category: categoriesSchema,
  amount: z.number(),
  date: z.coerce.date(),
})

export type GetTransactionsQuery = z.infer<typeof getTransactionsQuery>
export const getTransactionsResponse = z.object({
  transactions: z.array(getTransactionsQuery),
  total: z.number(),
  currentPage: z.number(),
  maxPages: z.number(),
  took: z.number(),
})
export type GetTransactionsResponse = z.infer<typeof getTransactionsResponse>

export const deleteTransactionParamsSchema = z.object({
  transactionId: z.string(),
})

export type DeleteTransactionParams = z.infer<
  typeof deleteTransactionParamsSchema
>

export const recentTransactionSchema = z.object({
  transactionId: z.string(),
  description: z.string().nullable(),
  category: categoriesSchema,
  amount: z.number(),
  date: z.coerce.date(),
})
export type RecentTransaction = z.infer<typeof recentTransactionSchema>

export const getRecentTransactionsSchema = z.object({
  recentTransactions: z.array(recentTransactionSchema),
  transactionCountThisMonth: z.number(),
})
export type GetRecentTransactions = z.infer<typeof getRecentTransactionsSchema>

export const dayNameSchema = z.union([
  z.literal('Monday'),
  z.literal('Tuesday'),
  z.literal('Wednesday'),
  z.literal('Thursday'),
  z.literal('Friday'),
  z.literal('Saturday'),
  z.literal('Sunday'),
])

export type DayName = z.infer<typeof dayNameSchema>

export const transactionOverviewSchema = z.object({
  day: dayNameSchema,
  transactions: z.number().min(0),
})

export type TransactionOverview = z.infer<typeof transactionOverviewSchema>

export const getTransactionOverviewSchema = z.object({
  data: z.array(
    z.object({
      day: dayNameSchema,
      transactions: z.number().min(0),
    }),
  ),
})

export type GetTransactionOverview = z.infer<
  typeof getTransactionOverviewSchema
>
