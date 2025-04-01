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

const route = Router()

const addNewEmailLimiter = createRateLimiter({
  windowMs: ms('3 minutes'),
  limit: 5,
})

export const userRoutes = (app: Router) => {
  app.use('/user', route)

  route.get('/emails', authorize, getUserEmailsHandler)

  route.post(
    '/emails',
    addNewEmailLimiter,
    authorize,
    validateData(addEmailMutationSchema),
    addEmailHandler,
  )

  route.post(
    '/resend-email-verification',
    authorize,
    validateData(resendEmailVerificationMutationSchema),
    resendEmailVerificationHandler,
  )

  route.post(
    '/verify-secondary-email',
    authorize,
    validateData(verifySecondaryEmailMutaitonSchema),
    verifySecondaryEmailHandler,
  )

  route.post(
    '/set-primary-email',
    authorize,
    validateData(setPrimaryEmailMutationSchema),
    setPrimaryEmailHandler,
  )

  route.post(
    '/delete-email',
    authorize,
    validateData(deleteEmailMutationSchema),
    deleteEmailHandler,
  )
}
