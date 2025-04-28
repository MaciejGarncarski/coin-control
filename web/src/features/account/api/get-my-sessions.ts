import { mySessionSchema } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'

export const getMySessionsQueryOptions = queryOptions({
  queryKey: [AUTH_QUERY_KEYS.MY_SESSIONS],
  queryFn: async () => {
    const data = await fetcher({
      url: '/auth/my-sessions',
      method: 'GET',
      schema: z.array(mySessionSchema),
    })

    return data
  },
  refetchOnMount: true,
  gcTime: 5000,
  staleTime: 1000 * 60 * 5,
})

export const useMySessions = () => {
  return useQuery(getMySessionsQueryOptions)
}
