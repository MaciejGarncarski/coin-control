import ms from 'ms'

import { createRateLimiter } from '../lib/rate-limiter.js'

export const limiter = createRateLimiter({
  windowMs: ms('15 minutes'),
  limit: 100,
})
