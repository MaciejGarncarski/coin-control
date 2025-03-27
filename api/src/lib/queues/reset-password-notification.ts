import { Queue, redisClient } from '@shared/queues'
import { type ResetPasswordNotificationJob } from '@shared/schemas'

export const resetPasswordNotificationQueue =
  new Queue<ResetPasswordNotificationJob>('resetPasswordNotification', {
    connection: redisClient,
  })
