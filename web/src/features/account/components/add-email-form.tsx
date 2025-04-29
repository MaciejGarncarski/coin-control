import { zodResolver } from '@hookform/resolvers/zod'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { addEmailMutationSchema } from '@shared/schemas'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Label } from '@/components/ui/label'
import { useAddNewEmail } from '@/features/account/api/use-add-new-email'
import { useUserEmails } from '@/features/account/api/use-user-emails'
import { useUser } from '@/lib/auth'

export const AddEmailForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isChecked, setIsChecked] = useState<CheckedState>(false)
  const addEmailMutation = useAddNewEmail()

  const user = useUser()
  const emails = useUserEmails()

  const form = useForm({
    resolver: zodResolver(addEmailMutationSchema),
    defaultValues: {
      email: '',
    },
  })

  const closeDialog = () => {
    setIsOpen(false)
    setIsChecked(false)
    form.reset({
      email: '',
    })
  }

  const addEmail = form.handleSubmit(({ email }) => {
    if (
      user.data?.email === email ||
      emails.data?.some((data) => data.email === email)
    ) {
      toast.error('This email is already assigned to your account.')
      return
    }

    addEmailMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success('New email added. Please verify it.')
          closeDialog()
        },
      },
    )
  })

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(e) => {
        setIsOpen(e)
        setIsChecked(false)
      }}>
      <DialogTrigger asChild>
        <Button type="button" variant={'default'} size={'sm'}>
          <Plus /> Add another
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add email</DialogTitle>
          <DialogDescription>
            Add a new email address to your account. This email, once verified,
            can be used to login to your account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="mt-2 flex flex-col gap-6" onSubmit={addEmail}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="user@email.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label className="text-muted-foreground text-xs">
              <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />I
              understand that this email will have access to my account.
            </Label>

            <DialogFooter>
              <div className="flex w-full justify-between">
                <Button size={'sm'} variant={'outline'} onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" size={'sm'} disabled={!isChecked}>
                  Save
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
