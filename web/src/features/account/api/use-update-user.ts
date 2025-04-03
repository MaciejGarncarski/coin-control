import type { UserFullNameMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { fetcher } from '@/lib/fetcher'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserFullNameMutation) => {
      return fetcher({
        method: 'PATCH',
        url: '/user',
        body: data,
        throwOnError: true,
      })
    },
    onSuccess: async () => {
      toast.success('Saved')
      await queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
