import type { GetTransactionsQuery } from '@shared/schemas'
import { createColumnHelper } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { TransactionCategoryIcon } from '@/features/transactions/components/transaction-category-icon'
import { TransactionTableMenu } from '@/features/transactions/components/transaction-table-menu'
import { cn } from '@/lib/utils'

const columnHelper = createColumnHelper<GetTransactionsQuery>()

export const transactionsTableColumns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: ({ row }) => {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(row.original.date)
    },
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <TransactionCategoryIcon category={row.original.category} />
          {row.original.description}
        </div>
      )
    },
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 font-semibold capitalize">
          <Badge variant={'outline'}>{row.original.category}</Badge>
        </div>
      )
    },
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ row }) => {
      return (
        <span
          className={cn(
            row.original.amount > 0 ? 'text-green-700' : 'text-red-700',
            'font-semibold',
          )}>
          {row.original.amount > 0
            ? `+${row.original.amount}`
            : row.original.amount}
        </span>
      )
    },
  }),
  columnHelper.display({
    id: 'options',
    header: 'Options',
    cell: () => {
      return <TransactionTableMenu />
    },
  }),
]
