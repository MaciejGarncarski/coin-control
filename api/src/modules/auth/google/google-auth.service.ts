import { db } from '@shared/database'
import type { GoogleOAuthResponse } from '@shared/schemas'
import status from 'http-status'
import { v7 } from 'uuid'

import { ApiError } from '../../../utils/api-error.js'
import { userDTO } from '../user.dto.js'

type Props = {
  googleUserId: string
  googleUserEmail: string
}

export async function checkGoogleUserExists({
  googleUserId,
  googleUserEmail,
}: Props) {
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
      statusCode: status.BAD_REQUEST,
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
