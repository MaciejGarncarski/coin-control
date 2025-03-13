import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'
import { userSchema } from '@shared/zod-schemas'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'

export const userQueryOptions = queryOptions({
  queryKey: [AUTH_QUERY_KEYS.SESSION],
  queryFn: async () => {
    const response = await fetcher({
      method: 'GET',
      url: '/auth/me',
      schema: userSchema,
    })

    if (!response) {
      return null
    }

    return response
  },
  staleTime: 1000 * 60,
  gcTime: 1000 * 60 * 2,
})

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const authContext = useRouteContext({
    from: '__root__',
    select: (context) => context.auth,
  })

  return useMutation({
    mutationFn: () =>
      fetcher({
        method: 'DELETE',
        url: '/auth/me',
        throwOnError: true,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      })
      authContext.logout()
    },
  })
}
