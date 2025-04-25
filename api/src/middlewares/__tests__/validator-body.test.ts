import type { Request, Response } from 'express'
import { z } from 'zod'

import { validateBody } from '../validator-body.js'

describe('body validator', () => {
  it('should pass when valid input provided', () => {
    const input = {
      someUserData: 'test test',
    }

    const testSchema = z.object({
      someUserData: z.string(),
    })

    const mockRequest = { body: input } as Request
    const mockResponse = {} as Response
    const mockNext = vi.fn()

    validateBody(testSchema)(mockRequest, mockResponse, mockNext)
    expect(mockNext).toHaveBeenCalledTimes(1)
  })

  it('should throw error when invalid input passed', () => {
    const input = {
      someUserData: {
        imInvalid: 'imInvalid',
      },
    }

    const testSchema = z.object({
      someUserData: z.string(),
    })

    const mockRequest = { body: input } as Request
    const mockResponse = {} as Response
    const mockNext = vi.fn()

    expect(() =>
      validateBody(testSchema)(mockRequest, mockResponse, mockNext),
    ).toThrowError(
      expect.objectContaining({
        message: `Body validation error`,
      }),
    )
    expect(mockNext).toHaveBeenCalledTimes(0)
  })

  it('should throw error when no input passed', () => {
    const testSchema = z.object({
      someUserData: z.string(),
    })

    const mockRequest = {} as Request
    const mockResponse = {} as Response
    const mockNext = vi.fn()

    expect(() =>
      validateBody(testSchema)(mockRequest, mockResponse, mockNext),
    ).toThrowError(
      expect.objectContaining({
        message: `Body validation error`,
      }),
    )
    expect(mockNext).toHaveBeenCalledTimes(0)
  })
})
