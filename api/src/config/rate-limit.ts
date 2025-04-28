import ms from 'ms'

import { createRateLimiter } from '../lib/rate-limiter.js'

export const globalRateLimit = createRateLimiter({
  windowMs: ms('15 minutes'),
  limit: 100,
})
