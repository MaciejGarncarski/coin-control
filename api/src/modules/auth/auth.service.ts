import { createHash } from 'node:crypto'

import { hash } from '@node-rs/argon2'
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
      statusCode: status.CONFLICT,
    })
  }

  const hashedPassword = await hash(userData.password)
  const userId = v7()

  const newUser = await db.users.create({
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
      email_verified: true,
    },
  })

  return newUser ? userDTO(newUser) : null
}

type VerifyOTPProps = {
  userId: string
  code: string
}

export async function verifyOTP({ code, userId }: VerifyOTPProps) {
  const otp = await db.otp_codes.findFirst({
    where: {
      user_id: userId,
      otp: code,
    },
    select: {
      id: true,
      expires_at: true,
    },
  })

  if (!otp) {
    throw new ApiError({
      message: 'Invalid OTP code.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  if (otp.expires_at < new Date()) {
    throw new ApiError({
      message: 'OTP code expired.',
      toastMessage: 'Code expired.',
      statusCode: status.UNAUTHORIZED,
    })
  }

  await db.$transaction(async (tx) => {
    await tx.users.update({
      data: {
        email_verified: true,
      },
      where: {
        id: userId,
      },
    })

    await tx.otp_codes.delete({
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
  const otp_uuid = v7()
  const OTPCode = generateOTP()

  await db.otp_codes.create({
    data: {
      expires_at: new Date(expires_at),
      otp: OTPCode,
      user_id: userId,
      id: otp_uuid,
    },
  })

  await emailVerificationQueue.add(
    `verification-email-${otp_uuid}`,
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
}

export async function getUser({ userId }: { userId: string }) {
  return await db.users.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      email_verified: true,
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
    `reset-password-link-${passwordCodeId}`,
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
    `reset-password-notification-${resetTokenId}`,
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
