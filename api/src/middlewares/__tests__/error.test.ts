import type { Request, Response } from 'express'
import status from 'http-status'

import { ApiError } from '../../utils/api-error.js'
import { ValidationError } from '../../utils/validation-error.js'
import { errorMiddleware } from '../error.js'

describe(' authorize middleware', () => {
  it('should pass if headers already sent', () => {
    const mockRequest = {} as Request

    const mockResponse = {
      headersSent: true,
      status: (code: number) => {
        return {
          json: vi.fn(),
        }
      },
    } as unknown as Response

    const mockNext = vi.fn()

    const error = new ApiError({
      message: 'Too many requests, please try again later.',
      statusCode: status.TOO_MANY_REQUESTS,
    })

    errorMiddleware(error, mockRequest, mockResponse, mockNext)
    expect(mockNext).toHaveBeenCalledTimes(1)
  })

  it('should send correct rate limit message', () => {
    const mockRequest = {} as Request

    const mockResponse = {
      status: (code: number) => {
        return {
          json: vi.fn(),
        }
      },
    } as unknown as Response

    const setStatusSpy = vi.spyOn(mockResponse, 'status')

    const mockNext = vi.fn()

    const error = new ApiError({
      message: 'Too many requests, please try again later.',
      statusCode: status.TOO_MANY_REQUESTS,
    })

    errorMiddleware(error, mockRequest, mockResponse, mockNext)
    expect(setStatusSpy).toHaveBeenCalledWith(status.TOO_MANY_REQUESTS)
  })

  it('should send correct rate limit message format', () => {
    const mockRequest = {
      statusCode: status.TOO_MANY_REQUESTS,
    } as Request

    const jsonMock = vi.fn()
    const mockResponse = {
      status: (code: number) => {
        return {
          json: jsonMock,
        }
      },
    } as unknown as Response

    const setStatusSpy = vi.spyOn(mockResponse, 'status')

    const mockNext = vi.fn()

    const error = new Error()
    errorMiddleware(error, mockRequest, mockResponse, mockNext)
    expect(setStatusSpy).toHaveBeenCalledWith(status.TOO_MANY_REQUESTS)
    expect(jsonMock).toHaveBeenCalledTimes(1)
  })

  it('should send correct validation error format', () => {
    const mockRequest = {} as Request

    const jsonMock = vi.fn()
    const mockResponse = {
      status: (code: number) => {
        return {
          json: jsonMock,
        }
      },
    } as unknown as Response

    const setStatusSpy = vi.spyOn(mockResponse, 'status')

    const mockNext = vi.fn()

    const error = new ValidationError({
      message: 'Username is invalid',
      paths: 'USERNAME',
    })

    errorMiddleware(error, mockRequest, mockResponse, mockNext)
    expect(setStatusSpy).toHaveBeenCalledWith(status.BAD_REQUEST)
    expect(jsonMock).toHaveBeenCalledTimes(1)
  })

  it('should send correct error format on implicit error', () => {
    const mockRequest = {} as Request

    const jsonMock = vi.fn()
    const mockResponse = {
      status: (code: number) => {
        return {
          json: jsonMock,
        }
      },
    } as unknown as Response

    const setStatusSpy = vi.spyOn(mockResponse, 'status')

    const mockNext = vi.fn()

    const error = new Error('error')

    errorMiddleware(error, mockRequest, mockResponse, mockNext)
    expect(setStatusSpy).toHaveBeenCalledWith(status.INTERNAL_SERVER_ERROR)
    expect(jsonMock).toHaveBeenCalledTimes(1)
  })
})
