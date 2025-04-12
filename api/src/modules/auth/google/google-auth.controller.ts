import {
  googleOauthAccessTokenSchema,
  googleOauthResponseSchema,
} from '@shared/schemas'
import type { Request, Response } from 'express'
import ms from 'ms'
import type { z } from 'zod'

import { env } from '../../../config/env.js'
import type { TypedRequestQuery } from '../../../utils/typed-request.js'
import { ValidationError } from '../../../utils/validation-error.js'
import { userDTO } from '../user.dto.js'
import {
  checkGoogleUserExists,
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
  const { code } = req.query

  const data = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: env.GOOGLE_CALLBACK_URL,
    grant_type: 'authorization_code',
  }

  const response = await fetch(env.GOOGLE_ACCESS_TOKEN_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  const access_token_data = await response.json()
  const parsedTokenData =
    googleOauthAccessTokenSchema.safeParse(access_token_data)

  if (!parsedTokenData.success) {
    const errorMessages = parsedTokenData.error.errors.map(
      (issue: z.ZodIssue) => {
        return issue.path.map((el) => el.toString())
      },
    )

    throw new ValidationError({
      message: 'Validation error',
      paths: errorMessages.toString(),
    })
  }

  const { access_token } = parsedTokenData.data

  const userInfoResponse = await fetch(
    ` https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
  )
  const userInfo = await userInfoResponse.json()
  const parsedUserInfo = googleOauthResponseSchema.safeParse(userInfo)

  if (!parsedUserInfo.success) {
    const errorMessages = parsedUserInfo.error.errors.map(
      (issue: z.ZodIssue) => {
        return issue.path.map((el) => el.toString())
      },
    )

    throw new ValidationError({
      message: 'Validation error',
      paths: errorMessages.toString(),
    })
  }

  const { email, id, name, picture } = parsedUserInfo.data

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

    const userData = userDTO({
      email: user.email,
      email_verified: isMinimumOneEmailVerified,
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
    })
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
}
