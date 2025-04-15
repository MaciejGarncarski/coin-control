import type { AddTransactionMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { STATISTICS_QUERY_KEYS } from '@/constants/query-keys/statistics'
import { TRANSACTIONS_QUERY_KEYS } from '@/constants/query-keys/transactions'
import { fetcher } from '@/lib/fetcher'

export const useAddTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AddTransactionMutation) => {
      return fetcher({
        method: 'POST',
        url: '/transactions',
        throwOnError: true,
        body: data,
      })
    },
    onSuccess: async () => {
      toast.success('Added')
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEYS.TRANSACTIONS],
        }),
        queryClient.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEYS.RECENT],
        }),
        queryClient.invalidateQueries({
          queryKey: [STATISTICS_QUERY_KEYS.STATISTICS],
        }),
        queryClient.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEYS.OVERVIEW],
        }),
      ])
    },
  })
}
