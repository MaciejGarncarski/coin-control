import {
  createFetcherInstance,
  type CreateFetcherOptions,
} from '@maciekdev/fetcher'
import { type ApiError } from '@shared/schemas'
import { toast } from 'sonner'

import { env } from '@/config/env'

const fetcherConfig: CreateFetcherOptions<ApiError> = {
  baseURL: env.API_URL,
  onErrorThrown(err) {
    if ('toastMessage' in err) {
      if (err.toastMessage) {
        toast.error(err.toastMessage)
      }
    }
  },
}

export const fetcher = createFetcherInstance(fetcherConfig)
