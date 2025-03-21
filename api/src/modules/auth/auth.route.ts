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

const route = Router()

export const authRoutes = (app: Router) => {
  app.use('/auth', route)
  route.post('/login', validateData(loginMutationSchema), postLoginHandler)
  route.post('/register', validateData(registerMutationSchema), registerHandler)

  route.get('/me', getUserHandler)
  route.delete('/me', logoutHandler)

  route.post('/otp', getOTPHandler)
  route.post(
    '/verify-otp',
    validateData(OTPVerifyMutationSchema),
    verifyOTPHandler,
  )

  route.post(
    '/forgot-password-link',
    validateData(forgotPasswordEmailMutationSchema),
    forgotPasswordLinkHandler,
  )

  route.post(
    '/reset-password',
    validateData(resetPasswordMutationSchema),
    resetPasswordHandler,
  )
}
