import {
  EmailVerificationVerifyMutationSchema,
  loginMutationSchema,
  logOutDeviceQuerySchema,
  registerMutationSchema,
} from '@shared/schemas'
import { Router } from 'express'
import ms from 'ms'

import { createRateLimiter } from '../../lib/rate-limiter.js'
import { authorize } from '../../middlewares/authorize.js'
import { validateData } from '../../middlewares/validator.js'
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
import { passwordRouter } from './password/password.route.js'

const authLimiter = createRateLimiter({
  windowMs: ms('3 minutes'),
  limit: 50,
})

const otpLimiter = createRateLimiter({
  windowMs: ms('3 minutes'),
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
})

export const authRouter = Router()

authRouter.use('/password', passwordRouter)
authRouter.post(
  '/login',
  validateData(loginMutationSchema),
  authLimiter,
  postLoginHandler,
)

authRouter.post(
  '/register',
  validateData(registerMutationSchema),
  authLimiter,
  registerHandler,
)

authRouter.get('/my-sessions', authorize, getMySessionsHandler)

authRouter.delete(
  '/my-sessions',
  authLimiter,
  authorize,
  logOutEveryDeviceHandler,
)

authRouter.delete(
  '/my-sessions/:id',
  authLimiter,
  authorize,
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
  otpLimiter,
  authorize,
  validateData(EmailVerificationVerifyMutationSchema),
  verifyAccountHandler,
)
