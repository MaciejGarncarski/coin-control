import { zodResolver } from '@hookform/resolvers/zod'
import { addTransactionMutation } from '@shared/schemas'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export const TransactionsForm = () => {
  const newTransactionForm = useForm({
    resolver: zodResolver(addTransactionMutation),
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>New transaction</DialogHeader>

        <Form {...newTransactionForm}>
          <form className="mt-4 flex flex-col gap-4">
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
                  </FormItem>
                )
              }}
            />
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
                  </FormItem>
                )
              }}
            />

            <div>
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
