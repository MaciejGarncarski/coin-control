import {
  ArrowLeftRight,
  Blocks,
  type LucideIcon,
  PiggyBank,
  User,
} from 'lucide-react'

type RoutesData = Array<{
  icon: LucideIcon
  url: string
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
