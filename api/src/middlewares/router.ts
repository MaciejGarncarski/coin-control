import { Router } from 'express'

import { authRouter } from '../modules/auth/auth.route.js'
import { avatarRouter } from '../modules/avatar/avatar.route.js'
import { userRouter } from '../modules/user/user.route.js'

export const mainRouter = Router()

mainRouter.use('/auth', authRouter)
mainRouter.use('/user', userRouter)
mainRouter.use('/avatar', avatarRouter)
