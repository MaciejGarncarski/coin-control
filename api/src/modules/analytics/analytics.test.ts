import { db } from '@shared/database'
import type { NextFunction, Request, Response } from 'express'
import status from 'http-status'
import ms from 'ms'
import request from 'supertest'
import { v7 } from 'uuid'

import { buildApp } from '../../app.js'
import { TEST_USER } from '../../tests/setup.js'

vi.mock('../../middlewares/authorize.js', () => ({
  authorize: (req: Request, _: Response, next: NextFunction) => {
    req.session.userId = TEST_USER.id
    next()
  },
}))

describe('analytics route', () => {
  it('GET /analytics/categories', async () => {
    const app = buildApp()

    await db.transactions.deleteMany({
      where: {
        user_id: TEST_USER.id,
      },
    })

    await db.transactions.createMany({
      data: [
        {
          amount: -10,
          user_id: TEST_USER.id,
          description: 'Groceries',
          transaction_date: new Date(Date.now() - ms('10 days')),
          category: 'foodAndDrink',
          transaction_id: v7(),
        },
        {
          amount: -10,
          user_id: TEST_USER.id,
          description: 'Test',
          transaction_date: new Date(Date.now() - ms('10 days')),
          category: 'foodAndDrink',
          transaction_id: v7(),
        },
        {
          amount: -10,
          user_id: TEST_USER.id,
          description: 'Test1',
          transaction_date: new Date(Date.now() - ms('10 days')),
          category: 'transportation',
          transaction_id: v7(),
        },
        {
          amount: -10,
          user_id: TEST_USER.id,
          description: 'Test2',
          transaction_date: new Date(Date.now() - ms('10 days')),
          category: 'utilities',
          transaction_id: v7(),
        },
        {
          amount: -10,
          user_id: TEST_USER.id,
          description: 'Test3',
          transaction_date: new Date(Date.now() - ms('10 days')),
          category: 'foodAndDrink',
          transaction_id: v7(),
        },
        {
          amount: -10,
          user_id: TEST_USER.id,
          description: 'Test4',
          transaction_date: new Date(Date.now() - ms('10 days')),
          category: 'housing',
          transaction_id: v7(),
        },
        {
          amount: -10,
          user_id: TEST_USER.id,
          description: 'Test5',
          transaction_date: new Date(Date.now() - ms('10 days')),
          category: 'foodAndDrink',
          transaction_id: v7(),
        },
      ],
    })

    const res = await request(app).get('/analytics/categories')

    expect(res.status).toBe(status.OK)
    expect(res.body).toEqual({
      categories: [
        { category: 'foodAndDrink', value: 4 },
        { category: 'housing', value: 1 },
        { category: 'transportation', value: 1 },
        { category: 'utilities', value: 1 },
      ],
    })
  })

  it('GET /analytics/largest-income-expense', async () => {
    const app = buildApp()

    await db.transactions.deleteMany({
      where: {
        user_id: TEST_USER.id,
      },
    })

    await db.transactions.createMany({
      data: [
        {
          amount: -10,
          user_id: TEST_USER.id,
          description: 'Groceries',
          transaction_date: new Date(Date.now() - ms('10 days')),
          category: 'foodAndDrink',
          transaction_id: v7(),
        },
        {
          amount: 10,
          user_id: TEST_USER.id,
          description: 'Test',
          transaction_date: new Date(Date.now() - ms('10 days')),
          category: 'foodAndDrink',
          transaction_id: v7(),
        },
      ],
    })

    const res = await request(app).get('/analytics/largest-income-expense')

    expect(res.status).toBe(status.OK)
    expect(res.body).toEqual({
      expense: {
        value: -10,
        description: 'Groceries',
      },
      income: {
        value: 10,
        description: 'Test',
      },
    })
  })
})
