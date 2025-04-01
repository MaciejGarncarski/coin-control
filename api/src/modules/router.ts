import { Router } from 'express'

import { authRoutes } from './auth/auth.route.js'
import { userRoutes } from './user/user.route.js'

export const router = () => {
  const app = Router()

  authRoutes(app)
  userRoutes(app)

  return app
}
