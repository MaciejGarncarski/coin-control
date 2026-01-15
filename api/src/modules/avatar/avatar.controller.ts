import { createWriteStream } from 'node:fs'
import { mkdir, unlink } from 'node:fs/promises'
import { join, normalize } from 'node:path'

import { db } from '@shared/database'
import { type Request, type Response } from 'express'
import formidable from 'formidable'
import status from 'http-status'
import { nanoid } from 'nanoid'

import { env } from '../../config/env.js'
import { ApiError } from '../../utils/api-error.js'

const MAX_FILE_SIZE = 5_000_000
const UPLOAD_DIR = normalize(join('avatar-upload'))

export async function uploadUserAvatarHandler(req: Request, res: Response) {
  const userId = req.session.userId
  const avatarId = nanoid()
  const newAvatarName = `${avatarId}.jpg`
  const safeFilePath = join(UPLOAD_DIR, newAvatarName)

  await mkdir(UPLOAD_DIR, { recursive: true })

  const form = formidable({
    maxFileSize: MAX_FILE_SIZE,
    fileWriteStreamHandler: () => {
      return createWriteStream(safeFilePath)
    },
  })

  try {
    const [fields, files] = await form.parse(req)
    const avatar = files.avatar?.[0]

    if (!avatar) {
      throw new ApiError({
        message: 'No image provided',
        statusCode: status.BAD_REQUEST,
      })
    }

    const userData = await db.users.findFirst({
      where: { id: userId },
      select: { avatar_url: true },
    })

    if (userData?.avatar_url) {
      const oldFileName = userData.avatar_url.split(
        `${env.API_URL}/avatars/`,
      )[1]
      if (oldFileName) {
        await unlink(join(UPLOAD_DIR, oldFileName)).catch(() => {})
      }
    }

    const avatarURL = `${env.API_URL}/avatars/${newAvatarName}`
    await db.users.update({
      where: { id: userId },
      data: { avatar_url: avatarURL },
    })

    return res
      .status(status.OK)
      .send({ message: 'ok', filename: newAvatarName })
  } catch (err) {
    await unlink(safeFilePath).catch(() => {})
    throw err
  }
}
