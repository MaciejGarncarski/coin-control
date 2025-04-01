import type { VerifySecondaryEmailMutation } from '@shared/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { fetcher } from '@/lib/fetcher'

export function useVerifySecondaryEmail() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

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
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      await queryClient.invalidateQueries({ queryKey: ['emails'] })

      navigate({
        to: '/account',
      })

      toast.success('Verified')
    },
  })
}
