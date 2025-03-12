import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { lazy } from 'react'
import { useAuth } from '@/hooks/use-auth'

export const auth: Auth = {
  status: 'loggedOut',
  login: () => {
    auth.status = 'loggedIn'
  },
  logout: () => {
    auth.status = 'loggedOut'
  },
}

export type Auth = {
  login: () => void
  logout: () => void
  status: 'loggedOut' | 'loggedIn'
}

interface RouterContext {
  queryClient: QueryClient
  auth: Auth
}

const LazyRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/react-router-devtools').then((m) => ({
          default: m.TanStackRouterDevtools,
        })),
      )

const RootComponent = () => {
  useAuth()

  return (
    <>
      <HeadContent />
      <Outlet />
      {process.env.NODE_ENV === 'development' ? 'dev' : 'prod'}
      <Toaster position="bottom-right" />
      <ReactQueryDevtools buttonPosition="top-right" />
      <LazyRouterDevtools />
    </>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { title: 'CoinControl' },
      {
        name: 'description',
        content: 'CoinControl - App to track your spendings in one place',
      },
    ],
  }),
  pendingComponent: () => <div>Loading...</div>,
  wrapInSuspense: true,
  pendingMinMs: 0,
  pendingMs: 0,
  component: () => <RootComponent />,
})
