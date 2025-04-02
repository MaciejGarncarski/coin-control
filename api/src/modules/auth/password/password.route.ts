import {
  forgotPasswordEmailMutationSchema,
  resetPasswordMutationSchema,
} from '@shared/schemas'
import { Router } from 'express'

import { validateData } from '../../../middlewares/validator.js'
import {
  forgotPasswordLinkHandler,
  resetPasswordHandler,
} from './password.controller.js'

export const passwordRouter = Router({ mergeParams: true })

passwordRouter.post(
  '/forgot',
  validateData(forgotPasswordEmailMutationSchema),
  forgotPasswordLinkHandler,
)

passwordRouter.post(
  '/reset',
  validateData(resetPasswordMutationSchema),
  resetPasswordHandler,
)
