import type { Category } from '@shared/schemas'

const negativeCategories = [
  'other',
  'transportation',
  'groceries',
  'foodAndDrink',
  'utilities',
  'housing',
  'shopping',
]

export function validateCategory(category: Category, amount: number) {
  if (category === 'income' && amount <= 0) {
    return false
  }

  if (negativeCategories.includes(category) && amount > 0) {
    return false
  }

  return true
}
