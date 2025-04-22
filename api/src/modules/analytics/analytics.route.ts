import { Router } from 'express'

import { authorize } from '../../middlewares/authorize.js'
import { getCategoriesHandler } from './analytics.controller.js'

export const analyticsRouter = Router()

analyticsRouter.get('/categories', authorize, getCategoriesHandler)
analyticsRouter.get('/categories', authorize)
