import type { User } from '@shared/schemas'
import { http, HttpResponse } from 'msw'

import { env } from '@/config/env'

const getApiUrl = (url: string) => {
  return env.API_URL + url
}

export const handlers = [
  http.get(getApiUrl('/user'), () => {
    const userResponse: User = {
      avatarURL: '',
      email: 'some@email.com',
      id: 'id',
      isEmailVerified: true,
      name: 'TEST_USER',
    }

    return HttpResponse.json(userResponse)
  }),

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
]

export const unauthedHandlerOnce = http.get(
  getApiUrl('/auth/me'),
  () => {
    return HttpResponse.json(null)
  },
  { once: true },
)
