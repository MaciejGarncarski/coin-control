import { useMutation, useQueryClient } from '@tanstack/react-query'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ avatar }: { avatar: Blob }) => {
      const formData = new FormData()
      formData.append('avatar', avatar)

      return fetcher({
        throwOnError: true,
        method: 'POST',
        url: '/avatar/upload',
        body: formData,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [AUTH_QUERY_KEYS.SESSION],
      })
    },
  })
}
