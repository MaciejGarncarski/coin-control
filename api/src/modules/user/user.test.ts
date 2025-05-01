import { db } from '@shared/database'
import type {
  AddEmailMutation,
  ResendEmailVerificationMutation,
} from '@shared/schemas'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'
import ms from 'ms'
import request from 'supertest'
import { v7 } from 'uuid'

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

describe('user.route.ts', async () => {
  it('GET /user/emails', async () => {
    const mock = mockAuthorize()
    mock.setSessionId('someSessionId')
    mock.setUserId(TEST_USER.id)

    const response = await request(app).get('/user/emails')
    expect(response.status).toBe(status.OK)
  })

  it('POST /user/emails', async () => {
    const mock = mockAuthorize()
    mock.setSessionId('someSessionId')
    mock.setUserId(TEST_USER.id)

    const email = 'newemail@test.pl'

    await db.user_emails.deleteMany({
      where: {
        email,
      },
    })

    const body: AddEmailMutation = {
      email,
    }

    const response = await request(app).post('/user/emails').send(body)
    expect(response.status).toBe(status.ACCEPTED)
  })

  const emailId = v7()

  describe('POST /user/resend-email-verification', () => {
    it('should resend verification email', async () => {
      const mock = mockAuthorize()
      mock.setSessionId('someSessionId')
      mock.setUserId(TEST_USER.id)

      await db.user_emails.create({
        data: {
          user_id: '019601da-faff-76b7-ad12-ca98c8cffeb4',
          email: 'new@email.com',
          email_id: emailId,
          is_verified: false,
          is_primary: false,
        },
      })

      const body: ResendEmailVerificationMutation = {
        email: 'new@email.com',
      }

      const response = await request(app)
        .post('/user/resend-email-verification')
        .send(body)
      expect(response.status).toBe(status.ACCEPTED)
    })

    it('should not resend verification email if sent earlier', async () => {
      const mock = mockAuthorize()
      mock.setSessionId('someSessionId')
      mock.setUserId(TEST_USER.id)

      const body: ResendEmailVerificationMutation = {
        email: 'new@email.com',
      }

      await db.email_verification.create({
        data: {
          email_id: emailId,
          user_id: '019601da-faff-76b7-ad12-ca98c8cffeb4',
          id: v7(),
          expires_at: new Date(Date.now() + ms('50 minutes')),
        },
      })

      const response = await request(app)
        .post('/user/resend-email-verification')
        .send(body)

      expect(response.status).toBe(status.BAD_REQUEST)
    })

    it('should return not found if no email found', async () => {
      const mock = mockAuthorize()
      mock.setSessionId('someSessionId')
      mock.setUserId(TEST_USER.id)

      const body: ResendEmailVerificationMutation = {
        email: 'notexisting@email.com',
      }

      const response = await request(app)
        .post('/user/resend-email-verification')
        .send(body)

      expect(response.status).toBe(status.BAD_REQUEST)
      expect(response.text).toMatch(/not found/i)
    })
  })
})
