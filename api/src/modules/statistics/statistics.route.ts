import { Router } from 'express'

import { authorize } from '../../middlewares/authorize.js'
import { getStatisticsHandler } from './statistics.controller.js'

export const statisticsRouter = Router()

statisticsRouter.get('/', authorize, getStatisticsHandler)
