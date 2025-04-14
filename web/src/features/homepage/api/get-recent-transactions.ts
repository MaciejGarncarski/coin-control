import { getRecentTransactionsSchema } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { TRANSACTIONS_QUERY_KEYS } from '@/constants/query-keys/transactions'
import { fetcher } from '@/lib/fetcher'

export const recentTransactionsQueryOptions = queryOptions({
  queryKey: [TRANSACTIONS_QUERY_KEYS.RECENT],
  queryFn: () => {
    return fetcher({
      method: 'GET',
      url: `/transactions/recent`,
      throwOnError: true,
      schema: getRecentTransactionsSchema,
    })
  },
})

export const useRecentTransactions = () => {
  return useQuery(recentTransactionsQueryOptions)
}
