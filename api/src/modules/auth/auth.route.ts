import { Router } from 'express'

import {
  forgotPasswordEmailMutationSchema,
  loginMutationSchema,
  OTPVerifyMutationSchema,
  registerMutationSchema,
  resetPasswordMutationSchema,
} from '@shared/zod-schemas'
import {
  forgotPasswordLinkHandler,
  getOTPHandler,
  getUserHandler,
  logoutHandler,
  postLoginHandler,
  registerHandler,
  resetPasswordHandler,
  verifyOTPHandler,
} from './auth.controller.js'
import { validateData } from '../../middlewares/validator.js'
import rateLimit from 'express-rate-limit'

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
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

  route.get('/me', getUserHandler)
  route.delete('/me', logoutHandler)

  route.post('/otp', getOTPHandler)
  route.post(
    '/verify-otp',
    validateData(OTPVerifyMutationSchema),
    authLimiter,
    verifyOTPHandler,
  )

  route.post(
    '/forgot-password-link',
    validateData(forgotPasswordEmailMutationSchema),
    authLimiter,
    forgotPasswordLinkHandler,
  )

  route.post(
    '/reset-password',
    validateData(resetPasswordMutationSchema),
    authLimiter,
    resetPasswordHandler,
  )
}
