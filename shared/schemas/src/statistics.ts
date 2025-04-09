import { z } from 'zod'

import { categoriesSchema } from './transactions.js'

export const getStatisticsResponse = z.object({
  totalBalance: z.object({
    value: z.number(),
    changeFromLastMonth: z.number(),
  }),
  thisMonthIncome: z.object({
    value: z.number(),
    changeFromLastMonth: z.number(),
  }),
  thisMonthSpending: z.object({
    value: z.number(),
    changeFromLastMonth: z.number(),
  }),
  mostCommonCategoryThisMonth: categoriesSchema,
})

export type GetStatistics = z.infer<typeof getStatisticsResponse>
