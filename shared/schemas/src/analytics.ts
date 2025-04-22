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
