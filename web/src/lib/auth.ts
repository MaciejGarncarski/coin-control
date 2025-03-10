import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'
import { loginMutationResponseSchema } from '@shared/zod-schemas/auth/login'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export const userQueryOptions = queryOptions({
  queryKey: [AUTH_QUERY_KEYS.SESSION],
  queryFn: async () => {
    const response = await fetcher({
      method: 'GET',
      url: '/auth/me',
      schema: loginMutationResponseSchema,
    })

    if (response.status === 'ok') {
      return response.data
    }

    return null
  },
})

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    onSuccess: () => {
      queryClient.setQueryData([AUTH_QUERY_KEYS.SESSION], () => null)
      navigate({
        to: '/',
      })
    },
    mutationFn: async () => {
      const response = await fetcher({
        method: 'DELETE',
        url: '/auth/me',
        schema: loginMutationResponseSchema,
      })

      if (response.status === 'ok') {
        return response.data
      }

      return null
    },
  })
}
