import {
  EmailVerificationVerifyMutationSchema,
  forgotPasswordEmailMutationSchema,
  loginMutationSchema,
  logOutDeviceQuerySchema,
  registerMutationSchema,
  resetPasswordMutationSchema,
} from '@shared/schemas'
import { Router } from 'express'
import ms from 'ms'

import { createRateLimiter } from '../../lib/rate-limiter.js'
import { authorize } from '../../middlewares/authorize.js'
import { validateData } from '../../middlewares/validator.js'
import { validateParams } from '../../middlewares/validator-params.js'
import {
  forgotPasswordLinkHandler,
  getMySessionsHandler,
  getUserHandler,
  logOutDeviceHandler,
  logOutEveryDeviceHandler,
  logoutHandler,
  postLoginHandler,
  registerHandler,
  resetPasswordHandler,
  sendEmailOTPCodeHandler,
  verifyEmailHandler,
} from './auth.controller.js'

const authLimiter = createRateLimiter({
  windowMs: ms('3 minutes'),
  limit: 10,
})

const otpLimiter = createRateLimiter({
  windowMs: ms('3 minutes'),
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
})

const emailLimiter = createRateLimiter({
  windowMs: ms('5 minutes'),
  limit: 3,
})

const route = Router()

export const authRoutes = (app: Router) => {
  app.use('/auth', route)

  route.post(
    '/login',
    validateData(loginMutationSchema),
    authLimiter,
    postLoginHandler,
  )
  route.post(
    '/register',
    validateData(registerMutationSchema),
    authLimiter,
    registerHandler,
  )

  route.get('/my-sessions', authorize, getMySessionsHandler)
  route.delete('/my-sessions', authLimiter, authorize, logOutEveryDeviceHandler)
  route.delete(
    '/my-sessions/:id',
    authLimiter,
    authorize,
    validateParams(logOutDeviceQuerySchema),
    logOutDeviceHandler,
  )

  route.get('/me', getUserHandler)
  route.delete('/me', logoutHandler)

  route.post('/email-verification', sendEmailOTPCodeHandler)
  route.post(
    '/verify-otp',
    otpLimiter,
    validateData(EmailVerificationVerifyMutationSchema),
    verifyEmailHandler,
  )

  route.post(
    '/forgot-password-link',
    emailLimiter,
    validateData(forgotPasswordEmailMutationSchema),
    forgotPasswordLinkHandler,
  )

  route.post(
    '/reset-password',
    otpLimiter,
    validateData(resetPasswordMutationSchema),
    resetPasswordHandler,
  )
}
