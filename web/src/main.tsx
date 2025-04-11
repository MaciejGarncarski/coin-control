import './styles.css'

import type { ApiError } from '@shared/schemas'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

import { auth } from '@/config/auth'
import { ErrorPage } from '@/features/layout/pages/error'
import { userQueryOptions } from '@/lib/auth'
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
  defaultViewTransition: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const MainApp = () => {
  const userAuthenticated = useQuery(userQueryOptions)

  useEffect(() => {
    if (userAuthenticated.isLoading) {
      return
    }

    router.invalidate()
  }, [userAuthenticated.data, userAuthenticated.isLoading])

  if (userAuthenticated.isLoading) return null

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          ...auth,
          status: userAuthenticated?.data?.id ? 'loggedIn' : 'loggedOut',
          isEmailVerified: userAuthenticated?.data?.isEmailVerified || false,
        },
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
