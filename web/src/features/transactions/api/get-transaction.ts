import { getTransactionsResponse } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'

import { fetcher } from '@/lib/fetcher'

type GetQuery = {
  dateFrom: string | null
  dateTo: string | null
  page: string
}

export const getTransactionQueryOptions = ({
  dateFrom,
  dateTo,
  page,
}: GetQuery) =>
  queryOptions({
    queryKey: ['transactions', dateFrom, dateTo, page],
    queryFn: () => {
      return fetcher({
        method: 'GET',
        url: `/transactions?page=${page}&dateFrom=${dateFrom || ''}&dateTo=${dateTo || ''}`,
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
    }),
  )
}
