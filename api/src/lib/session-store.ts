import session, { type SessionData } from 'express-session'
import type { Sql } from 'postgres'
import { db } from '../../lib/db.js'
import ms from 'ms'

interface PostgresSessionStoreOptions {
  table?: string
  ssl?: boolean
}

class PostgresSessionStore extends session.Store {
  private sql: Sql
  private table: string
  private maxAge: number

  constructor() {
    super()
    this.sql = db
    this.table = 'sessions'
    this.maxAge = ms('1 week')
  }

  async get(
    sid: string,
    callback: (err: unknown, session?: session.SessionData | null) => void,
  ): Promise<void> {
    try {
      const result = await this.sql<{ data: string }[]>`
        SELECT data FROM ${this.sql(this.table)} WHERE sid = ${sid}
      `
      if (result.length > 0) {
        if (result[0]) {
          callback(null, JSON.parse(result[0].data))
        }
      } else {
        callback(null, null)
      }
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

      await this.sql`
        INSERT INTO ${this.sql(this.table)} (sid, data, expire_at)
        VALUES (${sid}, ${data}, ${expiresAt})
        ON CONFLICT (sid) DO UPDATE
        SET data = ${data}, expire_at = ${expiresAt}
      `
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
      await this.sql`
        DELETE FROM ${this.sql(this.table)} WHERE sid = ${sid}
      `
      callback?.(null)
    } catch (err) {
      callback?.(err)
    }
  }
}

export default PostgresSessionStore
