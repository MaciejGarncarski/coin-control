import { QUEUES } from '@shared/queues'
import type {
  AddEmailMutation,
  DeleteEmailMutation,
  DeleteUserAccountMutation,
  EmailsResponse,
  ResendEmailVerificationMutation,
  SetPrimaryEmailMutation,
  UserFullNameMutation,
  VerifySecondaryEmailMutation,
} from '@shared/schemas'
import type { Request, Response } from 'express'
import status from 'http-status'
import ms from 'ms'
import { v7 } from 'uuid'

import { db } from '../../lib/db.js'
import { HttpError } from '../../lib/http-error.js'
import { secondaryEmailVerificationQueue } from '../../lib/queues/secondary-email-verification.js'
import { getHashCode } from '../../utils/get-hash-code.js'
import type { TypedRequestBody } from '../../utils/typed-request.js'
import { getUser } from '../auth/auth.service.js'

export const getUserEmailsHandler = async (req: Request, res: Response) => {
  const userID = req.session.userId

  const userEmails = await db.user_emails.findMany({
    where: {
      user_id: userID,
    },
  })

  const emailsResponse: EmailsResponse = userEmails
    .map((email) => {
      return {
        email: email.email,
        emailID: email.email_id,
        isPrimary: email.is_primary || false,
        isVerified: email.is_verified || false,
      }
    })
    .sort((a, b) => (a.isPrimary ? (b.isPrimary ? 1 : -1) : 0))

  res.status(status.OK).json(emailsResponse)
  return
}

const USER_EMAILS_LIMIT = 5

export async function addEmailHandler(
  req: TypedRequestBody<AddEmailMutation>,
  res: Response,
) {
  const email = req.body.email
  const token = getHashCode()
  const userId = req.session.userId

  const userEmailsCount = await db.user_emails.count({
    where: {
      user_id: userId,
    },
  })

  if (userEmailsCount >= USER_EMAILS_LIMIT) {
    throw new HttpError({
      message: `Emails limit is ${USER_EMAILS_LIMIT}.`,
      toastMessage: `Email limit is ${USER_EMAILS_LIMIT}.`,
      statusCode: 'FORBIDDEN',
    })
  }

  const someUserHasEmail = await db.users.findFirst({
    where: {
      email,
    },
  })

  if (someUserHasEmail?.id) {
    throw new HttpError({
      message: 'Already exists',
      toastMessage: 'Email already taken',
      statusCode: 'CONFLICT',
    })
  }

  const emailExists = await db.user_emails.findFirst({
    where: {
      email: email,
    },
  })

  if (emailExists?.user_id) {
    throw new HttpError({
      message: 'Already exists',
      toastMessage: 'Email already taken',
      statusCode: 'CONFLICT',
    })
  }

  const myEmails = await db.user_emails.findMany({
    where: {
      user_id: userId,
    },
  })

  if (myEmails.some((myEmails) => myEmails.email === email)) {
    throw new HttpError({
      message: 'Already exists',
      toastMessage: 'Email already taken',
      statusCode: 'CONFLICT',
    })
  }

  await db.$transaction(async (tx) => {
    const userEmail = await tx.user_emails.create({
      data: {
        email: email,
        email_id: v7(),
        is_primary: false,
        is_verified: false,
        user_id: userId,
      },
    })

    await tx.email_verification.create({
      data: {
        expires_at: new Date(new Date().getTime() + ms('5 minutes')),
        id: v7(),
        created_at: new Date(),
        email_id: userEmail.email_id,
        user_id: userEmail.user_id,
        verified: false,
        verification_token: token,
      },
    })

    await secondaryEmailVerificationQueue.add(
      `${QUEUES.NEW_EMAIL_VERIFICATION}-${email}`,
      {
        email: email,
        token: token,
      },
    )

    return true
  })

  res.status(status.ACCEPTED).json({ message: 'success' })
  return
}

export async function resendEmailVerificationHandler(
  req: TypedRequestBody<ResendEmailVerificationMutation>,
  res: Response,
) {
  const userId = req.session.userId
  const email = req.body.email

  const foundEmail = await db.user_emails.findFirst({
    where: {
      email: email,
    },
  })

  if (!foundEmail) {
    throw new HttpError({
      message: 'Not found.',
      statusCode: 'BAD_REQUEST',
    })
  }

  if (foundEmail.user_id !== userId) {
    throw new HttpError({
      message: 'Unauthorized.',
      statusCode: 'UNAUTHORIZED',
    })
  }

  const latestToken = await db.email_verification.findFirst({
    where: {
      email_id: foundEmail?.email_id,
    },
  })

  const token = getHashCode()

  if (!latestToken) {
    await secondaryEmailVerificationQueue.add(
      `${QUEUES.NEW_EMAIL_VERIFICATION}-${email}`,
      {
        email: email,
        token: token,
      },
    )

    res.status(status.ACCEPTED).json({ message: 'success' })
    return
  }

  const tokenDate = latestToken.expires_at.getTime() - ms('3 minutes')

  if (tokenDate > Date.now()) {
    throw new HttpError({
      message: 'Wait two minutes before sending new code.',
      toastMessage: 'Wait two minutes before sending new code.',
      statusCode: 'BAD_REQUEST',
    })
  }

  await db.email_verification.create({
    data: {
      id: v7(),
      expires_at: new Date(new Date().getTime() + ms('5 minutes')),
      verification_token: token,
      verified: false,
      user_id: userId,
      email_id: foundEmail.email_id,
    },
  })

  await secondaryEmailVerificationQueue.add(
    `${QUEUES.NEW_EMAIL_VERIFICATION}-${email}`,
    {
      email: email,
      token: token,
    },
  )

  res.status(status.ACCEPTED).json({ message: 'success' })
  return
}

