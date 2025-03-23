import { fetcher } from '@/lib/fetcher'
import { type ForgotPasswordEmailMutation } from '@shared/schemas'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSendPasswordResetLink = () => {
  return useMutation({
    mutationFn: async (mutationData: ForgotPasswordEmailMutation) => {
      const resposne = await fetcher({
        url: '/auth/forgot-password-link',
        method: 'POST',
        throwOnError: true,
        body: {
          email: mutationData.email,
        },
      })

      return resposne
    },
    onSuccess: () => {
      toast.success(
        'If the email address is valid you will receive reset password link.',
      )
    },
  })
}
