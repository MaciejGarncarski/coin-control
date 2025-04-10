import type { AddEmailMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
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
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.SESSION],
      })
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.MY_EMAILS],
      })
    },
  })
}
