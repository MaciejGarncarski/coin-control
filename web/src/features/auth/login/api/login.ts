import { type LoginMutation, userSchema } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { toast } from 'sonner'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'

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
        throwOnError: true,
        schema: userSchema,
        body: {
          email: mutationData.email,
          password: mutationData.password,
        },
      })

      return response
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.SESSION],
      })

      authContext.login()
      toast.success('Logged in successfully')
    },
  })
}
