import status from 'http-status'

export type ValidationErrorData = {
  message: string
  paths: string
}

export class ValidationError extends Error {
  statusCode: number
  paths: string

  constructor(data: ValidationErrorData) {
    super(data.message)
    this.name = 'validation'
    this.cause = 'Validation'

    this.statusCode = status.BAD_REQUEST
    this.message = data.message
    this.paths = data.paths
  }
}
