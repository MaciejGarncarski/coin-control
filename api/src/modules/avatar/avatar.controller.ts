import { copyFile, mkdir, unlink } from 'node:fs/promises'
import { join, normalize } from 'node:path'

import { type Request, type Response } from 'express'
import formidable from 'formidable'
import status from 'http-status'
import { nanoid } from 'nanoid'

import { env } from '../../config/env.js'
import { db } from '../../lib/db.js'
import { HttpError } from '../../lib/http-error.js'

const MAX_FILE_SIZE = 5_000_000 // 5 MB;

export async function uploadUserAvatarHandler(req: Request, res: Response) {
  const userId = req.session.userId

  const form = formidable({
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

  const userData = await db.users.findFirst({
    where: {
      id: userId,
    },
    select: {
      avatar_url: true,
    },
  })

  const avatarFileName = userData?.avatar_url?.split(
    `${env.API_URL}/avatars/`,
  )[1]

  try {
    await unlink(normalize(join('avatar-upload', avatarFileName || '')))
    // eslint-disable-next-line no-empty
  } catch {}

  const avatarId = nanoid()
  await mkdir(normalize(join('avatar-upload')), { recursive: true })
  const newAvatarName = `${avatarId}.jpg`
  const safeFilePath = normalize(join('avatar-upload', newAvatarName))
  await copyFile(avatar.filepath, safeFilePath)
  const avatarURL = `${env.API_URL}/avatars/${newAvatarName}`

  await db.users.update({
    where: {
      id: userId,
    },
    data: {
      avatar_url: avatarURL,
    },
  })

  res.status(status.OK).send({ message: 'ok' })
  return
}
