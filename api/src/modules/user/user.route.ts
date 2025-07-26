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
import { authorizeAccountType } from '../../middlewares/authorize-account-type.js'
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
  authorizeAccountType,
  validateBody(addEmailMutationSchema),
  addEmailHandler,
)

userRouter.post(
  '/resend-email-verification',
  authorize,
  authorizeAccountType,
  validateBody(resendEmailVerificationMutationSchema),
  resendEmailVerificationHandler,
)

userRouter.post(
  '/verify-secondary-email',
  authorize,
  authorizeAccountType,
  validateBody(verifySecondaryEmailMutaitonSchema),
  verifySecondaryEmailHandler,
)

userRouter.post(
  '/set-primary-email',
  authorize,
  authorizeAccountType,
  validateBody(setPrimaryEmailMutationSchema),
  setPrimaryEmailHandler,
)

userRouter.post(
  '/delete-email',
  authorize,
  authorizeAccountType,
  validateBody(deleteEmailMutationSchema),
  deleteEmailHandler,
)

userRouter.patch(
  '/',
  authorize,
  authorizeAccountType,
  validateBody(userFullNameMutationSchema),
  updateUserHandler,
)

userRouter.post(
  '/delete-account',
  authorize,
  authorizeAccountType,
  validateBody(deleteUserAccountMutationSchema),
  deleteUserAccountHandler,
)
