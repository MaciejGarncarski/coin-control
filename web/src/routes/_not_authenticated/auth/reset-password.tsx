import { ResetPasswordPage } from '@/features/auth/reset-password/pages/reset-password-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_not_authenticated/auth/reset-password')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <ResetPasswordPage />
}
