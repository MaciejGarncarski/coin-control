import { Router } from 'express'

import { authorize } from '../../middlewares/authorize.js'
import {
  getCategoriesHandler,
  getLargestExpenseIncomeHandler,
} from './analytics.controller.js'

export const analyticsRouter = Router()

analyticsRouter.get('/categories', authorize, getCategoriesHandler)
analyticsRouter.get(
  '/largest-income-expense',
  authorize,
  getLargestExpenseIncomeHandler,
)
