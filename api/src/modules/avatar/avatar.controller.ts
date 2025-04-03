import { copyFile, mkdir } from 'node:fs/promises'
import { join, normalize } from 'node:path'

import { type Request, type Response } from 'express'
import formidable from 'formidable'
import status from 'http-status'

import { HttpError } from '../../lib/http-error.js'

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

  //   const fileExt = await fileTypeFromFile(
  // avatar.originalFilename || 'image.jpeg',
  //   )

  await mkdir(normalize(join('avatar-upload', userId)), { recursive: true })
  const safeFilePath = normalize(join('avatar-upload', userId, `avatar.jpg`))
  await copyFile(avatar.filepath, safeFilePath)
  res.status(status.OK).send({ message: 'ok' })
  return
}
