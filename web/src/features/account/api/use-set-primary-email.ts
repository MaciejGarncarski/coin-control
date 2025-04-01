import type { SetPrimaryEmailMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetcher } from '@/lib/fetcher'

export const useSetPrimaryEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: SetPrimaryEmailMutation) => {
      return fetcher({
        throwOnError: true,
        method: 'POST',
        url: '/user/set-primary-email',
        body: body,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['emails'] })
      await queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
