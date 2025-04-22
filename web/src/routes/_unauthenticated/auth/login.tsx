import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { LoginPage } from '@/features/auth/pages/login-page'

export const Route = createFileRoute('/_unauthenticated/auth/login')({
  validateSearch: (search) => {
    const parsed = z
      .object({
        error: z.boolean().nullable().optional(),
      })
      .safeParse(search)

    return {
      error: parsed.data?.error,
    }
  },

  component: LoginPage,
})
