import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'

export const useDeleteOneSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionID: string) => {
      return fetcher({
        method: 'DELETE',
        url: `/auth/my-sessions/${sessionID}`,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.MY_SESSIONS],
      })
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.SESSION],
      })
    },
  })
}
