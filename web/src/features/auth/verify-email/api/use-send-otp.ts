import { userQueryOptions } from '@/lib/auth'
import { fetcher } from '@/lib/fetcher'
import { OTPResponeSchema } from '@shared/schemas'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSendOTP = () => {
  const user = useQuery(userQueryOptions)

  return useMutation({
    mutationKey: ['send-otp'],
    mutationFn: async () => {
      const resposne = await fetcher({
        url: '/auth/otp',
        method: 'POST',
        throwOnError: true,
        schema: OTPResponeSchema,
      })

      return resposne
    },
    onSuccess: () => {
      toast.success(`Code sent to ${user.data?.email || 'your email'}`)
    },
  })
}
