import type { Category } from '@shared/schemas'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Badge } from '@/components/ui/badge'

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

type Props = {
  category: Category
  withIcon?: boolean
}

export const TransactionBadge = ({ category, withIcon }: Props) => {
  return (
    <Badge variant={'outline'} className="gap-2">
      {withIcon ? (
        <TransactionCategoryIcon category={category} variant="small" />
      ) : null}
      {transactionNames[category]}
    </Badge>
  )
}
