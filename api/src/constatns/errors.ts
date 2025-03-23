import type { ApiError } from '@shared/schemas'
import status from 'http-status'

export const INTERNAL_SERVER_ERROR: ApiError = {
  statusCode: status.INTERNAL_SERVER_ERROR,
  message: 'Internal server error.',
}
