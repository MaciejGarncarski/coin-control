import { getStatisticsResponse } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { STATISTICS_QUERY_KEYS } from '@/constants/query-keys/statistics'
import { fetcher } from '@/lib/fetcher'

export const getStatisticsQueryOptions = queryOptions({
  queryKey: [STATISTICS_QUERY_KEYS.STATISTICS],
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
