import type { Prisma } from '@shared/database'
import type { MySession } from '@shared/schemas'

import { decrypt } from '../utils/encryption.js'

export function sessionsDTO(
  sessions: Prisma.sessionsGetPayload<{
    select: {
      browser: true
      device_type: true
      ip_address: true
      last_access: true
      location: true
      operating_system: true
      sid: true
      id: true
    }
  }>,
  sessionId: string,
): MySession {
  return {
    deviceType: sessions.device_type,
    ip: sessions.ip_address ? decrypt(sessions.ip_address) : null,
    location: sessions.location ? decrypt(sessions.location) : null,
    lastAccess: sessions.last_access,
    os: sessions.operating_system,
    browser: sessions.browser,
    id: sessions.id,
    current: sessionId === sessions.sid,
  }
}

export function sessionsDTODemoAcc(
  sessions: Prisma.sessionsGetPayload<{
    select: {
      browser: true
      device_type: true
      ip_address: true
      last_access: true
      location: true
      operating_system: true
      sid: true
      id: true
    }
  }>,
  sessionId: string,
): MySession {
  return {
    deviceType: sessions.device_type,
    ip: 'DEMO',
    location: sessions.location ? decrypt(sessions.location) : null,
    lastAccess: sessions.last_access,
    os: sessions.operating_system,
    browser: sessions.browser,
    id: sessions.id,
    current: sessionId === sessions.sid,
  }
}
