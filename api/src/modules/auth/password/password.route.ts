import {
  forgotPasswordEmailMutationSchema,
  resetPasswordMutationSchema,
} from '@shared/schemas'
import { Router } from 'express'

import { validateBody } from '../../../middlewares/validator-body.js'
import {
  forgotPasswordLinkHandler,
  resetPasswordHandler,
} from './password.controller.js'

export const passwordRouter = Router({ mergeParams: true })

passwordRouter.post(
  '/forgot',
  validateBody(forgotPasswordEmailMutationSchema),
  forgotPasswordLinkHandler,
)

passwordRouter.post(
  '/reset',
  validateBody(resetPasswordMutationSchema),
  resetPasswordHandler,
)
