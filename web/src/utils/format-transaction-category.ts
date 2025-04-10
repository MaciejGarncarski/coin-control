import type { Category } from '@shared/schemas'

const transactionNames: Record<Category, string> = {
  foodAndDrink: 'Food and drink',
  groceries: 'Groceries',
  housing: 'Housing',
  income: 'Income',
  shopping: 'Shopping',
  transportation: 'Transportation',
  utilities: 'Utilities',
  other: 'Other',
}

export const formatTransactionCategory = (category: Category) =>
  transactionNames[category]
