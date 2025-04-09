import { Router } from 'express'

import { authorize } from '../../middlewares/authorize.js'
import {
  addTransactionHandler,
  getTransactionsHandler,
} from './transaction.controller.js'

export const transactionsRouter = Router()

transactionsRouter.get('/', authorize, getTransactionsHandler)
transactionsRouter.post('/', authorize, addTransactionHandler)
