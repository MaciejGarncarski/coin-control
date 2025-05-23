import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

import { Button } from '@/components/ui/button'
import {
  getTransactionQueryOptions,
  useGetTransactions,
} from '@/features/transactions/api/get-transaction'

export const TransactionTablePagination = () => {
  const transactions = useGetTransactions()
  const search = useSearch({ from: '/_authenticated/transactions' })
  const navigate = useNavigate({ from: '/transactions' })
  const queryClient = useQueryClient()

  const prevPage = () => {
    const newPage = Number(search.page) - 1
    const maxPages = transactions.data?.maxPages

    if (maxPages) {
      navigate({
        search: (prev) => ({
          ...prev,
          page: newPage >= maxPages ? maxPages : newPage,
        }),
        resetScroll: false,
        viewTransition: false,
      })
      return
    }

    navigate({
      search: (prev) => ({
        ...prev,
        page: newPage < 1 ? 1 : newPage,
      }),
      resetScroll: false,
      viewTransition: false,
    })
  }

  const nextPage = () => {
    const newPage = Number(search.page) + 1

    const maxPages = transactions.data?.maxPages

    if (maxPages) {
      navigate({
        search: (prev) => ({
          ...prev,
          page: newPage >= maxPages ? maxPages : newPage,
        }),
        resetScroll: false,
        viewTransition: false,
      })
      return
    }

    navigate({
      search: (prev) => ({
        ...prev,
        page: newPage,
      }),
      resetScroll: false,
      viewTransition: false,
    })
  }

  const prefetchPrevPage = useDebouncedCallback(
    () => {
      queryClient.prefetchQuery(
        getTransactionQueryOptions({
          dateFrom: search.dateFrom || null,
          dateTo: search.dateTo || null,
          page: (Number(search.page) - 1).toString(),
          search: search.search || null,
          category: search.category || null,
        }),
      )
    },
    500,
    { maxWait: 2000 },
  )

  const prefetchNextPage = useDebouncedCallback(
    () => {
      queryClient.prefetchQuery(
        getTransactionQueryOptions({
          dateFrom: search.dateFrom || null,
          dateTo: search.dateTo || null,
          page: (Number(search.page) + 1).toString(),
          search: search.search || null,
          category: search.category || null,
        }),
      )
    },
    500,
    { maxWait: 2000 },
  )

  if (transactions.data?.maxPages === 1) {
    return null
  }

  return (
    <div className="mt-4 flex justify-center">
      <div className="flex items-center justify-center gap-8 p-4">
        <Button
          variant="outline"
          className="border-reflect border-0"
          size="sm"
          disabled={Number(search.page) - 1 < 1}
          onMouseOver={prefetchPrevPage}
          onClick={prevPage}>
          <ChevronLeft />
          Previous
        </Button>
        <p className="text-muted-foreground text-center text-sm">
          Page <span className="font-medium">{search.page}</span> of{' '}
          <span className="font-medium">
            {transactions.data?.maxPages || 1}
          </span>
        </p>
        <Button
          variant="outline"
          size="sm"
          className="border-reflect border-0"
          disabled={
            Number(search.page) - 1 >= (transactions.data?.maxPages || 1) - 1
          }
          onMouseOver={prefetchNextPage}
          onClick={nextPage}>
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