export async function verifySecondaryEmailHandler(
  req: TypedRequestBody<VerifySecondaryEmailMutation>,
  res: Response,
) {
  const body = req.body

  const emailData = await db.user_emails.findFirst({
    where: {
      email: body.email,
    },
    select: {
      email_id: true,
    },
  })

  const foundToken = await db.email_verification.findFirst({
    where: {
      email_id: emailData?.email_id,
      verification_token: body.token,
    },
  })

  if (!foundToken?.id) {
    throw new HttpError({
      message: 'Bad request',
      statusCode: 'BAD_REQUEST',
    })
  }

  const isExpired = foundToken.expires_at.getTime() < new Date().getTime()

  if (isExpired) {
    throw new HttpError({
      message: 'Token expired',
      statusCode: 'BAD_REQUEST',
    })
  }

  await db.$transaction(async (tx) => {
    await tx.user_emails.update({
      where: {
        email_id: emailData?.email_id,
        email: body.email,
      },
      data: {
        is_verified: true,
      },
    })

    await tx.email_verification.update({
      where: {
        id: foundToken.id,
      },
      data: {
        verified: true,
      },
    })

    return true
  })

  res.status(status.CREATED).json({ message: 'success' })
  return
}

export async function setPrimaryEmailHandler(
  req: TypedRequestBody<SetPrimaryEmailMutation>,
  res: Response,
) {
  const userId = req.session.userId

  const email = req.body.email

  const emailData = await db.user_emails.findFirst({
    where: {
      email: email,
    },
  })

  if (!emailData) {
    throw new HttpError({
      message: 'Bad request.',
      statusCode: 'BAD_REQUEST',
    })
  }

  if (emailData.is_primary) {
    throw new HttpError({
      message: 'Is primary already.',
      statusCode: 'BAD_REQUEST',
    })
  }

  if (!emailData.is_verified) {
    throw new HttpError({
      message: 'Email not verified.',
      statusCode: 'BAD_REQUEST',
    })
  }

  await db.$transaction(async (tx) => {
    const prevPrimaryEmail = await db.users.findFirst({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    })

    if (!prevPrimaryEmail) {
      throw new HttpError({
        message: 'Bad request.',
        statusCode: 'BAD_REQUEST',
      })
    }

    await db.user_emails.update({
      where: {
        email: prevPrimaryEmail.email,
      },
      data: {
        is_primary: false,
      },
    })

    await db.user_emails.update({
      where: {
        email: email,
      },
      data: {
        is_primary: true,
      },
    })

    await db.users.update({
      where: {
        id: userId,
      },
      data: {
        email: email,
      },
    })

    return true
  })

  res.status(status.OK).send({ message: 'ok' })
  return
}

export async function deleteEmailHandler(
  req: TypedRequestBody<DeleteEmailMutation>,
  res: Response,
) {
  const userId = req.session.userId
  const email = req.body.email

  const userData = await getUser({ userId })

  const isPrimaryEmail = email === userData.email

  if (isPrimaryEmail) {
    throw new HttpError({
      message: 'Cannot delete primary email.',
      statusCode: 'FORBIDDEN',
      toastMessage: 'Cannot delete primary email.',
    })
  }

  const emailExistsForUser = await db.user_emails.findFirst({
    where: {
      user_id: userId,
      email: email,
      is_primary: false,
    },
  })

  if (!emailExistsForUser) {
    throw new HttpError({
      message: 'Email does not exist.',
      statusCode: 'BAD_REQUEST',
    })
  }

  await db.user_emails.delete({
    where: {
      user_id: userId,
      is_primary: false,
      email: email,
    },
  })

  res.status(status.OK).send({ message: 'ok' })
  return
}

export async function updateUserHandler(
  req: TypedRequestBody<UserFullNameMutation>,
  res: Response,
) {
  const userId = req.session.userId
  const name = req.body.name

  await db.users.update({
    where: {
      id: userId,
    },
    data: {
      name: name,
    },
  })

  res.status(status.OK).send({ message: 'ok' })
}

export async function deleteUserAccountHandler(
  req: TypedRequestBody<DeleteUserAccountMutation>,
  res: Response,
) {
  const userId = req.session.userId
  const name = req.body.name

  const user = await db.users.findUnique({
    where: {
      name: name,
      id: userId,
    },
    select: {
      password_hash: true,
    },
  })

  if (!user) {
    throw new HttpError({
      message: 'Bad request',
      statusCode: 'BAD_REQUEST',
    })
  }

  await db.users.delete({
    where: {
      id: userId,
      name: name,
    },
  })

  req.session.destroy(() => null)

  res.status(status.OK).send({ message: 'ok' })
}
