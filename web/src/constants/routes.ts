type RoutesData = Array<{
  url: string
  text: string
}>

export const rotues = [
  {
    text: 'Dashboard',
    url: '/',
  },
  {
    text: 'Transactions',
    url: '/transactions',
  },
  {
    text: 'Budgets',
    url: '/budgets',
  },
] satisfies RoutesData
