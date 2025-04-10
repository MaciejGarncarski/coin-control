import type { SetPrimaryEmailMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
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
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.MY_EMAILS],
      })
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.SESSION],
      })
    },
  })
}
