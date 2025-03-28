import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '@/features/auth/pages/login-page'

export const Route = createFileRoute('/_unauthenticated/auth/login')({
  component: LoginPage,
})
