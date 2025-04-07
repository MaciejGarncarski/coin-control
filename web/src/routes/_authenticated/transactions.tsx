import { createFileRoute } from '@tanstack/react-router'

import { TransactionsPage } from '@/features/transactions/pages/transactions-page'

export const Route = createFileRoute('/_authenticated/transactions')({
  component: TransactionsPage,
})
