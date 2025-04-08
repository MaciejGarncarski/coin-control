import { hash } from '@node-rs/argon2'
import { db } from '@shared/database'
import { QUEUES } from '@shared/queues'
import ms from 'ms'
import { v7 } from 'uuid'

import { resetPasswordLinkQueue } from '../../../lib/queues/reset-password-link.js'
import { resetPasswordNotificationQueue } from '../../../lib/queues/reset-password-notification.js'
import { getHashCode } from '../../../utils/get-hash-code.js'

export async function getPasswordResetToken({ token }: { token: string }) {
  const codeFromDb = await db.reset_password_codes.findFirst({
    where: {
      reset_code: token,
      used: false,
    },
    select: {
      expires_at: true,
      id: true,
    },
  })

  return { expiresAt: codeFromDb?.expires_at, id: codeFromDb?.id }
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
    const userCode = await tx.reset_password_codes.update({
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

    if (!userCode.user_id) {
      throw new Error('User not found.')
    }

    const hashedPassword = await hash(newPassword)

    const updatedUser = await tx.users.update({
      where: {
        id: userCode.user_id,
      },
      data: {
        password_hash: hashedPassword,
      },
    })

    await tx.sessions.deleteMany({
      where: {
        user_id: userCode.user_id,
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

export async function sendResetPasswordCode({
  userId,
  email,
}: {
  userId: string
  email: string
}) {
  const passwordCodeId = v7()
  const expiresAt = new Date().getTime() + ms('5 minutes')
  const resetCode = getHashCode()

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
