import { createFileRoute } from '@tanstack/react-router'

import { PrivacyPolicyPage } from '@/features/privacy-policy/pages/privacy-policy'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
})
