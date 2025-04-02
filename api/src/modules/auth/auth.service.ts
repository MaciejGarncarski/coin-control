import { hash, verify } from '@node-rs/argon2'
import { QUEUES } from '@shared/queues'
import { type RegisterMutation, z } from '@shared/schemas'
import ms from 'ms'
import type { IResult } from 'ua-parser-js'
import { v7 } from 'uuid'

import { db } from '../../lib/db.js'
import { HttpError } from '../../lib/http-error.js'
import { emailVerificationQueue } from '../../lib/queues/email-verification.js'
import { generateOTP } from '../../utils/generate-otp.js'
import { getUserLocation } from '../../utils/get-user-location.js'
import { userDTO } from './user.dto.js'

type CheckUserExistsProps = {
  email: string
}

export async function checkUserExists({ email }: CheckUserExistsProps) {
  const userByEmail = await db.user_emails.findFirst({
    where: {
      email: email,
      is_verified: true,
    },
    select: {
      user_id: true,
    },
  })

  const user = await db.users.findFirst({
    where: {
      id: userByEmail?.user_id,
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
    throw new HttpError({
      statusCode: 'UNAUTHORIZED',
      message: 'Invalid email or password.',
    })
  }

  return user
}

type VerifyPasswordProps = {
  hash: string
  password: string
}

export async function verifyPassword({ hash, password }: VerifyPasswordProps) {
  const passwordMatches = await verify(hash, password)

  if (!passwordMatches) {
    throw new HttpError({
      statusCode: 'UNAUTHORIZED',
      message: 'Invalid email or password.',
    })
  }
}

export async function registerUser(userData: RegisterMutation) {
  const user = await db.users.findFirst({
    where: {
      email: userData.email,
    },
    select: {
      id: true,
      email: true,
    },
  })

  if (user) {
    throw new HttpError({
      toastMessage: 'User already exists.',
      message: 'User already exists.',
      statusCode: 'CONFLICT',
    })
  }

  const hashedPassword = await hash(userData.password)
  const userId = v7()

  const newUser = await db.$transaction(async (tx) => {
    const user = await tx.users.create({
      data: {
        id: userId,
        email: userData.email,
        password_hash: hashedPassword,
        name: userData.fullName,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    const userEmailData = await tx.user_emails.create({
      data: {
        email_id: v7(),
        email: userData.email,
        is_primary: true,
        is_verified: false,
        user_id: userId,
      },
    })

    return { user, userEmailData }
  })

  if (!newUser) {
    throw new HttpError({
      toastMessage: 'User not found.',
      message: 'User not found.',
      statusCode: 'NOT_FOUND',
    })
  }

  const expires_at = Date.now() + ms('5 minutes')
  const OTPUuid = v7()
  const OTPCode = generateOTP()

  await db.email_verification.create({
    data: {
      id: OTPUuid,
      email_id: newUser.userEmailData.email_id,
      user_id: newUser.user.id,
      otp: OTPCode,
      expires_at: new Date(expires_at),
    },
  })

  await emailVerificationQueue.add(
    `${QUEUES.EMAIL_VERIFICATION}-${OTPUuid}`,
    {
      code: OTPCode,
      userEmail: userData.email,
    },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: {
        age: 3600,
        count: 1000,
      },
      removeOnFail: {
        age: 24 * 3600,
      },
    },
  )

  return {
    user: userDTO({
      email: newUser.user.email,
      email_verified: false,
      id: newUser.user.id,
      name: newUser.user.name,
    }),
    userEmailData: newUser.userEmailData,
  }
}

type VerifyAccountProps = {
  userId: string
  code: string
}

export async function verifyAccount({ code, userId }: VerifyAccountProps) {
  const otp = await db.email_verification.findFirst({
    where: {
      user_id: userId,
      otp: code,
      verified: false,
    },
    include: {
      users: true,
    },
  })

  if (!otp) {
    throw new HttpError({
      message: 'Invalid OTP code.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  if (otp.expires_at < new Date()) {
    throw new HttpError({
      message: 'OTP code expired.',
      toastMessage: 'Code expired.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  await db.$transaction(async (tx) => {
    await tx.user_emails.upsert({
      where: {
        user_id: userId,
        email: otp.users.email,
      },
      create: {
        email: otp.users.email,
        email_id: v7(),
        is_primary: true,
        user_id: userId,
        is_verified: true,
      },
      update: {
        email: otp.users.email,
        is_primary: true,
        user_id: userId,
        is_verified: true,
      },
    })

    await tx.email_verification.delete({
      where: {
        user_id: userId,
        id: otp.id,
      },
    })
  })
}

type GetOTPPRops = {
  userId: string
  email: string
}

export async function getOTP({ email, userId }: GetOTPPRops) {
  const expires_at = Date.now() + ms('5 minutes')
  const OTPid = v7()
  const OTPCode = generateOTP()

  const userEmailData = await db.user_emails.findFirst({
    where: {
      email,
      user_id: userId,
    },
  })

  if (!userEmailData) {
    throw new HttpError({
      statusCode: 'BAD_REQUEST',
      message: 'Bad request',
    })
  }

  await db.$transaction(async (tx) => {
    await tx.email_verification.create({
      data: {
        expires_at: new Date(expires_at),
        otp: OTPCode,
        email_id: userEmailData?.email_id,
        user_id: userId,
        id: OTPid,
      },
    })

    await emailVerificationQueue.add(
      `${QUEUES.EMAIL_VERIFICATION}-${OTPid}`,
      {
        code: OTPCode,
        userEmail: email,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: {
          age: 3600,
          count: 1000,
        },
        removeOnFail: {
          age: 24 * 3600,
        },
      },
    )
  })
}

export async function getUser({ userId }: { userId: string }) {
  const user = await db.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  if (!user) {
    throw new HttpError({
      message: 'User not found',
      statusCode: 'BAD_REQUEST',
    })
  }

  const userEmail = await db.user_emails.findFirst({
    where: {
      user_id: user.id,
      is_verified: true,
    },
  })

  return userDTO({
    email: user.email,
    email_verified: userEmail ? userEmail.is_verified : false,
    id: user.id,
    name: user.name,
  })
}

const IPResponseSchema = z.object({
  countryName: z.string().min(2).optional(),
  cityName: z.string().min(2).optional(),
})

export async function saveSessionData({
  parsedUserAgent,
  userIP,
  sessionId,
}: {
  parsedUserAgent: IResult
  userIP: string
  sessionId: string
}) {
  const userIPResponse = await fetch(`https://freeipapi.com/api/json/${userIP}`)
  const userIPData = await userIPResponse.json()
  const IPData = IPResponseSchema.safeParse(userIPData)

  const userLocation = IPData.success
    ? getUserLocation(IPData.data.cityName, IPData.data.countryName)
    : null

  await db.sessions.update({
    where: {
      sid: sessionId,
    },
    data: {
      operating_system: parsedUserAgent.os.name,
      browser: parsedUserAgent.browser.name,
      device_type:
        parsedUserAgent.device.type === 'mobile' ? 'mobile' : 'desktop',
      last_access: new Date(),
      ip_address: userIP,
      location: userLocation,
    },
  })
}
