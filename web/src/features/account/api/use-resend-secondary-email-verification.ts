import { type RsendEmailVerificationMutation } from '@shared/schemas'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { userQueryOptions } from '@/lib/auth'
import { fetcher } from '@/lib/fetcher'

export const useResendSecondaryEmailVerification = () => {
  const user = useQuery(userQueryOptions)

  return useMutation({
    mutationFn: async (data: RsendEmailVerificationMutation) => {
      const resposne = await fetcher({
        url: '/user/resend-email-verification',
        method: 'POST',
        throwOnError: true,
        body: data,
      })

      return resposne
    },
    onSuccess: () => {
      toast.success(`Code sent to ${user.data?.email || 'your email'}`)
    },
  })
}
