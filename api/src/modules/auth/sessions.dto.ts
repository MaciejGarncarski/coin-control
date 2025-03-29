import type { Prisma } from '@prisma/client'
import type { MySession } from '@shared/schemas'

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
    }
  }>,
): MySession {
  return {
    deviceType: sessions.device_type,
    ip: sessions.ip_address,
    lastAccess: sessions.last_access,
    location: sessions.location,
    os: sessions.operating_system,
    browser: sessions.browser,
    sid: sessions.sid,
  }
}
