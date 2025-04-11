import type { Category } from '@shared/schemas'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from '@/components/ui/select'
import { getTransactionQueryOptions } from '@/features/transactions/api/get-transaction'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

const categories: Category[] = [
  'foodAndDrink',
  'groceries',
  'housing',
  'income',
  'shopping',
  'transportation',
  'utilities',
  'other',
]

export const TransactionCategoryFilter = () => {
  const search = useSearch({ from: '/_authenticated/transactions' })
  const navigate = useNavigate({ from: '/transactions' })
  const queryClient = useQueryClient()
  const category = search.category

  const prefetchOnHover = (category: Category) => {
    queryClient.prefetchQuery(
      getTransactionQueryOptions({
        search: search.search || null,
        category: category,
        dateFrom: search.dateFrom || null,
        dateTo: search.dateTo || null,
        page: (search.page || 1).toString(),
      }),
    )
  }

  const onChange = (newCat: Category | 'all') => {
    if (newCat === 'all') {
      navigate({
        viewTransition: false,
        search: (prev) => {
          return {
            ...prev,
            category: undefined,
          }
        },
      })
      return
    }

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
    <Select onValueChange={onChange} defaultValue={category || 'all'}>
      <SelectTrigger size={'sm'}>
        {category ? (
          <div className="flex items-center gap-4 px-1">
            <TransactionCategoryIcon category={category} variant="small" />
            <span>{formatTransactionCategory(category)}</span>
          </div>
        ) : (
          <span>Select category</span>
        )}
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[15rem] pr-3">
          {categories.map((category) => {
            return (
              <SelectItem
                key={category}
                value={category}
                onMouseOver={() => prefetchOnHover(category)}>
                <TransactionCategoryIcon category={category} />
                {formatTransactionCategory(category)}
              </SelectItem>
            )
          })}
        </ScrollArea>
        <SelectSeparator />
        <SelectItem value="all">All</SelectItem>
      </SelectContent>
    </Select>
  )
}
