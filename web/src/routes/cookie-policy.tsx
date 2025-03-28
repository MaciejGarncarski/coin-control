import { createFileRoute } from '@tanstack/react-router'

import { CookiePolicyPage } from '@/features/cookies/pages/cookie-policy'

export const Route = createFileRoute('/cookie-policy')({
  component: CookiePolicyPage,
})
