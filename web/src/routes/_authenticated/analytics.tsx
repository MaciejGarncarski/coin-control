import { createFileRoute } from '@tanstack/react-router'

import { AnalyticsPage } from '@/features/analytics/pages/analytics-page'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: AnalyticsPage,
})
