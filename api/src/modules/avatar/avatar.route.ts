import { Router } from 'express'

import { authorize } from '../../middlewares/authorize.js'
import { authorizeAccountType } from '../../middlewares/authorize-account-type.js'
import { uploadUserAvatarHandler } from './avatar.controller.js'

export const avatarRouter = Router()

avatarRouter.post(
  '/upload',
  authorize,
  authorizeAccountType,
  uploadUserAvatarHandler,
)
