import { createHash } from 'node:crypto'

import { v7 } from 'uuid'

export const getHashCode = () =>
  createHash('sha512').update(v7()).digest('hex').slice(0, 48)
