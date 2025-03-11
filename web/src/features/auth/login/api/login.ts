import { fetcher } from '@/lib/fetcher'
import {
  loginMutationResponseSchema,
  type LoginMutation,
} from '@shared/zod-schemas/auth/login'

import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const useLoginMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (mutationData: LoginMutation) => {
      const response = await fetcher({
        method: 'POST',
        url: '/auth/login',
        schema: loginMutationResponseSchema,
        body: {
          email: mutationData.email,
          password: mutationData.password,
        },
      })

      return response.data
    },
    onSuccess: async () => {
      toast.success('Logged in successfully')
      await navigate({
        from: '/auth/login',
        to: '/',
      })
    },
  })
}
