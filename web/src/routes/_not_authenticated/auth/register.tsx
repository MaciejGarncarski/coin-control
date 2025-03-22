import { createFileRoute } from '@tanstack/react-router'

import { RegisterPage } from '@/features/auth/register/pages/register-page'

export const Route = createFileRoute('/_not_authenticated/auth/register')({
  component: RegisterPage,
})
