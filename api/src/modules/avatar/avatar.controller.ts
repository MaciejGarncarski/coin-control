import { copyFile, mkdir } from 'node:fs/promises'
import { join, normalize } from 'node:path'

import { type Request, type Response } from 'express'
import formidable from 'formidable'
import status from 'http-status'
import { v7 } from 'uuid'

import { env } from '../../config/env.js'
import { db } from '../../lib/db.js'
import { HttpError } from '../../lib/http-error.js'
import type { TypedRequestParams } from '../../utils/typed-request.js'

const MAX_FILE_SIZE = 5_000_000 // 5 MB;

export async function uploadUserAvatarHandler(req: Request, res: Response) {
  const userId = req.session.userId

  const form = formidable({
    // uploadDir: normalize(join('temp', `${userId}-temp-avatar`)),
    maxFileSize: MAX_FILE_SIZE,
  })

  const [_, files] = await form.parse(req)

  const avatarFiles = files.avatar

  if (!avatarFiles) {
    throw new HttpError({
      message: 'No image provided',
      statusCode: 'BAD_REQUEST',
    })
  }

  const avatar = avatarFiles[0]

  if (!avatar) {
    throw new HttpError({
      message: 'No image provided',
      statusCode: 'BAD_REQUEST',
    })
  }

  const avatarId = v7()
  await mkdir(normalize(join('avatar-upload', userId)), { recursive: true })
  const avatarFileName = `${avatarId}.jpg`
  const avatarFolder = `avatar_${userId}`
  const safeFilePath = normalize(
    join('avatar-upload', avatarFolder, avatarFileName),
  )
  await copyFile(avatar.filepath, safeFilePath)
  const avatarURL = `${env.API_URL}/avatars/${avatarFolder}/${avatarFileName}`

  await db.users.update({
    where: {
      id: userId,
    },
    data: {
      avatar_url: avatarURL,
    },
  })

  res.status(status.OK).send({ message: 'ok', filepath: safeFilePath })
  return
}

export async function authenticateAvatarHandler(
  req: TypedRequestParams<{ userId: string }>,
  res: Response,
) {
  if (req.session.userId !== req.params.userId) {
    throw new HttpError({
      statusCode: 'UNAUTHORIZED',
      message: 'Unauthorized',
      additionalMessage: 'userId does not match',
    })
  }

  res.status(status.OK).send({ message: 'ok' })
  return
}
