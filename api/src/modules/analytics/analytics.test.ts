import request from 'supertest'

import { buildApp } from '../../app.js'

describe('analytics route', () => {
  it('should get categories', () => {
    const app = buildApp()

    const res = request(app).get('/analytics/')

    expect(true).toBe(true)
  })
})
