import type { Request, Response } from 'express'
import { z } from 'zod'

import { validateParams } from '../validator-params.js'

describe('params validator', () => {
  it('should pass on valid input provided', () => {
    const input = {
      someUserData: 'test test',
    }

    const testSchema = z.object({
      someUserData: z.string(),
    })

    const mockRequest = { params: input } as unknown as Request
    const mockResponse = {} as Response
    const mockNext = vi.fn()

    validateParams(testSchema)(mockRequest, mockResponse, mockNext)
    expect(mockNext).toHaveBeenCalledTimes(1)
  })

  it('should throw error on invalid input passed', () => {
    const input = {
      someUserData: {
        imInvalid: 'imInvalid',
      },
    }

    const testSchema = z.object({
      someUserData: z.string(),
    })

    const mockRequest = { params: input } as unknown as Request
    const mockResponse = {} as Response
    const mockNext = vi.fn()

    expect(() =>
      validateParams(testSchema)(mockRequest, mockResponse, mockNext),
    ).toThrowError(
      expect.objectContaining({
        message: `Query params validation error`,
      }),
    )
    expect(mockNext).toHaveBeenCalledTimes(0)
  })

  it('should throw error on no input passed', () => {
    const input = {
      someUserData: {
        imInvalid: 'imInvalid',
      },
    }

    const testSchema = z.object({
      someUserData: z.string(),
    })

    const mockRequest = {} as Request
    const mockResponse = {} as Response
    const mockNext = vi.fn()

    expect(() =>
      validateParams(testSchema)(mockRequest, mockResponse, mockNext),
    ).toThrowError(
      expect.objectContaining({
        message: `Query params validation error`,
      }),
    )
    expect(mockNext).toHaveBeenCalledTimes(0)
  })
})
