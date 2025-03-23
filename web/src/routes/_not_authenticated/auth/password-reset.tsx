import { createFileRoute, redirect } from '@tanstack/react-router'
import { resetPasswordCodeSchema, z } from '@shared/schemas'
import { PasswordResetPage } from '@/features/auth/password-reset/pages/password-reset-page'

const resetPasswordSearchSchema = z.object({
  reset_token: resetPasswordCodeSchema.nullable(),
})

export const Route = createFileRoute('/_not_authenticated/auth/password-reset')(
  {
    component: PasswordResetPage,
    validateSearch: (search): z.infer<typeof resetPasswordSearchSchema> => {
      const parsed = resetPasswordSearchSchema.safeParse(search)

      if (!parsed.success) {
        return {
          reset_token: null,
        }
      }

      return {
        reset_token: parsed.data.reset_token,
      }
    },
    loaderDeps: ({ search }) => {
      return search
    },
    loader: async ({ deps }) => {
      if (deps.reset_token) {
        return
      }

      throw redirect({
        to: '/auth/forgot-password',
        viewTransition: true,
      })
    },
  },
)
