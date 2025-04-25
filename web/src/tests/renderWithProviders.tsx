/* eslint-disable react/display-name */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const createWrapper = () => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        staleTime: 0,
        retry: false,
      },
    },
  })

  return ({ children }: Props) => {
    return (
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

export const renderWithProviders = (children: ReactNode) => {
  const setup = userEvent.setup()

  return {
    user: setup,
    ...render(children, { wrapper: createWrapper() }),
  }
}
