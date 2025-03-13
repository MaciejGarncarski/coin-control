import { Router } from 'express'

import {
  loginMutationSchema,
  registerMutationSchema,
} from '@shared/zod-schemas'
import {
  getUserHandler,
  logoutHandler,
  postLoginHandler,
  registerHandler,
} from './auth.controller.js'
import { validateData } from '../../middlewares/validator.js'

const route = Router()

export const authRoutes = (app: Router) => {
  app.use('/auth', route)
  route.post('/login', validateData(loginMutationSchema), postLoginHandler)
  route.post('/register', validateData(registerMutationSchema), registerHandler)

  route.get('/me', getUserHandler)
  route.delete('/me', logoutHandler)
}
