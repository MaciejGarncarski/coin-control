import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'
import request from 'supertest'

import { buildApp } from '../../app.js'
import { mockAuthorize } from '../../tests/mock-authorize.js'

const app = buildApp()

vi.mock('../../middlewares/authorize.js', () => ({
  authorize: (req: Request, _: Response, next: NextFunction) => {
    req.session.userId = '019601da-faff-76b7-ad12-ca98c8cffeb4'
    next()
  },
}))

describe('transaction.route.ts', async () => {
  describe('POST /transactions', () => {
    it('should fail on expense with positive amount', async () => {
      mockAuthorize()

      const body = {
        date: '2025-08-28T16:07:32.923Z',
        description: 'test api',
        category: 'housing',
        amount: 50,
      }

      const response = await request(app).post('/transactions').send(body)

      expect(response.status).toBe(status.BAD_REQUEST)
      expect(response.body.toastMessage).toEqual(
        'Invalid category and amount combination.',
      )
    })

    it('should fail on income with negative amount', async () => {
      mockAuthorize()

      const body = {
        date: '2025-08-28T16:07:32.923Z',
        description: 'test api',
        category: 'income',
        amount: -3050,
      }

      const response = await request(app).post('/transactions').send(body)

      expect(response.status).toBe(status.BAD_REQUEST)
      expect(response.body.toastMessage).toEqual(
        'Invalid category and amount combination.',
      )
    })
  })
})
