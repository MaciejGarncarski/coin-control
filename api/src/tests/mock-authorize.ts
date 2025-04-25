import { type NextFunction, type Request, type Response } from 'express'
import { vi } from 'vitest'

import { authorize } from '../middlewares/authorize.js'

export const mockAuthorize = () => {
  const mockReq = {
    session: {},
  } as unknown as Request
  const mockRes = {} as unknown as Response
  const mockNext = vi.fn() as NextFunction

  const setSessionId = (id: string) => {
    mockReq.session.id = id
  }

  const setUserId = (userId: string) => {
    mockReq.session.userId = userId
  }

  const mockImplementation = vi.fn(
    (req: Request, res: Response, next: NextFunction) => {
      try {
        authorize(req, res, next)
      } catch (error) {
        mockNext(error)
      }
    },
  )

  const mock = mockImplementation as unknown as TMockAuthorize
  mock.mockReq = mockReq
  mock.mockRes = mockRes
  mock.mockNext = mockNext
  mock.setSessionId = setSessionId
  mock.setUserId = setUserId

  return mock
}

type TMockAuthorize = {
  mockReq: Request
  mockRes: Response
  mockNext: NextFunction
  setSessionId: (id: string) => void
  setUserId: (userId: string) => void
}
