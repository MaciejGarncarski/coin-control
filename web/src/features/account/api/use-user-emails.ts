import { emailsResponseSchema } from '@shared/schemas'
import { queryOptions, useQuery } from '@tanstack/react-query'

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
  queryKey: ['emails'],
  queryFn: getUserEmails,
})

export const useUserEmails = () => {
  return useQuery(getUserEmailsQueryOptions)
}
