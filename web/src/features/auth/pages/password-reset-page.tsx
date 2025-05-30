import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordFormSchema } from '@shared/schemas'
import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'
import { KeySquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { InputPassword } from '@/components/ui/input-password'
import { useResetPassword } from '@/features/auth/api/use-reset-password'
import { Route } from '@/routes/_unauthenticated/auth/password-reset'

export const PasswordResetPage = () => {
  const resetPasswordMutation = useResetPassword()
  const search = Route.useSearch()
  const canGoBack = useCanGoBack()
  const router = useRouter()
  const navigate = useNavigate()

  const resetPasswordForm = useForm({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      confirmPassword: '',
      password: '',
    },
  })

  const resetPassword = resetPasswordForm.handleSubmit(
    ({ confirmPassword, password }) => {
      const token = search.reset_token

      if (!token) {
        toast.error('Invalid token!')
        return
      }

      resetPasswordMutation.mutate({
        password,
        confirmPassword,
        resetToken: token,
      })
    },
  )

  const goBack = () => {
    if (!canGoBack) {
      navigate({
        to: '/',
      })
      return
    }

    router.history.back()
  }

  return (
    <Card className="w-full px-10">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-center gap-2 pb-2">
            <KeySquare />
            <h1 className="text-center">Reset your password</h1>
          </div>
        </CardTitle>
        <CardDescription className="text-center">
          Type in your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...resetPasswordForm}>
          <form className="flex flex-col gap-6" onSubmit={resetPassword}>
            <FormField
              name="password"
              control={resetPasswordForm.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              name="confirmPassword"
              control={resetPasswordForm.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <InputPassword {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                size="sm"
                variant={'outline'}
                onClick={goBack}>
                Go back
              </Button>
              <Button type="submit" size="sm">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
