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
        {
          status: 400,
        },
      )
    },
  ),
]

export const unauthedHandlerOnce = http.get(
  getApiUrl('/auth/me'),
  () => {
    return HttpResponse.json(null)
  },
  { once: false },
)
