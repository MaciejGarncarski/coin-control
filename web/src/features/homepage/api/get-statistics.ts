import { getStatisticsResponse } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { fetcher } from '@/lib/fetcher'

export const getStatisticsQueryOptions = queryOptions({
  queryKey: ['statistics'],
  queryFn: () => {
    return fetcher({
      throwOnError: true,
      schema: getStatisticsResponse,
      method: 'GET',
      url: '/statistics',
    })
  },
})

export const useStatistics = () => {
  return useQuery(getStatisticsQueryOptions)
}
