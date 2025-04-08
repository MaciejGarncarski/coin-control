import { readdir } from 'node:fs/promises'
import path from 'node:path'

import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'
import request from 'supertest'

import { buildApp } from '../../app.js'

const app = buildApp()

vi.mock('../../middlewares/authorize.js', () => ({
  authorize: (req: Request, _: Response, next: NextFunction) => {
    req.session.userId = '019601da-faff-76b7-ad12-ca98c8cffeb4'
    next()
  },
}))

describe('avatar.route.ts', async () => {
  it('should not upload if no file provided', async () => {
    const response = await request(app).post('/avatar/upload')

    expect(response.status).toBe(status.BAD_REQUEST)
    expect(response.text).toMatch(/no image provided/i)
  })

  it('should upload avatar', async () => {
    const response = await request(app)
      .post('/avatar/upload')
      .attach('avatar', path.resolve('./src/tests/test-avatar.jpg'))

    const avatars = await readdir('avatar-upload')

    expect(avatars.includes(response.body.filename)).toBe(true)
    expect(response.status).toBe(status.OK)
  })
})
