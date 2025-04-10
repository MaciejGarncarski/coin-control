import { type RegisterMutation, userSchema } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { toast } from 'sonner'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'

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
        schema: userSchema,
        body: {
          email: mutationData.email,
          fullName: mutationData.fullName,
          password: mutationData.password,
          confirmPassword: mutationData.confirmPassword,
        },
      })

      return response
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.SESSION],
      })
      authContext.login()
      toast.success('Register completed.')
    },
  })
}
