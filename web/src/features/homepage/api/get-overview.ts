import { getTransactionOverviewSchema } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { TRANSACTIONS_QUERY_KEYS } from '@/constants/query-keys/transactions'
import { fetcher } from '@/lib/fetcher'

export const overviewTransactionsQueryOptions = queryOptions({
  queryKey: [TRANSACTIONS_QUERY_KEYS.OVERVIEW],
  queryFn: () => {
    return fetcher({
      method: 'GET',
      url: `/transactions/overview`,
      throwOnError: true,
      schema: getTransactionOverviewSchema,
    })
  },
})

export const useTransactionsOverview = () => {
  return useQuery(overviewTransactionsQueryOptions)
}
