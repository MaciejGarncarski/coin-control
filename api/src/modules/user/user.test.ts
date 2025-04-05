import type { AddEmailMutation } from '@shared/schemas'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'
import request from 'supertest'

import { buildApp } from '../../app.js'
import { db } from '../../lib/db.js'

const app = buildApp()

vi.mock('../../middlewares/authorize.js', () => ({
  authorize: (req: Request, _: Response, next: NextFunction) => {
    req.session.userId = '019601da-faff-76b7-ad12-ca98c8cffeb4'
    next()
  },
}))

describe('user.route.ts', async () => {
  await db.users.deleteMany()
  await db.users.create({
    data: {
      email: 'test@test.pl',
      id: '019601da-faff-76b7-ad12-ca98c8cffeb4',
      password_hash: 'xxxxx',
      user_emails: {
        create: {
          email: 'test@test.pl',
          email_id: '019601da-faff-76b7-ad12-ca98c8cffeb4',
          is_verified: true,
          is_primary: true,
        },
      },
    },
  })

  it('should return user emails', async () => {
    const response = await request(app).get('/user/emails')
    expect(response.status).toBe(status.OK)
  })

  it('should add user email', async () => {
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
})
