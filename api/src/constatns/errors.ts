import type { ApiError } from '@shared/zod-schemas'
import status from 'http-status'

export const INTERNAL_SERVER_ERROR: ApiError = {
  statusCode: status.INTERNAL_SERVER_ERROR,
  message: 'Internal server error.',
}
