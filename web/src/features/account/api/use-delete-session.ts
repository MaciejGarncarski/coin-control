import { useMutation, useQueryClient } from '@tanstack/react-query'

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
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}
