import type { Request, Response } from 'express'
import ms from 'ms'

import { env } from '../../../config/env.js'
import type { TypedRequestQuery } from '../../../utils/typed-request.js'
import {
  checkGoogleUserExists,
  getAccessToken,
  getUserInfo,
  registerGoogleUser,
} from './google-auth.service.js'

const GOOGLE_OAUTH_URL = env.GOOGLE_OAUTH_URL
const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID
const GOOGLE_CALLBACK_URL = env.GOOGLE_CALLBACK_URL
const GOOGLE_OAUTH_SCOPES = [
  'https%3A//www.googleapis.com/auth/userinfo.email',
  'https%3A//www.googleapis.com/auth/userinfo.profile',
]

export function googleAuthHandler(req: Request, res: Response) {
  const state = 'login_via_google'
  const scopes = GOOGLE_OAUTH_SCOPES.join(' ')
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`

  res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL)
}

type Query = {
  state: string
  code: string
  scope: string
  authuser: string
  prompt: string
}

export async function googleAuthRedirectHandler(
  req: TypedRequestQuery<Query>,
  res: Response,
) {
  try {
    const { code } = req.query
    const access_token = await getAccessToken({ code })
    const { email, id, name, picture } = await getUserInfo({
      accessToken: access_token,
    })
    const user = await checkGoogleUserExists({
      googleUserId: id,
      googleUserEmail: email,
    })

    if (user) {
      const isMinimumOneEmailVerified = user.user_emails.some(
        ({ is_verified }) => is_verified,
      )

      if (!isMinimumOneEmailVerified) {
        req.session.cookie.maxAge = ms('15 minutes')
      }

      req.session.userId = user.id
      res.redirect(env.APP_ORIGIN)
      return
    }

    const registeredUser = await registerGoogleUser({
      email,
      id,
      name,
      picture,
    })

    req.session.userId = registeredUser.user.id
    res.redirect(env.APP_ORIGIN)
  } catch (e) {
    req.log.error(e)
    res.redirect(env.APP_ORIGIN + '/auth/login?error=true')
  }
}
