import { Queue } from 'bullmq'

import { connection } from '../redis.js'
import { type ResetPasswordNotificationJob } from '@shared/schemas'

export const resetPasswordNotificationQueue =
  new Queue<ResetPasswordNotificationJob>('resetPasswordNotification', {
    connection: connection,
  })
