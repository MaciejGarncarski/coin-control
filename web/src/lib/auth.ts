import { userSchema } from '@shared/schemas'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useRouteContext, useRouter } from '@tanstack/react-router'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'
import type { QueryConfig } from '@/lib/react-query'

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

export const useUser = (props?: UseUserOptions) => {
  return useQuery({
    ...userQueryOptions,
    ...props?.queryConfig,
  })
}

export const useLogoutMutation = () => {
  const router = useRouter()
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
      authContext.logout()
      router.invalidate()
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.SESSION],
      })
    },
  })
}
