import type { EditTransactionMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TRANSACTIONS_QUERY_KEYS } from '@/constants/query-keys/transactions'
import { fetcher } from '@/lib/fetcher'

export const useEditTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      data: EditTransactionMutation & { transactionId: string },
    ) => {
      return fetcher({
        method: 'PATCH',
        url: `/transactions/${data.transactionId}`,
        throwOnError: true,
        body: data,
      })
    },
    onSuccess: async () => {
      toast.success('Edited')
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
