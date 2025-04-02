import status, { type HttpStatus } from 'http-status'

type Test = {
  message: string
  statusCode?: keyof HttpStatus
  toastMessage?: string
  additionalMessage?: string
}

export class HttpError extends Error {
  statusCode?: number
  toastMessage?: string
  additionalMessage?: string

  constructor(data: Test) {
    super(data.message)
    const statusCode = status[data.statusCode || 'INTERNAL_SERVER_ERROR']

    this.message = data.message
    this.statusCode = typeof statusCode === 'number' ? statusCode : 500
    this.toastMessage = data.toastMessage
    this.additionalMessage = data.additionalMessage
  }
}
