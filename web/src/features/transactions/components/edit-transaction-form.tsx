import { zodResolver } from '@hookform/resolvers/zod'
import { categoriesSchema, type Category } from '@shared/schemas'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useEditTransaction } from '@/features/transactions/api/edit-transaction'
import { AmountInput } from '@/features/transactions/components/amount-input'
import { cn } from '@/lib/utils'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

type Props = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  amount: number
  category: Category
  description: string
  transactionId: string
}

const editTransactionSchema = z
  .object({
    description: z
      .string()
      .max(64, { message: 'Description is too long.' })
      .optional(),
    category: categoriesSchema,
    amount: z.coerce.number().min(-999_999).max(999_999),
  })
  .refine(
    ({ amount }) => {
      if (amount === 0) {
        return false
      }
      return true
    },
    {
      message: 'Amount cannot be 0.',
      path: ['amount'],
    },
  )

export const EditTransactionForm = ({
  isOpen,
  setIsOpen,
  amount,
  category,
  description,
  transactionId,
}: Props) => {
  const editTransaction = useEditTransaction()

  const editTransactionForm = useForm({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      amount: amount,
      category: category,
      description: description,
    },
  })

  const amountValue = editTransactionForm.watch().amount

  const closeDialog = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onSubmit = editTransactionForm.handleSubmit(async (data) => {
    await editTransaction.mutateAsync(
      {
        transactionId: transactionId,
        amount: data.amount,
        category: data.category,
        description: data.description,
      },
      {
        onSuccess: () => {
          closeDialog()
          editTransactionForm.reset({
            amount: 0,
            category: 'other',
            description: '',
          })
        },
      },
    )
  })

  const onCancel = useCallback(() => {
    closeDialog()
    editTransactionForm.reset({
      amount: 0,
      category: 'other',
      description: '',
    })
  }, [closeDialog, editTransactionForm])

  const decreaseAmount = useCallback(() => {
    editTransactionForm.setValue(
      'amount',
      parseFloat(amountValue.toString()) - 10,
    )
  }, [amountValue, editTransactionForm])

  const increaseAmount = useCallback(() => {
    editTransactionForm.setValue(
      'amount',
      parseFloat(amountValue.toString()) + 10,
    )
  }, [amountValue, editTransactionForm])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <DialogDescription>Change income or spending.</DialogDescription>
        </DialogHeader>

        <Form {...editTransactionForm}>
          <form className="mt-4 flex flex-col gap-8" onSubmit={onSubmit}>
            <FormField
              name="amount"
              control={editTransactionForm.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <AmountInput
                        {...field}
                        onReduce={decreaseAmount}
                        onIncrease={increaseAmount}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={editTransactionForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={category}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-4 px-2">
                          <TransactionCategoryIcon
                            category={field.value}
                            variant="small"
                          />
                          {formatTransactionCategory(field.value)}
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className={cn('h-[15rem]')}>
                        <SelectItem value="income">
                          <TransactionCategoryIcon category="income" />
                          Income
                        </SelectItem>
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
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={editTransactionForm.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                size={'sm'}
                variant={'destructive'}
                onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" size={'sm'}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
