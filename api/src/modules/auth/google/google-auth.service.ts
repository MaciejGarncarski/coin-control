import { db } from '@shared/database'
import {
  googleOauthAccessTokenSchema,
  type GoogleOAuthResponse,
  googleOauthResponseSchema,
} from '@shared/schemas'
import status from 'http-status'
import { v7 } from 'uuid'
import type { z } from 'zod'

import { env } from '../../../config/env.js'
import { userDTO } from '../../../mappers/user.dto.js'
import { ApiError } from '../../../utils/api-error.js'
import { ValidationError } from '../../../utils/validation-error.js'

type GetAccessTokenData = {
  code: string
}

export async function getAccessToken(data: GetAccessTokenData) {
  const bodyData = {
    code: data.code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: env.GOOGLE_CALLBACK_URL,
    grant_type: 'authorization_code',
  }

  const response = await fetch(env.GOOGLE_ACCESS_TOKEN_URL, {
    method: 'POST',
    body: JSON.stringify(bodyData),
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

  return access_token
}

type GetUserInfoData = {
  accessToken: string
}

export async function getUserInfo({ accessToken }: GetUserInfoData) {
  const userInfoResponse = await fetch(
    ` https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
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

  return parsedUserInfo.data
}

type CheckGoogleUserExistsProps = {
  googleUserId: string
  googleUserEmail: string
}

export async function checkGoogleUserExists({
  googleUserId,
  googleUserEmail,
}: CheckGoogleUserExistsProps) {
  const userIdData = await db.users.findFirst({
    where: {
      OR: [
        {
          google_user_id: googleUserId,
        },
        {
          email: googleUserEmail,
        },
      ],
    },
    select: {
      id: true,
    },
  })

  const userEmail = await db.user_emails.findFirst({
    where: {
      email: googleUserEmail,
    },
    select: {
      user_id: true,
    },
  })

  if (!userIdData?.id) {
    return false
  }

  if (!userEmail) {
    await db.user_emails.create({
      data: {
        user_id: userIdData.id,
        email: googleUserEmail,
        is_primary: true,
        is_verified: true,
        email_id: v7(),
      },
    })
  }

  const user = await db.users.findFirst({
    where: {
      id: userEmail?.user_id,
    },
    include: {
      user_emails: {
        where: {
          is_primary: true,
        },
        select: {
          email: true,
          is_primary: true,
          is_verified: true,
        },
      },
    },
  })

  if (!user) {
    return false
  }

  return user
}

export async function registerGoogleUser(googleUserData: GoogleOAuthResponse) {
  const user = await db.users.findFirst({
    where: {
      google_user_id: googleUserData.id,
    },
    select: {
      id: true,
      email: true,
    },
  })

  if (user) {
    throw new ApiError({
      message: 'User already exists.',
      formMessage: 'User already exists.',
      statusCode: status.CONFLICT,
    })
  }

  const userId = v7()

  const newUser = await db.$transaction(async (tx) => {
    const user = await tx.users.create({
      data: {
        id: userId,
        email: googleUserData.email,
        name: googleUserData.name,
        avatar_url: googleUserData.picture,
        google_user_id: googleUserData.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar_url: true,
      },
    })

    const userEmailData = await tx.user_emails.create({
      data: {
        email_id: v7(),
        email: googleUserData.email,
        is_primary: true,
        is_verified: true,
        user_id: userId,
      },
    })

    return { user, userEmailData }
  })

  if (!newUser) {
    throw new ApiError({
      message: 'User not found.',
      formMessage: 'User not found.',
      statusCode: status.BAD_REQUEST,
    })
  }

  return {
    user: userDTO({
      email: newUser.user.email,
      email_verified: true,
      id: newUser.user.id,
      name: newUser.user.name,
      avatar_url: newUser.user.avatar_url,
    }),
    userEmailData: newUser.userEmailData,
  }
}
