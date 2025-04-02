import {
  addEmailMutationSchema,
  deleteEmailMutationSchema,
  resendEmailVerificationMutationSchema,
  setPrimaryEmailMutationSchema,
  verifySecondaryEmailMutaitonSchema,
} from '@shared/schemas'
import { Router } from 'express'
import ms from 'ms'

import { createRateLimiter } from '../../lib/rate-limiter.js'
import { authorize } from '../../middlewares/authorize.js'
import { validateData } from '../../middlewares/validator.js'
import {
  addEmailHandler,
  deleteEmailHandler,
  getUserEmailsHandler,
  resendEmailVerificationHandler,
  setPrimaryEmailHandler,
  verifySecondaryEmailHandler,
} from './user.controller.js'

export const userRouter = Router()

const addNewEmailLimiter = createRateLimiter({
  windowMs: ms('3 minutes'),
  limit: 15,
})

userRouter.get('/emails', authorize, getUserEmailsHandler)

userRouter.post(
  '/emails',
  addNewEmailLimiter,
  authorize,
  validateData(addEmailMutationSchema),
  addEmailHandler,
)

userRouter.post(
  '/resend-email-verification',
  authorize,
  validateData(resendEmailVerificationMutationSchema),
  resendEmailVerificationHandler,
)

userRouter.post(
  '/verify-secondary-email',
  authorize,
  validateData(verifySecondaryEmailMutaitonSchema),
  verifySecondaryEmailHandler,
)

userRouter.post(
  '/set-primary-email',
  authorize,
  validateData(setPrimaryEmailMutationSchema),
  setPrimaryEmailHandler,
)

userRouter.post(
  '/delete-email',
  authorize,
  validateData(deleteEmailMutationSchema),
  deleteEmailHandler,
)
