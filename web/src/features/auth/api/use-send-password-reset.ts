import { type ForgotPasswordEmailMutation } from '@shared/schemas'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetcher } from '@/lib/fetcher'

export const useSendPasswordResetLink = () => {
  return useMutation({
    mutationFn: async (mutationData: ForgotPasswordEmailMutation) => {
      const resposne = await fetcher({
        url: '/auth/password/forgot',
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
