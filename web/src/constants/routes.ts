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
    text: 'Spendings',
    url: '/spendings',
  },
  {
    text: 'Budgets',
    url: '/budgets',
  },
  {
    text: 'Incomes',
    url: '/incomes',
  },
] satisfies RoutesData
