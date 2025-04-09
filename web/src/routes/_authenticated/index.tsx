import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/features/homepage/pages/homepage'

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
})
