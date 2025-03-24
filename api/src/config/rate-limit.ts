import { createRateLimiter } from '../lib/rate-limiter.js'
import ms from 'ms'

export const limiter = createRateLimiter({
  windowMs: ms('15 minutes'),
  limit: 100,
})
