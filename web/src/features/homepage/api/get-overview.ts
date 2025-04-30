import { type DayName, getTransactionOverviewSchema } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { getWeek } from 'date-fns'

import { TRANSACTIONS_QUERY_KEYS } from '@/constants/query-keys/transactions'
import { fetcher } from '@/lib/fetcher'

export const overviewTransactionsQueryOptions = queryOptions({
  queryKey: [TRANSACTIONS_QUERY_KEYS.OVERVIEW],
  queryFn: async () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const transactionData = await fetcher({
      method: 'GET',
      url: `/transactions/overview?tz=${userTimeZone}&currDate=${new Date()}`,
      throwOnError: true,
      schema: getTransactionOverviewSchema,
    })

    const weekNumber = getWeek(new Date())

    if (transactionData) {
      const transactionsGroupedByDay = transactionData.data.reduce(
        (result, element) => {
          const weekNumberOfTransaction = getWeek(
            new Date(element.transactionDate),
          )

          if (weekNumberOfTransaction !== weekNumber) {
            return result
          }

          const dayName = new Date(element.transactionDate).toLocaleDateString(
            'en-GB',
            {
              weekday: 'long',
            },
          ) as DayName

          const prevVal = result[dayName]

          return {
            ...result,
            [dayName]: prevVal + 1,
          }
        },
        {
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
          Sunday: 0,
        } as Record<DayName, number>,
      )

      return Object.entries(transactionsGroupedByDay).map(([key, val]) => {
        return { day: key as DayName, transactions: val }
      })
    }

    return null
  },
})

export const useTransactionsOverview = () => {
  return useQuery(overviewTransactionsQueryOptions)
}
