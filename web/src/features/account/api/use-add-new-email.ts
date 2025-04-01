import type { AddEmailMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetcher } from '@/lib/fetcher'

export const useAddNewEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mutationData: AddEmailMutation) => {
      return fetcher({
        method: 'POST',
        url: '/user/emails',
        body: mutationData,
        throwOnError: true,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      await queryClient.invalidateQueries({ queryKey: ['emails'] })
    },
  })
}
