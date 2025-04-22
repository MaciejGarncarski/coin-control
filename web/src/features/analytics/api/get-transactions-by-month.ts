import { transactionsByMonthSchema } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { ANALYTICS_QUERY_KEYS } from '@/constants/query-keys/analytics'
import { fetcher } from '@/lib/fetcher'

export const getTransactionsByMonthQueryOptions = queryOptions({
  queryKey: [ANALYTICS_QUERY_KEYS.TRANSACTIONS_BY_MONTH],
  queryFn: async () => {
    const data = await fetcher({
      method: 'GET',
      url: `/analytics/transactions-by-month`,
      throwOnError: true,
      schema: transactionsByMonthSchema,
    })

    return data
  },
})

export const useTransactionsByMonth = () => {
  return useQuery(getTransactionsByMonthQueryOptions)
}
