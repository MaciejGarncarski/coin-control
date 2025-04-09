import { z } from 'zod'

export const categoriesSchema = z.union([
  z.literal('groceries'),
  z.literal('income'),
  z.literal('foodAndDrink'),
  z.literal('utilities'),
  z.literal('housing'),
  z.literal('shopping'),
  z.literal('transportation'),
])

export type Category = z.infer<typeof categoriesSchema>

export const addTransactionMutation = z
  .object({
    description: z.string().optional(),
    category: categoriesSchema,
    amount: z.number().min(-999_999).max(999_999),
    date: z.string(),
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
