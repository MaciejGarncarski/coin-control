import { categoriesAnalyticsSchema } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { ANALYTICS_QUERY_KEYS } from '@/constants/query-keys/analytics'
import { fetcher } from '@/lib/fetcher'

export const getCategoriesAnalyticsQueryOptions = queryOptions({
  queryKey: [ANALYTICS_QUERY_KEYS.CATEGORIES],
  queryFn: async () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const data = await fetcher({
      method: 'GET',
      url: `/analytics/categories?tz=${userTimeZone}`,
      throwOnError: true,
      schema: categoriesAnalyticsSchema,
    })

    return data?.categories
  },
})

export const useCategoriesAnalytics = () => {
  return useQuery(getCategoriesAnalyticsQueryOptions)
}
