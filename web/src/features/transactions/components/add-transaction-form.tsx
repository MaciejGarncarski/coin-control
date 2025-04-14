import { zodResolver } from '@hookform/resolvers/zod'
import { addTransactionMutation } from '@shared/schemas'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { TransactionCategoryIcon } from '@/components/transactions/transaction-category-icon'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useAddTransaction } from '@/features/transactions/api/add-transaction'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

export const AddTransactionForm = () => {
  const search = useSearch({ from: '/_authenticated/transactions' })
  const [dialogOpen, setDialogOpen] = useState<boolean>(
    () => search.addTransaction || false,
  )
  const navigate = useNavigate({ from: '/transactions' })
  const addTransaction = useAddTransaction()

  const newTransactionForm = useForm({
    resolver: zodResolver(addTransactionMutation),
    defaultValues: {
      amount: 0,
      category: 'other',
      description: '',
    },
  })

  const closeDialog = () => {
    setDialogOpen(false)

    navigate({
      viewTransition: false,
      search: (prev) => {
        return {
          ...prev,
          addTransaction: undefined,
        }
      },
    })
  }

  const onSubmit = newTransactionForm.handleSubmit(async (data) => {
    await addTransaction.mutateAsync(data, {
      onSuccess: () => {
        closeDialog()
        newTransactionForm.reset({
          amount: 0,
          category: 'other',
          description: '',
        })
      },
    })
  })

  const onCancel = () => {
    closeDialog()
    newTransactionForm.reset({
      amount: 0,
      category: 'other',
      description: '',
    })
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(state) => {
        setDialogOpen(state)
        navigate({
          viewTransition: false,
          search: (prev) => {
            return {
              ...prev,
              addTransaction: undefined,
            }
          },
        })
      }}>
      <DialogTrigger asChild>
        <Button type="button" size={'sm'}>
          <Plus />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New transaction</DialogTitle>
        </DialogHeader>

        <Form {...newTransactionForm}>
          <form className="mt-4 flex flex-col gap-8" onSubmit={onSubmit}>
            <FormField
              name="amount"
              control={newTransactionForm.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={newTransactionForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={newTransactionForm.control}
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
