import type { Request } from 'express'

export interface TypedRequestBody<T> extends Request {
  body: T
}

export interface TypedRequestParams<
  T extends Record<string, string>,
> extends Request {
  params: T
}

export interface TypedRequestQuery<
  T extends Record<string, string>,
> extends Request {
  query: T
}
