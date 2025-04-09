import type { Response } from 'express'

type ResponseData = {
  res: Response
  message: string
  statusCode: number
  toastMessage?: string
  additionalMessage?: string
}

export function createErrorResponse(responseData: ResponseData) {
  const json = {
    message: responseData.message,
    statusCode: responseData.statusCode,
    toastMessage: responseData.toastMessage,
    additionalMessage: responseData.additionalMessage,
  }

  return responseData.res.status(responseData.statusCode).json(json)
}
