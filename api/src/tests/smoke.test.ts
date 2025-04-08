import status from 'http-status'
import request from 'supertest'

import { buildApp } from '../app.js'

const app = buildApp()

describe('Server startup', () => {
  it('should respond to a basic not found request', async () => {
    const response = await request(app).get('/non-existent-route')
    expect(response.statusCode).toBe(status.NOT_FOUND)
    expect(response.text).toMatch(/route not found/i)
  })
})
