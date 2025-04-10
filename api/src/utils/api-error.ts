type ErrorData = {
  message: string
  statusCode: number
  toastMessage?: string
  additionalMessage?: string
  formMessage?: string
}

export class ApiError extends Error {
  statusCode?: number
  toastMessage?: string
  additionalMessage?: string
  formMessage?: string

  constructor(data: ErrorData) {
    super(data.message)
    this.name = 'api'
    this.cause = 'API'

    this.message = data.message
    this.statusCode = data.statusCode
    this.toastMessage = data.toastMessage
    this.additionalMessage = data.additionalMessage
    this.formMessage = data.formMessage
  }
}
