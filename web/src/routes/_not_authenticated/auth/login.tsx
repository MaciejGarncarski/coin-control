import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '@/features/auth/login/pages/login-page'

export const Route = createFileRoute('/_not_authenticated/auth/login')({
  component: LoginPage,
})
