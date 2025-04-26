import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'
import { lazy } from 'react'
import { Toaster } from 'sonner'

import { NotFoundPage } from '@/features/layout/pages/not-found'
import type { Auth, AuthUtils } from '@/hooks/use-auth'
import { useDetectTheme } from '@/hooks/use-detect-theme'

interface RouterContext {
  queryClient: QueryClient
  auth: Auth & AuthUtils
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
        content:
          'Budget tracking app designed to help users monitor their income and expenses. It addresses the common problem of lacking control over personal finances by providing tools for effective money management.',
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  component: () => <RootComponent />,
})
