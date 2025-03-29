import { useMutation, useQueryClient } from '@tanstack/react-query'

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
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['my-sessions'] })
    },
  })
}
