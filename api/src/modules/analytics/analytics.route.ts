import { Router } from 'express'

import { authorize } from '../../middlewares/authorize.js'
import {
  getCategoriesHandler,
  getLargestExpenseIncomeHandler,
  getTransactionsByMonthHandler,
} from './analytics.controller.js'

export const analyticsRouter = Router()

analyticsRouter.get('/categories', authorize, getCategoriesHandler)
analyticsRouter.get(
  '/largest-income-expense',
  authorize,
  getLargestExpenseIncomeHandler,
)
analyticsRouter.get(
  '/transactions-by-month',
  authorize,
  getTransactionsByMonthHandler,
)
