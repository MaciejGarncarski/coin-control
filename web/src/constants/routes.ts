import {
  ArrowLeftRight,
  Blocks,
  type LucideIcon,
  PiggyBank,
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
    icon: PiggyBank,
    text: 'Budgets',
    url: '/budgets',
  },
  {
    icon: User,
    text: 'Account',
    url: '/account',
  },
] satisfies RoutesData
