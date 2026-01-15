import type {
  GetRecentTransactions,
  GetStatistics,
  GetTransactionOverview,
  User,
} from '@shared/schemas'
import { http, HttpResponse } from 'msw'

import { env } from '@/config/env'

const getApiUrl = (url: string) => {
  return env.API_URL + url
}

export const handlers = [
  http.get(getApiUrl('/auth/me'), () => {
    const userResponse: User = {
      avatarURL: '',
      email: 'some@email.com',
      id: 'id',
      isEmailVerified: true,
      name: 'TEST_USER',
    }
    return HttpResponse.json(userResponse)
  }),

  http.post<object, { email: string; password: string }>(
    getApiUrl('/auth/login'),
    async ({ request }) => {
      const body = await request.json()
      if (body?.email === 'some@email.com') {
        const userResponse: User = {
          avatarURL: '',
          email: 'some@email.com',
          id: 'id',
          isEmailVerified: true,
          name: 'TEST_USER',
        }
        return HttpResponse.json(userResponse, { status: 200 })
      }
      return HttpResponse.json(
        {
          message: 'User not found.',
          formMessage: 'User not found.',
          statusCode: 400,
        },
        { status: 400 },
      )
    },
  ),

  http.get(new RegExp('/transactions/overview'), () => {
    const data: GetTransactionOverview = {
      data: [
        { transactionDate: new Date().toISOString(), transactionId: 'tx1' },
      ],
    }

    return HttpResponse.json(data)
  }),

  http.get(new RegExp('/transactions/recent'), () => {
    const recentTransactionsData: GetRecentTransactions = {
      recentTransactions: [
        {
          transactionId: 'tx1',
          amount: 20,
          category: 'foodAndDrink',
          date: new Date(),
          description: 'Lunch',
        },
      ],
      transactionCountThisMonth: 1,
    }

    return HttpResponse.json(recentTransactionsData)
  }),

  http.get(new RegExp('/statistics'), () => {
    const stats: GetStatistics = {
      totalBalance: { changeFromLastMonth: 0, value: 0 },
      thisMonthIncome: { changeFromLastMonth: 0, value: 0 },
      thisMonthSpending: { changeFromLastMonth: 0, value: 0 },
      mostCommonCategoryThisMonth: 'foodAndDrink',
    }

    return HttpResponse.json(stats)
  }),

  http.get(new RegExp('/user/emails'), () => {
    return HttpResponse.json([
      { email: 'some@email.com', isPrimary: true, isVerified: true },
    ])
  }),
]

export const unauthedHandlerOnce = http.get(
  getApiUrl('/auth/me'),
  () => HttpResponse.json(null),
  { once: false },
)
