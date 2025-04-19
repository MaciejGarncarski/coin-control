import { zodResolver } from '@hookform/resolvers/zod'
import { type Category, editTransactionMutation } from '@shared/schemas'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

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
import { useEditTransaction } from '@/features/transactions/api/edit-transaction'
import { AmountInput } from '@/features/transactions/components/amount-input'
import { TransactionDatePicker } from '@/features/transactions/components/transaction-date-picker'
import { TransactionSelect } from '@/features/transactions/components/transaction-select'

type Props = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  amount: number
  date: Date
  category: Category
  description: string
  transactionId: string
}

export const EditTransactionForm = ({
  isOpen,
  setIsOpen,
  amount,
  category,
  date,
  description,
  transactionId,
}: Props) => {
  const editTransaction = useEditTransaction()

  const editTransactionForm = useForm({
    resolver: zodResolver(editTransactionMutation),
    defaultValues: {
      amount: amount,
      date: date,
      category: category,
      description: description,
    },
  })

  const amountValue = editTransactionForm.watch().amount

  const closeAndReset = () => {
    setIsOpen(false)
    setTimeout(() => {
      editTransactionForm.reset({
        amount: 0,
        category: 'other',
        date: new Date(),
        description: '',
      })
    }, 300)
  }

  const onSubmit = editTransactionForm.handleSubmit(async (data) => {
    await editTransaction.mutateAsync(
      {
        transactionId: transactionId,
        amount: data.amount,
        date: data.date,
        category: data.category,
        description: data.description,
      },
      {
        onSuccess: () => {
          closeAndReset()
        },
      },
    )
  })

  const decreaseAmount = useCallback(() => {
    if (!amountValue) {
      return
    }

    editTransactionForm.setValue(
      'amount',
      parseFloat(amountValue.toString()) - 10,
    )
  }, [amountValue, editTransactionForm])

  const increaseAmount = useCallback(() => {
    if (!amountValue) {
      return
    }

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
              name="date"
              control={editTransactionForm.control}
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction date</FormLabel>
                    <TransactionDatePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
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
                  <TransactionSelect
                    onChange={field.onChange}
                    value={field.value || 'other'}
                  />
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
                onClick={closeAndReset}>
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
