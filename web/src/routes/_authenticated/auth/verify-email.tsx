import { tokenSchema, z } from '@shared/schemas'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { VerifySecondaryEmailPage } from '@/features/auth/pages/verify-secondary-email'

const verifySecondaryEmailSchema = z.object({
  token: tokenSchema.nullable(),
  email: z.string().nullable(),
})

export const Route = createFileRoute('/_authenticated/auth/verify-email')({
  validateSearch: (search): z.infer<typeof verifySecondaryEmailSchema> => {
    const parsed = verifySecondaryEmailSchema.safeParse(search)

    if (!parsed.success) {
      return {
        email: null,
        token: null,
      }
    }

    return {
      email: parsed.data.email,
      token: parsed.data.token,
    }
  },
  loaderDeps: ({ search }) => {
    return search
  },
  loader: async ({ deps }) => {
    if (deps.token && deps.email) {
      return
    }

    throw redirect({
      to: '/',
    })
  },
  component: VerifySecondaryEmailPage,
})
