import { toast } from 'sonner'
import type { ApiError as TApiError } from '@shared/zod-schemas'

export class ApiError extends Error {
  message: string
  statusCode: number | null
  toastMessage?: string
  additionalMessage?: string

  constructor(data: TApiError) {
    super(data.message)
    this.message = data.message
    this.statusCode = data.statusCode || null
    this.toastMessage = data.toastMessage
    this.additionalMessage = data.additionalMessage

    if (this.toastMessage) {
      toast.error(data.toastMessage)
    }
  }
}
