import './styles.css'

import type { ApiError } from '@shared/schemas'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { ErrorPage } from '@/features/layout/pages/error'
import { useAuth } from '@/hooks/use-auth'
import { queryConfig } from '@/lib/react-query'

import { routeTree } from './routeTree.gen'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})

export const router = createRouter({
  context: {
    auth: undefined!,
    queryClient: queryClient,
  },
  routeTree,
  defaultErrorComponent: ErrorPage,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultViewTransition: false,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const MainApp = () => {
  const auth = useAuth()

  return (
    <RouterProvider
      router={router}
      context={{
        auth: auth,
      }}
    />
  )
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MainApp />
      </QueryClientProvider>
    </StrictMode>,
  )
}
