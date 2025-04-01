import { EmailVerificationResponeSchema } from '@shared/schemas'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { userQueryOptions } from '@/lib/auth'
import { fetcher } from '@/lib/fetcher'

export const useSendEmailVerification = () => {
  const user = useQuery(userQueryOptions)

  return useMutation({
    mutationKey: ['send-email-verification'],
    mutationFn: async () => {
      const resposne = await fetcher({
        url: '/auth/email-verification',
        method: 'POST',
        throwOnError: true,
        schema: EmailVerificationResponeSchema,
      })

      return resposne
    },
    onSuccess: () => {
      toast.success(`Code sent to ${user.data?.email || 'your email'}`)
    },
  })
}
