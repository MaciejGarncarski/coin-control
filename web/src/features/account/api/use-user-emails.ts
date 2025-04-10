import { emailsResponseSchema } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

import { AUTH_QUERY_KEYS } from '@/constants/query-keys/auth'
import { fetcher } from '@/lib/fetcher'

export const getUserEmails = async () => {
  const response = await fetcher({
    method: 'GET',
    url: '/user/emails',
    schema: emailsResponseSchema,
  })

  return response
}

export const getUserEmailsQueryOptions = queryOptions({
  queryKey: [AUTH_QUERY_KEYS.MY_EMAILS],
  queryFn: getUserEmails,
})

export const useUserEmails = () => {
  return useQuery(getUserEmailsQueryOptions)
}
