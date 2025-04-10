import {
  ArrowLeftRight,
  Blocks,
  ChartArea,
  type LucideIcon,
  User,
} from 'lucide-react'

import type { FileRoutesByTo } from '@/routeTree.gen'

type RoutesData = Array<{
  icon: LucideIcon
  url: keyof FileRoutesByTo
  text: string
}>

export const rotues = [
  {
    icon: Blocks,
    text: 'Dashboard',
    url: '/',
  },
  {
    icon: ArrowLeftRight,
    text: 'Transactions',
    url: '/transactions',
  },
  {
    icon: ChartArea,
    text: 'Analytics',
    url: '/analytics',
  },
  {
    icon: User,
    text: 'Account',
    url: '/account',
  },
] satisfies RoutesData
