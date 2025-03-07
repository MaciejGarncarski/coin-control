import { Router } from 'express'

import { loginMutationSchema } from '@shared/zod-schemas/auth/login.js'
import { postLoginHandler } from './auth.controller.js'
import { validateData } from '../../middlewares/validator.js'

const route = Router()

export const authRoutes = (app: Router) => {
  app.use('/auth', route)
  route.post('/login', validateData(loginMutationSchema), postLoginHandler)
}
