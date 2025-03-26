import './styles.css'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

import { userQueryOptions } from '@/lib/auth'
import { queryConfig } from '@/lib/react-query'
import { auth } from '@/routes/__root'

import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})

const router = createRouter({
  context: {
    auth: undefined!,
    queryClient: queryClient,
  },
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const MainApp = () => {
  const userAuthenticated = useQuery(userQueryOptions)

  useEffect(() => {
    router.invalidate()
  }, [userAuthenticated?.data])

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
