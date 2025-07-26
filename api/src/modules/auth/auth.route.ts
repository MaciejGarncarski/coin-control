import {
  EmailVerificationVerifyMutationSchema,
  loginMutationSchema,
  logOutDeviceQuerySchema,
  registerMutationSchema,
} from '@shared/schemas'
import { Router } from 'express'

import { authorize } from '../../middlewares/authorize.js'
import { authorizeAccountType } from '../../middlewares/authorize-account-type.js'
import { validateBody } from '../../middlewares/validator-body.js'
import { validateParams } from '../../middlewares/validator-params.js'
import {
  getMySessionsHandler,
  getUserHandler,
  logOutDeviceHandler,
  logOutEveryDeviceHandler,
  logoutHandler,
  postLoginHandler,
  registerHandler,
  sendEmailVerificationHandler,
  verifyAccountHandler,
} from './auth.controller.js'
import { authGoogleRouter } from './google/google-auth.route.js'
import { passwordRouter } from './password/password.route.js'

export const authRouter = Router()

authRouter.use('/password', passwordRouter)
authRouter.use('/google', authGoogleRouter)

authRouter.post('/login', validateBody(loginMutationSchema), postLoginHandler)

authRouter.post(
  '/register',
  validateBody(registerMutationSchema),
  registerHandler,
)

authRouter.get('/my-sessions', authorize, getMySessionsHandler)

authRouter.delete(
  '/my-sessions',
  authorize,
  authorizeAccountType,
  logOutEveryDeviceHandler,
)

authRouter.delete(
  '/my-sessions/:id',
  authorize,
  authorizeAccountType,
  validateParams(logOutDeviceQuerySchema),
  logOutDeviceHandler,
)

authRouter.get('/me', authorize, getUserHandler)

authRouter.delete('/me', logoutHandler)

authRouter.post(
  '/account-verification',
  authorize,
  sendEmailVerificationHandler,
)

authRouter.post(
  '/verify-otp',
  authorize,
  validateBody(EmailVerificationVerifyMutationSchema),
  verifyAccountHandler,
)
