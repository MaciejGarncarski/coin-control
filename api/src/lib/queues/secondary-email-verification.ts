import {
  type NewEmailVerificationJob,
  Queue,
  QUEUES,
  redisClient,
} from '@shared/queues'

export const secondaryEmailVerificationQueue =
  new Queue<NewEmailVerificationJob>(QUEUES.NEW_EMAIL_VERIFICATION, {
    connection: redisClient,
  })
