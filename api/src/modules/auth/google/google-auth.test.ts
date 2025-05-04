import request from 'supertest'

import { buildApp } from '../../../app.js'
import { env } from '../../../config/env.js'

describe('google-auth.test.ts', () => {
  it('should redirect to Google on /auth/google', async () => {
    const app = buildApp()
    const res = await request(app).get('/auth/google')
    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toMatch(/^https:\/\/accounts\.google\.com/)
  })

  it('should redirect to / on failed login', async () => {
    const app = buildApp()
    const res = await request(app).get('/auth/google/callback')
    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toBe(`${env.APP_ORIGIN}/auth/login?error=true`)
  })
})
