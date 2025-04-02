import { createHash } from 'node:crypto'

import { hash } from '@node-rs/argon2'
import { QUEUES } from '@shared/queues'
import type { RegisterMutation } from '@shared/schemas'
import status from 'http-status'
import ms from 'ms'
import { v7 } from 'uuid'

import { ApiError } from '../../lib/api-error.js'
import { db } from '../../lib/db.js'
import { emailVerificationQueue } from '../../lib/queues/email-verification.js'
import { resetPasswordLinkQueue } from '../../lib/queues/reset-password-link.js'
import { resetPasswordNotificationQueue } from '../../lib/queues/reset-password-notification.js'
import { generateOTP } from '../../utils/generate-otp.js'
import { userDTO } from './user.dto.js'

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
    throw new ApiError({
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

  return newUser
    ? {
        user: userDTO({
          email: newUser.user.email,
          email_verified: false,
          id: newUser.user.id,
          name: newUser.user.name,
        }),
        userEmailData: newUser.userEmailData,
      }
    : null
}

type VerifyEmailProps = {
  userId: string
  code: string
}

export async function verifyEmail({ code, userId }: VerifyEmailProps) {
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
    throw new ApiError({
      message: 'Invalid OTP code.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  if (otp.expires_at < new Date()) {
    throw new ApiError({
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
    throw new ApiError({
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
  return await db.users.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })
}

export async function sendResetPasswordCode({
  userId,
  email,
}: {
  userId: string
  email: string
}) {
  const passwordCodeId = v7()
  const expiresAt = new Date().getTime() + ms('5 minutes')
  const resetCode = createHash('sha512').update(v7()).digest('hex').slice(0, 48)

  await db.reset_password_codes.create({
    data: {
      id: passwordCodeId,
      expires_at: new Date(expiresAt),
      user_id: userId,
      reset_code: resetCode,
    },
  })

  await resetPasswordLinkQueue.add(
    `${QUEUES.RESET_PASSWORD}-${passwordCodeId}`,
    {
      passwordResetCode: resetCode,
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
}

type ResetPasswordProps = {
  newPassword: string
  resetToken: string
  resetTokenId: string
}

export async function resetPassword({
  newPassword,
  resetToken,
  resetTokenId,
}: ResetPasswordProps) {
  const user = await db.$transaction(async (tx) => {
    const userId = await tx.reset_password_codes.update({
      where: {
        id: resetTokenId,
        reset_code: resetToken,
      },
      data: {
        used: true,
      },
      select: {
        user_id: true,
      },
    })

    if (!userId.user_id) {
      throw new Error('User not found.')
    }

    const hashedPassword = await hash(newPassword)

    const updatedUser = await tx.users.update({
      where: {
        id: userId.user_id,
      },
      data: {
        password_hash: hashedPassword,
      },
    })

    await tx.sessions.deleteMany({
      where: {
        user_id: userId.user_id,
      },
    })

    return updatedUser
  })

  const timestamp = Date.now()

  await resetPasswordNotificationQueue.add(
    `${QUEUES.RESET_PASSWORD_NOTIFICATION}-${resetTokenId}`,
    {
      createdAt: timestamp,
      userEmail: user.email,
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
}
