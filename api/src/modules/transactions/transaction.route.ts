import { deleteTransactionParamsSchema } from '@shared/schemas'
import { Router } from 'express'

import { authorize } from '../../middlewares/authorize.js'
import { validateParams } from '../../middlewares/validator-params.js'
import {
  addTransactionHandler,
  deleteTransactionHandler,
  getTransactionsHandler,
} from './transaction.controller.js'

export const transactionsRouter = Router()

transactionsRouter.get('/', authorize, getTransactionsHandler)
transactionsRouter.post('/', authorize, addTransactionHandler)
transactionsRouter.delete(
  '/:transactionId',
  authorize,
  validateParams(deleteTransactionParamsSchema),
  deleteTransactionHandler,
)
