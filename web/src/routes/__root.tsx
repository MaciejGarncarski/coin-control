import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { lazy } from 'react'
import { ThemeProvider } from '@/features/layout/comoponents/theme-provider'

export const auth: Auth = {
  status: 'loggedOut',
  isEmailVerified: false,
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
  isEmailVerified: boolean
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
  return (
    <>
      <HeadContent />
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>
      <Toaster position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <LazyRouterDevtools position="bottom-left" />
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
  pendingMinMs: 0,
  pendingMs: 0,
  component: () => <RootComponent />,
  shouldReload({ context }) {
    return context.auth.status !== 'loggedIn'
  },
})
