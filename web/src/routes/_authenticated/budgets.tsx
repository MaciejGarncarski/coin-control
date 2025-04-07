import { createFileRoute } from '@tanstack/react-router'

import { BudgetsPage } from '@/features/budgets/pages/budgets-page'

export const Route = createFileRoute('/_authenticated/budgets')({
  component: BudgetsPage,
})
