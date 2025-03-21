import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'
import type { QueryConfig } from '@/lib/react-query'
import { userSchema } from '@shared/zod-schemas'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'

export const getUser = async () => {
  const response = await fetcher({
    method: 'GET',
    url: '/auth/me',
    schema: userSchema,
  })

  return response
}

export const userQueryOptions = queryOptions({
  queryKey: [AUTH_QUERY_KEYS.SESSION],
  refetchOnWindowFocus: true,
  queryFn: getUser,
})

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof getUser>
}

export const useUser = ({ queryConfig }: UseUserOptions) => {
  return useQuery({
    ...userQueryOptions,
    ...queryConfig,
  })
}

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
