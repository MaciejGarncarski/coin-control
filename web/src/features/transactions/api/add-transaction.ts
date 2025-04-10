import type { AddTransactionMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
      await queryClient.invalidateQueries({
        queryKey: [TRANSACTIONS_QUERY_KEYS.TRANSACTIONS],
      })
    },
  })
}
