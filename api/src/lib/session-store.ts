import session, { type SessionData } from 'express-session'
import ms from 'ms'

import { db } from './db.js'

class PostgresSessionStore extends session.Store {
  private maxAge: number

  constructor() {
    super()
    this.maxAge = ms('1 week')
  }

  async get(
    sid: string,
    callback: (err: unknown, session?: session.SessionData | null) => void,
  ): Promise<void> {
    try {
      const getResult = await db.sessions.findFirst({
        where: {
          sid,
        },
      })

      if (!getResult) {
        callback(null, null)
        return
      }

      callback(null, JSON.parse(getResult?.data || ''))
    } catch (err) {
      callback(err)
    }
  }

  async set(
    sid: string,
    sessionData: SessionData,
    callback?: (err?: unknown) => void,
  ): Promise<void> {
    try {
      const data = JSON.stringify(sessionData)
      const expiresAt = Date.now() + this.maxAge

      await db.sessions.upsert({
        create: {
          data,
          expire_at: new Date(expiresAt),
          sid,
          user_id: sessionData.userId,
        },
        update: {
          data,
          expire_at: new Date(expiresAt),
          sid,
        },
        where: {
          sid,
        },
      })

      callback?.(null)
    } catch (err) {
      callback?.(err)
    }
  }

  async destroy(
    sid: string,
    callback?: (err?: unknown) => void,
  ): Promise<void> {
    try {
      await db.sessions.delete({
        where: {
          sid: sid,
        },
      })

      callback?.(null)
    } catch (err) {
      callback?.(err)
    }
  }
}

export default PostgresSessionStore
