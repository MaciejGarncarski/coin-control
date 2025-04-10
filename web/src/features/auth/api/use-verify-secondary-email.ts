import type { VerifySecondaryEmailMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'

export function useVerifySecondaryEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VerifySecondaryEmailMutation) => {
      return fetcher({
        method: 'POST',
        url: '/user/verify-secondary-email',
        body: data,
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

      toast.success('Verified')
    },
  })
}
