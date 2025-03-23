import { env } from '@/config/env'
import {
  ApiError,
  createFetcherInstance,
  type CreateFetcherOptions,
} from '@maciekdev/fetcher'
import { apiErrorSchema } from '@shared/schemas'
import { toast } from 'sonner'

const fetcherConfig: CreateFetcherOptions = {
  baseURL: env.API_URL,
  apiErrorSchema: apiErrorSchema,
  onErrorThrown(err) {
    if (err instanceof ApiError) {
      if (err.toastMessage) {
        toast.error(err.toastMessage)
      }
    }
  },
}

export const fetcher = createFetcherInstance(fetcherConfig)
