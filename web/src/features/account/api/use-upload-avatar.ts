import { useMutation, useQueryClient } from '@tanstack/react-query'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
