import { z } from "@shared/zod-schemas";

export type FetcherDataTransform = "json" | "text" | "arrayBuffer";

export type FetcherConfig<
  T extends FetcherTransformType = FetcherDataTransform,
  S extends z.ZodTypeAny = z.ZodTypeAny
> = {
  url: string;
  transformTo?: T;
  schema?: T extends "json" ? S : T extends "text" ? S : never;
};

export type FetcherConfigPOST<
  T extends FetcherTransformType = FetcherDataTransform,
  S extends z.ZodTypeAny = z.ZodTypeAny
> = {
  body: unknown;
} & FetcherConfig<T, S>;

export type FetcherTransformType = FetcherConfig<
  FetcherDataTransform,
  z.ZodTypeAny
>["transformTo"];

export type FetcherReturn<
  T extends FetcherTransformType,
  S extends z.ZodTypeAny
> = {
  data: T extends "arrayBuffer"
    ? ArrayBuffer
    : T extends "text"
    ? S extends "undefined"
      ? string
      : z.infer<S>
    : T extends "json"
    ? S extends "undefined"
      ? Record<string, unknown>
      : z.infer<S>
    : null;
  status: "ok" | "error";
  message?: string;
  statusCode: number;
};

type TransformRequestConfig<
  T extends FetcherTransformType = FetcherDataTransform,
  S extends z.ZodTypeAny = z.ZodTypeAny
> = {
  responsePromise: Promise<Response>;
  transformTo?: T;
  schema?: T extends "json" ? S : T extends "text" ? S : never;
};

export const transformReqeust = async <
  T extends FetcherTransformType = FetcherDataTransform,
  S extends z.ZodTypeAny = z.ZodTypeAny
>({
  responsePromise,
  schema,
  transformTo,
}: TransformRequestConfig) => {
  try {
    const response = await responsePromise;

    if (!response.ok) {
      throw {
        data: "responseError",
        status: "error",
        statusCode: response.status,
      } as FetcherReturn<T, S>;
    }

    if (transformTo === "arrayBuffer") {
      const responseArrayBuffer = await response.arrayBuffer();
      return {
        data: responseArrayBuffer,
        status: "ok",
        statusCode: response.status,
      } as FetcherReturn<T, S>;
    }

    if (transformTo === "text") {
      const responseText = await response.text();
      if (schema) {
        const parsedResponse = schema.safeParse(responseText);

        if (!parsedResponse.success) {
          throw {
            data: "parsingError",
            status: "error",
          } as FetcherReturn<T, S>;
        }

        return {
          data: parsedResponse.data,
          status: "ok",
          statusCode: response.status,
        } as FetcherReturn<T, S>;
      }

      return {
        data: responseText,
        status: "ok",
        statusCode: response.status,
      } as FetcherReturn<T, S>;
    }

    const responseJson = await response.json();

    if (schema) {
      const parsedResponse = schema.safeParse(responseJson);

      if (!parsedResponse.success) {
        throw {
          data: "parsingError",
          status: "error",
          statusCode: 500,
        } as FetcherReturn<T, S>;
      }

      return {
        data: parsedResponse.data,
        status: "ok",
        statusCode: response.status,
      } as FetcherReturn<T, S>;
    }

    return {
      data: responseJson,
      status: "ok",
      statusCode: response.status,
    } as FetcherReturn<T, S>;
  } catch {
    throw {
      data: null,
      status: "error",
    } as FetcherReturn<T, S>;
  }
};

export const fetcher = {
  get: async <
    S extends z.ZodTypeAny,
    T extends FetcherTransformType = FetcherDataTransform
  >({
    url,
    transformTo = "json",
    schema,
  }: FetcherConfig<T, S>): Promise<FetcherReturn<T, S>> => {
    const fetchUrl = url.startsWith("http")
      ? url
      : import.meta.env.VITE_API_URL + url;

    const responsePromise = fetch(fetchUrl, {
      method: "GET",
      credentials: "include",
    });

    return transformReqeust({ responsePromise, schema, transformTo });
  },

  delete: async <
    S extends z.ZodTypeAny,
    T extends FetcherTransformType = FetcherDataTransform
  >({
    url,
    transformTo = "json",
    schema,
  }: FetcherConfig<T, S>): Promise<FetcherReturn<T, S>> => {
    const fetchUrl = url.startsWith("http")
      ? url
      : import.meta.env.VITE_API_URL + url;

    const responsePromise = fetch(fetchUrl, {
      method: "DELETE",
      credentials: "include",
    });

    return transformReqeust({ responsePromise, schema, transformTo });
  },

  post: async <
    S extends z.ZodTypeAny,
    T extends FetcherTransformType = FetcherDataTransform
  >({
    url,
    transformTo = "json",
    schema,
    body,
  }: FetcherConfigPOST<T, S>): Promise<FetcherReturn<T, S>> => {
    const fetchUrl = url.startsWith("http")
      ? url
      : import.meta.env.VITE_API_URL + url;

    const responsePromise = fetch(fetchUrl, {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return transformReqeust({ responsePromise, schema, transformTo });
  },
};
