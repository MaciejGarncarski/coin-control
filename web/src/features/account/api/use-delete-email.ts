import type { DeleteEmailMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetcher } from '@/lib/fetcher'

export const useDeleteEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: DeleteEmailMutation) => {
      return fetcher({
        throwOnError: true,
        method: 'POST',
        url: '/user/delete-email',
        body: body,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['emails'] })
      await queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
