import { env } from '@/config/env'
import { ApiError } from '@/utils/api-error'
import { apiErrorSchema, z } from '@shared/zod-schemas'

type ResponseType = 'json' | 'text' | 'arrayBuffer'

type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'

type Body = FormData | Record<string, unknown>

export type FetcherProperties<
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
  throwOnError?: boolean
  signal?: AbortSignal
  headers?: HeadersInit
}

type ReturnType<R extends ResponseType | undefined, S extends z.ZodTypeAny> =
  | (R extends 'arrayBuffer'
      ? ArrayBuffer
      : R extends 'text'
        ? S extends undefined
          ? string
          : z.infer<S>
        : S extends undefined
          ? Record<string, unknown>
          : z.infer<S>)
  | never
  | null

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
  throwOnError = false,
  headers,
  signal,
}: FetcherProperties<R, M, S>): Promise<ReturnType<R, S>> => {
  try {
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
      signal: signal,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      method: method,
    })

    if (!response.ok) {
      const responseJson = await response.json()
      const parsedResponse = apiErrorSchema.safeParse(responseJson)

      if (!parsedResponse.success) {
        throw new ApiError({
          statusCode: response.status,
          message: 'parsing failed',
        })
      }

      if (parsedResponse.data.toastMessage) {
        throw new ApiError({
          message: 'request failed',
          statusCode: response.status,
          toastMessage: parsedResponse.data.toastMessage,
        })
      }

      if (parsedResponse.data.message) {
        throw new ApiError({
          statusCode: response.status,
          message: parsedResponse.data.message,
        })
      }

      throw new ApiError({
        statusCode: response.status,
        message: 'request failed',
      })
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
      return transformedData
    }

    const parsed = schema.safeParse(transformedData)

    if (parsed.error) {
      throw new ApiError({
        statusCode: response.status,
        message: 'parsing failed',
      })
    }

    return parsed.data
  } catch (error) {
    if (throwOnError) {
      throw error
    }

    return null
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

/// ciekawy pomysl
/// zrobic reusable useQuery, useMutation,
/// useApi([AUTH_QUERY_KEYS.SESSION], fetchUser(userId), {onSuccess: (dostepny queryClient + typesafe query data) => {toast costam}})
