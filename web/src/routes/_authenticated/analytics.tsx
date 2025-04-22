import { createFileRoute } from '@tanstack/react-router'

import { getCategoriesAnalyticsQueryOptions } from '@/features/analytics/api/get-categories'
import { getLargestIncomeExpenseQuery } from '@/features/analytics/api/get-largest-income-expense'
import { getTransactionsByMonthQueryOptions } from '@/features/analytics/api/get-transactions-by-month'
import { AnalyticsPage } from '@/features/analytics/pages/analytics-page'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: AnalyticsPage,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(getCategoriesAnalyticsQueryOptions)
    context.queryClient.ensureQueryData(getLargestIncomeExpenseQuery)
    context.queryClient.ensureQueryData(getTransactionsByMonthQueryOptions)
  },
})
