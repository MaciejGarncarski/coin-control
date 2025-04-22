import { largestIncomeExpenseSchema } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { ANALYTICS_QUERY_KEYS } from '@/constants/query-keys/analytics'
import { fetcher } from '@/lib/fetcher'

export const getLargestIncomeExpenseQuery = queryOptions({
  queryKey: [ANALYTICS_QUERY_KEYS.LARGEST_INCOME_EXPENSE],
  queryFn: async () => {
    const data = await fetcher({
      method: 'GET',
      url: `/analytics/largest-income-expense`,
      throwOnError: true,
      schema: largestIncomeExpenseSchema,
    })

    return data
  },
})

export const useLargestIncomeExpense = () => {
  return useQuery(getLargestIncomeExpenseQuery)
}
