import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'
import { lazy } from 'react'
import { Toaster } from 'sonner'

import type { Auth } from '@/config/auth'
import { NotFoundPage } from '@/features/layout/pages/not-found'
import { useDetectTheme } from '@/hooks/use-detect-theme'

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
  useDetectTheme()

  return (
    <>
      <HeadContent />
      <Outlet />
      <Toaster position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <LazyRouterDevtools position="bottom-right" />
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
  notFoundComponent: NotFoundPage,
  component: () => <RootComponent />,
  shouldReload({ context }) {
    return context.auth.status !== 'loggedIn'
  },
})
