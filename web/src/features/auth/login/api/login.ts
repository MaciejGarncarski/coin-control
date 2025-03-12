import { fetcher } from '@/lib/fetcher'
import {
  loginMutationResponseSchema,
  type LoginMutation,
} from '@shared/zod-schemas/auth/login'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouteContext, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const routerContext = useRouteContext({ from: '__root__' })
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (mutationData: LoginMutation) => {
      const response = await fetcher({
        method: 'POST',
        url: '/auth/login',
        schema: loginMutationResponseSchema,
        body: {
          email: mutationData.email,
          password: mutationData.password,
        },
      })

      return response?.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      })
      routerContext.auth.login()
      await router.invalidate()

      await navigate({
        to: '/',
      })

      toast.success('Logged in successfully')
    },
  })
}
