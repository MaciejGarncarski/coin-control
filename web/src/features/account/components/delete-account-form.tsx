import { zodResolver } from '@hookform/resolvers/zod'
import { z } from '@shared/schemas'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useDeleteAccount } from '@/features/account/api/use-delete-account'
import { useUser } from '@/lib/auth'

const deleteAccountShema = z
  .object({
    name: z
      .string()
      .min(2)
      .max(32, { message: 'Please use 32 characters at maximum.' }),
    confirmation: z.union([
      z.literal('delete my personal account'),
      z.string(),
    ]),
  })
  .refine(
    (ctx) => {
      return ctx.confirmation === 'delete my personal account'
    },
    { message: 'Confirm.' },
  )

export const DeleteAccountForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const user = useUser()
  const deleteAccountMutation = useDeleteAccount()
  const deleteUserAccountForm = useForm({
    resolver: zodResolver(deleteAccountShema),
    defaultValues: {
      name: '',
      confirmation: '',
    },
  })

  if (user.isPending) {
    return null
  }

  const deleteUserAccount = deleteUserAccountForm.handleSubmit(({ name }) => {
    deleteAccountMutation.mutate({
      name: name,
    })
  })

  return (
    <>
      <Card className="border-red-100 pb-0 dark:border-red-900">
        <CardHeader>
          <CardTitle>
            <h2 className="text-2xl font-semibold">Delete Account</h2>
          </CardTitle>
          <CardDescription className="flex items-center">
            <p>
              Permanently remove your Personal Account and all of its contents
              from the CoinControl. This action is not reversible, so please
              continue with caution.
            </p>
          </CardDescription>
        </CardHeader>
        <CardFooter className="rounded-b-xl border-t border-red-100 bg-red-50 px-6 py-3 dark:border-red-900 dark:bg-red-500/10">
          <Button
            type="button"
            variant={'destructive'}
            size={'sm'}
            onClick={() => setDialogOpen(true)}
            className="ml-auto">
            Delete Personal Account
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Personal Account</DialogTitle>
            <DialogDescription>
              Permanently remove your Personal Account and all of its contents
              from the CoinControl. This action is not reversible, so please
              continue with caution.
            </DialogDescription>
          </DialogHeader>
          <Form {...deleteUserAccountForm}>
            <form onSubmit={deleteUserAccount} autoComplete="off">
              <div className="flex flex-col gap-4 py-4">
                <FormField
                  name="name"
                  control={deleteUserAccountForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs">
                        <span>
                          Enter your full name{' '}
                          <span className="font-semibold">
                            {user.data?.name}
                          </span>{' '}
                          to continue:
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="confirmation"
                  control={deleteUserAccountForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs">
                        <span>
                          To verify, type{' '}
                          <span className="font-semibold">
                            delete my personal account
                          </span>{' '}
                          below:
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <div className="mt-4 flex w-full justify-between">
                  <Button type="button" size={'sm'}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant={'destructive'}
                    size={'sm'}
                    disabled={deleteAccountMutation.isPending}>
                    Delete my account
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
