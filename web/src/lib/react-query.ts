import {
  type DefaultOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'

export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60,
  },
} satisfies DefaultOptions

export type ApiFnReturnType<
  FnType extends (...args: Array<unknown>) => Promise<unknown>,
> = Awaited<ReturnType<FnType>>

export type QueryConfig<T extends (...args: Array<unknown>) => unknown> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>

export type MutationConfig<
  MutationFnType extends (...args: Array<unknown>) => Promise<unknown>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>
