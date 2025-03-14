import { fetcher } from '@/lib/fetcher'
import { OTPResponeSchema } from '@shared/zod-schemas'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSendOTP = () => {
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
      toast.success('OTP sent to your email')
    },
  })
}
