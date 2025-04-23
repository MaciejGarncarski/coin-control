import { zodResolver } from '@hookform/resolvers/zod'
import { addTransactionMutation } from '@shared/schemas'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useAddTransaction } from '@/features/transactions/api/add-transaction'
import { AmountInput } from '@/features/transactions/components/amount-input'
import { TransactionDatePicker } from '@/features/transactions/components/transaction-date-picker'
import { TransactionSelect } from '@/features/transactions/components/transaction-select'
import { formatTransaction } from '@/utils/format-transaction'

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
      date: new Date(),
      category: 'other',
      description: '',
    },
  })

  const amountValue = newTransactionForm.watch().amount

  const closeAndReset = () => {
    setDialogOpen(false)
    setTimeout(() => {
      newTransactionForm.reset({
        amount: 0,
        category: 'other',
        date: new Date(),
        description: '',
      })
    }, 300)
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

  const addNewTransaction = newTransactionForm.handleSubmit(async (data) => {
    await addTransaction.mutateAsync(data, {
      onSuccess: () => {
        closeAndReset()
      },
    })
  })

  const decreaseAmount = useCallback(() => {
    newTransactionForm.setValue(
      'amount',
      formatTransaction(amountValue.toString()) - 10,
    )
  }, [amountValue, newTransactionForm])

  const increaseAmount = useCallback(() => {
    newTransactionForm.setValue(
      'amount',
      formatTransaction(amountValue.toString()) + 10,
    )
  }, [amountValue, newTransactionForm])

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
          <DialogDescription>Add income or spending.</DialogDescription>
        </DialogHeader>

        <Form {...newTransactionForm}>
          <form
            className="mt-4 flex flex-col gap-8"
            onSubmit={addNewTransaction}>
            <FormField
              name="amount"
              control={newTransactionForm.control}
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
              control={newTransactionForm.control}
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
              control={newTransactionForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <TransactionSelect
                    onChange={field.onChange}
                    value={field.value}
                  />
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
