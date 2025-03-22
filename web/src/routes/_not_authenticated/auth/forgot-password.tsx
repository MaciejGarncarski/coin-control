import { ForgotPasswordPage } from '@/features/auth/forgot-password/pages/forgot-password-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_not_authenticated/auth/forgot-password',
)({
  component: ForgotPasswordPage,
})
