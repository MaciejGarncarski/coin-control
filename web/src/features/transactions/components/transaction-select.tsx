import type { Category } from '@shared/schemas'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { FormControl } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

type Props = {
  value: Category
  onChange: () => void
  isIncome: boolean
}

export const TransactionSelect = ({ onChange, value, isIncome }: Props) => {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <FormControl>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-4 px-2">
            <TransactionCategoryIcon category={value} variant="small" />
            {formatTransactionCategory(value)}
          </div>
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <ScrollArea className={cn('h-[15rem]')}>
          {isIncome ? (
            <>
              <SelectItem value="income">
                <TransactionCategoryIcon category="income" />
                Income
              </SelectItem>
            </>
          ) : (
            <>
              <SelectItem value="groceries">
                <TransactionCategoryIcon category="groceries" />
                Groceries
              </SelectItem>
              <SelectItem value="foodAndDrink">
                <TransactionCategoryIcon category="foodAndDrink" />
                Food and Drink
              </SelectItem>
              <SelectItem value="utilities">
                <TransactionCategoryIcon category="utilities" />
                Utilities
              </SelectItem>
              <SelectItem value="housing">
                <TransactionCategoryIcon category="housing" />
                Housing
              </SelectItem>
              <SelectItem value="shopping">
                <TransactionCategoryIcon category="shopping" />
                Shopping
              </SelectItem>
              <SelectItem value="transportation">
                <TransactionCategoryIcon category="transportation" />
                Transportation
              </SelectItem>
              <SelectItem value="other">
                <TransactionCategoryIcon category="other" />
                Other
              </SelectItem>
            </>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  )
}
