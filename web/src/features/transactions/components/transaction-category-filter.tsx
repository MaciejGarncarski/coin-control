import type { Category } from '@shared/schemas'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

export const TransactionCategoryFilter = () => {
  const search = useSearch({ from: '/_authenticated/transactions' })
  const navigate = useNavigate({ from: '/transactions' })

  const category = search.category

  const onChange = (newCat: Category) => {
    navigate({
      viewTransition: false,
      search: (prev) => {
        return {
          ...prev,
          category: newCat,
        }
      },
    })
  }

  return (
    <Select onValueChange={onChange} defaultValue={category || ''}>
      <SelectTrigger size={'sm'}>
        {category ? (
          <div className="flex items-center gap-4 px-2">
            <TransactionCategoryIcon category={category} variant="small" />
            <span>{formatTransactionCategory(category)}</span>
          </div>
        ) : (
          <span>Select category</span>
        )}
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[15rem]">
          <SelectItem value="groceries">
            <TransactionCategoryIcon category="groceries" />
            Groceries
          </SelectItem>
          <SelectItem value="income">
            <TransactionCategoryIcon category="income" />
            Income
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
        </ScrollArea>
      </SelectContent>
    </Select>
  )
}
