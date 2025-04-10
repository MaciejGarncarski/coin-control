import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'

export const useDeleteAllSessions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      return fetcher({
        method: 'DELETE',
        url: '/auth/my-sessions',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.SESSION] })
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.MY_SESSIONS] })
    },
  })
}
