import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'
import { ApiError } from '@maciekdev/fetcher'
import { OTPResponeSchema, type OTPVerifyMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { toast } from 'sonner'

export const useVerifyOTP = () => {
  const queryClient = useQueryClient()
  const toastRef = useRef<string | number | null>(null)

  return useMutation({
    mutationKey: ['verify-otp'],
    mutationFn: async (mutationData: OTPVerifyMutation) => {
      const resposne = await fetcher({
        url: '/auth/verify-otp',
        method: 'POST',
        throwOnError: true,
        schema: OTPResponeSchema,
        body: {
          code: mutationData.code,
        },
      })

      return resposne
    },
    onMutate: () => {
      toastRef.current = toast.loading('Verifying your account...')
    },
    onError: (error) => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current)
      }

      if (error instanceof ApiError) {
        if (error.message === 'Invalid OTP code.') {
          toast.error('Invalid code.')
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.SESSION],
      })

      if (toastRef.current) {
        toast.dismiss(toastRef.current)
      }

      toastRef.current = toast.success('Success! Your account is now verified.')
    },
  })
}
