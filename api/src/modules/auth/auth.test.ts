import { db } from '@shared/database'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'
import request from 'supertest'

import { buildApp } from '../../app.js'
import { mockAuthorize } from '../../tests/mock-authorize.js'
import { TEST_USER } from '../../tests/setup.js'

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

  describe('POST /auth/register', () => {
    it('should register user', async () => {
      mockAuthorize()

      await db.users.deleteMany({
        where: {
          email: 'newAccount@test.com',
        },
      })

      const body = {
        email: 'newAccount@test.com',
        fullName: 'New User',
        password: 'password',
        confirmPassword: 'password',
      }

      const response = await request(app).post('/auth/register').send(body)

      expect(response.status).toBe(status.ACCEPTED)
      expect(response.body).toHaveProperty('email')
      expect(response.body).toHaveProperty('name')
    })
  })

  it('should return error on user already existing', async () => {
    mockAuthorize()

    const body = {
      email: TEST_USER.email,
      fullName: 'New User',
      password: 'password',
      confirmPassword: 'password',
    }

    const response = await request(app).post('/auth/register').send(body)

    expect(response.status).toBe(status.CONFLICT)
    expect(response.body).toHaveProperty('message')
  })
})
