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
