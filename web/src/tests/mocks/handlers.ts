import type { User } from '@shared/schemas'
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
    return HttpResponse.json({
      totalBalance: 0,
      thisMonthIncome: 0,
      thisMonthSpending: 0,
      mostCommonCategoryThisMonth: 'Food', // or whatever your Enum/Type expects
      chartData: [],
    })
  }),

  http.get(new RegExp('/transactions/recent'), () => {
    return HttpResponse.json({
      data: [],
    })
  }),

  http.get(new RegExp('/statistics'), () => {
    return HttpResponse.json({
      categories: [],
      totalSpent: 0,
    })
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
