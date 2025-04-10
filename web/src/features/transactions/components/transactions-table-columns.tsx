import type { GetTransactionsQuery } from '@shared/schemas'
import { createColumnHelper } from '@tanstack/react-table'

import { TransactionBadge } from '@/components/transactions/transaction-badge'
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
    meta: {
      isWide: true,
    },
    cell: ({ row }) => {
      return (
        <p className="inline-block max-w-full break-words break-all whitespace-pre-line">
          {row.original.description}
        </p>
      )
    },
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: ({ row }) => {
      return <TransactionBadge category={row.original.category} withIcon />
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
    cell: ({ row }) => {
      return <TransactionTableMenu transactionId={row.original.transactionId} />
    },
  }),
]
