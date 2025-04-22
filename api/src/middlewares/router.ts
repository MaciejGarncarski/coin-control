import { Router } from 'express'

import { analyticsRouter } from '../modules/analytics/analytics.route.js'
import { authRouter } from '../modules/auth/auth.route.js'
import { avatarRouter } from '../modules/avatar/avatar.route.js'
import { statisticsRouter } from '../modules/statistics/statistics.route.js'
import { transactionsRouter } from '../modules/transactions/transaction.route.js'
import { userRouter } from '../modules/user/user.route.js'

export const mainRouter = Router()

mainRouter.use('/auth', authRouter)
mainRouter.use('/user', userRouter)
mainRouter.use('/avatar', avatarRouter)
mainRouter.use('/transactions', transactionsRouter)
mainRouter.use('/statistics', statisticsRouter)
mainRouter.use('/analytics', analyticsRouter)
