import { createFileRoute } from '@tanstack/react-router'

import { overviewTransactionsQueryOptions } from '@/features/homepage/api/get-overview'
import { recentTransactionsQueryOptions } from '@/features/homepage/api/get-recent-transactions'
import { getStatisticsQueryOptions } from '@/features/homepage/api/get-statistics'
import { HomePage } from '@/features/homepage/pages/homepage'

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
  loader: ({ context }) => {
    if (context.auth.status === 'loggedOut') {
      return
    }

    return Promise.allSettled([
      context.queryClient.ensureQueryData(recentTransactionsQueryOptions),
      context.queryClient.ensureQueryData(getStatisticsQueryOptions),
      context.queryClient.ensureQueryData(overviewTransactionsQueryOptions),
    ])
  },
})
