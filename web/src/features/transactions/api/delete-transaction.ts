import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TRANSACTIONS_QUERY_KEYS } from '@/constants/query-keys/transactions'
import { fetcher } from '@/lib/fetcher'

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transactionId: string) => {
      return fetcher({
        method: 'DELETE',
        url: `/transactions/${transactionId}`,
      })
    },
    onSuccess: async () => {
      toast.success('deleted')

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEYS.TRANSACTIONS],
        }),
        queryClient.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEYS.RECENT],
        }),
        queryClient.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEYS.OVERVIEW],
        }),
      ])
    },
  })
}
