import type { DeleteUserAccountMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetcher } from '@/lib/fetcher'

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteUserAccountMutation) => {
      return fetcher({
        method: 'POST',
        url: '/user/delete-account',
        body: data,
        throwOnError: true,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
