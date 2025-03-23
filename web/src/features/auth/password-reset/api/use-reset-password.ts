import { fetcher } from '@/lib/fetcher'
import type { ResetPasswordMutation } from '@shared/schemas'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (mutationData: ResetPasswordMutation) => {
      return fetcher({
        method: 'POST',
        url: '/auth/reset-password',
        throwOnError: true,
        body: {
          password: mutationData.password,
          confirmPassword: mutationData.confirmPassword,
          resetToken: mutationData.resetToken,
        },
      })
    },
    onSuccess: async () => {
      await navigate({
        to: '/auth/login',
        viewTransition: true,
      })

      toast.success('Success. You can log in with new password.')
    },
  })
}
