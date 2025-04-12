import { Router } from 'express'

import {
  googleAuthHandler,
  googleAuthRedirectHandler,
} from './google-auth.controller.js'

export const authGoogleRouter = Router()

authGoogleRouter.get('/', googleAuthHandler)
authGoogleRouter.get('/callback', googleAuthRedirectHandler)
