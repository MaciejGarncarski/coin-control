import { createFileRoute } from '@tanstack/react-router'

import { ForgotPasswordPage } from '@/features/auth/forgot-password/pages/forgot-password-page'

export const Route = createFileRoute(
  '/_not_authenticated/auth/forgot-password',
)({
  component: ForgotPasswordPage,
})
