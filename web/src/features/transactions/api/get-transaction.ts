import { type Category, getTransactionsResponse } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'

import { TRANSACTIONS_QUERY_KEYS } from '@/constants/query-keys/transactions'
import { fetcher } from '@/lib/fetcher'

type GetQuery = {
  dateFrom: string | null
  dateTo: string | null
  page: string
  search: string | null
  category: Category | null
}

export const getTransactionQueryOptions = ({
  dateFrom,
  dateTo,
  page,
  search,
  category,
}: GetQuery) =>
  queryOptions({
    queryKey: [
      TRANSACTIONS_QUERY_KEYS.TRANSACTIONS,
      dateFrom,
      dateTo,
      page,
      search,
      category,
    ],
    queryFn: () => {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

      return fetcher({
        method: 'GET',
        url: `/transactions?page=${page}&search=${search || ''}&dateFrom=${dateFrom || ''}&dateTo=${dateTo || ''}&category=${category || ''}&tz=${userTimeZone}`,
        throwOnError: true,
        schema: getTransactionsResponse,
      })
    },
  })

export const useGetTransactions = () => {
  const search = useSearch({ from: '/_authenticated/transactions' })

  return useQuery(
    getTransactionQueryOptions({
      dateFrom: search.dateFrom || null,
      dateTo: search.dateTo || null,
      page: search.page.toString() || '1',
      search: search.search || null,
      category: search.category || null,
    }),
  )
}
