import { fetcher } from '@/lib/fetcher'
import {
  loginMutationResponseSchema,
  type RegisterMutation,
} from '@shared/zod-schemas'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { toast } from 'sonner'

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()
  const authContext = useRouteContext({
    from: '__root__',
    select: (context) => context.auth,
  })

  return useMutation({
    mutationFn: async (mutationData: RegisterMutation) => {
      const response = await fetcher({
        method: 'POST',
        url: '/auth/register',
        throwOnError: true,
        schema: loginMutationResponseSchema,
        body: {
          email: mutationData.email,
          fullName: mutationData.fullName,
          password: mutationData.password,
          confirmPassword: mutationData.confirmPassword,
        },
      })

      return response?.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      })
      authContext.login()
      toast.success('Register completed.')
    },
  })
}
