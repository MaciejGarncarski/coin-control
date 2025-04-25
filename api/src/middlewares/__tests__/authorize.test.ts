import type { Request, Response } from 'express'

import { TEST_USER } from '../../tests/setup.js'
import { authorize } from '../authorize.js'

describe(' authorize middleware', () => {
  it('should pass if session data exists', () => {
    const mockRequest = {
      session: {
        id: 'someSessionId',
        userId: TEST_USER.id,
      },
    } as Request

    const mockResponse = {} as Response
    const mockNext = vi.fn()

    authorize(mockRequest, mockResponse, mockNext)
    expect(mockNext).toHaveBeenCalledTimes(1)
  })

  it('should fail if no sessionId provided', () => {
    vi.resetAllMocks()

    const mockRequest = {
      session: {
        id: null,
        userId: TEST_USER.id,
      },
    } as unknown as Request

    const mockResponse = {} as Response
    const mockNext = vi.fn()

    expect(() => authorize(mockRequest, mockResponse, mockNext)).toThrowError(
      expect.objectContaining({
        message: 'Unauthorized.',
      }),
    )
    expect(mockNext).toHaveBeenCalledTimes(0)
  })

  it('should fail if no userId provided', () => {
    vi.resetAllMocks()

    const mockRequest = {
      session: {
        id: 'someSessionId',
        userId: null,
      },
    } as unknown as Request

    const mockResponse = {} as Response
    const mockNext = vi.fn()

    expect(() => authorize(mockRequest, mockResponse, mockNext)).toThrowError(
      expect.objectContaining({
        message: 'Unauthorized.',
      }),
    )
    expect(mockNext).toHaveBeenCalledTimes(0)
  })
})
