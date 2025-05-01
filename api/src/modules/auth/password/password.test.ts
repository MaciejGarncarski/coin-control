import status from 'http-status'
import request from 'supertest'

import { buildApp } from '../../../app.js'
import { TEST_USER } from '../../../tests/setup.js'

describe('password.route.ts', () => {
  describe('POST /auth/password/forgot', () => {
    it('should success on invalid email', async () => {
      // so attacker does not know if email exists
      const app = buildApp()

      const response = await request(app).post('/auth/password/forgot').send({
        email: 'nonexistent@test.com',
      })

      expect(response.status).toBe(status.ACCEPTED)
    })

    it('should success on valid email', async () => {
      const app = buildApp()

      const response = await request(app).post('/auth/password/forgot').send({
        email: TEST_USER.email,
      })

      expect(response.status).toBe(status.ACCEPTED)
    })
  })
})
