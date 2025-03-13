import type { ApiError as TApiError } from '@shared/zod-schemas'

export class ApiError extends Error {
  statusCode?: number
  toastMessage?: string
  additionalMessage?: string

  constructor(data: TApiError) {
    super(data.message)
    this.message = data.message
    this.statusCode = data.statusCode
    this.toastMessage = data.toastMessage
    this.additionalMessage = data.additionalMessage
  }
}
