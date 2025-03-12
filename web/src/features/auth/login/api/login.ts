import { fetcher } from '@/lib/fetcher'
import {
  loginMutationResponseSchema,
  type LoginMutation,
} from '@shared/zod-schemas/auth/login'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { toast } from 'sonner'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  const authContext = useRouteContext({
    from: '__root__',
    select: (context) => context.auth,
  })

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

      return response?.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      })
      authContext.login()
      toast.success('Logged in successfully')
    },
  })
}
