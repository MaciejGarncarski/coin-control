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

import { authorize } from '../../middlewares/authorize.js'
import { validateBody } from '../../middlewares/validator-body.js'
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

userRouter.get('/emails', authorize, getUserEmailsHandler)

userRouter.post(
  '/emails',
  authorize,
  validateBody(addEmailMutationSchema),
  addEmailHandler,
)

userRouter.post(
  '/resend-email-verification',
  authorize,
  validateBody(resendEmailVerificationMutationSchema),
  resendEmailVerificationHandler,
)

userRouter.post(
  '/verify-secondary-email',
  authorize,
  validateBody(verifySecondaryEmailMutaitonSchema),
  verifySecondaryEmailHandler,
)

userRouter.post(
  '/set-primary-email',
  authorize,
  validateBody(setPrimaryEmailMutationSchema),
  setPrimaryEmailHandler,
)

userRouter.post(
  '/delete-email',
  authorize,
  validateBody(deleteEmailMutationSchema),
  deleteEmailHandler,
)

userRouter.patch(
  '/',
  authorize,
  validateBody(userFullNameMutationSchema),
  updateUserHandler,
)

userRouter.post(
  '/delete-account',
  authorize,
  validateBody(deleteUserAccountMutationSchema),
  deleteUserAccountHandler,
)
