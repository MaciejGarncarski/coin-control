import {
  EmailVerificationResponeSchema,
  type EmailVerificationVerifyMutation,
} from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { toast } from 'sonner'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'

export const useVerifyOTP = () => {
  const queryClient = useQueryClient()
  const toastRef = useRef<string | number | null>(null)

  return useMutation({
    mutationKey: ['verify-otp'],
    mutationFn: async (mutationData: EmailVerificationVerifyMutation) => {
      const resposne = await fetcher({
        url: '/auth/verify-otp',
        method: 'POST',
        throwOnError: true,
        schema: EmailVerificationResponeSchema,
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

      if (error.formMessage) {
        toast.error(error.formMessage)
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
