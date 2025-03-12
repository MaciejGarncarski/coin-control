import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'
import { loginMutationResponseSchema } from '@shared/zod-schemas/auth/login'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate, useRouteContext } from '@tanstack/react-router'

export const userQueryOptions = queryOptions({
  queryKey: [AUTH_QUERY_KEYS.SESSION],
  queryFn: async () => {
    const response = await fetcher({
      method: 'GET',
      url: '/auth/me',
      schema: loginMutationResponseSchema,
    })

    if (!response) {
      return null
    }

    return response?.data
  },
})

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const routerContext = useRouteContext({ from: '__root__' })
  const navigate = useNavigate()

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
      routerContext.auth.logout()
      await navigate({
        to: '/auth/login',
      })
    },
  })
}
