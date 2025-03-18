import { useQuery } from '@tanstack/react-query'

type UseApiProperties<T> = {
  queryKey: Array<string> | string
  queryFn: () => T
}

export const useApi = <T>({ queryKey, queryFn }: UseApiProperties<T>) => {
  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: queryFn,
  })
}
