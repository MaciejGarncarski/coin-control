import { env } from '@/config/env'
import { z } from '@shared/zod-schemas'

type ResponseType = 'json' | 'text' | 'arrayBuffer'

type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'

type Body = FormData | Record<string, unknown>

type Properties<
  R extends ResponseType | undefined = 'json',
  M extends HttpMethod = 'GET',
  S extends z.ZodTypeAny = z.ZodTypeAny,
> = {
  responseType?: R
  method: M
  url: string
  body?: M extends 'POST'
    ? Body
    : M extends 'PUT'
      ? Body
      : M extends 'PATCH'
        ? Body
        : never
  schema?: R extends 'arrayBuffer' ? never : S
}

type ReturnType<R extends ResponseType | undefined, S extends z.ZodTypeAny> =
  | {
      data: R extends 'arrayBuffer'
        ? ArrayBuffer
        : R extends 'text'
          ? S extends undefined
            ? string
            : z.infer<S>
          : S extends undefined
            ? Record<string, unknown>
            : z.infer<S>
      status: 'ok'
      statusCode?: number
    }
  | {
      message: string
      status: 'error'
      statusCode?: number
    }

export const fetcher = async <
  R extends ResponseType | undefined = 'json',
  M extends HttpMethod = 'GET',
  S extends z.ZodTypeAny = z.ZodTypeAny,
>({
  body,
  method,
  responseType = 'json',
  schema,
  url,
}: Properties<R, M, S>): Promise<ReturnType<R, S>> => {
  const transformedBody =
    method === 'POST'
      ? body
      : method === 'PUT'
        ? body
        : method === 'PATCH'
          ? body
          : null

  const response = await fetch(pasrseUrl(url), {
    body: canSendBody(method)
      ? transformedBody instanceof FormData
        ? transformedBody
        : JSON.stringify(transformedBody)
      : undefined,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: method,
  })

  if (!response.ok) {
    return {
      status: 'error',
      message: 'request failed',
      statusCode: response.status,
    }
  }

  const transformedData =
    responseType === 'arrayBuffer'
      ? await response.arrayBuffer()
      : responseType === 'text'
        ? await response.text()
        : responseType === 'json'
          ? await response.json()
          : await response.json()

  if (!schema) {
    return {
      data: transformedData,
      status: 'ok',
      statusCode: response.status,
    }
  }

  const parsed = schema.safeParse(transformedData)

  if (parsed.error) {
    return {
      status: 'error',
      message: 'parsing failed',
    }
  }

  return {
    data: parsed.data,
    status: 'ok',
  }
}

function canSendBody(method: HttpMethod) {
  if (method === 'PUT' || method === 'POST' || method === 'PATCH') {
    return true
  }

  return false
}

function pasrseUrl(url: string) {
  return url.startsWith('http') ? url : env.API_URL + url
}
