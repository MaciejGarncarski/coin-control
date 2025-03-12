import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { lazy } from 'react'

interface RouterContext {
  queryClient: QueryClient
}

const LazyRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then((m) => ({
          default: m.TanStackRouterDevtools,
        })),
      )

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
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      {process.env.NODE_ENV === 'development' ? 'dev' : 'prod'}
      <Toaster position="bottom-right" />
      <ReactQueryDevtools buttonPosition="top-right" />
      <LazyRouterDevtools />
    </>
  ),
})
