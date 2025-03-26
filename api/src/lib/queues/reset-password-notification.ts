import { type ResetPasswordNotificationJob } from '@shared/schemas'
import { Queue } from 'bullmq'

import { connection } from '../redis.js'

export const resetPasswordNotificationQueue =
  new Queue<ResetPasswordNotificationJob>('resetPasswordNotification', {
    connection: connection,
  })
