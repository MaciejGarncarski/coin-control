import { mySessionSchema } from '@shared/schemas'
import { z } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { fetcher } from '@/lib/fetcher'

export const getMySessionsQueryOptions = queryOptions({
  queryKey: ['my-sessions'],
  queryFn: async () => {
    const data = await fetcher({
      url: '/auth/my-sessions',
      method: 'GET',
      schema: z.array(mySessionSchema),
    })

    return data
  },
  refetchOnMount: true,
})

export const useMySessions = () => {
  return useQuery(getMySessionsQueryOptions)
}
