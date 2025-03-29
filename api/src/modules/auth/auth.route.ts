import {
  forgotPasswordEmailMutationSchema,
  loginMutationSchema,
  logOutDeviceQuerySchema,
  OTPVerifyMutationSchema,
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
  getOTPHandler,
  getUserHandler,
  logOutDeviceHandler,
  logOutEveryDeviceHandler,
  logoutHandler,
  postLoginHandler,
  registerHandler,
  resetPasswordHandler,
  verifyOTPHandler,
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
    '/my-sessions/:sid',
    authLimiter,
    authorize,
    validateParams(logOutDeviceQuerySchema),
    logOutDeviceHandler,
  )

  route.get('/me', getUserHandler)
  route.delete('/me', logoutHandler)

  route.post('/otp', getOTPHandler)
  route.post(
    '/verify-otp',
    validateData(OTPVerifyMutationSchema),
    otpLimiter,
    verifyOTPHandler,
  )

  route.post(
    '/forgot-password-link',
    validateData(forgotPasswordEmailMutationSchema),
    emailLimiter,
    forgotPasswordLinkHandler,
  )

  route.post(
    '/reset-password',
    validateData(resetPasswordMutationSchema),
    otpLimiter,
    resetPasswordHandler,
  )
}
