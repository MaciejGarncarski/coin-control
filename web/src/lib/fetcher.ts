import { env } from '@/config/env'
import { createFetcherInstance } from '@maciekdev/fetcher'
import { apiErrorSchema } from '@shared/zod-schemas'

export const fetcher = createFetcherInstance({
  baseURL: env.API_URL,
  apiErrorSchema: apiErrorSchema,
})
