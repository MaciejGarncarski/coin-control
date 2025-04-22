import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { ANALYTICS_QUERY_KEYS } from '@/constants/query-keys/analytics'
import { STATISTICS_QUERY_KEYS } from '@/constants/query-keys/statistics'
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
          queryKey: [STATISTICS_QUERY_KEYS.STATISTICS],
        }),
        queryClient.invalidateQueries({
          queryKey: [TRANSACTIONS_QUERY_KEYS.OVERVIEW],
        }),
        queryClient.invalidateQueries({
          queryKey: [ANALYTICS_QUERY_KEYS.CATEGORIES],
        }),
        queryClient.invalidateQueries({
          queryKey: [ANALYTICS_QUERY_KEYS.LARGEST_INCOME_EXPENSE],
        }),
        queryClient.invalidateQueries({
          queryKey: [ANALYTICS_QUERY_KEYS.TRANSACTIONS_BY_MONTH],
        }),
      ])
    },
  })
}
