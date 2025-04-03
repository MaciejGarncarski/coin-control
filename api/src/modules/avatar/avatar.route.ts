import { Router } from 'express'

import { authorize } from '../../middlewares/authorize.js'
import {
  authenticateAvatarHandler,
  uploadUserAvatarHandler,
} from './avatar.controller.js'

export const avatarRouter = Router()

avatarRouter.post('/upload', authorize, uploadUserAvatarHandler)
avatarRouter.get('/auth/:userId', authorize, authenticateAvatarHandler)
