import { categoriesSchema } from '@shared/schemas'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getTransactionQueryOptions } from '@/features/transactions/api/get-transaction'
import { TransactionsPage } from '@/features/transactions/pages/transactions-page'

export const Route = createFileRoute('/_authenticated/transactions')({
  component: TransactionsPage,
  validateSearch: (search: Record<string, unknown>) => {
    const searchSchema = z.object({
      addTransaction: z.coerce.boolean().default(false).optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
      page: z
        .union([z.string().length(0), z.null(), z.number(), z.undefined()])
        .optional()
        .transform((arg) => {
          if (typeof arg === 'number') {
            return arg
          }

          return 1
        }),
      search: z.string().optional(),
      category: categoriesSchema.optional(),
    })

    return searchSchema.parse(search)
  },
  loaderDeps: ({ search }) => {
    return search
  },
  loader: ({ context, deps }) => {
    const { page, dateFrom, dateTo, search, category } = deps

    context.queryClient.prefetchQuery(
      getTransactionQueryOptions({
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        page: String(page || 1),
        search: search || null,
        category: category || null,
      }),
    )
  },
})
