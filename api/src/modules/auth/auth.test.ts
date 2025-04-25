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

describe('auth.route.ts', async () => {
  describe('/auth/login', () => {
    it('should login user', async () => {
      mockAuthorize()

      const body = {
        email: 'test@test.pl',
        password: 'test',
      }

      const response = await request(app).post('/auth/login').send(body)

      expect(response.status).toBe(status.OK)
      expect(response.body).toHaveProperty('email')
      expect(response.body).toHaveProperty('name')
    })

    it('should error on invalid credentials', async () => {
      mockAuthorize()

      const body = {
        email: 'invalid@test.pl',
        password: 'invalidpass',
      }

      const response = await request(app).post('/auth/login').send(body)

      expect(response.status).toBe(status.BAD_REQUEST)
      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('statusCode')
    })
  })
})
