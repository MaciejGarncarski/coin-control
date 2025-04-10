import type { Category } from '@shared/schemas'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Badge } from '@/components/ui/badge'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

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
      {formatTransactionCategory(category)}
    </Badge>
  )
}
