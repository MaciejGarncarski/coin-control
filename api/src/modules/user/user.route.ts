import {
  addEmailMutationSchema,
  deleteEmailMutationSchema,
  deleteUserAccountMutationSchema,
  resendEmailVerificationMutationSchema,
  setPrimaryEmailMutationSchema,
  userFullNameMutationSchema,
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
  deleteUserAccountHandler,
  getUserEmailsHandler,
  resendEmailVerificationHandler,
  setPrimaryEmailHandler,
  updateUserHandler,
  verifySecondaryEmailHandler,
} from './user.controller.js'

export const userRouter = Router()

const addNewEmailLimiter = createRateLimiter({
  windowMs: ms('3 minutes'),
  limit: 30,
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

userRouter.patch(
  '/',
  authorize,
  validateData(userFullNameMutationSchema),
  updateUserHandler,
)

userRouter.post(
  '/delete-account',
  createRateLimiter({
    limit: 10,
    windowMs: ms('1 minute'),
  }),
  authorize,
  validateData(deleteUserAccountMutationSchema),
  deleteUserAccountHandler,
)
