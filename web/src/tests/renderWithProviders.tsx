import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0,
      retry: false,
    },
  },
})

const wrapper = ({ children }: Props) => (
  <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
)

export const renderWithProviders = (children: ReactNode) => {
  return render(children, { wrapper: wrapper })
}
